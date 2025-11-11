import React, { useContext } from 'react';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable,
  DragOverlay,
  type DragEndEvent,
  type DragOverEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { KanbanContext } from '../contexts/KanbanContext.js';
import type { Task, ColumnId } from '../api/tasks.js';
import TaskCard from './TaskCard.js';
import TaskDetailModal from './TaskDetailModal.js';
import * as S from './Board.style.js';

type ColKey = 'todo' | 'in-progress' | 'done';
const COLUMN_KEYS: ColKey[] = ['todo', 'in-progress', 'done'];

function ColumnDroppableWrapper({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <S.TasksList
      ref={setNodeRef}
      style={{
        borderRadius: 8,
        padding: 6,
        transition: 'background-color 160ms ease',
        backgroundColor: isOver ? 'rgba(99, 102, 241, 0.08)' : 'transparent',
      }}
    >
      {children}
    </S.TasksList>
  );
}

function SortableTask({
  task,
  index,
  onTaskClick,
}: {
  task: Task;
  index: number;
  onTaskClick: (task: Task) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
  });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition: isDragging ? 'none' : transition,
    opacity: isDragging ? 0.3 : 1,
    userSelect: 'none',
    marginBottom: 12,
    cursor: 'grab',
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <TaskCard task={task} onClick={() => onTaskClick(task)} />
    </div>
  );
}

export default function Board(): React.ReactElement {
  const { columns, setColumns, updateTask, loadTasks } = useContext(
    KanbanContext
  ) as any;

  const [activeId, setActiveId] = React.useState<string | null>(null);
  const [selectedTask, setSelectedTask] = React.useState<Task | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = React.useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const findColumnAndIndexByTaskId = (id: string) => {
    for (const key of COLUMN_KEYS) {
      const idx = columns[key].items.findIndex((t: Task) => t.id === id);
      if (idx !== -1) return { colId: key as ColKey, index: idx };
    }
    return { colId: null as ColKey | null, index: -1 };
  };

  const handleDragStart = (event: any) => {
    setActiveId(String(event.active.id));
  };

  const handleDragOver = (_event: DragOverEvent) => {
    // Apenas atualiza visualmente, não move realmente
  };

  const handleDragCancel = () => {
    setActiveId(null);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    setActiveId(null);

    const { active, over } = event;
    if (!over) return;

    const activeId = String(active.id);
    const overId = String(over.id);

    const activeInfo = findColumnAndIndexByTaskId(activeId);
    if (!activeInfo.colId) return;

    let destColId: ColKey | null = null;
    let destIndex = -1;

    if (COLUMN_KEYS.includes(overId as ColKey)) {
      destColId = overId as ColKey;
      destIndex = columns[destColId].items.length;
    } else {
      const overInfo = findColumnAndIndexByTaskId(overId);
      if (!overInfo.colId) {
        return;
      }
      destColId = overInfo.colId;
      destIndex = overInfo.index;
    }

    if (activeInfo.colId === destColId && activeInfo.index === destIndex)
      return;

    // Mesma coluna - apenas reordenação
    if (activeInfo.colId === destColId) {
      const colId = activeInfo.colId;
      const newItems = arrayMove(
        columns[colId].items,
        activeInfo.index,
        destIndex
      );
      setColumns((prev: any) => ({
        ...prev,
        [colId]: { ...prev[colId], items: newItems },
      }));
      return;
    }

    // Coluna diferente - move para outra coluna
    if (activeInfo.colId && destColId) {
      const sourceCol = activeInfo.colId;
      const targetCol = destColId;

      const sourceItems = Array.from(columns[sourceCol].items);
      const targetItems = Array.from(columns[targetCol].items);

      const [moved] = sourceItems.splice(activeInfo.index, 1) as [Task];
      const insertAt = destIndex === -1 ? targetItems.length : destIndex;
      if (moved) targetItems.splice(insertAt, 0, moved);

      setColumns((prev: any) => ({
        ...prev,
        [sourceCol]: { ...prev[sourceCol], items: sourceItems },
        [targetCol]: { ...prev[targetCol], items: targetItems },
      }));

      // Persiste a mudança no backend
      try {
        if (moved) {
          await updateTask(moved.id, { status: targetCol as ColumnId });
        }
      } catch (err) {
        console.error('Erro ao mover tarefa:', err);
        if (typeof loadTasks === 'function') {
          await loadTasks();
        } else {
          window.location.reload();
        }
      }
    }
  };

  // Encontra a tarefa ativa para exibir no overlay
  const getActiveTask = () => {
    if (!activeId) return null;
    for (const key of COLUMN_KEYS) {
      const task = columns[key].items.find((t: Task) => t.id === activeId);
      if (task) return task;
    }
    return null;
  };

  const activeTask = getActiveTask();

  return (
    <S.Wrapper>
      <S.Container>
        <S.Header>
          <h1>📋 Quadro Kanban</h1>
          <p>Organize suas tarefas por status</p>
        </S.Header>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
          onDragCancel={handleDragCancel}
        >
          <S.BoardGrid>
            {COLUMN_KEYS.map((colId) => {
              const column = columns[colId];
              const columnVariant = colId as 'todo' | 'in-progress' | 'done';
              return (
                <S.Column key={colId} variant={columnVariant}>
                  <div className="column-header">
                    <div>
                      <div className="column-title">{column.name}</div>
                    </div>
                    <span className="task-count">{column.items.length}</span>
                  </div>

                  <ColumnDroppableWrapper id={colId}>
                    <SortableContext
                      items={column.items.map((t: Task) => t.id)}
                      strategy={verticalListSortingStrategy}
                    >
                      {column.items.length === 0 ? (
                        <S.Empty>Nenhuma tarefa aqui</S.Empty>
                      ) : (
                        column.items.map((task: Task, index: number) => (
                          <SortableTask
                            key={task.id}
                            task={task}
                            index={index}
                            onTaskClick={(t) => {
                              setSelectedTask(t);
                              setIsDetailModalOpen(true);
                            }}
                          />
                        ))
                      )}
                    </SortableContext>
                  </ColumnDroppableWrapper>
                </S.Column>
              );
            })}
          </S.BoardGrid>

          {/* Overlay que segue o cursor enquanto arrasta */}
          <DragOverlay>
            {activeTask ? (
              <div style={{ opacity: 0.9, transform: 'scale(1.05)' }}>
                <TaskCard task={activeTask} />
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>

        {/* Modal de detalhe da tarefa */}
        {selectedTask && (
          <TaskDetailModal
            isOpen={isDetailModalOpen}
            onClose={() => setIsDetailModalOpen(false)}
            task={selectedTask}
          />
        )}
      </S.Container>
    </S.Wrapper>
  );
}
