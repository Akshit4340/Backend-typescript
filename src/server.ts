import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import compression from 'compression';

import type { CorsOptions } from 'cors';

import config from '@/config';
import limiter from '@/lib/express-rate-limit';
import v1Routes from '@/routes/v1/routes';
import { connectDb, disconnectDb } from '@/lib/mongoose';
import logger from '@/lib/winston';

const app = express();
const corsOptions: CorsOptions = {
    origin(origin, callback) {
        if (
            config.NODE_ENV === 'development' ||
            !origin ||
            config.WHITELISTED_ORIGINS.includes(origin)
        ) {
            callback(null, true);
        } else {
            callback(new Error('CORS Error'), false);
            logger.warn(`CORS Error: ${origin} is not allowed`);
        }
    },
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
    compression({
        threshold: 1024,
    })
);
app.use(helmet());
app.use(limiter);

(async () => {
    // Your async code here

    try {
        await connectDb();
        app.use('/api/v1', v1Routes);

        // Fallback for unmatched routes (helps debug 404s)

        app.listen(config.port, () => {
            logger.info(
                `Server is running on port http://localhost:${config.port}`
            );
        });
    } catch (error) {
        logger.error('Error starting server:', error);
        if (config.NODE_ENV === 'production') {
            process.exit(1);
        }
    }
})();

const handleShutdown = async () => {
    try {
        await disconnectDb();
        logger.warn('Server SHUTDOWN');
        process.exit(0);
    } catch (error) {
        logger.error('Error shutting down server:', error);
    }
};

process.on('SIGINT', handleShutdown);
process.on('SIGTERM', handleShutdown);
