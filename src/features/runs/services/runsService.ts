import { mockRuns } from '../data/mockRuns';
import type { Run } from '../types/run';

const REQUEST_DELAY_MS = 800;

let hasTriggeredDemoError = false;

export function getRuns(): Promise<Run[]> {
  const shouldSimulateError =
    new URLSearchParams(window.location.search).get('demoError') === '1' &&
    !hasTriggeredDemoError;

  if (!new URLSearchParams(window.location.search).has('demoError')) {
    hasTriggeredDemoError = false;
  }

  if (shouldSimulateError) {
    hasTriggeredDemoError = true;
  }

  return new Promise((resolve, reject) => {
    window.setTimeout(() => {
      if (shouldSimulateError) {
        reject(new Error('Simulated server error'));
        return;
      }

      resolve(mockRuns.map((run) => ({ ...run, logs: [...run.logs] })));
    }, REQUEST_DELAY_MS);
  });
}
