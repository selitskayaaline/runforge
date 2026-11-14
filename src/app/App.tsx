import { useEffect, useState } from 'react';

import AppHeader from '../layout/AppHeader/AppHeader';
import Sidebar from '../layout/Sidebar/Sidebar';
import RunsPage from '../features/runs/RunsPage/RunsPage';

import styles from './App.module.css';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isSidebarOpen) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsSidebarOpen(false);
      }
    }

    window.addEventListener('keydown', handleKeyDown);

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSidebarOpen]);

  return (
    <div className={styles.app}>
      <AppHeader
        isMenuOpen={isSidebarOpen}
        onMenuClick={() => setIsSidebarOpen((isOpen) => !isOpen)}
      />

      <div className={styles.layout}>
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        <RunsPage />
      </div>
    </div>
  );
}

export default App;
