/** @format */

import type { Candidate } from '../../../shared/types';

export const openUrlInNewTab = (url: string) => {
	window.open(url, '_blank', 'noopener,noreferrer');
};

export const openRawResume = (candidate: Candidate) => {
	const blob = new Blob([candidate.rawText], { type: 'text/plain' });
	const url = URL.createObjectURL(blob);
	openUrlInNewTab(url);
	window.setTimeout(() => URL.revokeObjectURL(url), 30000);
};
