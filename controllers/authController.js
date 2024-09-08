import User from '../schema/userSchema.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';


const secretKey = process.env.JWT_SECRET;

export class AuthController {

    static async register(req, res, next) {

        try {
            const { nickname, firstName, email, password } = req.body;

            if (!nickname || !firstName || !email || !password) {
                return res.status(400).json({ message: 'All required fields must be provided.' });
            }

            const emailDb = await User.findOne({ email });
            if (emailDb) {
                return res.status(400).json({ message: 'User already registered.' });
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const newUser = new User({
                nickname,
                firstName,
                email,
                password: hashedPassword
            });

            await newUser.save();
            const { _id } = newUser;
            res.status(201).json({ message: 'User registered successfully', userId: _id });
        } catch (error) {
            next(error);
        }
    }

    static async login(req, res, next) {
        try {
            const { email, password } = req.body;
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(400).json({ error: 'Invalid credentials' });
            }

            //? Actualizar ultimo inicio de sesión
            user.lastLogin = new Date();
            await user.save();

            const token = jwt.sign({ id: user._id, lastLogin: user.lastLogin }, secretKey, { expiresIn: '3m' });
            res.status(200).json({ token });
        } catch (error) {
            next(error);
        }
    }

    static async logout(req, res, next) {
        try {
            const user = req.user;
            user.lastLogin = new Date();
            await user.save();
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
}
