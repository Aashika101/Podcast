/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol:'https', 
                hostname: 'diligent-butterfly-405.convex.cloud',
            },
            {
                protocol:'https', 
                hostname: 'img.clerk.com',
            }
        ]
    }
};

export default nextConfig;
