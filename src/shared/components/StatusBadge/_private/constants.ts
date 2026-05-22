/**
 * statusConfig - Color configuration map for all job and candidate statuses.
 *
 * @format
 */

export const statusConfig: Record<string, { bg: string; text: string; dot: string }> = {
  draft: {
    bg: 'var(--badge-draft-bg)',
    text: 'var(--badge-draft-text)',
    dot: 'var(--badge-draft-dot)',
  },
  published: {
    bg: 'var(--badge-published-bg)',
    text: 'var(--badge-published-text)',
    dot: 'var(--badge-published-dot)',
  },
  filled: {
    bg: 'var(--badge-filled-bg)',
    text: 'var(--badge-filled-text)',
    dot: 'var(--badge-filled-dot)',
  },
  available: {
    bg: 'var(--badge-published-bg)',
    text: 'var(--badge-published-text)',
    dot: 'var(--badge-published-dot)',
  },
  'in-progress': {
    bg: 'var(--badge-draft-bg)',
    text: 'var(--badge-draft-text)',
    dot: 'var(--badge-draft-dot)',
  },
  offered: {
    bg: 'var(--badge-offered-bg)',
    text: 'var(--badge-offered-text)',
    dot: 'var(--badge-offered-dot)',
  },
  hired: {
    bg: 'var(--badge-hired-bg)',
    text: 'var(--badge-hired-text)',
    dot: 'var(--badge-hired-dot)',
  },
  rejected: {
    bg: 'var(--badge-rejected-bg)',
    text: 'var(--badge-rejected-text)',
    dot: 'var(--badge-rejected-dot)',
  },
};

/** statusLabels - Display label overrides for statuses with non-standard formatting. */
export const statusLabels: Record<string, string> = { 'in-progress': 'In Progress' };
