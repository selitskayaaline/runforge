import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import RunDetailsDrawer from '../components/RunDetailsDrawer/RunDetailsDrawer';
import RunsList from '../components/RunsList/RunsList';
import RunsToolbar from '../components/RunsToolbar/RunsToolbar';

import { getRuns } from '../services/runsService';
import type { Run } from '../types/run';
import { filterRuns } from '../utils/filterRuns';

import styles from './RunsPage.module.css';
import { useRunsUrlState } from '../hooks/useRunsUrlState';

type RequestStatus = 'loading' | 'success' | 'error';

function RunsSkeleton() {
  return (
    <div
      className={styles.skeletonList}
      role="status"
      aria-label="Loading runs"
      aria-busy="true"
    >
      <div className={styles.skeletonHeader} aria-hidden="true">
        <span>RUN</span>
        <span>BRANCH</span>
        <span>STATUS</span>
        <span>DURATION</span>
        <span>CREATED</span>
        <span />
      </div>

      {Array.from({ length: 5 }, (_, index) => (
        <div className={styles.skeletonRow} key={index} aria-hidden="true">
          <span className={styles.skeletonRunInfo}>
            <span className={styles.skeletonPrimary} />
            <span className={styles.skeletonRepository} />
          </span>
          <span className={styles.skeletonBranch} />
          <span className={styles.skeletonBadge} />
          <span className={styles.skeletonDuration} />
          <span className={styles.skeletonDate} />
          <span className={styles.skeletonArrow} />
        </div>
      ))}
      <span className={styles.loadingMessage}>Loading runs…</span>
    </div>
  );
}

function RunsPage() {
  const [runs, setRuns] = useState<Run[]>([]);
  const [requestStatus, setRequestStatus] = useState<RequestStatus>('loading');
  const [requestError, setRequestError] = useState<string | null>(null);
  const requestIdRef = useRef(0);

  const {
    search,
    setSearch,
    status,
    setStatus,
    sort,
    setSort,
    selectedRun,
    openRun,
    closeRun,
  } = useRunsUrlState(runs);

  const loadRuns = useCallback(async () => {
    const requestId = ++requestIdRef.current;
    setRequestStatus('loading');
    setRequestError(null);

    try {
      const data = await getRuns();

      if (requestId !== requestIdRef.current) return;

      setRuns(data);
      setRequestStatus('success');
    } catch {
      if (requestId !== requestIdRef.current) return;

      setRequestError('We could not load the runs. Please try again.');
      setRequestStatus('error');
    }
  }, []);

  useEffect(() => {
    const requestTimer = window.setTimeout(() => void loadRuns(), 0);

    return () => {
      window.clearTimeout(requestTimer);
      requestIdRef.current += 1;
    };
  }, [loadRuns]);

  const filteredRuns = useMemo(
    () => filterRuns(runs, { search, status, sort }),
    [runs, search, status, sort],
  );

  const handleResetFilters = () => {
    setSearch('');
    setStatus('all');
  };

  return (
    <main className={styles.page}>
      <header className={styles.pageHeader}>
        <div className={styles.breadcrumb}>
          <span>PROJECT</span>
          <span className={styles.slash}>/</span>
          <strong>web-platform</strong>
        </div>

        <div className={styles.headingRow}>
          <div className={styles.headingContent}>
            <h1>Runs</h1>

            <div className={styles.descriptionRow}>
              <p className={styles.subtitle}>
                Browse agent runs and inspect their execution details.
              </p>

              <div className={`${styles.liveIndicator} ${styles.livePosition}`}>
                <span />
                LIVE
              </div>
            </div>
          </div>
        </div>
      </header>

      <section className={styles.content} aria-label="Agent runs">
        {requestStatus !== 'error' && (
          <RunsToolbar
            search={search}
            onSearchChange={setSearch}
            status={status}
            onStatusChange={setStatus}
            sort={sort}
            onSortChange={setSort}
          />
        )}

        {requestStatus === 'loading' && <RunsSkeleton />}

        {requestStatus === 'error' && (
          <div className={styles.stateCard} role="alert">
            <span className={styles.stateEyebrow}>REQUEST FAILED</span>
            <h2>Runs are unavailable</h2>
            <p>{requestError}</p>
            <button
              className={styles.primaryButton}
              type="button"
              onClick={() => void loadRuns()}
            >
              Try again
            </button>
          </div>
        )}

        {requestStatus === 'success' && filteredRuns.length > 0 && (
          <RunsList runs={filteredRuns} onRunOpen={openRun} />
        )}

        {requestStatus === 'success' && filteredRuns.length === 0 && (
          <div className={styles.stateCard} role="status">
            <span className={styles.stateEyebrow}>NO MATCHES</span>
            <h2>No runs found</h2>
            <p>Try another search term or reset the active filters.</p>
            <button
              className={styles.secondaryButton}
              type="button"
              onClick={handleResetFilters}
            >
              Clear search and filters
            </button>
          </div>
        )}
      </section>

      <RunDetailsDrawer run={selectedRun} onClose={closeRun} />
    </main>
  );
}

export default RunsPage;
