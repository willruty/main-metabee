package service

import (
	"errors"
	"metabee/internal/config"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

// JWTClaims define as claims customizadas usadas no token.
type JWTClaims struct {
	UserID string `json:"user_id"`
	jwt.RegisteredClaims
}

// GenerateJWT gera um token JWT com o ID do usuário e expiração padrão de 24h.
func GenerateJWT(userID string) (string, error) {
	if userID == "" {
		return "", errors.New("userID não pode ser vazio")
	}

	jwtSecret := config.Env.Jwt.JWTSECRET
	if jwtSecret == "" {
		return "", errors.New("JWT_SECRET não definido no .env")
	}

	claims := JWTClaims{
		UserID: userID,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(24 * time.Hour)),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	signedToken, err := token.SignedString([]byte(jwtSecret))
	if err != nil {
		return "", err
	}

	return signedToken, nil
}

// ValidateJWT valida o token recebido e retorna o userID presente nas claims.
func ValidateJWT(tokenString string) (string, error) {
	jwtSecret := config.Env.Jwt.JWTSECRET
	if jwtSecret == "" {
		return "", errors.New("JWT_SECRET não definido no .env")
	}

	claims := &JWTClaims{}
	parser := jwt.NewParser(jwt.WithValidMethods([]string{jwt.SigningMethodHS256.Name}))

	token, err := parser.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
		return []byte(jwtSecret), nil
	})
	if err != nil {
		return "", err
	}

	if !token.Valid {
		return "", errors.New("token inválido ou expirado")
	}

	// Verifica se expirou
	if claims.ExpiresAt != nil && claims.ExpiresAt.Time.Before(time.Now()) {
		return "", errors.New("token expirado")
	}

	if claims.UserID == "" {
		return "", errors.New("user_id ausente no token")
	}

	return claims.UserID, nil
}
