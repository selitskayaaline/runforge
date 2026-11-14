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
  { label: 'Runs', href: '/runs', Icon: Activity, available: true },
  { label: 'Projects', href: '/runs', Icon: Folder, available: false },
  { label: 'Devboxes', href: '/runs', Icon: Terminal, available: false },
  { label: 'Previews', href: '/runs', Icon: Eye, available: false },
  { label: 'Snapshots', href: '/runs', Icon: Camera, available: false },
];

function Sidebar({ isOpen, onClose }: SidebarProps) {
  return (
    <aside
      id="workspace-sidebar"
      className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}
      aria-label="Sidebar navigation"
    >
      <div className={styles.mainSection}>
        <h2 className={styles.sectionTitle}>WORKSPACE</h2>

        <nav className={styles.navigation} aria-label="Workspace navigation">
          {mainNavigation.map(({ label, href, Icon, available }) => (
            <a
              key={label}
              href={href}
              className={`${styles.navItem} ${available ? styles.active : ''}`}
              aria-current={available ? 'page' : undefined}
              aria-disabled={!available}
              title={
                !available ? 'This section is not available yet' : undefined
              }
              onClick={(event) => {
                if (!available) {
                  event.preventDefault();
                  return;
                }

                onClose();
              }}
            >
              <Icon className={styles.navIcon} aria-hidden="true" />
              <span>{label}</span>
            </a>
          ))}
        </nav>
      </div>

      <nav className={styles.bottomNavigation} aria-label="Settings">
        <a
          href="/runs"
          className={styles.navItem}
          aria-disabled="true"
          title="This section is not available yet"
          onClick={(event) => {
            event.preventDefault();
          }}
        >
          <Settings className={styles.navIcon} aria-hidden="true" />
          <span>Settings</span>
        </a>
      </nav>
    </aside>
  );
}

export default Sidebar;
