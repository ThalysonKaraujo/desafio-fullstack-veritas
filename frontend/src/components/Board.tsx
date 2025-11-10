import React, { useContext, useState } from 'react';
import {
  Wrapper,
  Container,
  Header,
  BoardGrid,
  Column,
  TasksList,
  Empty,
} from './Board.style.js';
import { KanbanContext } from '../contexts/KanbanContext.js';
import type { Task } from '../api/tasks.js';
import TaskCard from './TaskCard.js';
import TaskDetailModal from './TaskDetailModal.js';

const borderColorForStatus = (status: string) => {
  switch (status) {
    case 'todo':
      return '#3b82f6';
    case 'in-progress':
      return '#f59e0b';
    case 'done':
      return '#10b981';
    default:
      return '#c7d2fe';
  }
};

const Board: React.FC = () => {
  const { columns, isLoading, error } = useContext(KanbanContext);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openTask = (task: Task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTask(null);
  };

  if (isLoading) {
    return (
      <Wrapper>
        <Container>
          <Header>
            <h1>Mini Kanban</h1>
            <p>Carregando tarefas...</p>
          </Header>
        </Container>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <Container>
        <Header>
          <h1>Mini Kanban</h1>
          <p>Organize suas tarefas de forma visual e eficiente</p>
        </Header>

        {error && (
          <div style={{ color: '#fee2e2', marginBottom: 12 }}>{error}</div>
        )}

        <BoardGrid>
          <Column variant="todo">
            <div className="column-header">
              <div className="column-title">📝 A Fazer</div>
              <div className="task-count">{columns.todo.items.length}</div>
            </div>

            <TasksList>
              {columns.todo.items.length === 0 && <Empty>Nenhuma tarefa</Empty>}
              {columns.todo.items.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onClick={() => openTask(task)}
                />
              ))}
            </TasksList>
          </Column>

          <Column variant="in-progress">
            <div className="column-header">
              <div className="column-title">⚡ Em Progresso</div>
              <div className="task-count">
                {columns['in-progress'].items.length}
              </div>
            </div>

            <TasksList>
              {columns['in-progress'].items.length === 0 && (
                <Empty>Nenhuma tarefa</Empty>
              )}
              {columns['in-progress'].items.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onClick={() => openTask(task)}
                />
              ))}
            </TasksList>
          </Column>

          <Column variant="done">
            <div className="column-header">
              <div className="column-title">✅ Concluído</div>
              <div className="task-count">{columns.done.items.length}</div>
            </div>

            <TasksList>
              {columns.done.items.length === 0 && <Empty>Nenhuma tarefa</Empty>}
              {columns.done.items.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onClick={() => openTask(task)}
                />
              ))}
            </TasksList>
          </Column>
        </BoardGrid>

        {selectedTask && (
          <TaskDetailModal
            isOpen={isModalOpen}
            onClose={closeModal}
            task={selectedTask}
          />
        )}
      </Container>
    </Wrapper>
  );
};

export default Board;
