import { useState } from 'react';

import AppHeader from '../layout/AppHeader/AppHeader';
import Sidebar from '../layout/Sidebar/Sidebar';

import styles from './App.module.css';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className={styles.app}>
      <AppHeader onMenuClick={() => setIsSidebarOpen((isOpen) => !isOpen)} />

      <div className={styles.layout}>
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
      </div>
    </div>
  );
}

export default App;
