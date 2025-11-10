import React, { useState } from 'react';
import CreateTaskModal from './CreateTaskModal.js';
import { Fab, Label } from './CreateTaskButton.styles.js';

export default function CreateTaskButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Label hidden={open}>Nova tarefa</Label>

      <Fab
        aria-label="Criar nova tarefa"
        title="Criar nova tarefa"
        onClick={() => setOpen(true)}
        hidden={open}
      >
        +
      </Fab>

      <CreateTaskModal isOpen={open} onClose={() => setOpen(false)} />
    </>
  );
}
