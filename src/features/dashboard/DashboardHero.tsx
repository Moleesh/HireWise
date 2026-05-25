/** @format */

/** DashboardHero - Prominent dashboard heading for small and large screens. */
const DashboardHero = () => (
	<div className="mb-6 md:mb-8 rounded-3xl border border-[var(--card-border)] bg-[var(--card-bg)] p-5 md:p-7 shadow-2xl shadow-black/5">
		<p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--accent-text)] mb-2">
			Hiring Overview
		</p>
		<h1 className="text-2xl md:text-4xl font-bold text-[var(--text-primary)]">Dashboard</h1>
		<p className="text-[var(--text-tertiary)] mt-2 text-sm md:text-base max-w-2xl">
			A quick view of open roles, candidate activity, and ranking progress.
		</p>
	</div>
);

export default DashboardHero;
