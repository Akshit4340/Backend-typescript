import express from 'express';
import authRoutes from '@/routes/v1/auth';

import userRoutes from '@/routes/v1/user';

const router = express.Router();

router.get('/', (req, res) => {
    res.status(200).json({
        message: 'API is running',
        status: 'ok',
        version: '1.0.0',
        timestamp: new Date().toISOString(),
    });
});
router.use('/auth', authRoutes);
router.use('/users', userRoutes);

export default router;
