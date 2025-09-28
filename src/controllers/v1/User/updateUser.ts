import logger from '@/lib/winston';
import User from '@/models/user';
import type { Request, Response } from 'express';

const updateUser = async (req: Request, res: Response): Promise<void> => {
    const userId = req.userId;
    const {
        username,
        email,
        password,
        first_name,
        last_name,
        website,
        facebook,
        instagram,
        linkedIn,
        x,
        youtube,
    } = req.body;
    try {
        const user = await User.findById(userId)
            .select('+password -__v')
            .exec();
        if (!user) {
            res.status(404).json({
                code: 'not-found',
                message: 'User not found',
            });
            return;
        }
        if (username) user.username = username;
        if (email) user.email = email;
        if (password) user.password = password;
        if (first_name) user.firstName = first_name;
        if (last_name) user.lastName = last_name;
        if (!user.socials) {
            user.socials = {};
        }
        if (website) user.socials.website = website;
        if (facebook) user.socials.facebook = facebook;
        if (instagram) user.socials.instagram = instagram;
        if (linkedIn) user.socials.linkedIn = linkedIn;
        if (x) user.socials.x = x;
        if (youtube) user.socials.youtube = youtube;
        await user.save();
        logger.info(`User updated successfully: ${userId}`);
        res.status(200).json({
            code: 'success',
            message: 'User updated successfully',
        });
    } catch (error) {
        res.status(500).json({
            code: 'internal-server-error',
            message: 'Error updating user',
        });
        logger.error(`Error updating user: ${error}`);
    }
};

export default updateUser;
