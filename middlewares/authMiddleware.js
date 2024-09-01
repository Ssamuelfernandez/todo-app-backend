import jwt from 'jsonwebtoken';
import { User } from '../schema/userSchema.js';

const secretKey = process.env.JWT_SECRET;

export const authenticateJWT = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ message: 'Access token is missing or invalid.' });

    try {
        const decoded = jwt.verify(token, secretKey);
        req.user = await User.findById(decoded.userId).select('-password'); // Excluye la contraseña

        console.log('Decoded Token:', decoded);
        console.log('User from DB:', req.user);

        if (!req.user) return res.status(404).json({ message: 'User not found' });

        next();
    } catch (error) {
        return res.status(403).json({ message: 'Invalid token' });
    }
};
