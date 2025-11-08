package main

import (
	"testing"
	"time"
)

func TestUnit_isStatusValid(t *testing.T) {
	// ... (seu teste existente)
}
func TestUnit_Repository_CreateTaskDefaults(t *testing.T) {
	repo := NewInMemoryTaskRepository()
	repo.tasks = make(map[string]Task) 

	taskToCreate := Task{
		Title: "Teste de Padrões",
	}

	createdTask, err := repo.CreateTask(taskToCreate)
	if err != nil {
		t.Fatalf("CreateTask retornou um erro inesperado: %v", err)
	}

	if createdTask.ID == "" {
		t.Error("CreateTask falhou em definir um ID")
	}
	if createdTask.Status != StatusTodo {
		t.Errorf("CreateTask falhou em definir o Status padrão: esperado '%s', recebido '%s'", StatusTodo, createdTask.Status)
	}
	if createdTask.CreatedAt.IsZero() {
		t.Error("CreateTask falhou em definir o CreatedAt")
	}
}

func TestUnit_Repository_UpdateTaskInvalidStatus(t *testing.T) {
	repo := NewInMemoryTaskRepository()
	repo.tasks = make(map[string]Task) 
	
	testTask := Task{
		ID:        "task-1",
		Title:     "Tarefa Original",
		Status:    StatusTodo,
		CreatedAt: time.Now(),
	}
	repo.tasks[testTask.ID] = testTask

	invalidUpdate := Task{
		Title:  "Tarefa Atualizada",
		Status: "status-quebrado", 
	}

	_, err := repo.UpdateTask("task-1", invalidUpdate)

	if err == nil {
		t.Fatal("UpdateTask deveria retornar um erro para status inválido, mas não retornou")
	}

	expectedError := "invalid task status"
	if err.Error() != expectedError {
		t.Errorf("UpdateTask retornou a mensagem de erro errada: esperado '%s', recebido '%s'", expectedError, err.Error())
	}

	originalTask, _ := repo.GetTaskByID("task-1")
	if originalTask.Title != "Tarefa Original" {
		t.Error("UpdateTask modificou a tarefa mesmo após um erro de validação")
	}
}