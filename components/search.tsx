import { Search as SearchIcon, X } from "lucide-react";

type SearchProps = {
	placeholder: string;
	query: string;
	onQueryChange: (value: string) => void;
};

export function Search({ placeholder, query, onQueryChange }: SearchProps) {
	return (
		<div className="relative min-w-0 flex-1">
			<SearchIcon
				size="16"
				className="absolute left-2.5 top-1/2 -translate-y-1/2 text-default-600 pointer-events-none"
			/>
			<input
				type="text"
				placeholder={placeholder}
				className="rounded-full w-full text-default-600 bg-default-200/75 hover:bg-default-200 focus:border-primary focus:outline-none px-10 py-2.5 text-sm border-default-200"
				value={query}
				onChange={(event) => onQueryChange(event.target.value)}
			/>
			{query && (
				<button
					type="button"
					onClick={() => onQueryChange("")}
					className="absolute right-3 top-1/2 -translate-y-1/2 text-default-400 hover:text-foreground cursor-pointer rounded-full p-0.5"
					aria-label="Clear search"
				>
					<X size="20" />
				</button>
			)}
		</div>
	);
}
