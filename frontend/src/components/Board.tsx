import React, { useContext } from 'react';
import {
  Wrapper,
  Container,
  Header,
  BoardGrid,
  Column,
  TasksList,
  Card,
  Empty,
} from './Board.style.js';
import { KanbanContext } from '../contexts/KanbanContext.js';

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
                <Card
                  key={task.id}
                  style={{ borderLeftColor: borderColorForStatus(task.status) }}
                >
                  <div className="title">{task.title}</div>
                  {task.description && (
                    <div className="desc">{task.description}</div>
                  )}
                  <div className="meta">
                    <span>{task.createdAt}</span>
                    <strong style={{ color: '#3b82f6' }}>A Fazer</strong>
                  </div>
                </Card>
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
                <Card
                  key={task.id}
                  style={{ borderLeftColor: borderColorForStatus(task.status) }}
                >
                  <div className="title">{task.title}</div>
                  {task.description && (
                    <div className="desc">{task.description}</div>
                  )}
                  <div className="meta">
                    <span>{new Date(task.createdAt).toLocaleString()}</span>
                    <strong style={{ color: '#f59e0b' }}>Em Progresso</strong>
                  </div>
                </Card>
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
                <Card
                  key={task.id}
                  style={{ borderLeftColor: borderColorForStatus(task.status) }}
                >
                  <div className="title">{task.title}</div>
                  {task.description && (
                    <div className="desc">{task.description}</div>
                  )}
                  <div className="meta">
                    <span>{new Date(task.createdAt).toLocaleString()}</span>
                    <strong style={{ color: '#10b981' }}>Concluído</strong>
                  </div>
                </Card>
              ))}
            </TasksList>
          </Column>
        </BoardGrid>
      </Container>
    </Wrapper>
  );
};

export default Board;
