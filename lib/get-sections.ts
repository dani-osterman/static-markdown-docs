import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import userConfigs from "../content/config.json";

export interface ConfigData {
	title: string;
	searchPlaceholder: string;
	noResults: string;
}

export interface SectionData {
	label: string;
	title: string;
	subtitle?: string;
	content: string;
}

export const config: ConfigData = userConfigs;

export function getSections(): SectionData[] {
	const contentDir = path.join(process.cwd(), "content");

	const files = fs
		.readdirSync(contentDir)
		.filter(
			(f) =>
				f.endsWith(".md") && fs.statSync(path.join(contentDir, f)).isFile(),
		)
		.sort();

	return files.map((file) => {
		const raw = fs.readFileSync(path.join(contentDir, file), "utf8");
		const { data, content } = matter(raw);
		const fallback = file
			.replace(/^\d+-/, "")
			.replace(/-/g, " ")
			.replace(/\.md$/, "")
			.replace(/\b\w/g, (c) => c.toUpperCase());

		return {
			label: (data.label as string) || fallback,
			title: (data.title as string) || fallback,
			subtitle: data.subtitle as string | undefined,
			content: content.trim(),
		};
	});
}
