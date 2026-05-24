/** @format */

import { useNavigate, useLocation, matchPath } from 'react-router-dom';
import type { Page } from '../types';

/** pageToUrl - Maps a Page (and optional data) to a real URL path. */
export const pageToUrl = (page: Page, data?: Record<string, string>): string => {
	switch (page) {
		case 'dashboard':
			return '/';
		case 'jobs':
			return '/jobs';
		case 'job-editor': {
			if (!data?.id) return '/jobs/new';
			if (data.mode === 'edit') return `/jobs/${data.id}/edit`;
			return `/jobs/${data.id}`;
		}
		case 'candidates':
			return '/candidates';
		case 'rankings':
			return data?.jobId ? `/rankings?jobId=${data.jobId}` : '/rankings';
		case 'settings':
			return '/settings';
		default:
			return '/';
	}
};

/** urlToPage - Resolves the active Page and route data from the URL. */
export const urlToPage = (
	pathname: string,
	search: string,
): { page: Page; data: Record<string, string> } => {
	if (pathname === '/' || pathname === '/dashboard') return { page: 'dashboard', data: {} };
	if (pathname === '/jobs') return { page: 'jobs', data: {} };
	if (pathname === '/jobs/new') return { page: 'job-editor', data: { mode: 'create' } };
	const editMatch = matchPath('/jobs/:id/edit', pathname);
	if (editMatch?.params.id)
		return { page: 'job-editor', data: { id: editMatch.params.id, mode: 'edit' } };
	const viewMatch = matchPath('/jobs/:id', pathname);
	if (viewMatch?.params.id)
		return { page: 'job-editor', data: { id: viewMatch.params.id, mode: 'view' } };
	if (pathname === '/candidates') return { page: 'candidates', data: {} };
	if (pathname.startsWith('/rankings')) {
		const params = new URLSearchParams(search);
		const jobId = params.get('jobId');
		return { page: 'rankings', data: jobId ? { jobId } : {} };
	}
	if (pathname === '/settings') return { page: 'settings', data: {} };
	return { page: 'dashboard', data: {} };
};

/** useRouter - Hook exposing the active Page, route data, and a typed navigator. */
const useRouter = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const { page, data } = urlToPage(location.pathname, location.search);
	const onNavigate = (target: Page, payload?: Record<string, string>) =>
		navigate(pageToUrl(target, payload));
	return { currentPage: page, pageData: data, onNavigate };
};

export default useRouter;
