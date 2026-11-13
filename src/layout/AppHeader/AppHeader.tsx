import { Menu } from 'lucide-react';

import logo from '../../assets/runforge-mark.svg';
import styles from './AppHeader.module.css';

interface AppHeaderProps {
  onMenuClick: () => void;
}

function AppHeader({ onMenuClick }: AppHeaderProps) {
  return (
    <header className={styles.header}>
      <button
        className={styles.menuButton}
        type="button"
        aria-label="Open navigation menu"
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
