/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        serverComponentsHmrCache: false, // default to true
    },

    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: "jjrsnrxflbndscqbgmvw.supabase.co",
            },
        ],
    },
};

export default nextConfig;