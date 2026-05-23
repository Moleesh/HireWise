/** @format */

import { navItems } from './MobileNav/_private/config';

type MobileNavProps = {
	currentPage: (typeof navItems)[number]['page'];
	onNavigate: (page: (typeof navItems)[number]['page']) => void;
};

/** MobileNav - Bottom navigation bar shown on screens < 768px. */
const MobileNav = ({ currentPage, onNavigate }: MobileNavProps) => (
	<nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-[var(--sidebar-bg)] border-t border-[var(--sidebar-border)] safe-area-bottom">
		<div className="flex items-center justify-around py-2">
			{navItems.map((item) => {
				const isActive = currentPage === item.page;
				return (
					<button
						key={item.page}
						onClick={() => onNavigate(item.page)}
						className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all ${
							isActive ? 'text-[var(--accent-text)]' : 'text-[var(--text-quaternary)]'
						}`}
					>
						<item.icon size={20} />
						<span className="text-[10px] font-medium">{item.label}</span>
					</button>
				);
			})}
		</div>
	</nav>
);

export default MobileNav;
