import type { RunStatus } from '../../types/run';
import styles from './StatusBadge.module.css';

interface StatusBadgeProps {
  status: RunStatus;
}

const statusConfig: Record<RunStatus, { label: string; className: string }> = {
  queued: {
    label: 'Queued',
    className: styles.queued,
  },
  running: {
    label: 'Running',
    className: styles.running,
  },
  succeeded: {
    label: 'Succeeded',
    className: styles.succeeded,
  },
  failed: {
    label: 'Failed',
    className: styles.failed,
  },
};

function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <span className={`${styles.badge} ${config.className}`}>
      <span className={styles.dot} aria-hidden="true" />
      {config.label}
    </span>
  );
}

export default StatusBadge;
