package services

import (
	"sync"

	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
)

type RealTime struct {
	upgrader websocket.Upgrader

	// token-scoped connections for tailing logs by profile token
	tokenClients map[string]map[*websocket.Conn]bool
	mu           sync.RWMutex
}

func NewRealtime() *RealTime {
	return &RealTime{
		tokenClients: make(map[string]map[*websocket.Conn]bool),
	}
}

// ConnectTail upgrades the connection to WebSocket and registers the client
// under the token provided in the route param :token. Incoming messages are
// ignored; the connection is used only for server->client broadcasts.
func (r *RealTime) ConnectTail(c *gin.Context) {
	token := c.Param("token")

	conn, err := r.upgrader.Upgrade(c.Writer, c.Request, nil)
	if err != nil {
		return
	}

	// Ensure cleanup on function return
	defer conn.Close()

	// Register connection under the token
	r.mu.Lock()
	if _, ok := r.tokenClients[token]; !ok {
		r.tokenClients[token] = make(map[*websocket.Conn]bool)
	}
	r.tokenClients[token][conn] = true
	r.mu.Unlock()

	// Read loop to keep the connection alive; ignore payloads.
	for {
		if _, _, err := conn.ReadMessage(); err != nil {
			// On error (client disconnect), remove the client and break
			r.mu.Lock()
			if conns, ok := r.tokenClients[token]; ok {
				delete(conns, conn)
				// Optionally clean up empty maps
				if len(conns) == 0 {
					delete(r.tokenClients, token)
				}
			}
			r.mu.Unlock()
			break
		}
	}
}

// BroadcastToToken sends the message to all clients subscribed with the token.
func (r *RealTime) BroadcastToToken(token string, message []byte) {
	r.mu.RLock()
	conns := r.tokenClients[token]
	// Create a copy of the connections to avoid holding the read lock during network writes
	var targets []*websocket.Conn
	for conn := range conns {
		targets = append(targets, conn)
	}
	r.mu.RUnlock()

	// Write to clients; on error, remove the client
	for _, conn := range targets {
		if err := conn.WriteMessage(websocket.TextMessage, message); err != nil {
			conn.Close()
			r.mu.Lock()
			if conns, ok := r.tokenClients[token]; ok {
				delete(conns, conn)
				if len(conns) == 0 {
					delete(r.tokenClients, token)
				}
			}
			r.mu.Unlock()
		}
	}
}
