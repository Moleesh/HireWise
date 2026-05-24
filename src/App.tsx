/** @format */

import { BrowserRouter } from 'react-router-dom';
import AuthProvider from './features/auth/hooks/AuthProvider';
import ThemeProvider from './shared/hooks/ThemeProvider';
import useAuth from './features/auth/hooks/useAuth';
import useRouter from './shared/hooks/useRouter';
import Layout from './shared/components/Layout';
import LoginPage from './features/auth/LoginPage';
import DashboardPage from './features/dashboard/DashboardPage';
import JobListPage from './features/jobs/JobListPage';
import JobEditorPage from './features/jobs/JobEditorPage';
import CandidateListPage from './features/candidates/CandidateListPage';
import RankingPage from './features/rankings/RankingPage';
import UserManagementPage from './features/settings/UserManagementPage';

/** AppContent - Inner app with URL-driven routing and auth guard. */
const AppContent = () => {
	const { user, loading } = useAuth();
	const { currentPage, pageData, onNavigate } = useRouter();

	if (loading) {
		return (
			<div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center">
				<div className="w-8 h-8 border-2 border-[var(--accent-bg)] border-t-transparent rounded-full animate-spin" />
			</div>
		);
	}

	if (!user) return <LoginPage />;

	const renderPage = () => {
		switch (currentPage) {
			case 'dashboard':
				return <DashboardPage onNavigate={onNavigate} />;
			case 'jobs':
				return <JobListPage onNavigate={onNavigate} />;
			case 'job-editor':
				return (
					<JobEditorPage
						onNavigate={onNavigate}
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
				return <DashboardPage onNavigate={onNavigate} />;
		}
	};

	return (
		<Layout currentPage={currentPage} onNavigate={onNavigate}>
			{renderPage()}
		</Layout>
	);
};

/** App - Root with router + providers. */
const App = () => (
	<BrowserRouter>
		<ThemeProvider>
			<AuthProvider>
				<AppContent />
			</AuthProvider>
		</ThemeProvider>
	</BrowserRouter>
);

export default App;
