/** @format */

import { type ReactNode } from 'react';
import Sidebar from './Sidebar';
import MobileNav from './MobileNav';
import type { Page } from '../types';

type LayoutProps = {
	children: ReactNode;
	currentPage: Page;
	onNavigate: (page: Page) => void;
};

/** Layout - Main application layout with sidebar (desktop) and bottom nav (mobile). */
const Layout = ({ children, currentPage, onNavigate }: LayoutProps) => (
	<div className="min-h-screen bg-[var(--bg-primary)] relative">
		<div className="fixed inset-0 pointer-events-none">
			<div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[var(--accent-glow)] rounded-full blur-[200px] opacity-[0.03]" />
			<div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[var(--accent-glow-secondary)] rounded-full blur-[180px] opacity-[0.02]" />
		</div>
		<Sidebar currentPage={currentPage} onNavigate={onNavigate} />
		<main className="md:ml-64 min-h-screen relative z-10 pb-20 md:pb-0">
			<div className="p-4 md:p-8">{children}</div>
		</main>
		<MobileNav currentPage={currentPage} onNavigate={onNavigate} />
	</div>
);

export default Layout;
