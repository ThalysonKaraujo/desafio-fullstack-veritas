package main

import (
	"encoding/json"
	"errors"
	"log"
	"net/http"
	"strings"

	"sync"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/google/uuid"

	"os"
)

const jsonStoreFile = "task.json"

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
	repo := &InMemoryTaskRepository{
		tasks: make(map[string]Task),
	}

	err := repo.loadFromJSON()
	if err != nil && !os.IsNotExist(err) {
		log.Fatalf("Could not load tasks from JSON: %s\n", err.Error())
	}

	return repo
}

func (r *InMemoryTaskRepository) loadFromJSON() error {
	r.mu.Lock()
	defer r.mu.Unlock()

	file, err := os.Open(jsonStoreFile)
	if err != nil {
		return err
	}
	defer file.Close()
	
	decoder := json.NewDecoder(file)
	if err := decoder.Decode(&r.tasks); err != nil {
		return err
	}
	return nil
}

func (r *InMemoryTaskRepository) saveToJSON() error {

	file, err := os.Create(jsonStoreFile)
	if err != nil {
		return err	
	}
	defer file.Close()
	
	encoder := json.NewEncoder(file)
	encoder.SetIndent("", " ")
	return encoder.Encode(r.tasks)
}


func (r *InMemoryTaskRepository) CreateTask(task Task) (*Task, error) {
    r.mu.Lock()
    defer r.mu.Unlock()
    task.ID = uuid.New().String() 
    task.CreatedAt = time.Now().Format("02/01/2006")
    if task.Status == "" {
        task.Status = StatusTodo
    }
    r.tasks[task.ID] = task

	if err := r.saveToJSON(); err != nil {
		log.Printf("Error saving in JSON")
	}
    
    return &task, nil 
}

func (r *InMemoryTaskRepository) GetAllTasks() ([]Task, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()
	allTasks := make([]Task, 0, len(r.tasks))
	for _, task := range r.tasks {
		allTasks = append(allTasks, task)
	}
	return allTasks, nil
}

func (r *InMemoryTaskRepository) GetTaskByID(id string) (*Task, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()
	task, exists := r.tasks[id]
	if !exists {
		return &Task{}, errors.New("task not found")
	}
	return &task, nil
}

func (r *InMemoryTaskRepository) UpdateTask(id string, updatedTask Task) (*Task, error) {
	r.mu.Lock()
	defer r.mu.Unlock()
	existingTask, exists := r.tasks[id]
	if !exists {
		return &Task{}, errors.New("task not found")
	}
	if !isStatusValid(updatedTask.Status) {
		return &Task{}, errors.New("invalid task status")
	}
	updatedTask.ID = id
	updatedTask.CreatedAt = existingTask.CreatedAt
	r.tasks[id] = updatedTask
	if err := r.saveToJSON(); err != nil {
		log.Printf("Error saving in JSON")
	}

	return &updatedTask, nil
}

func (r *InMemoryTaskRepository) DeleteTask(id string) error {
	r.mu.Lock()
	defer r.mu.Unlock()
	_, exists := r.tasks[id]
	if !exists {
		return errors.New("task not found")
	}

	delete(r.tasks, id)

	if err := r.saveToJSON(); err != nil {
		log.Printf("Error saving in JSON")
	}
	return nil
}

func (h *TaskHandler) HandlerCreateTask(w http.ResponseWriter, r *http.Request) {
	var task Task
	if err := json.NewDecoder(r.Body).Decode(&task); err != nil {
		h.respondWithError(w, http.StatusBadRequest, "invalid payload json")
		return
	}

	if task.Title == "" {
		h.respondWithError(w, http.StatusBadRequest, "title is required")
		return
	}
	
	createdTask, err := h.repo.CreateTask(task)
	if err != nil {
		h.respondWithError(w, http.StatusInternalServerError, "failed to create task")
		return
	}

	h.respondWithJSON(w, http.StatusCreated, createdTask)
}

func (h *TaskHandler) handleGetAllTasks(w http.ResponseWriter, r *http.Request) {
	tasks, err := h.repo.GetAllTasks()
	if err != nil {
		h.respondWithError(w, http.StatusInternalServerError, "failed to retrieve tasks")
		return
	}
	h.respondWithJSON(w, http.StatusOK, tasks)
}

func (h *TaskHandler) handleGetTaskByID(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	task, err := h.repo.GetTaskByID(id)
	if err != nil {
		h.respondWithError(w, http.StatusNotFound, "task not found")
		return
	}
	h.respondWithJSON(w, http.StatusOK, task)
}

func (h *TaskHandler) handleUpdateTask(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	var taskToUpdate Task
	if err := json.NewDecoder(r.Body).Decode(&taskToUpdate); err != nil {
		h.respondWithError(w, http.StatusBadRequest, "invalid payload json")
		return
	}
	

	if taskToUpdate.Title == "" {
		h.respondWithError(w, http.StatusBadRequest, "title is required")
		return
	}

	updatedTask, err := h.repo.UpdateTask(id, taskToUpdate)
	if err != nil {
		errorMessage := err.Error()
		if errorMessage == "task not found" {
			h.respondWithError(w, http.StatusNotFound, errorMessage)
			return
		}

		if strings.Contains(errorMessage, "invalid task status") {
			h.respondWithError(w, http.StatusBadRequest, errorMessage)
			return
		}

		h.respondWithError(w, http.StatusInternalServerError, "failed to update task")
		return
	}

	h.respondWithJSON(w, http.StatusOK, updatedTask)
}

func (h *TaskHandler) handleDeleteTask(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")

	err := h.repo.DeleteTask(id)
	if err != nil {
		if err.Error() == "task not found" {
			h.respondWithError(w, http.StatusNotFound, err.Error())
		} else {
			h.respondWithError(w, http.StatusInternalServerError, "failed to delete task")
		}
		return
	}

	w.WriteHeader(http.StatusNoContent)
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

func isStatusValid(status Status) bool {
	switch status {
	case StatusTodo, StatusInProgress, StatusDone:
		return true
	default:
		return false
	}
}
