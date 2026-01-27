import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import { markdownComponents } from "@/lib/markdown-components";
import type { DocsSection, SearchableDocItem } from "@/lib/types";

type ContentProps = {
	searchQuery: string;
	searchResults: SearchableDocItem[] | null;
	groupedSearchResults: SearchableDocItem[][] | null;
	currentSection: DocsSection;
	onNavigate: (sectionId: string, hash?: string) => void;
	contentRef: React.RefObject<HTMLDivElement | null>;
	noResultsText: string;
};

export function Content({
	searchQuery,
	searchResults,
	groupedSearchResults,
	currentSection,
	onNavigate,
	contentRef,
	noResultsText,
}: ContentProps) {
	if (searchResults) {
		return (
			<article className="max-w-3xl mx-auto px-6 lg:px-8 py-8 lg:py-12">
				<div className="mb-10">
					<h1 className="text-3xl lg:text-4xl font-extrabold text-foreground tracking-tight mb-3">
						Search Results
					</h1>
					<p className="text-lg lg:text-xl text-foreground leading-relaxed">
						Showing results for "{searchQuery}"
					</p>
				</div>

				<div className="flex flex-col">
					{groupedSearchResults?.map((group, groupIndex) => {
						const page = group.find((item) => item.type === "page") ?? group[0];
						return (
							<div key={page.itemId}>
								{groupIndex > 0 && <div className="border-t border-default-200" />}
								<div className="py-6">
									<div className="flex items-center justify-between mb-3">
										<button
											type="button"
											onClick={() => onNavigate(page.itemId)}
											className="font-bold text-foreground hover:text-primary hover:underline truncate cursor-pointer transition-colors text-left"
										>
											{page.title}
										</button>
										<span className="shrink-0 text-default-400 text-xs">
											{group.length} match{group.length === 1 ? "" : "es"}
										</span>
									</div>
									{page.subtitle && <p className="text-sm text-default-600 mb-0!">{page.subtitle}</p>}

									{group.filter((item) => item.type === "heading").length > 0 && (
										<div className="mt-4 flex flex-col gap-2">
											{group
												.filter((item) => item.type === "heading")
												.map((item) => (
													<button
														type="button"
														key={`${item.itemId}-${item.hash}`}
														onClick={() => onNavigate(item.itemId, item.hash as string)}
														className="bg-default-100 hover:bg-default-200 shadow-xs block cursor-pointer w-full text-left px-3 py-2 text-sm text-default-600 hover:text-foreground rounded-lg"
													>
														{item.title}
													</button>
												))}
										</div>
									)}
								</div>
							</div>
						);
					})}
					{searchResults.length === 0 && (
						<div className="px-5 py-8 text-center text-foreground border border-dashed border-default-300 rounded-xl">
							{noResultsText}
						</div>
					)}
				</div>
			</article>
		);
	}

	return (
		<article className="max-w-3xl mx-auto px-6 lg:px-8 py-8 lg:py-12">
			<div className="mb-10">
				<h1 className="text-3xl lg:text-4xl font-extrabold text-foreground tracking-tight mb-3">
					{currentSection.title}
				</h1>
				{currentSection.subtitle && (
					<p className="text-lg lg:text-xl text-foreground leading-relaxed">
						{currentSection.subtitle}
					</p>
				)}
			</div>
			<div ref={contentRef} className="prose prose-slate max-w-none">
				<ReactMarkdown
					remarkPlugins={[remarkGfm]}
					rehypePlugins={[rehypeRaw, rehypeSlug, rehypeHighlight]}
					components={markdownComponents}
				>
					{currentSection.content}
				</ReactMarkdown>
			</div>
		</article>
	);
}
