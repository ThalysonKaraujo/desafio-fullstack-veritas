import AddTaskForm from './components/AddTaskForm.js';
import Board from './components/Board.js';
import CreateTaskButton from './components/CreateTaskButton.js';
import TasksDebugger from './components/TasksDebugger.js';
import { KanbanProvider } from './contexts/KanbanContext.js';

function App() {
  return (
    <KanbanProvider>
      <Board />
      <CreateTaskButton />
    </KanbanProvider>
  );
}

export default App;
