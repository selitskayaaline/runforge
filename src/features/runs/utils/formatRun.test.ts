import { describe, expect, it } from 'vitest';

import { formatRunDate, formatRunDuration } from './formatRun';

describe('formatRunDate', () => {
  it('formats a valid date for the interface', () => {
    expect(formatRunDate('2026-11-13T12:42:00Z')).not.toBe('—');
  });

  it('returns a fallback for an invalid date', () => {
    expect(formatRunDate('not-a-date')).toBe('—');
  });

  it('keeps the details date presentation in one shared formatter', () => {
    const date = '2026-11-13T12:42:00Z';
    const expected = new Intl.DateTimeFormat('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(new Date(date));

    expect(formatRunDate(date, 'details')).toBe(expected);
    expect(formatRunDate('not-a-date', 'details')).toBe('not-a-date');
  });
});

describe('formatRunDuration', () => {
  it('formats seconds and minutes', () => {
    expect(formatRunDuration(184)).toBe('3 min. 4 sec.');
    expect(formatRunDuration(60)).toBe('1 min. 0 sec.');
    expect(formatRunDuration(0)).toBe('0 min. 0 sec.');
  });

  it('returns a fallback for missing or invalid durations', () => {
    expect(formatRunDuration()).toBe('—');
    expect(formatRunDuration(-1)).toBe('—');
    expect(formatRunDuration(Number.NaN)).toBe('—');
  });

  it('keeps the compact details presentation in one shared formatter', () => {
    expect(formatRunDuration(184, 'details')).toBe('3m 4s');
    expect(formatRunDuration(60, 'details')).toBe('1m');
    expect(formatRunDuration(20, 'details')).toBe('20s');
    expect(formatRunDuration(undefined, 'details')).toBe('Not available');
  });
});
