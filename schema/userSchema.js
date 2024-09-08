import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    nickname: {
        type: String,
        required: [true, 'Nickname is required'],
        trim: true,
        unique: true
    },
    firstName: {
        type: String,
        required: [true, 'First name is required'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: [true, 'Password is required']
    },
    profilePicture: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    lastLogin: {
        type: Date
    }
}, { collection: 'users', versionKey: false });

const User = mongoose.model('User', userSchema);

export default User;
