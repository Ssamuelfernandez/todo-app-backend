import User from '../schema/userSchema.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import crypto from 'crypto'
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const secretKey = process.env.JWT_SECRET;

export class AuthController {

    static async register(req, res, next) {

        try {
            const { nickname, name, surname, email, password } = req.body;

            // Eliminar usuarios no verificados que hayan expirado
            await User.deleteMany({
                isVerified: false,
                verificationExpires: { $lt: Date.now() }
            });

            const verificationToken = crypto.randomBytes(32).toString('hex');
            const verificationExpires = Date.now() + 10 * 60 * 1000; //10 minutos

            const newUser = new User({
                nickname,
                name,
                surname,
                email,
                password,
                verificationToken,
                verificationExpires,
            });

            await newUser.save();

            const verificationUrl = `${req.protocol}://${req.get('host')}/auth/verify-email/${verificationToken}`;

            await resend.emails.send({
                from: "ToDo App SsamuelFernandez <verify-email@ssamuelfernandez.net>",
                to: email,
                subject: 'Verify your email',
                html: `<p>Thank you for registering!</p>
                   <p>Please click the link below to verify your email:</p>
                   <a href="${verificationUrl}">${verificationUrl}</a>`
            });

            res.status(201).json({ message: 'User registered successfully, you have 10 minutes to verify your email' });
        } catch (error) {
            next(error);
        }
    }

    static async verifyEmail(req, res, next) {
        try {
            const { token } = req.params;
    
            const user = await User.findOne({ verificationToken: token });
    
            if (!user) {
                return res.status(400).json({ message: 'Invalid verification token' });
            }
    
            if (user.isVerified) {
                return res.status(200).json({ message: 'Email already verified' });
            }
    
            if (user.verificationExpires < Date.now()) {
                return res.status(400).json({ message: 'Invalid or expired verification token' });
            }
    
            user.isVerified = true;
            user.verificationExpires = undefined;
    
            await user.save();
    
            return res.status(200).json({ message: 'Email verified successfully' });
        } catch (error) {
            console.error(error);
            next(error);
        }
    }
    

    static async login(req, res, next) {
        try {
            const { email, password } = req.body;

            const user = await User.findOne({ email });

            if (!user) {
                return res.status(400).json({ error: 'Invalid credentials' });
            }

            if (!user.isVerified) {
                return res.status(403).json({ error: 'Email not verified. Please check your email.' });
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(400).json({ error: 'Invalid credentials' });
            }

            //? Actualizar ultimo inicio de sesión
            const lastLoginDate = new Date();
            await User.updateOne({ _id: user._id }, { lastLogin: lastLoginDate });

            const token = jwt.sign({ id: user._id, lastLogin: lastLoginDate }, secretKey, { expiresIn: '30m' });
            res.status(200).json({ token });
        } catch (error) {
            next(error);
        }
    }

    static async verifyToken(req, res) {
        try {
            return res.status(200).json({ valid: true });
        } catch (error) {
            next(error)
        }
    }

    static async logout(req, res, next) {
        try {
            const userId = req.user._id;
            await User.updateOne({ _id: userId }, { lastLogin: new Date() });
            res.status(200).json({ message: 'Logged out successfully' });
        } catch (error) {
            next(error)
        }
    }

    static async getProfile(req, res, next) {
        try {
            const user = req.user;
            res.status(200).json(user);
        } catch (error) {
            next(error);
        }
    }

    static async forgotPassword(req, res, next) {
        try {
            const { email } = req.body;
            const user = await User.findOne({ email });

            if (user) {
                //? Genero el token de reseteo
                const resetToken = crypto.randomBytes(32).toString('hex');
                user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
                user.resetPasswordExpires = Date.now() + 10 * 60 * 1000; //? 10 minutos

                await user.save();

                const resetUrl = `${req.protocol}://${req.get('host')}/auth/reset-password/${resetToken}`;

                await resend.emails.send({
                    from: "ToDo App SsamuelFernandez <forgotPassword@ssamuelfernandez.net>",
                    to: user.email,
                    subject: 'Password Reset',
                    html: `<p>You are receiving this email because you (or someone else) has requested the reset of a password.</p>
                       <p>Please make a PUT request to the following URL to reset your password:</p>
                       <p><a href="${resetUrl}">${resetUrl}</a></p>`
                });
            }

            res.status(200).json({ message: 'Email sent with password reset instructions, you have 10 minutes to change it.' });
        } catch (error) {
            next(error);
        }
    }

    static async resetPassword(req, res, next) {
        try {
            const { token } = req.params;
            const { newPassword } = req.body;

            //? Buscar usuario mediante el rest token
            const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
            const user = await User.findOne({
                resetPasswordToken: hashedToken,
                resetPasswordExpires: { $gt: Date.now() } //? Comprobar validez token
            });

            if (!user) {
                return res.status(400).json({ message: 'Invalid or expired token' });
            }

            //? Actualizar contraseña
            user.password = newPassword;
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;

            await user.save();

            res.status(200).json({ message: 'Password has been reset successfully' });
        } catch (error) {
            next(error);
        }
    }

    static async changePassword(req, res, next) {
        try {
            const { currentPassword, newPassword } = req.body;
            const userId = req.user._id;

            const user = await User.findById(userId);

            //? Verifico que la contraseña actual es correcta
            const isMatch = await bcrypt.compare(currentPassword, user.password);
            if (!isMatch) {
                return res.status(400).json({ message: 'Incorrect current password' });
            }

            //? Actualizo a la nueva contraseña
            user.password = newPassword;
            await user.save();

            res.status(200).json({ message: 'Password has been updated successfully' });
        } catch (error) {
            next(error);
        }
    }

}
