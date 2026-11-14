import { describe, expect, it } from 'vitest';

import { mockRuns } from '../data/mockRuns';
import { filterRuns } from './filterRuns';

const defaults = {
  search: '',
  status: 'all' as const,
  sort: 'newest' as const,
};

describe('filterRuns', () => {
  it('returns all runs when no filters are active', () => {
    expect(filterRuns(mockRuns, defaults)).toHaveLength(mockRuns.length);
  });

  it('filters by status', () => {
    const result = filterRuns(mockRuns, { ...defaults, status: 'failed' });

    expect(result.length).toBeGreaterThan(0);
    expect(result.every((run) => run.status === 'failed')).toBe(true);
  });

  it('searches by run name without case sensitivity', () => {
    const result = filterRuns(mockRuns, {
      ...defaults,
      search: 'AUTHENTICATION',
    });

    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('run-1042');
  });

  it('searches by repository and ignores surrounding whitespace', () => {
    const result = filterRuns(mockRuns, {
      ...defaults,
      search: '  ACME/API-SERVICE  ',
    });

    expect(result.length).toBeGreaterThan(0);
    expect(result.every((run) => run.repository === 'acme/api-service')).toBe(
      true,
    );
  });

  it('combines search and status filters', () => {
    const result = filterRuns(mockRuns, {
      search: 'api-service',
      status: 'failed',
      sort: 'newest',
    });

    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('run-1040');
  });

  it('sorts by newest and oldest dates', () => {
    const newest = filterRuns(mockRuns, { ...defaults, sort: 'newest' });
    const oldest = filterRuns(mockRuns, { ...defaults, sort: 'oldest' });

    expect(newest[0].id).toBe('run-1042');
    expect(oldest[0].id).toBe('run-1035');
  });

  it('sorts durations and keeps runs without a duration at the end', () => {
    const ascending = filterRuns(mockRuns, {
      ...defaults,
      sort: 'duration-asc',
    });
    const descending = filterRuns(mockRuns, {
      ...defaults,
      sort: 'duration-desc',
    });

    expect(ascending[0].durationSeconds).toBe(96);
    expect(descending[0].durationSeconds).toBe(312);
    expect(
      ascending.slice(-2).every((run) => run.durationSeconds === undefined),
    ).toBe(true);
  });

  it('does not mutate the source array', () => {
    const source = [...mockRuns];
    const originalOrder = source.map((run) => run.id);

    filterRuns(source, { ...defaults, sort: 'oldest' });

    expect(source.map((run) => run.id)).toEqual(originalOrder);
  });

  it('returns an empty array when no run matches both conditions', () => {
    expect(
      filterRuns(mockRuns, {
        search: 'no-such-run',
        status: 'running',
        sort: 'newest',
      }),
    ).toEqual([]);
  });
});
