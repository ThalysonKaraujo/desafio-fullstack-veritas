import React, { useState, useContext } from 'react';
import { KanbanContext } from '../contexts/KanbanContext.js';
import type { ColumnId } from '../contexts/KanbanContext.js';

const AddTaskForm: React.FC = () => {
  const { addTask } = useContext(KanbanContext);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<ColumnId>('todo');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return setError('Título é obrigatório');
    setError(null);
    setLoading(true);
    try {
      await addTask({
        title: title.trim(),
        description: description.trim(),
        status,
      });
      setTitle('');
      setDescription('');
    } catch (err: any) {
      setError(err?.message ?? 'Erro ao criar tarefa');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        padding: 12,
        border: '1px solid #eee',
        borderRadius: 8,
        marginBottom: 12,
      }}
    >
      <div>
        <label>
          Título
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{ width: '100%' }}
          />
        </label>
      </div>
      <div>
        <label>
          Descrição
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{ width: '100%' }}
          />
        </label>
      </div>
      <div>
        <label>
          Status
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as ColumnId)}
          >
            <option value="todo">A Fazer</option>
            <option value="in-progress">Em Progresso</option>
            <option value="done">Concluído</option>
          </select>
        </label>
      </div>
      <div style={{ marginTop: 8 }}>
        <button type="submit" disabled={loading}>
          {loading ? 'Criando...' : 'Adicionar Tarefa'}
        </button>
      </div>
      {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
    </form>
  );
};

export default AddTaskForm;
