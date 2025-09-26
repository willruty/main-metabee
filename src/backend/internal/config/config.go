package config

import (
	"log"
	"os"
	"path/filepath"

	"github.com/BurntSushi/toml"
)

type service struct {
	Port int
}

type database struct {
	Port         int
	Host         string
	DatabaseName string
	User         string
	Password     string
	AnonKey      string
}

type jwt struct {
	JWTSECRET string
}

type ConfigEnv struct {
	Service  service
	Database database
	Jwt      jwt
}

var Env ConfigEnv

func Load() {

	executablePath, err := os.Executable()
	if err != nil {
		log.Fatal(err)
	}
	executableDir := filepath.Dir(executablePath)

	fileConf := filepath.Join(executableDir, "metabee.conf")
	if _, err := toml.DecodeFile(fileConf, &Env); err != nil {
		log.Fatalf("Erro ao ler config: %v", err)
	}
}
