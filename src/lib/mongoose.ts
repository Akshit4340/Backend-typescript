import mongoose from 'mongoose';
import config from '@/config';
import type { ConnectOptions } from 'mongoose';
import logger from './winston';

const clientOptions: ConnectOptions = {
    dbName: 'blog-db',
    appName: 'blog-api',
    serverApi: {
        version: '1',
        strict: true,
        deprecationErrors: true,
    },
};

export const connectDb = async (): Promise<void> => {
    if (!config.MONGO_URI) {
        throw new Error(
            'MONGO_URI is not defined in the environment variables'
        );
    }
    try {
        await mongoose.connect(config.MONGO_URI, clientOptions);
        logger.info('Connected to MongoDB');
    } catch (error) {
        if (error instanceof Error) {
            logger.error('Error connecting to MongoDB:', error.message);
        }
    }
};

export const disconnectDb = async (): Promise<void> => {
    try {
        await mongoose.disconnect();
        logger.info('Disconnected from MongoDB');
    } catch (error) {
        if (error instanceof Error) {
            logger.error('Error disconnecting from MongoDB:', error.message);
        }
    }
};
