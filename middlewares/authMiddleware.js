import jwt from 'jsonwebtoken';
import User from '../schema/userSchema.js';
import dotenv from 'dotenv';

dotenv.config();
const secretKey = process.env.JWT_SECRET;

export const authenticateJWT = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ message: 'Access token is missing.' });

    try {
        const decoded = jwt.verify(token, secretKey);
        const user = await User.findById(decoded.id).select('-password'); // Excluyo la contraseña

        if (!user) return res.status(404).json({ message: 'User not found' });

        //? Verificar si el token fue emitido antes de la última fecha de login
        if (decoded.lastLogin !== user.lastLogin.toISOString()) {
            return res.status(403).json({ message: 'Token has been revoked' });
        }

        req.user = user;

        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(403).json({ message: 'Token has expired' });
        } else if (error.name === 'JsonWebTokenError') {
            return res.status(403).json({ message: 'Token is invalid' });
        } else {
            return res.status(403).json({ message: 'Authentication failed' });
        }
    }
};
