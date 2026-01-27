"use client";

import { useEffect, useRef, useState, type PointerEvent } from "react";
import { ChevronUp, X } from "lucide-react";
import { cn } from "@/lib/helpers";
import type { DocsSection, MarkdownHeading, SearchableDocItem } from "@/lib/types";

type SidebarProps = {
	title: string;
	sections: DocsSection[];
	currentId: string;
	searchResults: SearchableDocItem[] | null;
	sidebarOpen: boolean;
	onCloseSidebar: () => void;
	onSelectSection: (sectionId: string) => void;
	tocHeadings: MarkdownHeading[];
	onSelectHeading: (hash: string) => void;
};

export function Sidebar({
	title,
	sections,
	currentId,
	searchResults,
	sidebarOpen,
	onCloseSidebar,
	onSelectSection,
	tocHeadings,
	onSelectHeading,
}: SidebarProps) {
	const [tocOpen, setTocOpen] = useState(false);
	const [isTocDragging, setIsTocDragging] = useState(false);
	const [activeHeadingId, setActiveHeadingId] = useState("");
	const [passedHeadingIndex, setPassedHeadingIndex] = useState(-1);
	const tocPanelRef = useRef<HTMLDivElement | null>(null);
	const tocDragStateRef = useRef({
		pointerId: -1,
		startY: 0,
		startScrollTop: 0,
		isDragging: false,
		suppressClick: false,
	});

	const activeHeadingIndex = tocHeadings.findIndex(
		(heading) => heading.id === activeHeadingId,
	);

	const resetTocDragState = () => {
		tocDragStateRef.current.pointerId = -1;
		tocDragStateRef.current.startY = 0;
		tocDragStateRef.current.startScrollTop = 0;
		tocDragStateRef.current.isDragging = false;
		setIsTocDragging(false);
	};

	const handleTocPointerDown = (event: PointerEvent<HTMLDivElement>) => {
		if (!tocOpen || event.pointerType === "touch" || event.button !== 0 || !tocPanelRef.current) {
			return;
		}

		tocDragStateRef.current.pointerId = event.pointerId;
		tocDragStateRef.current.startY = event.clientY;
		tocDragStateRef.current.startScrollTop = tocPanelRef.current.scrollTop;
		tocDragStateRef.current.isDragging = false;
	};

	const handleTocPointerMove = (event: PointerEvent<HTMLDivElement>) => {
		const dragState = tocDragStateRef.current;
		const panel = tocPanelRef.current;

		if (dragState.pointerId !== event.pointerId || event.pointerType === "touch" || !panel) {
			return;
		}

		const deltaY = event.clientY - dragState.startY;
		if (!dragState.isDragging && Math.abs(deltaY) < 6) {
			return;
		}

		if (!dragState.isDragging) {
			dragState.isDragging = true;
			setIsTocDragging(true);
			// Capture only after drag threshold so plain clicks reach the buttons
			event.currentTarget.setPointerCapture(dragState.pointerId);
		}

		event.preventDefault();
		panel.scrollTop = dragState.startScrollTop - deltaY;
	};

	const finishTocPointerInteraction = (event: PointerEvent<HTMLDivElement>) => {
		const dragState = tocDragStateRef.current;
		if (dragState.pointerId !== event.pointerId) {
			return;
		}

		if (event.currentTarget.hasPointerCapture(event.pointerId)) {
			event.currentTarget.releasePointerCapture(event.pointerId);
		}

		if (dragState.isDragging) {
			dragState.suppressClick = true;
			window.setTimeout(() => {
				dragState.suppressClick = false;
			}, 0);
		}

		resetTocDragState();
	};

	const handleTocClickCapture = (event: PointerEvent<HTMLDivElement>) => {
		if (!tocDragStateRef.current.suppressClick) {
			return;
		}

		event.preventDefault();
		event.stopPropagation();
		tocDragStateRef.current.suppressClick = false;
	};

	useEffect(() => {
		setActiveHeadingId(tocHeadings[0]?.id ?? "");
	}, [currentId, tocHeadings]);

	useEffect(() => {
		if (searchResults) {
			setPassedHeadingIndex(-1);
			setActiveHeadingId("");
			return;
		}

		const updateReadingProgress = () => {
			const scrollingElement = document.scrollingElement;
			if (!scrollingElement) {
				setPassedHeadingIndex(-1);
				return;
			}
			const viewportTop = window.scrollY + 120;
			const headingPositions = tocHeadings
				.map((heading) => {
					const element = document.getElementById(heading.id);
					if (!element) return null;
					return element.getBoundingClientRect().top + window.scrollY;
				})
				.filter((position): position is number => position !== null);

			let latestPassedIndex = -1;
			for (let index = 0; index < headingPositions.length; index += 1) {
				if (headingPositions[index] <= viewportTop) {
					latestPassedIndex = index;
				}
			}

			const scrollableDistance = scrollingElement.scrollHeight - window.innerHeight;
			const isAtBottom = scrollableDistance <= 0 || window.scrollY >= scrollableDistance - 1;
			const activeIndex = isAtBottom ? tocHeadings.length - 1 : Math.max(latestPassedIndex, 0);

			setPassedHeadingIndex(isAtBottom ? tocHeadings.length - 1 : latestPassedIndex);
			setActiveHeadingId(tocHeadings[activeIndex]?.id ?? "");
		};

		updateReadingProgress();
		window.addEventListener("scroll", updateReadingProgress, { passive: true });
		window.addEventListener("resize", updateReadingProgress);

		return () => {
			window.removeEventListener("scroll", updateReadingProgress);
			window.removeEventListener("resize", updateReadingProgress);
		};
	}, [tocHeadings, searchResults]);

	return (
		<>
			{sidebarOpen && (
				<button
					type="button"
					aria-label="Close sidebar"
					className="lg:hidden fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
					onClick={onCloseSidebar}
				/>
			)}

			<aside
				className={cn(
					"fixed top-0 left-0 z-50 h-screen w-64 bg-default-100 border-default-100 transform transition-transform duration-200 ease-out",
					"lg:translate-x-0 lg:z-20 lg:shadow-none",
					sidebarOpen ? "translate-x-0 shadow-xl" : "-translate-x-full",
				)}
			>
				<div className="relative flex h-full flex-col">
					<div className="px-6 h-16 flex items-center justify-between w-full border-b border-default-200">
						<div className="min-w-0 flex-1">
							<p className="text-sm font-bold text-foreground leading-tight truncate">{title}</p>
						</div>
						<button
							type="button"
							onClick={onCloseSidebar}
							className="text-default-800 cursor-pointer transition-colors lg:hidden"
							aria-label="Close menu"
						>
							<X size={24} />
						</button>
					</div>

					<nav className="flex-1 overflow-y-auto py-6 pb-16">
						<div className="flex flex-col gap-1">
							<div className="px-3">
								{sections.map((section) => (
									<button
										key={section.id}
										type="button"
										onClick={() => onSelectSection(section.id)}
										className={cn(
											"w-full text-left px-4 py-2 mb-1 rounded-full text-[12px] font-semibold transition-colors cursor-pointer",
											currentId === section.id && !searchResults
												? "bg-primary/75 text-white"
												: "text-default-500 hover:bg-default-200 hover:text-foreground",
										)}
									>
										{section.title}
									</button>
								))}
							</div>
						</div>

						{sections.length === 0 && (
							<div className="px-7 py-4 text-sm text-default-600">No pages found.</div>
						)}
					</nav>

					{tocHeadings.length > 0 && (
						<div className="absolute inset-x-0 bottom-0 z-30 border-t border-default-200 bg-default-100/95 backdrop-blur-sm">
							<button
								type="button"
								onClick={() => setTocOpen((value) => !value)}
								aria-expanded={tocOpen}
								aria-controls="toc-panel"
								className="flex cursor-pointer w-full items-center justify-between px-6 py-2 text-left"
							>
								<p className="text-xs font-semibold uppercase tracking-wide text-default-400">
									Table of contents
								</p>
								<ChevronUp
									className={cn(
										"h-4 w-4 shrink-0 text-default-500 transition-transform",
										tocOpen && "rotate-180",
									)}
								/>
							</button>
							<div
								className={cn(
									"relative transition-[max-height,opacity] duration-200",
									tocOpen ? "max-h-64 opacity-100" : "max-h-0 opacity-0",
								)}
							>
								<div className="pointer-events-none absolute top-0 inset-x-0 h-6 z-10 bg-gradient-to-b from-default-100/95 to-transparent" />
								<div className="pointer-events-none absolute bottom-0 inset-x-0 h-6 z-10 bg-gradient-to-t from-default-100/95 to-transparent" />
								<div
									id="toc-panel"
									ref={tocPanelRef}
							onPointerDown={handleTocPointerDown}
							onPointerMove={handleTocPointerMove}
							onPointerUp={finishTocPointerInteraction}
							onPointerCancel={finishTocPointerInteraction}
							onLostPointerCapture={finishTocPointerInteraction}
							onClickCapture={handleTocClickCapture}
									className={cn(
										"overflow-y-auto overflow-x-hidden max-h-64 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden",
										isTocDragging ? "cursor-grabbing select-none" : "cursor-grab",
									)}
									style={{ touchAction: "pan-y" }}
								>
									<div className="relative isolate px-8 pb-6">
										<span
											aria-hidden="true"
											className="pointer-events-none absolute left-[39.5px] top-4 bottom-10 z-0 w-px bg-default-200"
										/>
										{!searchResults && activeHeadingIndex >= 0 && tocHeadings.length > 1 && (
											<span
												aria-hidden="true"
												className="pointer-events-none absolute left-[39.5px] top-4 z-0 w-px bg-primary transition-[height] duration-300"
												style={{
													height: `calc(${activeHeadingIndex} / ${Math.max(tocHeadings.length - 1, 1)} * (100% - 3.5rem))`,
												}}
											/>
										)}
										{tocHeadings.map((heading, index) => {
											const isActive = activeHeadingId === heading.id && !searchResults;
											const isReached = searchResults ? false : index <= passedHeadingIndex;

											return (
												<div key={heading.id}>
													<button
														type="button"
														onClick={() => onSelectHeading(`#${heading.id}`)}
														aria-current={isActive ? "location" : undefined}
														className={cn(
															"group relative z-10 grid w-full grid-cols-[1rem_minmax(0,1fr)] items-center gap-3 py-2 text-left text-xs transition-colors cursor-pointer focus-visible:outline-none",
															isActive ? "text-foreground" : "text-default-500 hover:text-foreground",
														)}
													>
														<span
															aria-hidden="true"
															className={cn(
																"inline-flex h-1.5 w-1.5 justify-self-center shrink-0 rounded-full transition-colors",
																isReached ? "bg-primary" : "bg-default-300",
															)}
														/>
														<span className="truncate font-medium group-focus-visible:outline group-focus-visible:outline-1 group-focus-visible:outline-primary group-focus-visible:rounded">
															{heading.text}
														</span>
													</button>
												</div>
											);
										})}
									</div>
								</div>
							</div>
						</div>
					)}
				</div>
			</aside>
		</>
	);
}
