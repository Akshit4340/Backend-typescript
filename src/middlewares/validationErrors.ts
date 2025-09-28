import { validationResult } from 'express-validator';
import { Response, Request, NextFunction } from 'express';


const validateRequest = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            code: 'validation error',
            message: 'Invalid request data',
            errors: errors.array(),
        });
    }
    next();
};

export default validateRequest;
