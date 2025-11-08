package main

import (
	"encoding/json"
	"net/http"

	// "errors"
	"sync"
	"time"

	"github.com/google/uuid"
	// "github.com/go-chi/chi/v5"
)

type InMemoryTaskRepository struct {
	tasks map[string]Task 
	mu    sync.RWMutex
}

type TaskHandler struct {
	repo TaskRepository
}

func NewTaskHandler(repo TaskRepository) *TaskHandler {
	return &TaskHandler{repo: repo}
}

func NewInMemoryTaskRepository() *InMemoryTaskRepository {
	return &InMemoryTaskRepository{
		tasks: make(map[string]Task),
	}
}


func (r *InMemoryTaskRepository) CreateTask(task Task) (Task, error) { 
    r.mu.Lock()
    defer r.mu.Unlock()
    task.ID = uuid.New().String() 
    task.CreatedAt = time.Now().UTC()
    if task.Status == "" {
        task.Status = StatusTodo
    }
    r.tasks[task.ID] = task
    
    return task, nil 
}

func (h *TaskHandler) HandlerCreateTask(w http.ResponseWriter, r *http.Request) {
	var task Task
	if err := json.NewDecoder(r.Body).Decode(&task); err != nil {
		h.respondWithError(w, http.StatusBadRequest, "Invalid Payload JSON")
		return
	}

	if task.Title == "" {
		h.respondWithError(w, http.StatusBadRequest, "Title is required")
		return
	}
	
	createdTask, err := h.repo.CreateTask(task)
	if err != nil {
		h.respondWithError(w, http.StatusInternalServerError, "Failed to create Task")
		return
	}

	h.respondWithJSON(w, http.StatusCreated, createdTask)
}

func (h *TaskHandler) respondWithError(w http.ResponseWriter, code int, message string) {
	h.respondWithJSON(w, code, map[string]string{"error": message})
}

func (h *TaskHandler) respondWithJSON(w http.ResponseWriter, statusCode int, payload interface{}){
	response, _ := json.Marshal(payload)
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(statusCode)
	w.Write(response)
 }