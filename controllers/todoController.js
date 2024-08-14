import { todoModel } from '../models/todoModel.js'

export class ToDoController {

    static getWelcome (req, res) {
        res.status(200).json({ message: 'Welcome to ToDo Api' })
    }

    static async getToDos (req, res) {

        const todos = await todoModel.getToDos()
        res.status(200).json(todos)
    }
}