/** @type {import('next').NextConfig} */
const nextConfig = {
    async headers() {
        return [
            {
                source: "/sign-in",
                headers: [
                    {
                        key: "Cross-Origin-Embedder-Policy",
                        value: "unsafe-none",
                    },
                ],
            },
            {
                source: "/api/:path*",
                headers: [
                    { key: "Access-Control-Allow-Credentials", value: "true" },
                    { key: "Access-Control-Allow-Origin", value: "*" },
                    { key: "Access-Control-Allow-Methods", value: "GET,OPTIONS,PATCH,DELETE,POST,PUT" },
                    { key: "Access-Control-Allow-Headers", value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Origin, Content-MD5, Content-Type, Date, X-Api-Version,true" },
                    {
                        key: "Cross-Origin-Embedder-Policy",
                        value: "unsafe-none",
                    },
                ],
            }
        ];
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'lh3.googleusercontent.com'
            },
        ]
    },
};

export default nextConfig;