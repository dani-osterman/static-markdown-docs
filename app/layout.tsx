import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../styles/globals.css";

const inter = Inter({
	subsets: ["latin"],
	display: "swap",
	variable: "--font-inter",
});

export const metadata: Metadata = {
	title: {
		default: "Static markdown docs",
		template: "%s | Static markdown docs",
	},
	description:
		"A minimal, statically generated documentation site built with Next.js and Markdown.",
	metadataBase: new URL("https://example.com"),
	openGraph: {
		title: "Static markdown docs",
		description:
			"A minimal, statically generated documentation site built with Next.js and Markdown.",
		type: "website",
		locale: "en_US",
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" className={inter.variable} suppressHydrationWarning>
			<body className="font-sans bg-default-50">{children}</body>
		</html>
	);
}
