import AddTaskForm from './components/AddTaskForm.js';
import TasksDebugger from './components/TasksDebugger.js';
import { KanbanProvider } from './contexts/KanbanContext.js';

function App() {
  return (
    <KanbanProvider>
      <AddTaskForm />
      <TasksDebugger />
    </KanbanProvider>
  );
}

export default App;
