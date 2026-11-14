import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { mockRuns } from '../data/mockRuns';
import { getRuns } from '../services/runsService';
import RunsPage from './RunsPage';

vi.mock('../services/runsService', () => ({
  getRuns: vi.fn(),
}));

const mockedGetRuns = vi.mocked(getRuns);

function resetUrl(search = '') {
  window.history.replaceState(null, '', `/runs${search}`);
}

describe('RunsPage', () => {
  beforeEach(() => {
    resetUrl();
    mockedGetRuns.mockReset();
    mockedGetRuns.mockResolvedValue(mockRuns);
  });

  it('shows a loading skeleton while the request is pending', () => {
    mockedGetRuns.mockReturnValue(new Promise(() => undefined));

    render(<RunsPage />);

    expect(
      screen.getByRole('status', { name: 'Loading runs' }),
    ).toBeInTheDocument();
    expect(screen.getByText('Loading runs…')).toBeInTheDocument();
  });

  it('loads and displays the runs returned by the service', async () => {
    render(<RunsPage />);

    expect(
      await screen.findByText('Implement authentication flow'),
    ).toBeInTheDocument();
    expect(screen.getAllByText('LIVE')).toHaveLength(1);
    expect(mockedGetRuns).toHaveBeenCalledOnce();
  });

  it('shows an error state and retries the failed request', async () => {
    const user = userEvent.setup();
    mockedGetRuns
      .mockRejectedValueOnce(new Error('Network error'))
      .mockResolvedValueOnce(mockRuns);

    render(<RunsPage />);

    expect(await screen.findByRole('alert')).toBeInTheDocument();
    expect(screen.getByText('Runs are unavailable')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Try again' }));

    expect(
      await screen.findByText('Implement authentication flow'),
    ).toBeInTheDocument();
    expect(mockedGetRuns).toHaveBeenCalledTimes(2);
  });

  it('filters runs by status', async () => {
    const user = userEvent.setup();
    render(<RunsPage />);

    await screen.findByText('Implement authentication flow');
    await user.click(screen.getByRole('button', { name: 'Failed' }));

    expect(screen.getByText('Update API documentation')).toBeInTheDocument();
    expect(
      screen.queryByText('Implement authentication flow'),
    ).not.toBeInTheDocument();
  });

  it('combines search and status filters', async () => {
    const user = userEvent.setup();
    render(<RunsPage />);

    await screen.findByText('Implement authentication flow');
    await user.click(screen.getByRole('button', { name: 'Failed' }));
    await user.type(
      screen.getByRole('searchbox', {
        name: 'Search runs by name or repository',
      }),
      'api-service',
    );

    expect(screen.getByText('Update API documentation')).toBeInTheDocument();
    expect(
      screen.queryByText('Refactor user settings'),
    ).not.toBeInTheDocument();
  });

  it('shows an empty state and lets the user clear filters', async () => {
    const user = userEvent.setup();
    render(<RunsPage />);

    await screen.findByText('Implement authentication flow');
    await user.type(
      screen.getByRole('searchbox', {
        name: 'Search runs by name or repository',
      }),
      'missing-run',
    );

    expect(screen.getByRole('status')).toHaveTextContent('No runs found');
    await user.click(
      screen.getByRole('button', { name: 'Clear search and filters' }),
    );

    expect(
      screen.getByText('Implement authentication flow'),
    ).toBeInTheDocument();
  });

  it('opens the original details drawer from a run row', async () => {
    const user = userEvent.setup();
    render(<RunsPage />);

    await screen.findByText('Update API documentation');
    await user.click(
      screen.getByRole('button', {
        name: /open details for update api documentation/i,
      }),
    );

    const drawer = screen.getByRole('dialog');
    expect(
      within(drawer).getByRole('heading', { name: 'Execution logs' }),
    ).toBeInTheDocument();
    expect(
      within(drawer).getByRole('heading', { name: 'Result' }),
    ).toBeInTheDocument();
    expect(window.location.search).toContain('run=run-1040');
  });

  it('updates the URL when search, status, and sorting change', async () => {
    const user = userEvent.setup();
    resetUrl('?keep=1');
    render(<RunsPage />);

    await screen.findByText('Implement authentication flow');
    await user.type(
      screen.getByRole('searchbox', {
        name: 'Search runs by name or repository',
      }),
      'auth',
    );
    await user.click(screen.getByRole('button', { name: 'Running' }));
    fireEvent.change(screen.getByRole('combobox', { name: 'Sort runs' }), {
      target: { value: 'oldest' },
    });

    await waitFor(() => {
      const params = new URLSearchParams(window.location.search);
      expect(params.get('keep')).toBe('1');
      expect(params.get('search')).toBe('auth');
      expect(params.get('status')).toBe('running');
      expect(params.get('sort')).toBe('oldest');
    });
  });

  it('restores filter state from the URL', async () => {
    resetUrl('?status=failed&search=api');
    render(<RunsPage />);

    expect(
      await screen.findByText('Update API documentation'),
    ).toBeInTheDocument();
    expect(
      screen.queryByText('Implement authentication flow'),
    ).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Failed' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
  });

  it('sorts runs by duration when the sort control changes', async () => {
    const user = userEvent.setup();
    render(<RunsPage />);

    await screen.findByText('Implement authentication flow');
    await user.selectOptions(
      screen.getByRole('combobox', { name: 'Sort runs' }),
      'duration-asc',
    );

    const list = screen.getByRole('region', { name: 'Runs list' });
    const rows = within(list).getAllByRole('button');

    expect(rows[0]).toHaveAccessibleName(/Update API documentation/);
  });

  it('closes the drawer and removes its run parameter from the URL', async () => {
    const user = userEvent.setup();
    render(<RunsPage />);

    await screen.findByText('Update API documentation');
    await user.click(
      screen.getByRole('button', {
        name: /open details for update api documentation/i,
      }),
    );
    expect(window.location.search).toContain('run=run-1040');

    await user.click(screen.getByRole('button', { name: 'Close run details' }));

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(new URLSearchParams(window.location.search).has('run')).toBe(false);
  });

  it('restores filter state after a browser history navigation event', async () => {
    render(<RunsPage />);
    await screen.findByText('Implement authentication flow');

    act(() => {
      window.history.replaceState(null, '', '/runs?status=failed');
      window.dispatchEvent(new PopStateEvent('popstate'));
    });

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Failed' })).toHaveAttribute(
        'aria-pressed',
        'true',
      );
    });
    expect(screen.getByText('Update API documentation')).toBeInTheDocument();
    expect(
      screen.queryByText('Implement authentication flow'),
    ).not.toBeInTheDocument();
  });

  it('removes an unknown selected run from the URL after data loads', async () => {
    resetUrl('?run=unknown-run');
    render(<RunsPage />);

    await screen.findByText('Implement authentication flow');

    await waitFor(() => {
      expect(new URLSearchParams(window.location.search).has('run')).toBe(
        false,
      );
    });
  });
});
