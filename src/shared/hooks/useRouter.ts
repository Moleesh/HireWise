/** @format */

import { useEffect } from 'react';
import { useNavigate, useLocation, matchPath } from 'react-router-dom';
import type { Page } from '../types';
import { jobCodeFromId } from '../lib/jobCode';

/** pageToUrl - Maps a Page (and optional data) to a real URL path. */
export const pageToUrl = (page: Page, data?: Record<string, string>): string => {
	switch (page) {
		case 'dashboard':
			return '/';
		case 'jobs':
			return '/jobs';
		case 'job-editor': {
			if (!data?.id) return '/jobs/new';
			const jobRouteId = data.code ?? jobCodeFromId(data.id);
			if (data.mode === 'edit') return `/jobs/${jobRouteId}/edit`;
			return `/jobs/${jobRouteId}`;
		}
		case 'candidates':
			return '/candidates';
		case 'rankings':
			return data?.jobId ? `/rankings?jobId=${data.jobId}` : '/rankings';
		case 'reports':
			return '/reports';
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
): { page: Page; data: Record<string, string>; matched: boolean } => {
	if (pathname === '/' || pathname === '/dashboard')
		return { page: 'dashboard', data: {}, matched: true };
	if (pathname === '/jobs') return { page: 'jobs', data: {}, matched: true };
	if (pathname === '/jobs/new')
		return { page: 'job-editor', data: { mode: 'create' }, matched: true };
	const editMatch = matchPath('/jobs/:id/edit', pathname);
	if (editMatch?.params.id)
		return {
			page: 'job-editor',
			data: { id: editMatch.params.id, mode: 'edit' },
			matched: true,
		};
	const viewMatch = matchPath('/jobs/:id', pathname);
	if (viewMatch?.params.id)
		return {
			page: 'job-editor',
			data: { id: viewMatch.params.id, mode: 'view' },
			matched: true,
		};
	if (pathname === '/candidates') return { page: 'candidates', data: {}, matched: true };
	if (pathname.startsWith('/rankings')) {
		const params = new URLSearchParams(search);
		const jobId = params.get('jobId');
		return { page: 'rankings', data: jobId ? { jobId } : {}, matched: true };
	}
	if (pathname === '/reports') return { page: 'reports', data: {}, matched: true };
	if (pathname === '/settings') return { page: 'settings', data: {}, matched: true };
	return { page: 'dashboard', data: {}, matched: false };
};

/** useRouter - Hook exposing the active Page, route data, and a typed navigator. */
const useRouter = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const { page, data, matched } = urlToPage(location.pathname, location.search);
	useEffect(() => {
		if (!matched) navigate(pageToUrl('dashboard'), { replace: true });
	}, [matched, navigate]);
	const onNavigate = (target: Page, payload?: Record<string, string>) =>
		navigate(pageToUrl(target, payload));
	return { currentPage: page, pageData: data, onNavigate };
};

export default useRouter;
