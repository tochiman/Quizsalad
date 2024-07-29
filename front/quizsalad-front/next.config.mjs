/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  env:{
    API_FRONT: process.env.API_FRONT,
    API_BACK: process.env.API_BACK,
  }
};

export default nextConfig;
