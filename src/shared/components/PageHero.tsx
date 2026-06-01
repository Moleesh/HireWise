/** @format */

import type { ReactNode } from 'react';

type PageHeroProps = {
    eyebrow: string;
    title: string;
    description: string;
    action?: ReactNode;
};

const PageHero = ({ eyebrow, title, description, action }: PageHeroProps) => (
    <div className="mb-6 md:mb-8 rounded-3xl border border-[var(--card-border)] bg-[var(--card-bg)] p-5 md:p-7 shadow-2xl shadow-black/5">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--accent-text)] mb-2">
                    {eyebrow}
                </p>
                <h1 className="text-2xl md:text-4xl font-bold text-[var(--text-primary)]">
                    {title}
                </h1>
                <p className="hidden md:block text-[var(--text-tertiary)] mt-2 text-sm md:text-base max-w-2xl">
                    {description}
                </p>
            </div>
            {action && <div className="md:pt-1">{action}</div>}
        </div>
    </div>
);

export default PageHero;
