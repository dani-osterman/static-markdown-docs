"use client";

import { Check, Copy } from "lucide-react";
import { type ReactNode, isValidElement, useState } from "react";

function extractText(node: ReactNode): string {
	if (typeof node === "string") return node;
	if (typeof node === "number") return String(node);
	if (Array.isArray(node)) return node.map(extractText).join("");
	if (isValidElement(node)) {
		return extractText((node.props as { children?: ReactNode }).children);
	}
	return "";
}

function extractLanguage(children: ReactNode): string {
	if (!isValidElement(children)) return "";
	const className = (children.props as { className?: string }).className ?? "";
	const match = className.match(/language-(\w+)/);
	return match ? match[1] : "";
}

interface CodeBlockProps {
	children: ReactNode;
}

export function CodeBlock({ children }: CodeBlockProps) {
	const [copied, setCopied] = useState(false);
	const language = extractLanguage(children);
	const text = extractText(children);

	const handleCopy = async () => {
		await navigator.clipboard.writeText(text.trimEnd());
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	return (
		<div className="not-prose my-6 overflow-hidden rounded-xl border border-default-200">
			<div className="flex items-center justify-between border-b border-default-200 bg-default-200 px-3 py-2">
				<span className="font-mono text-xs font-semibold uppercase tracking-wide text-default-500">
					{language || "code"}
				</span>
				<button
					type="button"
					onClick={handleCopy}
					className="flex cursor-pointer items-center gap-1.5 text-xs text-default-500 transition-colors hover:text-foreground"
					aria-label="Copy code"
				>
					{copied ? <Check size={13} /> : <Copy size={13} />}
					<span>{copied ? "Copied!" : "Copy"}</span>
				</button>
			</div>
			<pre className="m-0 overflow-x-auto rounded-none bg-default-100 px-5 text-sm text-default-800">
				{children}
			</pre>
		</div>
	);
}
