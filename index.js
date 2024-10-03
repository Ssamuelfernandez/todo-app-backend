import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv';
import { errorHandler } from './middlewares/errorHandler.js'
import { todoRouter } from './routes/todoRoutes.js'
import { connectToDatabase } from './mongoDB.js'
import { noteRouter } from './routes/noteRoutes.js'
import { getWelcome } from './controllers/welcomeController.js'
import { authRouter } from './routes/authRoutes.js'
import { authenticateJWT } from './middlewares/authMiddleware.js'

dotenv.config();

const app = express()

const PORT = process.env.PORT || 3000

const allowedOrigins = [
    process.env.FRONTEND_VERCEL_URL,
    process.env.FRONTEND_DOMAIN_URL,
    process.env.LOCALHOST_URL
].filter(Boolean);

app.disable('x-powered-by')
app.use(express.json())

//? Configuración de CORS
const corsOptions = {
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
    credentials: true
};

app.use(cors(corsOptions))

app.get('/', getWelcome)
app.use('/todos', authenticateJWT,  todoRouter)
app.use('/notes', authenticateJWT, noteRouter)
app.use('/auth', authRouter)

app.use(errorHandler)

connectToDatabase()
    .then(() => {
        console.log('Database connected, starting server...');
        app.listen(PORT, () => {
            console.log(`Server listening on port http://localhost:${PORT}`)
        })
    })
    .catch(error => {
        console.error('Failed to connect to database, server not started:', error);
    });

export default app;