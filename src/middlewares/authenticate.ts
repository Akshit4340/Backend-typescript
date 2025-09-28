import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';

import { verifyAccessToken } from '@/lib/jwt';
import logger from '@/lib/winston';

import type { Request, Response, NextFunction } from 'express';
import type { Types } from 'mongoose';

const authenticate = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
        res.status(401).json({
            code: 'unauthorized',
            message: 'access denied',
        });
        return;
    }
    const token = authHeader.split(' ')[1];

    try {
        const payload = verifyAccessToken(token) as { userId: Types.ObjectId };

        req.userId = payload.userId;

        return next();
    } catch (error) {
        if (error instanceof TokenExpiredError) {
            res.status(401).json({
                code: 'unauthorized',
                message: 'access token expired',
            });
            return;
        }
        if (error instanceof JsonWebTokenError) {
            res.status(401).json({
                code: 'unauthorized',
                message: 'invalid access token',
            });
            return;
        }
        res.status(500).json({
            code: 'server error',
            message: 'authenticate error',
            err: error,
        });
        logger.error(`Authenticate error: ${error}`);
    }
};

export default authenticate;
