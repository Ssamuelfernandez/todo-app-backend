import { Router } from 'express'
import { ToDoController } from '../controllers/todoController.js'

export const todoRouter = Router()

todoRouter.get("/", ToDoController.getWelcome)
todoRouter.get("/todos",ToDoController.getToDos)
todoRouter.get("/todos/:id", ToDoController.getToDosById)
todoRouter.post("/todos", ToDoController.postToDos)
todoRouter.patch("/todos/:id", ToDoController.patchToDos)
todoRouter.delete("/todos/:id", ToDoController.deleteToDos)