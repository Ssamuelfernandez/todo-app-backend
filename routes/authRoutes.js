import { Router } from 'express';
import { AuthController } from '../controllers/authController.js';
import { authenticateJWT } from '../middlewares/authMiddleware.js';

export const authRouter = Router();

authRouter.post('/register', AuthController.register);
authRouter.post('/login', AuthController.login);
authRouter.post('/logout', authenticateJWT, AuthController.logout);
authRouter.get('/profile', authenticateJWT, AuthController.getProfile);
authRouter.post('/forgot-password', AuthController.forgotPassword);
authRouter.patch('/reset-password/:token', AuthController.resetPassword);
authRouter.patch('/change-password', authenticateJWT, AuthController.changePassword);
authRouter.get('/verify-email/:token', AuthController.verifyEmail);
authRouter.get('/verify-token', authenticateJWT, AuthController.verifyToken);
