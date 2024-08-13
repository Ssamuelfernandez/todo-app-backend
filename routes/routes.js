import { Router } from 'express'

export const todoRouter = Router()

todoRouter.get("/", (req, res) => {
    res.status(200).json({message: "Test back todo app"})
})