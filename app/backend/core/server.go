package core

import (
	"logger/core/services"
	"logger/core/utils"

	"github.com/gin-gonic/gin"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

type Server struct {
	Router      *gin.Engine
	Logger      *services.Logger
	Config      *utils.Config
	Filesystem  *services.Filesystem
	Mailer      *services.Mailer
	Hasher      *services.Hasher
	Jwt         *services.Jwt
	Globals     map[string]any
	DB          *gorm.DB
	Verified    bool
	RealTime    *services.RealTime
	NeededSetup []string
}

func (s *Server) Initialize(envFile string) {
	var environment = s.setupEnv(envFile)

	s.configGin()
	s.setupGlobals()
	s.setupLogger()
	s.setupMailer(environment)
	s.setupHasher(environment)
	s.setupJwt(environment)
	s.setupDatabase()
	s.setupRouter()
	s.setupRealTime()
}

const (
	Development = "development"
	Production  = "production"
)

func (s *Server) setupDatabase() {
	var err error

	s.DB, err = gorm.Open(postgres.Open(s.Config.DatabaseConnection), &gorm.Config{})

	if err != nil {
		s.Logger.Alert(err.Error())
		panic(err)
	}

	s.DB.AutoMigrate()
}

func (s *Server) Run() {
	s.Router.Run(":" + s.Config.Port)
}

func (s *Server) SetGlobal(key string, value any) {
	s.Globals[key] = value
}

func (s *Server) configGin() {
	if s.Config.Mode == Development {
		gin.SetMode(gin.DebugMode)
	} else {
		gin.SetMode(gin.ReleaseMode)
	}
}

func (s *Server) setupEnv(envFile string) any {
	s.Filesystem = services.NewFilesystem()

	var environment any = nil

	s.Filesystem.ReadJSONFromFile(envFile, &environment)

	s.Config = &utils.Config{
		Port:               environment.(map[string]any)["config"].(map[string]any)["port"].(string),
		LogFile:            environment.(map[string]any)["config"].(map[string]any)["log_file"].(string),
		DatabaseConnection: environment.(map[string]any)["config"].(map[string]any)["database_connection"].(string),
		Mode:               environment.(map[string]any)["config"].(map[string]any)["mode"].(string),
	}

	return environment
}

func (s *Server) setupGlobals() {
	s.Globals = make(map[string]any)
}

func (s *Server) setupLogger() {
	if s.Config.LogFile != "" {
		checkFile(s, s.Config.LogFile)
		s.Logger = services.NewFileLogger(s.Config.LogFile)
	} else {
		s.Logger = services.NewDefaultLogger()
	}
}

func (s *Server) setupMailer(environment any) {
	s.Mailer = services.NewMailer(
		environment.(map[string]any)["mailer"].(map[string]any)["username"].(string),
		environment.(map[string]any)["mailer"].(map[string]any)["password"].(string),
		environment.(map[string]any)["mailer"].(map[string]any)["host"].(string),
		environment.(map[string]any)["mailer"].(map[string]any)["port"].(string),
	)
}

func (s *Server) setupHasher(environment any) {
	s.Hasher = services.NewHasher(
		int(environment.(map[string]any)["hasher"].(map[string]any)["cost"].(float64)),
	)
}

func (s *Server) setupJwt(environment any) {
	s.Jwt = services.NewJwt(environment.(map[string]any)["jwt"].(map[string]any)["secret_key"].(string))
}

func (s *Server) setupRouter() {
	s.Router = gin.Default()
}

func checkFile(s *Server, file string) error {
	if !s.Filesystem.FileExists(file) {
		return s.Filesystem.CreateEmptyFile(file)
	}

	return nil
}

func (s *Server) setupRealTime() {
	s.RealTime = services.NewRealtime()
	go s.RealTime.HandleMessages()
}
