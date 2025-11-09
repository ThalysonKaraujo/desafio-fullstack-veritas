import axios from 'axios';

export type TaskStatus = 'todo' | 'in-progress' | 'done';

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  createdAt: string;
}

export interface TaskCreatePayload {
  title: string;
  description?: string;
  status?: TaskStatus;
}

export interface TaskUpdatePayload {
  title: string;
  description?: string;
  status: TaskStatus;
}

const api = axios.create({
  baseURL: 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
});

const getErrorMessage = (err: unknown) => {
  if (axios.isAxiosError(err)) {
    return err.response?.data?.error ?? err.message;
  }
  return String(err);
};

export const getTasks = async (): Promise<Task[]> => {
  try {
    const response = await api.get<Task[]>('/tasks');
    return response.data;
  } catch (err) {
    throw new Error(`Falha ao buscar tarefas: ${getErrorMessage(err)}`);
  }
};

export const createTask = async (payload: TaskCreatePayload): Promise<Task> => {
  try {
    const response = await api.post<Task>('/tasks', payload);
    return response.data;
  } catch (err) {
    throw new Error(`Falha ao criar tarefa: ${getErrorMessage(err)}`);
  }
};

export const updateTask = async (
  id: string,
  payload: TaskUpdatePayload
): Promise<Task> => {
  try {
    const response = await api.put<Task>(`/tasks/${id}`, payload);
    return response.data;
  } catch (err) {
    throw new Error(`Falha ao atualizar tarefa: ${getErrorMessage(err)}`);
  }
};

export const deleteTask = async (id: string): Promise<void> => {
  try {
    await api.delete(`/tasks/${id}`);
  } catch (err) {
    throw new Error(`Falha ao deletar tarefa: ${getErrorMessage(err)}`);
  }
};

export { api };
