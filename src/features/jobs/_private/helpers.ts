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
	const goodToHave = (job.goodtohave ?? []).slice(0, 3).join(', ');
	const styles = [
		'editorial minimalist typography poster, generous whitespace, large display type',
		'modern geometric poster with subtle gradients, layered shapes, bold sans-serif',
		'bauhaus-inspired poster with strong grid, primary shapes and confident typography',
	];
	const style = styles[variant % styles.length];

	const lines = [
		`Recruitment wall poster (portrait, "wall-in" hanging poster) for: ${job.title ?? 'Open Role'}.`,
		`Department: ${job.department ?? 'Team'}.`,
		skills && `Core skills to feature as small chips or accent text: ${skills}.`,
		goodToHave && `Nice-to-have mentions: ${goodToHave}.`,
		`Visual style: ${style}.`,
		`Color direction: ${palette}.`,
		'Include the job title as the dominant text, a short "We are hiring" tag, and the department.',
		'No human faces, no photographs, no logos. Crisp legible typography only.',
		'Aspect ratio 2:3 portrait, print-ready, high-contrast, no watermark, no lorem ipsum.',
		refinement && `User refinement: ${refinement}.`,
	].filter(Boolean);

	return lines.join('\n');
};

/** buildSummaryFields - Extracts the fields used when asking the AI for a summary. */
export const buildSummaryFields = (job: Partial<Job>) => ({
	title: job.title ?? '',
	department: job.department ?? '',
	skills: job.skills ?? [],
	goodtohave: job.goodtohave ?? [],
});
