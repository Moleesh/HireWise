/** @format */

import { LayoutDashboard, FileText, Users, BarChart3, Settings } from 'lucide-react';
import type { Page } from '../../../types';

/** navItems - Mobile bottom navigation items with page, label, and icon. */
export const navItems: { page: Page; label: string; icon: typeof LayoutDashboard }[] = [
	{ page: 'dashboard', label: 'Home', icon: LayoutDashboard },
	{ page: 'jobs', label: 'Jobs', icon: FileText },
	{ page: 'candidates', label: 'People', icon: Users },
	{ page: 'rankings', label: 'Rank', icon: BarChart3 },
	{ page: 'settings', label: 'Admin', icon: Settings },
];
