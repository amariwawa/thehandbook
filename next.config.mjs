/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/curriculum',
        destination: '/practice/custom',
        permanent: true,
      },
    ];
  },
};
export default nextConfig;
