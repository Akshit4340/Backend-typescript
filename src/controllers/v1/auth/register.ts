import logger from '@/lib/winston';
import config from '@/config';
import User from '@/models/user';
import token from '@/models/token';
import { getUsername } from '@/utils/index';
import type { IUser } from '@/models/user';
import { generateAccessToken, generateRefreshToken } from '@/lib/jwt';

import type { Request, Response } from 'express';

type UserData = Pick<IUser, 'username' | 'email' | 'password' | 'role'>;

const register = async (req: Request, res: Response) => {
    const { email, password, role } = req.body as UserData;
    console.log({ email, password, role });
    if (role === 'admin' && !config.WHITELIST_EMAILS.includes(email)) {
        res.status(403).json({
            code: 'forbidden',
            message: 'Email not whitelisted',
        });
        logger.warn(`Registration attempt failed: ${email} is not whitelisted`);
        return;
    }

    try {
        const newUser = await User.create({
            username: getUsername(),
            email,
            password,
            role,
        });
        const accessToken = generateAccessToken(newUser._id);
        const refreshToken = generateRefreshToken(newUser._id);
        await token.create({ token: refreshToken, userId: newUser._id });
        logger.info(
            `New refresh token created: ${JSON.stringify({ token: refreshToken, username: newUser.username })}`
        );
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
        });
        res.status(201).json({
            user: newUser,
            accessToken,
        });
        logger.info(`New user registered: ${newUser}`);
    } catch (error) {
        res.status(500).json({
            code: 'server error',
            message: 'Internal Server Error',
            err: error,
        });
        logger.error(`Error occurred during registration: ${error}`);
    }
};
export default register;
