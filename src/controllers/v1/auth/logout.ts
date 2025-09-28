import logger from '@/lib/winston';
import config from '@/config';

import Token from '@/models/token';

import type { Request, Response } from 'express';
import user from '@/models/user';

const logout = async (req: Request, res: Response) => {
    try {
        const refreshToken = req.cookies.refreshToken as string;
        if (refreshToken) {
            await Token.deleteOne({ token: refreshToken });
            logger.info(`User logged out: ${req.userId}`);
        }
        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: config.NODE_ENV === 'production',
            sameSite: 'strict',
        });
        res.sendStatus(204);
        logger.info('User logged out successfully', {
            userId: req.userId,
        });
    } catch (error) {
        res.status(500).json({
            code: 'server error',
            message: 'Internal Server Error',
            err: error,
        });
        logger.error(`Logout error: ${error}`);
    }
};

export default logout;
