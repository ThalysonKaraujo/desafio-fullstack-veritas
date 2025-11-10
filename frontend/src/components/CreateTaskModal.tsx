import React, { useState, useContext } from 'react';
import { KanbanContext } from '../contexts/KanbanContext.js';
import {
  Backdrop,
  Modal,
  Title,
  Field,
  Actions,
  Button,
  ErrorText,
} from './CreateTaskModal.styles.js';

type TaskStatus = 'todo' | 'in-progress' | 'done';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateTaskModal({ isOpen, onClose }: Props) {
  const { addTask } = useContext(KanbanContext);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<TaskStatus>('todo');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError('O título é obrigatório.');
      return;
    }

    setIsLoading(true);
    try {
      await addTask({
        title: title.trim(),
        description: description.trim(),
        status,
      });
      setTitle('');
      setDescription('');
      setStatus('todo');
      onClose();
    } catch (err) {
      setError('Erro ao criar a tarefa. Tente novamente.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Backdrop role="dialog" aria-modal="true" onMouseDown={onClose}>
      <Modal onMouseDown={(ev) => ev.stopPropagation()}>
        <Title>Nova tarefa</Title>

        <form onSubmit={handleSubmit}>
          <Field>
            <label htmlFor="task-title">Título</label>
            <input
              id="task-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Implementar botão de salvar"
              autoFocus
            />
          </Field>

          <Field>
            <label htmlFor="task-desc">Descrição</label>
            <textarea
              id="task-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detalhes da tarefa (opcional)"
            />
          </Field>

          <Field>
            <label htmlFor="task-status">Status</label>
            <select
              id="task-status"
              value={status}
              onChange={(e) => setStatus(e.target.value as TaskStatus)}
            >
              <option value="todo">A Fazer</option>
              <option value="in-progress">Em Progresso</option>
              <option value="done">Concluído</option>
            </select>
          </Field>

          {error && <ErrorText>{error}</ErrorText>}

          <Actions>
            <Button
              type="button"
              onClick={onClose}
              variant="ghost"
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button type="submit" variant="primary" disabled={isLoading}>
              {isLoading ? 'Criando...' : 'Criar tarefa'}
            </Button>
          </Actions>
        </form>
      </Modal>
    </Backdrop>
  );
}
