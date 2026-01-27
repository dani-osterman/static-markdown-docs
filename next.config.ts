import type { NextConfig } from "next";

// assetPrefix "./" is required for static export (relative paths for file:// serving)
// but breaks HMR in dev, so only apply it during build
const nextConfig: NextConfig = {
	output: "export",
	trailingSlash: true,
	...(process.env.NODE_ENV !== "development" && { assetPrefix: "./" }),
	images: {
		unoptimized: true,
	},
};

export default nextConfig;
