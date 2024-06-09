/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        // declare here all your variables
        HOST: process.env.HOST,
        JWT_SECRET: process.env.JWT_SECRET,
        STRAVA_HOST: process.env.STRAVA_HOST,
        STRAVA_CLIENT_ID: process.env.STRAVA_CLIENT_ID,
        STRAVA_CLIENT_SECRET: process.env.STRAVA_CLIENT_SECRET,
        STRAVA_MONGODB_DSN: process.env.STRAVA_MONGODB_DSN
    }
};

export default nextConfig;
