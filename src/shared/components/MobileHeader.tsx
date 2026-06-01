/** @format */

import AnimatedLogo from './AnimatedLogo';
import { navItems } from './MobileNav/_private/config';

type MobileHeaderProps = {
    currentPage: (typeof navItems)[number]['page'];
};

/** MobileHeader - Compact brand header with current page breadcrumb. */
const MobileHeader = ({ currentPage }: MobileHeaderProps) => {
    const activeItem = navItems.find((item) => item.page === currentPage) ?? navItems[0];
    return (
        <div className="md:hidden sticky top-0 z-30 bg-[var(--bg-primary)]/90 backdrop-blur-xl border-b border-[var(--border-subtle)]">
            <div className="px-4 py-4 flex items-center justify-between gap-3">
                <AnimatedLogo size={28} />
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--accent-bg-subtle)] text-[var(--accent-text)] text-xs font-semibold shrink-0">
                    <activeItem.icon size={14} />
                    {activeItem.label}
                </div>
            </div>
        </div>
    );
};

export default MobileHeader;
