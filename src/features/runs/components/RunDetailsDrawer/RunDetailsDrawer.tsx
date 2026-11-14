import { useEffect } from 'react';

import type { Run } from '../../types/run';
import StatusBadge from '../StatusBadge/StatusBadge';

import styles from './RunDetailsDrawer.module.css';
import { formatRunDate, formatRunDuration } from '../../utils/formatRun';

interface RunDetailsDrawerProps {
  run: Run | null;
  onClose: () => void;
}

function RunDetailsDrawer({ run, onClose }: RunDetailsDrawerProps) {
  useEffect(() => {
    if (!run) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose();
      }
    }

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [run, onClose]);

  if (!run) {
    return null;
  }

  return (
    <div
      className={styles.overlay}
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <aside
        className={styles.drawer}
        role="dialog"
        aria-modal="true"
        aria-labelledby="run-details-title"
      >
        <div className={styles.topbar}>
          <div className={styles.breadcrumb}>
            <span>web-platform</span>
            <span className={styles.slash}>/</span>
            <span className={styles.currentPage}>RUN DETAILS</span>
          </div>

          <button
            className={styles.closeButton}
            type="button"
            onClick={onClose}
            aria-label="Close run details"
          >
            <svg
              viewBox="0 0 20 20"
              width="18"
              height="18"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M5 5L15 15M15 5L5 15"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        <div className={styles.content}>
          <header className={styles.pageHeader}>
            <div className={styles.titleRow}>
              <h1 id="run-details-title">{run.name}</h1>
              <StatusBadge status={run.status} />
            </div>
          </header>

          <section className={styles.overview} aria-label="Run information">
            <div className={styles.detail}>
              <span className={styles.label}>Repository</span>
              <span className={styles.value}>{run.repository}</span>
            </div>

            <div className={styles.detail}>
              <span className={styles.label}>Branch</span>
              <span className={styles.value}>{run.branch}</span>
            </div>

            <div className={styles.detail}>
              <span className={styles.label}>Created</span>
              <span className={styles.value}>
                {formatRunDate(run.createdAt, 'details')}
              </span>
            </div>

            <div className={styles.detail}>
              <span className={styles.label}>Duration</span>
              <span className={styles.value}>
                {formatRunDuration(run.durationSeconds, 'details')}
              </span>
            </div>
          </section>

          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2>Execution logs</h2>
            </div>

            {run.logs.length > 0 ? (
              <ol className={styles.logs}>
                {run.logs.map((log, index) => {
                  const isError = log.toLowerCase().startsWith('error:');
                  const isFailed = log.toLowerCase().includes('run failed');

                  return (
                    <li
                      key={`${run.id}-${index}`}
                      className={
                        isError || isFailed ? styles.errorLog : undefined
                      }
                    >
                      <span className={styles.logMarker}>
                        {isError || isFailed ? '!' : '›'}
                      </span>

                      <code>{log}</code>
                    </li>
                  );
                })}
              </ol>
            ) : (
              <p className={styles.emptyMessage}>
                No logs available for this run.
              </p>
            )}
          </section>

          {run.result && (
            <section className={styles.section}>
              <div className={styles.sectionHeader}>
                <h2>Result</h2>
              </div>

              <div className={styles.result}>
                <p>{run.result}</p>
              </div>
            </section>
          )}
        </div>
      </aside>
    </div>
  );
}

export default RunDetailsDrawer;
