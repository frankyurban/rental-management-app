const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:5050/api/:path*'
      },
    ];
  },
};

export default nextConfig; // if using TypeScript/ESM