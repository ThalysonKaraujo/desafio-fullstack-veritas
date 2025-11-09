import React, { createContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { getTasks, createTask } from '../api/tasks.js';

export type ColumnId = 'todo' | 'in-progress' | 'done';

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: ColumnId;
  createdAt: string;
}

export type KanbanColumns = Record<
  ColumnId,
  {
    name: string;
    items: Task[];
  }
>;

interface KanbanContextType {
  columns: KanbanColumns;
  isLoading: boolean;
  error: string | null;
  addTask: (payload: {
    title: string;
    description?: string;
    status?: ColumnId;
  }) => Promise<Task>;
}

export const KanbanContext = createContext<KanbanContextType>({
  columns: {
    todo: { name: 'A Fazer', items: [] },
    'in-progress': { name: 'Em Progresso', items: [] },
    done: { name: 'Concluído', items: [] },
  },
  isLoading: false,
  error: null,
  addTask: async () => {
    throw new Error('addTask not implemented');
  },
});

interface KanbanProviderProps {
  children: ReactNode;
}

const isColumnId = (status: any): status is ColumnId => {
  return ['todo', 'in-progress', 'done'].includes(status);
};

const mapTasksToColumns = (tasks: Task[]): KanbanColumns => {
  const columns: KanbanColumns = {
    todo: { name: 'A Fazer', items: [] },
    'in-progress': { name: 'Em Progresso', items: [] },
    done: { name: 'Concluído', items: [] },
  };

  tasks.forEach((task) => {
    if (isColumnId(task.status)) {
      columns[task.status].items.push(task);
    }
  });

  return columns;
};

export const KanbanProvider: React.FC<KanbanProviderProps> = ({ children }) => {
  const [columns, setColumns] = useState<KanbanColumns>({
    todo: { name: 'A Fazer', items: [] },
    'in-progress': { name: 'Em Progresso', items: [] },
    done: { name: 'Concluído', items: [] },
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTasks = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const tasks = await getTasks();
        const mappedColumns = mapTasksToColumns(tasks);
        setColumns(mappedColumns);
      } catch (err) {
        setError('Erro ao carregar tarefas.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const addTask = async (payload: {
    title: string;
    description?: string;
    status?: ColumnId;
  }): Promise<Task> => {
    setError(null);
    try {
      const status = payload.status ?? 'todo';
      const created = await createTask({
        title: payload.title,
        description: payload.description ?? '',
        status,
      });
      setColumns((prev) => ({
        ...prev,
        [status]: { ...prev[status], items: [created, ...prev[status].items] },
      }));
      return created;
    } catch (err) {
      setError('Erro ao criar tarefa.');
      throw err;
    }
  };

  return (
    <KanbanContext.Provider value={{ columns, isLoading, error, addTask }}>
      {children}
    </KanbanContext.Provider>
  );
};
