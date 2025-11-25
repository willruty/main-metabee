package controller

import (
	"bytes"
	"encoding/json"
	"io"
	"log"
	"metabee/internal/config"
	"net/http"

	"github.com/gin-gonic/gin"
)

type ChatRequest struct {
	Message string `json:"message"`
}

type N8nResponse struct {
	Output string `json:"output"`
}

func ChatIa(c *gin.Context) {
	// Verificar se o contexto é válido
	if c == nil {
		log.Println("Erro: gin.Context é nil")
		return
	}

	// Verificar se o Request é válido
	if c.Request == nil {
		log.Println("Erro: c.Request é nil")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro interno do servidor"})
		return
	}

	var req ChatRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		log.Printf("Erro ao fazer bind do JSON: %v", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "Mensagem não fornecida ou formato inválido"})
		return
	}

	if req.Message == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Mensagem não pode estar vazia"})
		return
	}

	// Obter URL do n8n (com fallback para URL padrão)
	n8nWebhookURL := config.GetN8nWebhookURL()

	// Preparar payload para n8n
	payload := map[string]string{
		"message": req.Message,
	}
	jsonData, err := json.Marshal(payload)
	if err != nil {
		log.Printf("Erro ao serializar payload: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao processar requisição"})
		return
	}

	// Fazer requisição para n8n
	resp, err := http.Post(n8nWebhookURL, "application/json", bytes.NewBuffer(jsonData))
	if err != nil {
		log.Printf("Erro ao chamar n8n: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao conectar com o serviço de IA"})
		return
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		bodyBytes, _ := io.ReadAll(resp.Body)
		log.Printf("Erro na resposta do n8n: Status %d, Body: %s", resp.StatusCode, string(bodyBytes))
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao processar resposta da IA"})
		return
	}

	// Ler resposta do n8n
	bodyBytes, err := io.ReadAll(resp.Body)
	if err != nil {
		log.Printf("Erro ao ler resposta do n8n: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao processar resposta"})
		return
	}

	var n8nResp N8nResponse
	if err := json.Unmarshal(bodyBytes, &n8nResp); err != nil {
		// Se não conseguir fazer parse como JSON estruturado, retorna a resposta como está
		log.Printf("Resposta não é JSON estruturado, retornando texto: %s", string(bodyBytes))
		c.JSON(http.StatusOK, gin.H{"message": string(bodyBytes)})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": n8nResp.Output})
}
