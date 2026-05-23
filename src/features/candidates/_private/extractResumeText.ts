/** @format */

/**
 * extractResumeText - Extract plain text from an uploaded resume file.
 *
 * Supports PDF (via pdfjs-dist), DOCX (via mammoth), and plain-text files.
 * Falls back to an empty string for unsupported types so the upload still
 * proceeds and the server-side parser can degrade gracefully.
 */
export const extractResumeText = async (file: File): Promise<string> => {
	const ext = (file.name.split('.').pop() ?? '').toLowerCase();
	try {
		if (ext === 'txt' || file.type === 'text/plain') {
			return await file.text();
		}
		if (ext === 'pdf' || file.type === 'application/pdf') {
			return await extractPdf(file);
		}
		if (ext === 'docx' || file.type.includes('officedocument.wordprocessingml')) {
			return await extractDocx(file);
		}
		// .doc legacy is unreliable in-browser; fall back to text() best effort.
		return await file.text();
	} catch (err) {
		console.warn('extractResumeText failed', err);
		return '';
	}
};

const extractPdf = async (file: File): Promise<string> => {
	const pdfjs = await import('pdfjs-dist');
	// Use bundled worker via Vite ?url import
	(
		pdfjs as unknown as { GlobalWorkerOptions: { workerSrc: string } }
	).GlobalWorkerOptions.workerSrc = (
		await import('pdfjs-dist/build/pdf.worker.min.mjs?url')
	).default;

	const buffer = await file.arrayBuffer();
	const doc = await pdfjs.getDocument({ data: buffer }).promise;
	const pages: string[] = [];
	for (let i = 1; i <= doc.numPages; i++) {
		const page = await doc.getPage(i);
		const content = await page.getTextContent();
		pages.push(
			content.items.map((it) => ('str' in it ? (it as { str: string }).str : '')).join(' '),
		);
	}
	return pages.join('\n\n');
};

const extractDocx = async (file: File): Promise<string> => {
	const mammoth = await import('mammoth/mammoth.browser');
	const buffer = await file.arrayBuffer();
	const result = await mammoth.extractRawText({ arrayBuffer: buffer });
	return result.value;
};
