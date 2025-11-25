package config

import (
	"log"
	"os"
	"path/filepath"

	"github.com/BurntSushi/toml"
)

type service struct {
	Port          int    `toml:"port"`
	GeminiApiKey  string `toml:"geminiApiKey"`
	N8nWebhookURL string `toml:"n8nWebhookURL"`
}

type database struct {
	MongoURI string `toml:"mongoURI"`
	DBName   string `toml:"dbName"`
}

type jwt struct {
	JWTSECRET string `toml:"jwtsecret"`
}

type ConfigEnv struct {
	Service  service  `toml:"service"`
	Database database `toml:"database"`
	Jwt      jwt      `toml:"jwt"`
}

var Env ConfigEnv
var loaded bool

func Load() {
	loaded = false
	executablePath, err := os.Executable()
	if err != nil {
		log.Fatal(err)
	}
	executableDir := filepath.Dir(executablePath)

	fileConf := filepath.Join(executableDir, "metabee.conf")
	
	// Verificar se o arquivo existe
	if _, err := os.Stat(fileConf); os.IsNotExist(err) {
		log.Fatalf("Arquivo de configuração não encontrado: %s", fileConf)
	}

	metadata, err := toml.DecodeFile(fileConf, &Env)
	if err != nil {
		log.Fatalf("Erro ao ler config: %v", err)
	}

	// Log de campos não mapeados (para debug)
	if len(metadata.Undecoded()) > 0 {
		log.Printf("Aviso: Campos não mapeados no config: %v", metadata.Undecoded())
	}

	log.Printf("Config carregado: Port=%d, MongoDB=%s, N8nWebhook=%s", 
		Env.Service.Port, 
		func() string {
			if Env.Database.MongoURI != "" {
				return "configurado"
			}
			return "não configurado"
		}(),
		func() string {
			if Env.Service.N8nWebhookURL != "" {
				return Env.Service.N8nWebhookURL
			}
			return "não configurado"
		}())
	loaded = true
}

// GetN8nWebhookURL retorna a URL do webhook n8n de forma segura
func GetN8nWebhookURL() string {
	defer func() {
		if r := recover(); r != nil {
			log.Printf("Panic ao acessar config.GetN8nWebhookURL: %v", r)
		}
	}()
	
	if !loaded {
		log.Println("Config não foi carregado ainda, usando URL padrão")
		return "https://n8n.zenitoficial.com.br/webhook-test/gemini"
	}
	
	url := Env.Service.N8nWebhookURL
	if url != "" {
		return url
	}
	
	log.Println("N8nWebhookURL vazio no config, usando URL padrão")
	return "https://n8n.zenitoficial.com.br/webhook-test/gemini"
}
