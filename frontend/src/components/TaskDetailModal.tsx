import React, { useContext, useState, useEffect } from 'react';
import {
  Backdrop,
  Modal,
  Header,
  Title,
  IconButton,
  Body,
  Footer,
  Button,
  TextArea,
  TitleInput,
  DescriptionView,
} from './TaskDetailModal.styles.js';
import { KanbanContext } from '../contexts/KanbanContext.js';

type Task = {
  id: string;
  title: string;
  description?: string | null;
  status?: string;
  createdAt?: string | null;
};

interface Props {
  isOpen: boolean;
  onClose: () => void;
  task: Task;
}

export default function TaskDetailModal({ isOpen, onClose, task }: Props) {
  const { updateTask, deleteTask } = useContext(KanbanContext);
  const [editing, setEditing] = useState(false);
  const [desc, setDesc] = useState(task.description ?? '');
  const [title, setTitle] = useState(task.title);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setDesc(task.description ?? '');
    setTitle(task.title);
    setEditing(false);
  }, [task, isOpen]);

  if (!isOpen) return null;

  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return '';
    return d.toLocaleDateString('pt-BR');
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const payload = { title: title?.trim(), description: desc ?? '' };
      console.log('updateTask payload:', task.id, payload);
      await updateTask(task.id, payload as any);
      onClose();
    } catch (err: any) {
      console.error('Erro ao atualizar tarefa:', err);
      alert(err?.message ?? 'Erro ao atualizar tarefa.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Tem certeza que deseja excluir esta tarefa?')) return;
    try {
      await deleteTask(task.id);
      onClose();
    } catch (err) {
      console.error(err);
      alert('Erro ao excluir.');
    }
  };

  return (
    <Backdrop onMouseDown={onClose} role="dialog" aria-modal="true">
      <Modal onMouseDown={(e) => e.stopPropagation()}>
        <Header>
          <div style={{ flex: 1 }}>
            {!editing ? (
              <>
                <Title>{task.title}</Title>
                <div style={{ fontSize: 12, color: '#6b7280' }}>
                  {formatDate(task.createdAt)}
                </div>
              </>
            ) : (
              <>
                <TitleInput
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                <div style={{ fontSize: 12, color: '#6b7280' }}>
                  {formatDate(task.createdAt)}
                </div>
              </>
            )}
          </div>

          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <IconButton
              aria-label="Editar"
              title="Editar descrição"
              onClick={() => setEditing((s) => !s)}
            >
              ✏️
            </IconButton>

            <IconButton
              aria-label="Excluir"
              title="Excluir tarefa"
              onClick={handleDelete}
            >
              🗑️
            </IconButton>

            <IconButton aria-label="Fechar" title="Fechar" onClick={onClose}>
              ✖️
            </IconButton>
          </div>
        </Header>

        <Body>
          {!editing ? (
            <DescriptionView>
              {task.description || 'Sem descrição'}
            </DescriptionView>
          ) : (
            <>
              <TextArea
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                placeholder="Descrição..."
              />
              <Footer style={{ marginTop: 12 }}>
                <Button
                  onClick={() => {
                    setEditing(false);
                    setDesc(task.description ?? '');
                    setTitle(task.title);
                  }}
                >
                  Cancelar
                </Button>
                <Button
                  variant="primary"
                  onClick={handleSave}
                  disabled={isSaving}
                >
                  {isSaving ? 'Salvando...' : 'Salvar'}
                </Button>
              </Footer>
            </>
          )}
        </Body>

        {!editing && (
          <Footer>
            <Button onClick={onClose}>Fechar</Button>
            <Button variant="primary" onClick={() => setEditing(true)}>
              Editar
            </Button>
          </Footer>
        )}
      </Modal>
    </Backdrop>
  );
}
