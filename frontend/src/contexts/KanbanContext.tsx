import React, { createContext, useState, useEffect } from 'react';
import {
  getTasks as apiGetTasks,
  createTask as apiCreateTask,
  updateTask as apiUpdateTask,
  deleteTask as apiDeleteTask,
} from '../api/tasks.js';
import type {
  Task,
  TaskCreatePayload,
  TaskUpdatePayload,
} from '../api/tasks.js';

interface KanbanColumns {
  todo: { name: string; items: Task[] };
  'in-progress': { name: string; items: Task[] };
  done: { name: string; items: Task[] };
}

interface KanbanContextType {
  columns: KanbanColumns;
  isLoading: boolean;
  error: string | null;
  createTask: (payload: TaskCreatePayload) => Promise<Task>;
  updateTask: (id: string, update: Partial<TaskUpdatePayload>) => Promise<Task>;
  deleteTask: (id: string) => Promise<void>;
}

export const KanbanContext = createContext<KanbanContextType>({
  columns: {
    todo: { name: 'A Fazer', items: [] },
    'in-progress': { name: 'Em Progresso', items: [] },
    done: { name: 'Concluído', items: [] },
  },
  isLoading: false,
  error: null,
  createTask: async () => {
    throw new Error('createTask not implemented');
  },
  updateTask: async () => {
    throw new Error('updateTask not implemented');
  },
  deleteTask: async () => {
    throw new Error('deleteTask not implemented');
  },
});

export const KanbanProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [columns, setColumns] = useState<KanbanColumns>({
    todo: { name: 'A Fazer', items: [] },
    'in-progress': { name: 'Em Progresso', items: [] },
    done: { name: 'Concluído', items: [] },
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const findTaskById = (id: string): Task | null => {
    const allTasks = [
      ...columns.todo.items,
      ...columns['in-progress'].items,
      ...columns.done.items,
    ];
    return allTasks.find((t) => t.id === id) ?? null;
  };

  const loadTasks = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const tasks = await apiGetTasks();
      const newColumns: KanbanColumns = {
        todo: { name: 'A Fazer', items: [] },
        'in-progress': { name: 'Em Progresso', items: [] },
        done: { name: 'Concluído', items: [] },
      };
      tasks.forEach((task) => {
        if (task.status === 'todo') newColumns.todo.items.push(task);
        else if (task.status === 'in-progress')
          newColumns['in-progress'].items.push(task);
        else if (task.status === 'done') newColumns.done.items.push(task);
      });
      setColumns(newColumns);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar tarefas');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const createTask = async (payload: TaskCreatePayload): Promise<Task> => {
    setError(null);
    try {
      const newTask = await apiCreateTask(payload);
      setColumns((prev) => {
        const col = prev[newTask.status];
        return {
          ...prev,
          [newTask.status]: { ...col, items: [newTask, ...col.items] },
        };
      });
      return newTask;
    } catch (err: any) {
      setError(err.message || 'Erro ao criar tarefa');
      throw err;
    }
  };

  const updateTask = async (
    id: string,
    update: Partial<TaskUpdatePayload>
  ): Promise<Task> => {
    setError(null);
    try {
      const current = findTaskById(id);
      if (!current) {
        throw new Error('Tarefa não encontrada no estado local.');
      }

      const payloadToSend: TaskUpdatePayload = {
        title: update.title ?? current.title,
        description: Object.prototype.hasOwnProperty.call(update, 'description')
          ? (update.description as string | null)
          : (current.description ?? ''),
        status: update.status ?? current.status,
      };

      console.log('updateTask -> sending payload (PUT):', id, payloadToSend);

      const updated = await apiUpdateTask(id, payloadToSend);

      console.log('updateTask -> api returned:', updated);

      setColumns((prev) => {
        const newColumns: KanbanColumns = {
          todo: {
            ...prev.todo,
            items: prev.todo.items.filter((t) => t.id !== id),
          },
          'in-progress': {
            ...prev['in-progress'],
            items: prev['in-progress'].items.filter((t) => t.id !== id),
          },
          done: {
            ...prev.done,
            items: prev.done.items.filter((t) => t.id !== id),
          },
        };

        if (['todo', 'in-progress', 'done'].includes(updated.status)) {
          newColumns[updated.status].items = [
            updated,
            ...newColumns[updated.status].items,
          ];
        }

        return newColumns;
      });

      return updated;
    } catch (err: any) {
      console.error('Erro updateTask:', err);
      setError(err.message || 'Erro ao atualizar tarefa.');
      throw err;
    }
  };

  const deleteTask = async (id: string): Promise<void> => {
    setError(null);
    try {
      await apiDeleteTask(id);
      setColumns((prev) => {
        const newColumns: KanbanColumns = {
          todo: {
            ...prev.todo,
            items: prev.todo.items.filter((t) => t.id !== id),
          },
          'in-progress': {
            ...prev['in-progress'],
            items: prev['in-progress'].items.filter((t) => t.id !== id),
          },
          done: {
            ...prev.done,
            items: prev.done.items.filter((t) => t.id !== id),
          },
        };
        return newColumns;
      });
    } catch (err: any) {
      setError(err.message || 'Erro ao deletar tarefa');
      throw err;
    }
  };

  return (
    <KanbanContext.Provider
      value={{
        columns,
        isLoading,
        error,
        createTask,
        updateTask,
        deleteTask,
      }}
    >
      {children}
    </KanbanContext.Provider>
  );
};
