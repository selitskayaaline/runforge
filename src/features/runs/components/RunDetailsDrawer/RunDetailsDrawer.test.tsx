import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { mockRuns } from '../../data/mockRuns';
import RunDetailsDrawer from './RunDetailsDrawer';

describe('RunDetailsDrawer', () => {
  it('does not render when no run is selected', () => {
    render(<RunDetailsDrawer run={null} onClose={vi.fn()} />);

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('renders the original run details, logs, and result', () => {
    render(<RunDetailsDrawer run={mockRuns[2]} onClose={vi.fn()} />);

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: mockRuns[2].name }),
    ).toBeInTheDocument();
    expect(screen.getByText('Repository')).toBeInTheDocument();
    expect(screen.getByText('acme/api-service')).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Execution logs' }),
    ).toBeInTheDocument();
    expect(
      screen.getByText('Error: OpenAPI schema validation failed'),
    ).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Result' })).toBeInTheDocument();
    expect(screen.getByText(mockRuns[2].result as string)).toBeInTheDocument();
  });

  it('does not render a result section when result is absent', () => {
    render(<RunDetailsDrawer run={mockRuns[0]} onClose={vi.fn()} />);

    expect(
      screen.queryByRole('heading', { name: 'Result' }),
    ).not.toBeInTheDocument();
  });

  it('shows a fallback when logs are empty', () => {
    render(
      <RunDetailsDrawer run={{ ...mockRuns[0], logs: [] }} onClose={vi.fn()} />,
    );

    expect(
      screen.getByText('No logs available for this run.'),
    ).toBeInTheDocument();
  });

  it('closes when the close button is clicked', () => {
    const onClose = vi.fn();
    render(<RunDetailsDrawer run={mockRuns[0]} onClose={onClose} />);

    fireEvent.click(screen.getByRole('button', { name: 'Close run details' }));

    expect(onClose).toHaveBeenCalledOnce();
  });

  it('closes on Escape', () => {
    const onClose = vi.fn();
    render(<RunDetailsDrawer run={mockRuns[0]} onClose={onClose} />);

    fireEvent.keyDown(window, { key: 'Escape' });

    expect(onClose).toHaveBeenCalledOnce();
  });

  it('closes when the backdrop is clicked', () => {
    const onClose = vi.fn();
    render(<RunDetailsDrawer run={mockRuns[0]} onClose={onClose} />);

    fireEvent.click(screen.getByRole('dialog').parentElement as HTMLElement);

    expect(onClose).toHaveBeenCalledOnce();
  });
});
