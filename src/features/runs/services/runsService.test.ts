import { afterEach, describe, expect, it, vi } from 'vitest';

import { mockRuns } from '../data/mockRuns';
import { getRuns } from './runsService';

const REQUEST_DELAY_MS = 800;

describe('getRuns', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns a promise and resolves with the run collection after the simulated request delay', async () => {
    window.history.replaceState(null, '', '/');
    vi.useFakeTimers();

    const request = getRuns();
    let isResolved = false;
    request.then(() => {
      isResolved = true;
    });

    expect(request).toBeInstanceOf(Promise);
    await vi.advanceTimersByTimeAsync(799);
    expect(isResolved).toBe(false);

    await vi.advanceTimersByTimeAsync(1);
    const result = await request;
    expect(result).toEqual(mockRuns);
    expect(result).not.toBe(mockRuns);
    expect(result[0].logs).not.toBe(mockRuns[0].logs);
  });

  it('simulates one backend error and allows the retry to succeed', async () => {
    vi.useFakeTimers();
    window.history.replaceState(null, '', '/?demoError=1');

    const failedRequest = getRuns();
    const failure = expect(failedRequest).rejects.toThrow(
      'Simulated server error',
    );

    await vi.advanceTimersByTimeAsync(REQUEST_DELAY_MS);
    await failure;

    const retryRequest = getRuns();
    await vi.advanceTimersByTimeAsync(REQUEST_DELAY_MS);

    await expect(retryRequest).resolves.toEqual(mockRuns);
  });
});
