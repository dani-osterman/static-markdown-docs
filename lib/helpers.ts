import type { ClassValue } from "clsx";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

import type { SectionData } from "./get-sections";
import type { DocsSection, MarkdownHeading } from "./types";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function slugify(input: string) {
	return input
		.toLowerCase()
		.trim()
		.replace(/['"]/g, "")
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-+|-+$/g, "");
}

export function extractMarkdownHeadings(content: string): MarkdownHeading[] {
	const headings: MarkdownHeading[] = [];
	const headerRegex = /^(#{1,3})\s+(.+)$/gm;
	let match;

	while ((match = headerRegex.exec(content)) !== null) {
		const text = match[2].trim();
		headings.push({
			level: match[1].length,
			text,
			id: slugify(text),
		});
	}

	return headings;
}

export function calculateReadingProgress(markers: number[], position: number) {
	if (markers.length < 2) return 0;
	if (position <= markers[0]) return 0;
	if (position >= markers[markers.length - 1]) return 1;

	for (let index = 0; index < markers.length - 1; index += 1) {
		const start = markers[index];
		const end = markers[index + 1];

		if (position < start) continue;
		if (position <= end) {
			const segmentProgress = (position - start) / Math.max(end - start, 1);
			return Math.max(
				0,
				Math.min(1, (index + segmentProgress) / (markers.length - 1)),
			);
		}
	}

	return 1;
}

export function buildSections(raw: SectionData[]): DocsSection[] {
	const used = new Map<string, number>();

	return raw.map((s) => {
		const base = slugify(s.label || s.title) || "section";
		const count = used.get(base) ?? 0;
		used.set(base, count + 1);
		const id = count === 0 ? base : `${base}-${count + 1}`;

		return { ...s, id };
	});
}

