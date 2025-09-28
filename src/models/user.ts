import { Schema, model } from 'mongoose';
import bcrypt from 'bcrypt';

export interface IUser {
    username: string;
    email: string;
    password: string;
    role: 'admin' | 'user';
    firstName?: string;
    lastName?: string;
    socials?: {
        facebook?: string;
        website?: string;
        instagram?: string;
        linkedIn?: string;
        x?: string;
        youtube?: string;
    };
}
const userSchema = new Schema<IUser>(
    {
        username: {
            type: String,
            required: [true, 'Username is required'],
            maxLength: [20, 'Username must not be less than 20 characters'],
            unique: [true, 'username should be unique'],
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: [true, 'Email must be unique'],
            maxLength: [50, 'Email must not be less than 50 characters'],
            validate: {
                validator: (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
                message: (props) => `${props.value} is not a valid email!`,
            },
        },
        password: {
            type: String,
            required: [true, 'Password is required'],
            minLength: [6, 'Password must be at least 6 characters'],
            select: false, // Exclude password field by default
        },
        role: {
            type: String,
            required: [true, 'Role is required'],
            enum: {
                values: ['admin', 'user'],
                message: '{VALUE} is not a valid role',
            },
            default: 'user',
        },
        firstName: {
            type: String,
            maxLength: [20, 'First name must not be less than 20 characters'],
        },
        lastName: {
            type: String,
            maxLength: [20, 'Last name must not be less than 20 characters'],
        },
        socials: {
            type: {
                facebook: {
                    type: String,
                    maxLength: [
                        100,
                        'Facebook URL must not be less than 100 characters',
                    ],
                },
                website: {
                    type: String,
                    maxLength: [
                        100,
                        'Website URL must not be less than 100 characters',
                    ],
                },
                instagram: {
                    type: String,
                    maxLength: [
                        100,
                        'Instagram URL must not be less than 100 characters',
                    ],
                },
                linkedIn: {
                    type: String,
                    maxLength: [
                        100,
                        'LinkedIn URL must not be less than 100 characters',
                    ],
                },
                x: {
                    type: String,
                    maxLength: [
                        100,
                        'X (Twitter) URL must not be less than 100 characters',
                    ],
                },
                youtube: {
                    type: String,
                    maxLength: [
                        100,
                        'YouTube URL must not be less than 100 characters',
                    ],
                },
            },
        },
    },
    { timestamps: true }
);

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

export default model<IUser>('User', userSchema);
