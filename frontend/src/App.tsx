import Board from './components/Board.js';
import CreateTaskButton from './components/CreateTaskButton.js';
import { KanbanProvider } from './contexts/KanbanContext.js';
import { AppRoot } from './App.styles.js';

function App() {
  return (
    <AppRoot>
      <KanbanProvider>
        <Board />
        <CreateTaskButton />
      </KanbanProvider>
    </AppRoot>
  );
}

export default App;
