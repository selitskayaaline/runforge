import type { SortOption, StatusFilter } from '../../types/runFilters';

import styles from './RunsToolbar.module.css';

interface RunsToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  status: StatusFilter;
  onStatusChange: (value: StatusFilter) => void;
  sort: SortOption;
  onSortChange: (value: SortOption) => void;
}

const statusFilters: { label: string; value: StatusFilter }[] = [
  { label: 'All', value: 'all' },
  { label: 'Queued', value: 'queued' },
  { label: 'Running', value: 'running' },
  { label: 'Succeeded', value: 'succeeded' },
  { label: 'Failed', value: 'failed' },
];

function RunsToolbar({
  search,
  onSearchChange,
  status,
  onStatusChange,
  sort,
  onSortChange,
}: RunsToolbarProps) {
  return (
    <div className={styles.toolbar}>
      <div className={styles.controls}>
        <label className={styles.search}>
          <span className={styles.searchIcon} aria-hidden="true" />

          <input
            type="search"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search runs..."
            aria-label="Search runs by name or repository"
          />
        </label>

        <label className={styles.sort}>
          <span className={styles.sortLabel}>Sort by</span>

          <select
            value={sort}
            onChange={(event) => onSortChange(event.target.value as SortOption)}
            aria-label="Sort runs"
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
            <option value="duration-asc">Shortest duration</option>
            <option value="duration-desc">Longest duration</option>
          </select>
        </label>
      </div>

      <div className={styles.filters} aria-label="Filter runs by status">
        {statusFilters.map((filter) => (
          <button
            key={filter.value}
            type="button"
            className={`${styles.filter} ${
              status === filter.value ? styles.active : ''
            }`}
            onClick={() => onStatusChange(filter.value)}
            aria-pressed={status === filter.value}
          >
            {filter.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default RunsToolbar;
