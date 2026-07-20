/** @type {import('next').NextConfig} */
const repo = process.env.GITHUB_REPOSITORY?.split("/")[1];
const nextConfig = {
  reactStrictMode: true,
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  ...(repo ? { basePath: `/${repo}`, assetPrefix: `/${repo}` } : {}),
};

export default nextConfig;
