import express from 'express'
import { todoRouter } from './routes/routes.js'

const app = express()

const PORT = process.env.PORT || 3000

app.disable('x-powered-by')
app.use(express.json())

app.use('/api', todoRouter)

app.listen(PORT, () => {
    console.log(`Server listening on port http://localhost:${PORT}`)
})

export default app;