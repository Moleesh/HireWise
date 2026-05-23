/** @format */

import { LayoutDashboard, FileText, Users, BarChart3, Settings } from 'lucide-react';
import type { Page } from '../../../types';

/** navItems - Sidebar navigation items with page, label, and icon. */
export const navItems: { page: Page; label: string; icon: typeof LayoutDashboard }[] = [
	{ page: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
	{ page: 'jobs', label: 'Job Descriptions', icon: FileText },
	{ page: 'candidates', label: 'Candidates', icon: Users },
	{ page: 'rankings', label: 'Rankings', icon: BarChart3 },
	{ page: 'settings', label: 'User Management', icon: Settings },
];
