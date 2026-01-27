"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export function ThemeToggle() {
	const [isDark, setIsDark] = useState(false);

	useEffect(() => {
		const saved = localStorage.getItem("theme");
		const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
		const dark = saved === "dark" || (saved === null && prefersDark);
		setIsDark(dark);
		document.documentElement.classList.toggle("dark", dark);
	}, []);

	const toggle = () => {
		const next = !isDark;
		setIsDark(next);
		document.documentElement.classList.toggle("dark", next);
		localStorage.setItem("theme", next ? "dark" : "light");
	};

	const lightButtonClass = `flex h-9 w-9 items-center justify-center rounded-full transition-colors cursor-pointer ${
		isDark ? "text-default-500 hover:text-foreground hover:bg-default-100/70" : "bg-background text-foreground shadow"
	}`;
	const darkButtonClass = `flex h-9 w-9 items-center justify-center rounded-full transition-colors cursor-pointer ${
		isDark ? "bg-background text-foreground shadow" : "text-default-500 hover:text-foreground hover:bg-default-100/70"
	}`;

	return (
		<div
			role="group"
			aria-label="Theme selector"
			className="inline-flex items-center gap-1 rounded-full bg-default-200/80 p-0.5 shadow-sm"
		>
			<button
				type="button"
				onClick={() => {
					if (!isDark) {
						return;
					}
					toggle();
				}}
				className={lightButtonClass}
				aria-label="Switch to light mode"
				aria-pressed={!isDark}
			>
				<Sun size={16} />
			</button>
			<button
				type="button"
				onClick={() => {
					if (isDark) {
						return;
					}
					toggle();
				}}
				className={darkButtonClass}
				aria-label="Switch to dark mode"
				aria-pressed={isDark}
			>
				<Moon size={16} />
			</button>
		</div>
	);
}
