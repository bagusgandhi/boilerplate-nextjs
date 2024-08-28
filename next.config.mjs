/** @type {import('next').NextConfig} */
const nextConfig = {
    serverRuntimeConfig: {
      APP_ENV: process.env.APP_ENV,
      BE_API_HOST: process.env.BE_API_HOST
  },
  publicRuntimeConfig: {
      NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
};

export default nextConfig;
