import type { RunStatus } from './run';

export type StatusFilter = 'all' | RunStatus;

export type SortOption = 'newest' | 'oldest' | 'duration-asc' | 'duration-desc';
