import { Menu } from 'lucide-react';

import logo from '../../assets/runforge-mark.svg';
import styles from './AppHeader.module.css';

interface AppHeaderProps {
  isMenuOpen: boolean;
  onMenuClick: () => void;
}

function AppHeader({ isMenuOpen, onMenuClick }: AppHeaderProps) {
  return (
    <header className={styles.header}>
      <button
        className={styles.menuButton}
        type="button"
        aria-label={
          isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'
        }
        aria-expanded={isMenuOpen}
        aria-controls="workspace-sidebar"
        onClick={onMenuClick}
      >
        <Menu size={20} aria-hidden="true" />
      </button>

      <a className={styles.brand} href="/">
        <img className={styles.logo} src={logo} alt="runforge logo" />
        <span className={styles.brandName}>runforge</span>
      </a>
    </header>
  );
}

export default AppHeader;
