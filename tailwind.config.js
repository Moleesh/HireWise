/** @format */

export default {
	content: ['./index.html', './src/**/*.{js,ts,jsx,tsx,scss}'],
	theme: {
		extend: {
			fontFamily: {
				sans: ['var(--font-body)', 'Inter', 'system-ui', 'sans-serif'],
				display: ['var(--font-display)', 'var(--font-body)', 'Inter', 'sans-serif'],
			},
		},
	},
	plugins: [],
};
