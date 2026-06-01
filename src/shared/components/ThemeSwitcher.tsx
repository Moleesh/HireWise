/** @format */

import useTheme from '../hooks/useTheme';
import { Palette } from 'lucide-react';
import { themes } from './ThemeSwitcher/_private/config';

type ThemeSwitcherProps = {
	showLabel?: boolean;
};

/** ThemeSwitcher - Dropdown for selecting between 4 color themes. */
const ThemeSwitcher = ({ showLabel = true }: ThemeSwitcherProps) => {
	const { theme, setTheme } = useTheme();
	const activeTheme = themes.find((item) => item.name === theme) ?? themes[0];

	return (
		<div className="theme-switcher relative group">
			<button className="theme-switcher__trigger flex items-center gap-2 px-3 py-2 rounded-xl transition-all">
				<Palette size={16} />
				{showLabel && <span className="text-xs">{activeTheme.label}</span>}
			</button>
			<div className="theme-switcher__menu absolute bottom-full left-0 mb-2 w-56 py-2 rounded-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 ease-out z-50 origin-bottom-left group-hover:-translate-y-1 group-hover:scale-[1.01]">
				{themes.map((t) => {
					const isActive = theme === t.name;

					return (
						<button
							key={t.name}
							onClick={() => setTheme(t.name)}
							data-preview-theme={t.name}
							className={`theme-switcher__option w-full flex items-center gap-2 px-3 py-2 text-sm text-left transition-all duration-200 ease-out ${
								isActive ? 'theme-switcher__option--active' : ''
							}`}
						>
							<div className="theme-switcher__swatches flex gap-1 shrink-0 mr-1">
								<span className="theme-switcher__swatch theme-switcher__swatch--primary w-3 h-3 rounded-full border border-white/10" />
								<span className="theme-switcher__swatch theme-switcher__swatch--secondary w-3 h-3 rounded-full border border-white/10" />
								<span className="theme-switcher__swatch theme-switcher__swatch--accent-bg w-3 h-3 rounded-full border border-white/10" />
								<span className="theme-switcher__swatch theme-switcher__swatch--accent-text w-3 h-3 rounded-full border border-white/10" />
							</div>
							<span className="theme-switcher__label whitespace-nowrap">
								{t.label}
							</span>
						</button>
					);
				})}
			</div>
		</div>
	);
};

export default ThemeSwitcher;
