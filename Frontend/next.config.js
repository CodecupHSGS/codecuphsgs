/** @type {import('next').NextConfig} */

const BACKEND_URL = process.env.BACKEND_URL; 
console.log(BACKEND_URL)
module.exports = () => {
    const rewrites = () => {
        return [
        {
            source: "/api/:path*",
            destination: `${BACKEND_URL}/:path*` // proxyto backend
        },
        ];
    };
    return {
        rewrites,
    };
};
  