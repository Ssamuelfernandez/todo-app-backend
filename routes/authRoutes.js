import { Router } from 'express';
import { AuthController } from '../controllers/authController.js';
import { authenticateJWT } from '../middlewares/authMiddleware.js';

export const authRouter = Router();

authRouter.post('/register', AuthController.register);
authRouter.post('/login', AuthController.login);
authRouter.get('/profile', authenticateJWT, AuthController.getProfile);
authRouter.post('/logout', authenticateJWT, AuthController.logout);

