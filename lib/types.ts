import type { SectionData, ConfigData } from "./get-sections";

export type DocsSection = SectionData & { id: string };

export type MarkdownHeading = {
	level: number;
	text: string;
	id: string;
};

export type DocsLayoutProps = {
	sections: SectionData[];
	config: ConfigData;
};

export type SearchableDocItem = {
	itemId: string;
	type: "page" | "heading";
	title: string;
	label: string;
	subtitle: string;
	content: string;
	hash: string;
};
