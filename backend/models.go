package main

import "time"

type Status string

const (
	StatusTodo 	 Status = "A Fazer"
	StatusInProgress Status = "Em Progresso"
	StatusDone      Status = "Concluído"
)

type Task struct {
	ID          string       `json:"id"`
	Title       string    `json:"title"`
	Description string    `json:"description"`
	Status	  Status    `json:"status"`
	CreatedAt   time.Time `json:"created_at"`
}

type TaskRepository interface {
	CreateTask(task Task) (Task, error)
	GetAllTasks() ([]Task, error)
	GetTaskByID(id string) (*Task, error)
	UpdateTask(id string, task Task) (*Task, error)
	DeleteTask(id string) error
}