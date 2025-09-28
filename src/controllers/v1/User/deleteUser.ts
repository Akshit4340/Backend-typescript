import logger from '@/lib/winston';
import User from '@/models/user';
import type { Request, Response } from 'express';

const deleteCurrentUser = async (
    req: Request,
    res: Response
): Promise<void> => {
    const userId = req.userId;

    try {
        const result = await User.deleteOne({ _id: userId });
        if (result.deletedCount === 0) {
            res.status(404).json({
                code: 'not-found',
                message: 'User not found',
            });
            return;
        }
        res.status(200).json({
            code: 'success',
            message: 'User deleted successfully',
        });
        logger.info(`User deleted successfully: ${userId}`);
    } catch (error) {
        res.status(500).json({
            code: 'internal-server-error',
            message: 'Error deleting user',
        });
        logger.error(`Error deleting user: ${error}`);
    }
};

export default deleteCurrentUser;
