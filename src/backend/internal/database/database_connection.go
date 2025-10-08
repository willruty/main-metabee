package database

import (
	"database/sql"
	"fmt"
)

// Define a URI de conexão completa com a sua senha
const databaseURL = "postgresql://postgres:metabee2025@db.vtzmdlxigiwljyktgdxe.supabase.co:5432/postgres"

var DB *sql.DB

func DBConnect() error {

	db, err := sql.Open("postgres", databaseURL)
	if err != nil {
		return fmt.Errorf("failed to open database: %w", err)
	}

	DB = db

	return nil
}
