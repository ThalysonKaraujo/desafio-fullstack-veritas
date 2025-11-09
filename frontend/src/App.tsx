import AddTaskForm from './components/AddTaskForm.js';
import Board from './components/Board.js';
import TasksDebugger from './components/TasksDebugger.js';
import { KanbanProvider } from './contexts/KanbanContext.js';

function App() {
  return (
    <KanbanProvider>
      <AddTaskForm />
      <Board />
    </KanbanProvider>
  );
}

export default App;
