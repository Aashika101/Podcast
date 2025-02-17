/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol:'https', 
                hostname: 'lovely-flamingo-139.convex.cloud'
            },
            {
                protocol:'https', 
                hostname: 'diligent-butterfly-405.convex.cloud',
            }
        ]
    }
};

export default nextConfig;
