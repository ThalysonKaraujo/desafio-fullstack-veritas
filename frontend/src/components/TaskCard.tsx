import { Card, Title, Description, MetaRow } from './TaskCard.styles.js';

type Task = {
  id: string;
  title: string;
  description?: string | null;
  status?: string;
  createdAt?: string | null;
};

interface Props {
  task: Task;
  onClick?: () => void;
}

const formatDate = (dateStr?: string | null) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return '';
  return d.toLocaleDateString('pt-BR');
};

export default function TaskCard({ task, onClick }: Props) {
  return (
    <Card
      onClick={onClick}
      role="button"
      aria-label={`Abrir tarefa ${task.title}`}
      style={{ cursor: 'pointer' }}
    >
      <Title>{task.title}</Title>

      <Description>{task.description || 'Sem descrição'}</Description>

      <MetaRow>
        <div>{formatDate(task.createdAt)}</div>
        <div style={{ fontWeight: 700, color: '#2563eb', fontSize: 12 }}>
          {task.status}
        </div>
      </MetaRow>
    </Card>
  );
}
