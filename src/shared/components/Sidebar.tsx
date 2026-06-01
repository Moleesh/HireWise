/** @format */

import { LogOut } from 'lucide-react';
import useAuth from '../../features/auth/hooks/useAuth';
import ThemeSwitcher from './ThemeSwitcher';
import AnimatedLogo from './AnimatedLogo';
import { navItems } from './Sidebar/_private/config';

type SidebarProps = {
    currentPage: (typeof navItems)[number]['page'];
    onNavigate: (page: (typeof navItems)[number]['page']) => void;
};

/** Sidebar - Desktop sidebar navigation with brand, nav items, and user info. */
const Sidebar = ({ currentPage, onNavigate }: SidebarProps) => {
    const { user, signOut } = useAuth();
    const initials = user?.email?.charAt(0).toUpperCase() ?? 'U';

    return (
        <aside className="hidden md:flex fixed left-0 top-0 bottom-0 w-64 bg-[var(--sidebar-bg)] border-r border-[var(--sidebar-border)] flex-col z-40">
            <div className="p-6 border-b border-[var(--border-subtle)]">
                <AnimatedLogo size={28} />
            </div>
            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                {navItems.map((item) => {
                    const isActive = currentPage === item.page;
                    return (
                        <button
                            key={item.page}
                            onClick={() => onNavigate(item.page)}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 relative ${
                                isActive
                                    ? 'text-[var(--accent-text)] bg-[var(--accent-bg-subtle)]'
                                    : 'text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] hover:bg-[var(--btn-ghost-hover)]'
                            }`}
                        >
                            {isActive && (
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-r-full bg-[var(--accent-bg)]" />
                            )}
                            <item.icon size={18} />
                            <span>{item.label}</span>
                        </button>
                    );
                })}
            </nav>
            <div className="p-4 border-t border-[var(--border-subtle)] space-y-2">
                <ThemeSwitcher />
                <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-[var(--card-bg)] border border-[var(--card-border)]">
                    <div className="w-8 h-8 rounded-lg bg-[var(--accent-bg-subtle)] border border-[var(--accent-border)] flex items-center justify-center text-xs font-semibold text-[var(--accent-text)]">
                        {initials}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-[var(--text-primary)] truncate">
                            {user?.email}
                        </p>
                        <p className="text-[10px] text-[var(--text-quaternary)]">Admin</p>
                    </div>
                    <button
                        onClick={signOut}
                        className="p-1.5 rounded-lg text-[var(--text-tertiary)] hover:text-red-400 hover:bg-red-500/10 transition-all"
                        title="Sign out"
                    >
                        <LogOut size={14} />
                    </button>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
