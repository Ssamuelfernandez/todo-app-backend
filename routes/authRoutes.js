import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { AuthController } from '../controllers/authController.js';
import { authenticateJWT } from '../middlewares/authMiddleware.js';

export const authRouter = Router();

//? Limitar intentos de login/registro/recuperación para mitigar fuerza bruta y abuso de envío de emails
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, //? 15 minutos
    limit: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: 'Too many attempts, please try again later.' }
});

authRouter.post('/register', authLimiter, AuthController.register);
authRouter.post('/login', authLimiter, AuthController.login);
authRouter.post('/logout', authenticateJWT, AuthController.logout);
authRouter.get('/profile', authenticateJWT, AuthController.getProfile);
authRouter.post('/forgot-password', authLimiter, AuthController.forgotPassword);
authRouter.patch('/reset-password/:token', authLimiter, AuthController.resetPassword);
authRouter.patch('/change-password', authenticateJWT, AuthController.changePassword);
authRouter.get('/verify-email/:token', AuthController.verifyEmail);
authRouter.get('/verify-token', authenticateJWT, AuthController.verifyToken);
