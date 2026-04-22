const hiddenMenuEditorPath = '/bk-menu-editor-7d3f9a8c'

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  async headers() {
    const hiddenEditorHeaders = [
      {
        key: 'X-Robots-Tag',
        value: 'noindex, nofollow, noarchive',
      },
      {
        key: 'Cache-Control',
        value: 'no-store',
      },
    ]

    return [
      {
        source: hiddenMenuEditorPath,
        headers: hiddenEditorHeaders,
      },
      {
        source: `${hiddenMenuEditorPath}/:path*`,
        headers: hiddenEditorHeaders,
      },
    ]
  },
  async rewrites() {
    return [
      {
        source: hiddenMenuEditorPath,
        destination: `${hiddenMenuEditorPath}/index.html`,
      },
    ]
  },
}

export default nextConfig
