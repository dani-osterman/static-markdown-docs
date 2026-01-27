import { Menu } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";
import { Search } from "./search";
import { cn } from "@/lib/helpers";

type TopbarProps = {
	searchPlaceholder: string;
	searchQuery: string;
	onSearchQueryChange: (value: string) => void;
	onOpenSidebar: () => void;
};

export function Topbar({
	searchPlaceholder,
	searchQuery,
	onSearchQueryChange,
	onOpenSidebar,
}: TopbarProps) {
	return (
		<header
			className={cn(
				"fixed top-0 left-0 lg:left-64 right-0 z-30 h-16 bg-background/50 backdrop-blur-sm",
			)}
		>
			<div className="mx-auto flex h-full w-full max-w-3xl items-center gap-2 px-6 lg:px-8">
				<button
					type="button"
					onClick={onOpenSidebar}
					className="lg:hidden mr-3 text-default-800 hover:text-default-400 cursor-pointer transition-colors shrink-0"
					aria-label="Open menu"
				>
					<Menu size={20} />
				</button>
				<div className="flex flex-1 min-w-0 items-center gap-2">
					<Search
						placeholder={searchPlaceholder}
						query={searchQuery}
						onQueryChange={onSearchQueryChange}
					/>
					<ThemeToggle />
				</div>
			</div>
		</header>
	);
}
