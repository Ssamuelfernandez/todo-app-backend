import express from 'express'
import { errorHandler } from './middlewares/errorHandler.js'
import { todoRouter } from './routes/todoRoutes.js'
import { connectToDatabase } from './mongoDB.js'
import { noteRouter } from './routes/noteRoutes.js'
import { getWelcome } from './controllers/welcomeController.js'

const app = express()

const PORT = process.env.PORT || 3000

app.disable('x-powered-by')
app.use(express.json())

app.get('/', getWelcome)
app.use('/todos', todoRouter)
app.use('/notes', noteRouter)

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