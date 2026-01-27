"use client";

import Fuse from "fuse.js";
import { useMemo, useRef, useState } from "react";
import { Content } from "./content";
import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";
import type { DocsLayoutProps, DocsSection, SearchableDocItem } from "@/lib/types";
import { buildSections, extractMarkdownHeadings } from "@/lib/helpers";

export function Main({ sections: rawSections, config }: DocsLayoutProps) {
	const sections = useMemo(() => buildSections(rawSections), [rawSections]);

	const [currentId, setCurrentId] = useState(sections[0]?.id ?? "");
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");
	const contentRef = useRef<HTMLDivElement | null>(null);

	const currentSection = sections.find((section) => section.id === currentId) ?? sections[0];
	const searchableItems = useMemo(() => {
		const items: SearchableDocItem[] = [];

		for (const section of sections) {
			items.push({
				itemId: section.id,
				type: "page",
				title: section.title,
				label: section.label || "",
				subtitle: section.subtitle || "",
				content: section.content,
				hash: "",
			});

			for (const heading of extractMarkdownHeadings(section.content)) {
				items.push({
					itemId: section.id,
					type: "heading",
					title: heading.text,
					label: section.title,
					subtitle: `In ${section.title}`,
					content: "",
					hash: `#${heading.id}`,
				});
			}
		}

		return items;
	}, [sections]);

	const fuse = useMemo(() => {
		return new Fuse(searchableItems, {
			keys: ["title", "label", "subtitle", "content"],
			threshold: 0.3,
			includeMatches: true,
			ignoreLocation: true,
		});
	}, [searchableItems]);

	const searchResults = useMemo(() => {
		if (!searchQuery) return null;
		return fuse.search(searchQuery).map((result) => result.item);
	}, [searchQuery, fuse]);

	const groupedSearchResults = useMemo(() => {
		if (!searchResults) return null;
		const groups = new Map<string, typeof searchResults>();
		for (const item of searchResults) {
			const group = groups.get(item.itemId) ?? [];
			group.push(item);
			groups.set(item.itemId, group);
		}
		return [...groups.values()];
	}, [searchResults]);

	const tocHeadings = useMemo(() => {
		if (!currentSection) return [];
		return extractMarkdownHeadings(currentSection.content);
	}, [currentSection]);

	const fallbackSection: DocsSection = {
		id: "",
		label: "",
		title: "No pages found",
		subtitle: "",
		content: "",
	};
	const resolvedCurrentSection = currentSection ?? fallbackSection;

	const handleNavClick = (sectionId: string, hash?: string) => {
		setCurrentId(sectionId);
		setSidebarOpen(false);
		setSearchQuery("");
		setTimeout(() => {
			if (hash) {
				const element = document.getElementById(hash.substring(1));
				if (element) {
					const top = element.getBoundingClientRect().top + window.scrollY - 72;
					window.scrollTo({ top, behavior: "smooth" });
				}
			} else {
				window.scrollTo({ top: 0, behavior: "smooth" });
			}
		}, 100);
	};

	return (
		<div className="min-h-screen bg-background">
			<Topbar
				searchPlaceholder={config.searchPlaceholder || "Search..."}
				searchQuery={searchQuery}
				onSearchQueryChange={setSearchQuery}
				onOpenSidebar={() => setSidebarOpen(true)}
			/>

			<Sidebar
				title={config.title || "Your title"}
				sections={sections}
				currentId={currentId}
				searchResults={searchResults}
				sidebarOpen={sidebarOpen}
				onCloseSidebar={() => setSidebarOpen(false)}
				onSelectSection={(sectionId) => handleNavClick(sectionId)}
				tocHeadings={tocHeadings}
				onSelectHeading={(hash) => handleNavClick(currentId, hash)}
			/>

			<main className="lg:pl-64 pt-14">
				<div className="pt-8">
					<Content
						searchQuery={searchQuery}
						searchResults={searchResults}
						groupedSearchResults={groupedSearchResults}
						currentSection={resolvedCurrentSection}
						onNavigate={handleNavClick}
						contentRef={contentRef}
						noResultsText={config.noResults || "No results found."}
					/>
				</div>
			</main>
		</div>
	);
}
