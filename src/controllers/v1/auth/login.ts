import { generateAccessToken, generateRefreshToken } from '@/lib/jwt';
import logger from '@/lib/winston';
import config from '@/config';

import User from '@/models/user';
import Token from '@/models/token';

import type { Request, Response } from 'express';
import type { IUser } from '@/models/user';

type UserData = Pick<IUser, 'email' | 'password'>;

const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email } = req.body as UserData;
        const user = await User.findOne({ email })
            .select('username email password role')
            .lean()
            .exec();
        if (!user) {
            res.status(404).json({
                code: 'not_found',
                message: 'User not found',
            });
            return;
        }
        const accessToken = generateAccessToken(user._id);
        const refreshToken = generateRefreshToken(user._id);
        await Token.create({ token: refreshToken, userId: user._id });
        logger.info('New User Created', {
            userId: user._id,
            Token: refreshToken,
        });
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: config.NODE_ENV === 'production',
            sameSite: 'strict',
        });
        res.status(200).json({
            message: 'User LoggedIn',
            user: {
                username: user.username,
                email: user.email,
                role: user.role,
            },
            accessToken,
        });
        logger.info('User has logged in', {
            userId: user._id,
            Token: refreshToken,
        });
    } catch (error) {
        res.status(500).json({
            code: 'server error',
            message: 'Internal Server Error',
            err: error,
        });
        logger.error(`Login error: ${error}`);
    }
};

export default login;
