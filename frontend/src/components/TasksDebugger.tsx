import React, { useEffect, useState } from 'react';
import { getTasks } from '../api/tasks.js';
import type { Task as ApiTask } from '../api/tasks.js';
const TasksDebugger: React.FC = () => {
  const [tasks, setTasks] = useState<ApiTask[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getTasks();
        setTasks(data);
      } catch (err: any) {
        setError(err?.message ?? String(err));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <div>Carregando tarefas...</div>;
  if (error) return <div style={{ color: 'red' }}>Erro: {error}</div>;
  if (!tasks || tasks.length === 0) return <div>Nenhuma tarefa encontrada</div>;

  return (
    <div style={{ padding: 16 }}>
      <h3>Tarefas (debug)</h3>
      <ul>
        {tasks.map((t) => (
          <li key={t.id}>
            <strong>{t.title}</strong> — {t.status} — {t.createdAt}
            <div style={{ color: '#666' }}>{t.description}</div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TasksDebugger;
