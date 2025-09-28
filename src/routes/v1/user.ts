import authenticate from '@/middlewares/authenticate';
import User from '@/models/user';
import getCurrentUser from '@/controllers/v1/User/getCurrentUser';
import { Router } from 'express';
import authorize from '@/middlewares/authorization';
import updateUser from '@/controllers/v1/User/updateUser';
import { body } from 'express-validator';
import validateRequest from '@/middlewares/validationErrors';
import deleteCurrentUser from '@/controllers/v1/User/deleteUser';

const router = Router();

router.get(
    '/current',
    authenticate,
    authorize(['user', 'admin']),
    getCurrentUser
);
router.put(
    '/current',
    authenticate,
    authorize(['user', 'admin']),
    body('username')
        .optional()
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage('Username must be between 2 and 100 characters')
        .custom(async (value, { req }) => {
            const user = await User.findOne({ username: value });
            if (user && user.id !== String(req.userId)) {
                throw new Error('Username is already taken');
            }
        }),
    body('email')
        .optional()
        .isEmail()
        .withMessage('Invalid email format')
        .custom(async (value, { req }) => {
            const user = await User.findOne({ email: value });
            if (user && user.id !== String(req.userId)) {
                throw new Error('Email is already taken');
            }
        }),
    body('password')
        .optional()
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long'),
    body('first_name')
        .optional()
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage('First name must be between 2 and 100 characters'),
    body('last_name')
        .optional()
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage('Last name must be between 2 and 100 characters'),
    body(['website', 'facebook', 'instagram', 'linkedIn', 'x', 'youtube'])
        .optional()
        .isURL()
        .withMessage('Invalid URL format')
        .isLength({ min: 2, max: 200 })
        .withMessage('URL must be between 2 and 200 characters'),
    validateRequest,
    updateUser
);
router.delete(
    '/current',
    authenticate,
    authorize(['user', 'admin']),
    deleteCurrentUser
);

export default router;
