/** @format */

import useTheme from '../hooks/useTheme';
import { Palette } from 'lucide-react';
import { themes } from './ThemeSwitcher/_private/config';

/** ThemeSwitcher - Dropdown for selecting between 4 color themes. */
const ThemeSwitcher = () => {
	const { theme, setTheme } = useTheme();

	return (
		<div className="relative group">
			<button className="flex items-center gap-2 px-3 py-2 rounded-xl text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] hover:bg-[var(--btn-ghost-hover)] transition-all">
				<Palette size={16} />
				<span className="text-xs">Theme</span>
			</button>
			<div className="absolute bottom-full left-0 mb-2 w-48 py-2 bg-[var(--dropdown-bg)] border border-[var(--dropdown-border)] rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
				{themes.map((t) => (
					<button
						key={t.name}
						onClick={() => setTheme(t.name)}
						className={`w-full flex items-center gap-3 px-3 py-2 text-sm transition-colors ${
							theme === t.name
								? 'text-[var(--accent-text)] bg-[var(--accent-bg-subtle)]'
								: 'text-[var(--text-secondary)] hover:bg-[var(--btn-ghost-hover)]'
						}`}
					>
						<div className="flex gap-1">
							{t.colors.map((c, i) => (
								<span
									key={i}
									className="w-3 h-3 rounded-full border border-white/10"
									style={{ backgroundColor: c }}
								/>
							))}
						</div>
						<span>{t.label}</span>
					</button>
				))}
			</div>
		</div>
	);
};

export default ThemeSwitcher;
