import { Router } from 'express';
import { body, cookie } from 'express-validator';
import register from '@/controllers/v1/auth/register';
import login from '@/controllers/v1/auth/login';
import refreshToken from '@/controllers/v1/auth/refreshToken';
import logout from '@/controllers/v1/auth/logout';
import validateRequest from '@/middlewares/validationErrors';
import authenticate from '@/middlewares/authenticate';

import User from '@/models/user';
import bcrypt from 'bcrypt';

const router = Router();

router.post(
    '/register',
    body('email')
        .isEmail()
        .trim()
        .withMessage('Invalid email format')
        .custom(async (email) => {
            const user = await User.findOne({ email });
            if (user) {
                throw new Error('Email already in use');
            }
        }),
    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long'),
    body('role')
        .isIn(['user', 'admin'])
        .withMessage('Role must be either user or admin'),
    validateRequest,
    register
);
router.post(
    '/login',
    body('email')
        .trim()
        .notEmpty()
        .withMessage('Email is required')
        .isLength({ max: 50 })
        .withMessage('Email must be at most 50 characters long')
        .isEmail()
        .withMessage('Invalid email format')
        .custom(async (email) => {
            const user = await User.findOne({ email });
            if (!user) {
                throw new Error('User not found');
            }
        }),
    body('password')
        .notEmpty()
        .withMessage('Password is required')
        .custom(async (value, { req }) => {
            const { email } = req.body as { email: string };
            const user = await User.findOne({ email })
                .select('password')
                .lean()
                .exec();
            if (!user) {
                throw new Error('Email or password is incorrect');
            }
            const isMatch = await bcrypt.compare(value, user.password);
            if (!isMatch) {
                throw new Error('Email or password is incorrect');
            }
        }),
    validateRequest,
    login
);
router.post(
    '/refresh-token',
    cookie('refreshToken')
        .notEmpty()
        .withMessage('Refresh token is required')
        .isJWT()
        .withMessage('Invalid refresh token format'),
    validateRequest,
    refreshToken
);
router.post('/logout', authenticate, logout);
export default router;
