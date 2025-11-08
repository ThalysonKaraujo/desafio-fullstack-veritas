package main

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"os"
	"testing"

	"github.com/go-chi/chi/v5"
)


func setupTestRouter() (http.Handler, func()) {
	os.Remove(jsonStoreFile)

	repo := NewInMemoryTaskRepository()

	handler := NewTaskHandler(repo)

	r := chi.NewRouter()
	r.Route("/tasks", func(r chi.Router) {
		r.Post("/", handler.HandlerCreateTask)
		r.Get("/", handler.handleGetAllTasks)
		r.Route("/{id}", func(r chi.Router) {
			r.Get("/", handler.handleGetTaskByID)
			r.Put("/", handler.handleUpdateTask)
			r.Delete("/", handler.handleDeleteTask)
		})
	})

	cleanup := func() {
		os.Remove(jsonStoreFile)
	}

	return r, cleanup
}

func TestIntegration_CRUD_Flow(t *testing.T) {
	router, cleanup := setupTestRouter()
	defer cleanup() 

	server := httptest.NewServer(router)
	defer server.Close()

	taskJSON := `{"title": "Tarefa de Teste", "description": "Testando o POST"}`
	req, _ := http.NewRequest("POST", server.URL+"/tasks", bytes.NewBufferString(taskJSON))
	req.Header.Set("Content-Type", "application/json")

	resp, _ := server.Client().Do(req)

	if resp.StatusCode != http.StatusCreated {
		t.Errorf("POST /tasks: esperado status 201, recebido %d", resp.StatusCode)
	}

	var createdTask Task
	json.NewDecoder(resp.Body).Decode(&createdTask)
	resp.Body.Close()

	if createdTask.ID == "" {
		t.Error("POST /tasks: ID não foi retornado no JSON")
	}
	if createdTask.Title != "Tarefa de Teste" {
		t.Error("POST /tasks: Título não corresponde ao enviado")
	}
	
	taskID := createdTask.ID

	req, _ = http.NewRequest("GET", server.URL+"/tasks/"+taskID, nil)
	resp, _ = server.Client().Do(req)

	if resp.StatusCode != http.StatusOK {
		t.Errorf("GET /tasks/{id}: esperado status 200, recebido %d", resp.StatusCode)
	}

	var fetchedTask Task
	json.NewDecoder(resp.Body).Decode(&fetchedTask)
	resp.Body.Close()

	if fetchedTask.ID != taskID {
		t.Error("GET /tasks/{id}: ID não corresponde ao solicitado")
	}

	updateJSON := `{"title": "Tarefa Atualizada", "description": "Testando o PUT", "status": "Em Progresso"}`
	req, _ = http.NewRequest("PUT", server.URL+"/tasks/"+taskID, bytes.NewBufferString(updateJSON))
	req.Header.Set("Content-Type", "application/json")
	resp, _ = server.Client().Do(req)

	if resp.StatusCode != http.StatusOK {
		t.Errorf("PUT /tasks/{id}: esperado status 200, recebido %d", resp.StatusCode)
	}

	var updatedTask Task
	json.NewDecoder(resp.Body).Decode(&updatedTask)
	resp.Body.Close()

	if updatedTask.Title != "Tarefa Atualizada" {
		t.Error("PUT /tasks/{id}: Título não foi atualizado")
	}
	if updatedTask.Status != StatusInProgress {
		t.Error("PUT /tasks/{id}: Status não foi atualizado")
	}

	req, _ = http.NewRequest("DELETE", server.URL+"/tasks/"+taskID, nil)
	resp, _ = server.Client().Do(req)

	if resp.StatusCode != http.StatusNoContent {
		t.Errorf("DELETE /tasks/{id}: esperado status 204, recebido %d", resp.StatusCode)
	}

	req, _ = http.NewRequest("GET", server.URL+"/tasks/"+taskID, nil)
	resp, _ = server.Client().Do(req)

	if resp.StatusCode != http.StatusNotFound {
		t.Errorf("GET /tasks/{id} após DELETE: esperado status 404, recebido %d", resp.StatusCode)
	}
}

