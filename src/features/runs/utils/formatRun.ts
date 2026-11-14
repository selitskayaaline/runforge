export type RunDisplayVariant = 'list' | 'details';

export function formatRunDate(
  dateString: string,
  variant: RunDisplayVariant = 'list',
): string {
  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return variant === 'details' ? dateString : '—';
  }

  const locale = variant === 'details' ? 'en-US' : 'ru-RU';
  const options: Intl.DateTimeFormatOptions =
    variant === 'details'
      ? { dateStyle: 'medium', timeStyle: 'short' }
      : {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        };

  return new Intl.DateTimeFormat(locale, options).format(date);
}

export function formatRunDuration(
  seconds?: number,
  variant: RunDisplayVariant = 'list',
): string {
  if (seconds === undefined || !Number.isFinite(seconds) || seconds < 0) {
    return variant === 'details' ? 'Not available' : '—';
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  if (variant === 'details') {
    if (minutes === 0) return `${remainingSeconds}s`;
    if (remainingSeconds === 0) return `${minutes}m`;

    return `${minutes}m ${remainingSeconds}s`;
  }

  return `${minutes} min. ${remainingSeconds} sec.`;
}
