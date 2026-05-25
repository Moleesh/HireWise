/** @format */

import { afterEach, describe, expect, it, vi } from 'vitest';
import type { Candidate } from '../../../../shared/types';
import { openRawResume, openUrlInNewTab } from '../openCandidateFile';

afterEach(() => {
	vi.restoreAllMocks();
});

describe('openUrlInNewTab', () => {
	it('opens links in a safe new tab', () => {
		const open = vi.spyOn(window, 'open').mockReturnValue(null);
		openUrlInNewTab('https://example.com/resume.pdf');
		expect(open).toHaveBeenCalledWith(
			'https://example.com/resume.pdf',
			'_blank',
			'noopener,noreferrer',
		);
	});
});

describe('openRawResume', () => {
	it('opens raw resume text as a blob tab', () => {
		const open = vi.spyOn(window, 'open').mockReturnValue(null);
		vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:resume');
		vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {});
		vi.spyOn(window, 'setTimeout').mockImplementation((callback: TimerHandler) => {
			if (typeof callback === 'function') callback();
			return 1;
		});

		openRawResume({ rawText: 'resume text' } as Candidate);
		expect(open).toHaveBeenCalledWith('blob:resume', '_blank', 'noopener,noreferrer');
		expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:resume');
	});
});
