/** @format */

import type { Job, ThemeName } from '../../../shared/types';

/** RequiredJobField - Fields required before generating an AI poster. */
export type RequiredJobField = 'title' | 'department' | 'skills';

/** missingPosterFields - Returns the list of required fields that are empty for a job. */
export const missingPosterFields = (job: Partial<Job>): RequiredJobField[] => {
	const missing: RequiredJobField[] = [];
	if (!job.title?.trim()) missing.push('title');
	if (!job.department?.trim()) missing.push('department');
	if (!(job.skills ?? []).length) missing.push('skills');
	return missing;
};

/** themePosterPalette - Color hints fed into the poster prompt for brand consistency. */
export const themePosterPalette = (theme: ThemeName): string => {
	switch (theme) {
		case 'midnight-emerald':
			return 'deep navy background with emerald and teal accents';
		case 'ocean-depth':
			return 'midnight blue background with cyan and azure highlights';
		case 'sunset-copper':
			return 'warm charcoal background with amber, copper and ember accents';
		case 'royal-violet':
			return 'deep aubergine background with violet and electric indigo accents';
		case 'forest-moss':
			return 'forest-black background with moss green and sage highlights';
		case 'crimson-noir':
			return 'pure black background with crimson red and bone-white accents';
		case 'arctic-frost':
			return 'crisp white background with sky-blue and silver accents';
		case 'paper-ink':
			return 'off-white paper background with bold black ink and a single red accent';
		default:
			return 'modern professional palette';
	}
};

/** buildPosterPrompt - Build a wall-in recruitment poster prompt for the AI image model. */
export const buildPosterPrompt = (
	job: Partial<Job>,
	theme: ThemeName,
	variant: number,
	refinement?: string,
): string => {
	const palette = themePosterPalette(theme);
	const skills = (job.skills ?? []).slice(0, 5).join(', ');
	const goodToHave = (job.goodToHave ?? []).slice(0, 3).join(', ');
	const styles = [
		'premium editorial hiring poster, strong visual hierarchy, modern sans-serif, generous spacing',
		'sleek tech recruiting poster, soft glow gradients, clean geometric shapes, high-end product aesthetic',
		'bold campaign-style recruitment poster, structured grid, confident typography, refined contrast',
	];
	const style = styles[variant % styles.length];

	const lines = [
		`Create an eye-catching recruitment wall poster (portrait, 2:3) for: ${job.title ?? 'Open Role'}.`,
		`Department: ${job.department ?? 'Team'}.`,
		skills && `Core skills to show as polished skill tags: ${skills}.`,
		goodToHave && `Optional "good to have" tags: ${goodToHave}.`,
		`Visual style: ${style}.`,
		`Color direction: ${palette}.`,
		'Poster composition: big headline, one short subtitle, skill chips, and a small CTA footer.',
		'Use clean English copy only; avoid gibberish text and avoid placeholder lorem ipsum.',
		'Include only these text blocks: "We are hiring", job title, department, and skills.',
		'No human faces, no photos, no logos, no brand names, no watermark.',
		'Professional, premium, visually rich, balanced whitespace, high contrast and highly legible typography.',
		'Print-ready look, crisp edges, cinematic lighting accents, modern texture depth.',
		refinement && `User refinement: ${refinement}.`,
	].filter(Boolean);

	return lines.join('\n');
};

/** buildSummaryFields - Extracts the fields used when asking the AI for a summary. */
export const buildSummaryFields = (job: Partial<Job>) => ({
	title: job.title ?? '',
	department: job.department ?? '',
	skills: job.skills ?? [],
	goodToHave: job.goodToHave ?? [],
});
