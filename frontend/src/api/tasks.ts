import axios from 'axios';

export type ColumnId = 'todo' | 'in-progress' | 'done';

export interface ApiTask {
  id: string;
  title: string;
  description?: string | null;
  status: string;
  created_at: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string | null;
  status: ColumnId;
  createdAt: string;
}

export interface TaskCreatePayload {
  title: string;
  description?: string;
  status?: ColumnId;
}

export interface TaskUpdatePayload {
  title: string;
  description?: string | null;
  status: ColumnId;
}

const apiStatusToColumnId = (s: string): ColumnId => {
  switch (s) {
    case 'A Fazer':
      return 'todo';
    case 'Em Progresso':
      return 'in-progress';
    case 'Concluído':
      return 'done';
    default:
      return 'todo';
  }
};

const columnIdToApiStatus = (c: ColumnId): string => {
  switch (c) {
    case 'todo':
      return 'A Fazer';
    case 'in-progress':
      return 'Em Progresso';
    case 'done':
      return 'Concluído';
    default:
      return 'A Fazer';
  }
};

const mapApiTaskToTask = (t: ApiTask): Task => {
  return {
    id: t.id,
    title: t.title,
    description: t.description ?? null,
    status: apiStatusToColumnId(t.status),
    createdAt: t.created_at ?? new Date().toISOString(),
  };
};

const api = axios.create({
  baseURL: 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
});

const getErrorMessage = (err: unknown) => {
  if (axios.isAxiosError(err)) {
    return (err.response as any)?.data?.error ?? err.message;
  }
  return String(err);
};

/* GET /tasks -> retorna array de Task */
export const getTasks = async (): Promise<Task[]> => {
  try {
    const response = await api.get<Record<string, ApiTask>>('/tasks');
    const data = response.data;
    return Object.values(data).map(mapApiTaskToTask);
  } catch (err) {
    throw new Error(`Falha ao buscar tarefas: ${getErrorMessage(err)}`);
  }
};

export const createTask = async (payload: TaskCreatePayload): Promise<Task> => {
  try {
    const body = {
      title: payload.title,
      description: payload.description ?? '',
      status: columnIdToApiStatus(payload.status ?? 'todo'),
    };

    const res = await api.post<ApiTask>('/tasks', body);
    return mapApiTaskToTask(res.data);
  } catch (err) {
    throw new Error(`Falha ao criar tarefa: ${getErrorMessage(err)}`);
  }
};

export const updateTask = async (
  id: string,
  payload: TaskUpdatePayload
): Promise<Task> => {
  try {
    const bodyForApi = {
      title: payload.title,
      description: payload.description ?? '',
      status: columnIdToApiStatus(payload.status),
    };

    const response = await api.put<ApiTask>(`/tasks/${id}`, bodyForApi);
    return mapApiTaskToTask(response.data);
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
