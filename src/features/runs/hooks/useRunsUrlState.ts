import { useCallback, useEffect, useRef, useState } from 'react';

import type { Run } from '../types/run';
import type { SortOption, StatusFilter } from '../types/runFilters';

interface RunsUrlState {
  search: string;
  status: StatusFilter;
  sort: SortOption;
  selectedRunId: string | null;
}

const RUNS_PATH = '/runs';

const VALID_STATUSES: StatusFilter[] = [
  'all',
  'queued',
  'running',
  'succeeded',
  'failed',
];

const VALID_SORTS: SortOption[] = [
  'newest',
  'oldest',
  'duration-asc',
  'duration-desc',
];

function readUrlState(): RunsUrlState {
  const params = new URLSearchParams(window.location.search);
  const statusParam = params.get('status') as StatusFilter | null;
  const sortParam = params.get('sort') as SortOption | null;

  return {
    search: params.get('search') ?? '',
    status:
      statusParam && VALID_STATUSES.includes(statusParam) ? statusParam : 'all',
    sort: sortParam && VALID_SORTS.includes(sortParam) ? sortParam : 'newest',
    selectedRunId: params.get('run'),
  };
}

function writeUrlState(state: RunsUrlState, replace = false): void {
  const params = new URLSearchParams(window.location.search);

  if (state.search.trim()) params.set('search', state.search.trim());
  else params.delete('search');

  if (state.status !== 'all') params.set('status', state.status);
  else params.delete('status');

  if (state.sort !== 'newest') params.set('sort', state.sort);
  else params.delete('sort');

  if (state.selectedRunId) params.set('run', state.selectedRunId);
  else params.delete('run');

  const query = params.toString();
  const nextUrl = `${RUNS_PATH}${query ? `?${query}` : ''}${window.location.hash}`;

  window.history[replace ? 'replaceState' : 'pushState'](null, '', nextUrl);
}

export function useRunsUrlState(runs: Run[]) {
  const [state, setState] = useState<RunsUrlState>(readUrlState);
  const stateRef = useRef(state);

  useEffect(() => {
    const handlePopState = () => {
      const nextState = readUrlState();
      stateRef.current = nextState;
      setState(nextState);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const updateState = useCallback(
    (updates: Partial<RunsUrlState>, replace = false) => {
      const nextState = { ...stateRef.current, ...updates };
      stateRef.current = nextState;
      writeUrlState(nextState, replace);
      setState(nextState);
    },
    [],
  );

  const selectedRun =
    runs.find((run) => run.id === state.selectedRunId) ?? null;

  useEffect(() => {
    if (!state.selectedRunId || runs.length === 0 || selectedRun) return;

    const nextState = { ...stateRef.current, selectedRunId: null };
    stateRef.current = nextState;
    writeUrlState(nextState, true);
  }, [runs.length, selectedRun, state.selectedRunId]);

  const setSearch = useCallback(
    (search: string) => updateState({ search }, true),
    [updateState],
  );

  const setStatus = useCallback(
    (status: StatusFilter) => updateState({ status }),
    [updateState],
  );

  const setSort = useCallback(
    (sort: SortOption) => updateState({ sort }),
    [updateState],
  );

  const openRun = useCallback(
    (run: Run) => updateState({ selectedRunId: run.id }),
    [updateState],
  );

  const closeRun = useCallback(
    () => updateState({ selectedRunId: null }, true),
    [updateState],
  );

  return {
    ...state,
    selectedRun,
    setSearch,
    setStatus,
    setSort,
    openRun,
    closeRun,
  };
}

export default useRunsUrlState;
