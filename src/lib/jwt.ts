import jwt from 'jsonwebtoken';
import config from '@/config';
import { Types } from 'mongoose';

export const generateAccessToken = (userId: Types.ObjectId): string => {
    return jwt.sign({ userId }, config.JWT_SECRET, {
        expiresIn: config.TOKEN_EXPIRE_TIME,
        subject: 'access',
    });
};

export const generateRefreshToken = (userId: Types.ObjectId): string => {
    return jwt.sign({ userId }, config.JWT_REFRESH_SECRET, {
        expiresIn: config.REFRESH_TOKEN_EXPIRE_TIME,
        subject: 'refresh',
    });
};

export const verifyAccessToken = (token: string) => {
    return jwt.verify(token, config.JWT_SECRET);
};
export const verifyRefreshToken = (token: string) => {
    return jwt.verify(token, config.JWT_REFRESH_SECRET);
};
