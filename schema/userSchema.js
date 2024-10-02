import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    nickname: {
        type: String,
        required: [true, 'Nickname is required'],
        trim: true,
        minlength: [3, 'Nickname must be at least 3 characters long'],
        maxlength: [10, 'Nickname cannot exceed 10 characters']
    },
    name: {
        type: String,
        required: [true, 'First name is required'],
        trim: true,
        minlength: [3, 'First name must be at least 3 characters long'],
        maxlength: [10, 'First name cannot exceed 10 characters']
    },
    surname: {
        type: String,
        required: [true, 'Surname is required'],
        trim: true,
        minlength: [3, 'Surname must be at least 3 characters long'],
        maxlength: [10, 'Surname cannot exceed 50 characters']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters long']
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    verificationToken: {
        type: String
    },
    verificationExpires: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    lastLogin: {
        type: Date
    },
    resetPasswordToken: {
        type: String
    },
    resetPasswordExpires: {
        type: Date
    }

}, { collection: 'users', versionKey: false });

userSchema.pre('save', async function (next) {
    const user = this;

    if (!user.isModified('password')) return next();

    try {
        // Verificar si el email ya existe
        const existingEmail = await User.findOne({ email: user.email });

        // Si existe un usuario con ese email y no es el usuario actual (por _id)
        if (existingEmail && existingEmail._id.toString() !== user._id.toString()) {
            return next(new Error('Email is already in use.'));
        }

        // Encriptar la contraseña
        const hashedPassword = await bcrypt.hash(user.password, 10);
        user.password = hashedPassword;

        next();
    } catch (error) {
        return next(error);
    }
});

const User = mongoose.model('User', userSchema);

export default User;
