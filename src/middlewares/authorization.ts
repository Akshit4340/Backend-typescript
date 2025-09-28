import logger from '@/lib/winston';
import User from '@/models/user';
import type { Request, Response, NextFunction } from 'express';
export type AuthRole = 'user' | 'admin';

const authorize = (roles: AuthRole[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const userId = req.userId;

        try {
            const user = await User.findById(userId).select('role').exec();
            if (!user) {
                return res
                    .status(404)
                    .json({ code: 'not-found', message: 'user not found' });
            }
            if (!roles.includes(user.role)) {
                return res
                    .status(403)
                    .json({ code: 'forbidden', message: 'access denied' });
            }
            return next();
        } catch (error) {
            res.status(500).json({
                code: 'internal-server-error',
                message: 'Error in authorization middleware',
            });
            logger.error(`Error in authorization middleware: ${error}`);
        }
    };
};

export default authorize;
