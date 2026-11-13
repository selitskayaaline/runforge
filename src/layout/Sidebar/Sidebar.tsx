import {
  Activity,
  Folder,
  Terminal,
  Eye,
  Camera,
  Settings,
} from 'lucide-react';

import styles from './Sidebar.module.css';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const mainNavigation = [
  { label: 'Runs', href: '/runs', Icon: Activity },
  { label: 'Projects', href: '/projects', Icon: Folder },
  { label: 'Devboxes', href: '/devboxes', Icon: Terminal },
  { label: 'Previews', href: '/previews', Icon: Eye },
  { label: 'Snapshots', href: '/snapshots', Icon: Camera },
];

function Sidebar({ isOpen, onClose }: SidebarProps) {
  return (
    <aside
      className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}
      aria-label="Sidebar navigation"
      aria-hidden={!isOpen && undefined}
    >
      <div className={styles.mainSection}>
        <h2 className={styles.sectionTitle}>WORKSPACE</h2>

        <nav className={styles.navigation} aria-label="Workspace navigation">
          {mainNavigation.map(({ label, href, Icon }) => (
            <a
              key={label}
              href={href}
              className={`${styles.navItem} ${
                label === 'Runs' ? styles.active : ''
              }`}
              aria-current={label === 'Runs' ? 'page' : undefined}
              onClick={onClose}
            >
              <Icon className={styles.navIcon} aria-hidden="true" />
              <span>{label}</span>
            </a>
          ))}
        </nav>
      </div>

      <nav className={styles.bottomNavigation} aria-label="Settings">
        <a href="/settings" className={styles.navItem} onClick={onClose}>
          <Settings className={styles.navIcon} aria-hidden="true" />
          <span>Settings</span>
        </a>
      </nav>
    </aside>
  );
}

export default Sidebar;
