/** @format */

import { useState } from 'react';
import AuthProvider from './features/auth/hooks/AuthProvider';
import ThemeProvider from './shared/hooks/ThemeProvider';
import useAuth from './features/auth/hooks/useAuth';
import Layout from './shared/components/Layout';
import LoginPage from './features/auth/LoginPage';
import DashboardPage from './features/dashboard/DashboardPage';
import JobListPage from './features/jobs/JobListPage';
import JobEditorPage from './features/jobs/JobEditorPage';
import CandidateListPage from './features/candidates/CandidateListPage';
import RankingPage from './features/rankings/RankingPage';
import UserManagementPage from './features/settings/UserManagementPage';
import type { Page } from './shared/types';

/** AppContent - Inner app content with auth guard and page routing */
const AppContent = () => {
	const { user, loading } = useAuth();
	const [currentPage, setCurrentPage] = useState<Page>('dashboard');
	const [pageData, setPageData] = useState<Record<string, string>>({});

	const handleNavigate = (page: Page, data?: Record<string, string>) => {
		setCurrentPage(page);
		setPageData(data ?? {});
	};

	if (loading) {
		return (
			<div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center">
				<div className="w-8 h-8 border-2 border-[var(--accent-bg)] border-t-transparent rounded-full animate-spin" />
			</div>
		);
	}

	if (!user) {
		return <LoginPage />;
	}

	const renderPage = () => {
		switch (currentPage) {
			case 'dashboard':
				return <DashboardPage onNavigate={handleNavigate} />;
			case 'jobs':
				return <JobListPage onNavigate={handleNavigate} />;
			case 'job-editor':
				return (
					<JobEditorPage
						onNavigate={handleNavigate}
						jobId={pageData.id}
						mode={(pageData.mode as 'create' | 'edit' | 'view') ?? 'create'}
					/>
				);
			case 'candidates':
				return <CandidateListPage />;
			case 'rankings':
				return <RankingPage preselectedJobId={pageData.jobId} />;
			case 'settings':
				return <UserManagementPage />;
			default:
				return <DashboardPage onNavigate={handleNavigate} />;
		}
	};

	return (
		<Layout currentPage={currentPage} onNavigate={handleNavigate}>
			{renderPage()}
		</Layout>
	);
};

/** App - Root application component with providers */
const App = () => {
	return (
		<ThemeProvider>
			<AuthProvider>
				<AppContent />
			</AuthProvider>
		</ThemeProvider>
	);
};

export default App;
