import { ArrowUpRight, GitBranch } from 'lucide-react';

import type { Run } from '../../types/run';
import StatusBadge from '../StatusBadge/StatusBadge';

import styles from './RunItem.module.css';

interface RunItemProps {
  run: Run;
  onOpen: (run: Run) => void;
}

function RunItem({ run, onOpen }: RunItemProps) {
  const formattedDate = new Date(run.createdAt).toLocaleString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const duration = run.durationSeconds;

  const formattedDuration =
    duration === undefined
      ? '—'
      : `${Math.floor(duration / 60)} min. ${duration % 60} sec.`;

  return (
    <li className={styles.item}>
      <button
        className={styles.row}
        type="button"
        onClick={() => onOpen(run)}
        aria-label={`Open details for ${run.name}. Status: ${run.status}. Repository: ${run.repository}. Branch: ${run.branch}.`}
      >
        <span className={styles.runInfo}>
          <span className={styles.runName}>{run.name}</span>
          <span className={styles.repository}>{run.repository}</span>
        </span>

        <span className={styles.branch}>
          <GitBranch aria-hidden="true" />
          {run.branch}
        </span>

        <span className={styles.status}>
          <StatusBadge status={run.status} />
        </span>

        <span className={styles.duration}>{formattedDuration}</span>

        <time className={styles.createdAt} dateTime={run.createdAt}>
          {formattedDate}
        </time>

        <span className={styles.openIcon} aria-hidden="true">
          <ArrowUpRight />
        </span>
      </button>
    </li>
  );
}

export default RunItem;
