import type { Run } from '../types/run';
import type { SortOption, StatusFilter } from '../types/runFilters';

interface FilterRunsOptions {
  search: string;
  status: StatusFilter;
  sort: SortOption;
}

function getTimestamp(value: string): number {
  const timestamp = new Date(value).getTime();
  return Number.isNaN(timestamp) ? Number.NEGATIVE_INFINITY : timestamp;
}

export function filterRuns(
  runs: Run[],
  { search, status, sort }: FilterRunsOptions,
): Run[] {
  const normalizedSearch = search.trim().toLocaleLowerCase();

  const filteredRuns = runs.filter((run) => {
    const matchesSearch =
      normalizedSearch.length === 0 ||
      run.name.toLocaleLowerCase().includes(normalizedSearch) ||
      run.repository.toLocaleLowerCase().includes(normalizedSearch);
    const matchesStatus = status === 'all' || run.status === status;

    return matchesSearch && matchesStatus;
  });

  return filteredRuns.sort((first, second) => {
    switch (sort) {
      case 'newest':
        return getTimestamp(second.createdAt) - getTimestamp(first.createdAt);

      case 'oldest':
        return getTimestamp(first.createdAt) - getTimestamp(second.createdAt);

      case 'duration-asc':
      case 'duration-desc': {
        const firstDuration = first.durationSeconds;
        const secondDuration = second.durationSeconds;

        if (firstDuration === undefined && secondDuration === undefined)
          return 0;
        if (firstDuration === undefined) return 1;
        if (secondDuration === undefined) return -1;

        return sort === 'duration-asc'
          ? firstDuration - secondDuration
          : secondDuration - firstDuration;
      }

      default:
        return 0;
    }
  });
}
