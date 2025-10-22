package service

import (
	"metabee/internal/config"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

type JWTClaims struct {
	UserId string `json:"user_id"`
	jwt.RegisteredClaims
}

func GenerateJWT(id string) (string, error) {

	jwtSecret := config.Env.Jwt.JWTSECRET
	claims := JWTClaims{
		UserId: id,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(24 * time.Hour)),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(jwtSecret))
}

func ValidateJWT(tokenString string) (string, error) {

	jwtSecret := config.Env.Jwt.JWTSECRET
	claims := &JWTClaims{}

	parser := jwt.NewParser(jwt.WithValidMethods([]string{jwt.SigningMethodHS256.Name}))

	if token, err := parser.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
		return []byte(jwtSecret), nil
	}); err != nil || !token.Valid {
		return "", err
	}

	return claims.UserId, nil
}
