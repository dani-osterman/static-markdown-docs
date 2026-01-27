import type React from "react";
import NextImage from "next/image";
import ReactMarkdown from "react-markdown";
import { CodeBlock } from "@/components/code-block";

export const markdownComponents: React.ComponentProps<
	typeof ReactMarkdown
>["components"] = {
	pre({ children }) {
		return <CodeBlock>{children}</CodeBlock>;
	},
	img({ src, alt, width, height, className }) {
		return (
			<NextImage
				src={(src as string) ?? ""}
				alt={alt ?? ""}
				width={Number(width) || 800}
				height={Number(height) || 600}
				className={className}
				sizes="(max-width: 768px) 100vw, 768px"
			/>
		);
	},
};

