package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"net/http"

	_ "github.com/lib/pq"
)

func main() {

	connStr := "host=localhost port=5432 user=postgres password=123456789 dbname=animehub sslmode=disable"

	db, err := sql.Open("postgres", connStr)

	if err != nil {
		fmt.Println("Database connection error:", err)
		return
	}

	err = db.Ping()

	if err != nil {
		fmt.Println("Database is not connected:", err)
		return
	}

	fmt.Println("PostgreSQL connected successfully!")

	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("AnimeHub Backend is running!"))
	})

	http.HandleFunc("/test", func(w http.ResponseWriter, r *http.Request) {

		w.Header().Set("Content-Type", "application/json")

		response := map[string]string{
			"message": "AnimeHub API is working!",
		}

		json.NewEncoder(w).Encode(response)
	})

	// Register API
	http.HandleFunc("/register", func(w http.ResponseWriter, r *http.Request) {

		if r.Method != http.MethodPost {
			http.Error(w, "Only POST method is allowed", http.StatusMethodNotAllowed)
			return
		}

		var user struct {
			Name     string `json:"name"`
			Email    string `json:"email"`
			Password string `json:"password"`
		}

		err := json.NewDecoder(r.Body).Decode(&user)

		if err != nil {
			http.Error(w, "Invalid data", http.StatusBadRequest)
			return
		}

		_, err = db.Exec(
			"INSERT INTO users (name, email, password) VALUES ($1, $2, $3)",
			user.Name,
			user.Email,
			user.Password,
		)

		if err != nil {
			http.Error(w, "Could not register user", http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")

		response := map[string]string{
			"message": "User registered successfully!",
		}

		json.NewEncoder(w).Encode(response)
	})
	// Login API
http.HandleFunc("/login", func(w http.ResponseWriter, r *http.Request) {

	if r.Method != http.MethodPost {
		http.Error(w, "Only POST method is allowed", http.StatusMethodNotAllowed)
		return
	}

	var user struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}

	err := json.NewDecoder(r.Body).Decode(&user)

	if err != nil {
		http.Error(w, "Invalid data", http.StatusBadRequest)
		return
	}

	var name string

	err = db.QueryRow(
		"SELECT name FROM users WHERE email = $1 AND password = $2",
		user.Email,
		user.Password,
	).Scan(&name)

	if err != nil {
		http.Error(w, "Invalid email or password", http.StatusUnauthorized)
		return
	}

	w.Header().Set("Content-Type", "application/json")

	response := map[string]string{
		"message": "Login successful!",
		"name":    name,
	}

	json.NewEncoder(w).Encode(response)
})

	fmt.Println("AnimeHub Backend running on http://localhost:8080")

	http.ListenAndServe(":8080", nil)
}