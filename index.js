import express from 'express'
import { todoRouter } from './routes/routes.js'
import { connectToDatabase } from './mongoDB.js'

const app = express()

const PORT = process.env.PORT || 3000

app.disable('x-powered-by')
app.use(express.json())

app.use('/api', todoRouter)

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