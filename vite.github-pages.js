/** @format */

import { copyFileSync, existsSync } from 'fs';
import { resolve } from 'path';

export const githubPagesFallback = () => ({
    name: 'github-pages-fallback',
    closeBundle() {
        const indexPath = resolve('dist', 'index.html');
        const fallbackPath = resolve('dist', '404.html');
        if (existsSync(indexPath)) copyFileSync(indexPath, fallbackPath);
    },
});
