import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();
const uri = process.env.MONGO_URI;

export async function connectToDatabase() {
    try {
        await mongoose.connect(uri);
        console.log('Connected to MongoDB with Mongoose');
    } catch (error) {
        console.error('Error connecting to database with Mongoose:', error);
        throw error;
    }
}

export async function checkDatabaseStatus() {
    const connectionState = mongoose.connection.readyState;

    switch (connectionState) {
        case 0:
            return { status: 'disconnected' };
        case 1:
            return { status: 'connected' };
        case 2:
            return { status: 'connecting' };
        case 3:
            return { status: 'disconnecting' };
        default:
            return { status: 'unknown' };
    }
}
