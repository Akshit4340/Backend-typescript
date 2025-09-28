import dotenv from 'dotenv';

dotenv.config();

import ms from 'ms';

const config = {
    port: process.env.PORT || 3000,
    NODE_ENV: process.env.NODE_ENV,
    WHITELISTED_ORIGINS: ['https://api.blogs.com'],
    MONGO_URI: process.env.MONGO_URI,
    LOG_LEVEL: process.env.LOG_LEVEL || 'info',
    JWT_SECRET: process.env.JWT_SECRET as ms.StringValue,
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET as ms.StringValue,
    TOKEN_EXPIRE_TIME: process.env.TOKEN_EXPIRE_TIME as ms.StringValue,
    REFRESH_TOKEN_EXPIRE_TIME: process.env
        .REFRESH_TOKEN_EXPIRE_TIME as ms.StringValue,
    WHITELIST_EMAILS: [
        'akshitmeshram15@gmail.com',
        'meshramakshit15@ggmail.com',
    ],
};

export default config;
