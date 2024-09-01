import { Router } from 'express'
import { ToDoController } from '../controllers/todoController.js'

export const todoRouter = Router()

todoRouter.get("/", ToDoController.getToDos)
todoRouter.get("/:id", ToDoController.getToDosById)
todoRouter.post("/", ToDoController.postToDos)
todoRouter.patch("/:id", ToDoController.patchToDos)
todoRouter.delete("/:id", ToDoController.deleteToDos)