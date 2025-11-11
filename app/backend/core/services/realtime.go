package services

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
)

type RealTime struct {
	upgrader  *websocket.Upgrader
	clients   map[*websocket.Conn]bool
	broadcast chan []byte

	upUpgrader  *websocket.Upgrader
	upClients   map[*websocket.Conn]bool
	broadcastUp chan []byte
}

func NewRealtime() *RealTime {
	return &RealTime{
		upgrader: &websocket.Upgrader{
			CheckOrigin: checkOrigin,
		},
		clients:   make(map[*websocket.Conn]bool),
		broadcast: make(chan []byte),

		upUpgrader: &websocket.Upgrader{
			CheckOrigin: checkOrigin,
		},
		upClients:   make(map[*websocket.Conn]bool),
		broadcastUp: make(chan []byte),
	}
}

func checkOrigin(r *http.Request) bool {
	return true
}

func (r *RealTime) Connect(c *gin.Context) {
	conn, err := r.upgrader.Upgrade(c.Writer, c.Request, nil)
	if err != nil {
		return
	}
	defer conn.Close()

	r.clients[conn] = true

	for {
		_, message, err := conn.ReadMessage()
		if err != nil {
			break
		}

		r.broadcast <- message
	}
}

func (r *RealTime) ConnectUp(c *gin.Context) {
	conn, err := r.upUpgrader.Upgrade(c.Writer, c.Request, nil)
	if err != nil {
		return
	}
	defer conn.Close()

	r.upClients[conn] = true

	for {
		_, message, err := conn.ReadMessage()
		if err != nil {
			break
		}

		r.broadcastUp <- message
	}
}

func (r *RealTime) HandleMessages() {
	for {
		msg := <-r.broadcast

		for client := range r.clients {
			err := client.WriteMessage(websocket.TextMessage, msg)
			if err != nil {
				client.Close()
				delete(r.clients, client)
			}
		}
	}
}

func (r *RealTime) BroadcastMessage(message []byte) {
	r.broadcast <- message
}
