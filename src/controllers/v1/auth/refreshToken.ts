import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';

import logger from '@/lib/winston';
import { verifyRefreshToken, generateAccessToken } from '@/lib/jwt';

import Token from '@/models/token';

import type { Request, Response } from 'express';
import { Types } from 'mongoose';

const refreshToken = async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken as string;
    try {
        const tokenExists = await Token.exists({ token: refreshToken });
        if (!tokenExists) {
            return res.status(401).json({
                code: 'UNAUTHORIZED',
                message: 'Invalid refresh token',
            });
        }
        const jwtPayload = verifyRefreshToken(refreshToken) as {
            userId: Types.ObjectId;
        };
        const accessToken = generateAccessToken(jwtPayload.userId);
        res.status(200).json({
            accessToken,
        });
    } catch (error) {
        if (error instanceof TokenExpiredError) {
            return res.status(401).json({
                code: 'TOKEN_EXPIRED',
                message: 'Refresh token has expired',
            });
        }
        if (error instanceof JsonWebTokenError) {
            return res.status(401).json({
                code: 'INVALID_TOKEN',
                message: 'Refresh token is invalid',
            });
        }
        res.status(500).json({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'An error occurred while refreshing the token',
            error: error,
        });
        logger.error('Error in refreshToken:', { error });
    }
};

export default refreshToken;
