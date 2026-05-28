/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/curriculum',
        destination: '/practice/custom',
        permanent: true,
      },
      {
        source: '/about',
        destination: '/company',
        permanent: true,
      },
    ];
  },
};
export default nextConfig;
