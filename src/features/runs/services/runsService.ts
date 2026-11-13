import { mockRuns } from '../data/mockRuns';
import type { Run } from '../types/run';

const MOCK_DELAY = 800;

export function getRuns(): Promise<Run[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockRuns);
    }, MOCK_DELAY);
  });
}
