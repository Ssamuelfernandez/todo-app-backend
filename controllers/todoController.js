import { todoModel } from '../models/todoModel.js'
import { checkDatabaseStatus } from '../mongoDB.js';

export class ToDoController {

    static async getWelcome(req, res) {
        try {
            const dbStatus = await checkDatabaseStatus();
            res.status(200).json({
                message: 'Welcome to ToDo API',
                database: dbStatus
            });
        } catch (error) {
            res.status(500).json({
                message: 'Error checking API status',
                error: error.message
            });
        }
    }

    static async getToDos(req, res) {
        try {
            const todos = await todoModel.getToDos();
            res.status(200).json(todos);
        } catch (error) {
            next(error);
        }
    }

    static async getToDosById(req, res, next) {
        const { id } = req.params;
        try {
            const todo = await todoModel.getToDosById(id);

            if (todo === null) {
                return res.status(404).json({ error: 'TODO not found' });
            }

            return res.status(200).json(todo);

        } catch (error) {
            next(error);
        }
    }

    static async postToDos(req, res, next) {
        try {
            const todo = req.body;
            const insertedTodo = await todoModel.postToDos(todo);
            const { _id} = insertedTodo
            res.status(201).json({ message: `TODO created witch Id ${_id}`, todo: insertedTodo });
        } catch (error) {
            next(error);
        }
    }

    static async deleteToDos(req, res, next) {
        const { id } = req.params;
        try {
            const result = await todoModel.deleteToDos(id);
            res.status(200).json(result);
        } catch (error) {
            next(error);

        }
    }

    static async patchToDos(req, res, next) {
        const { id } = req.params;
        const updates = req.body;

        try {
            //* Llamar al modelo para actualizar el TODO
            const result = await todoModel.patchToDos(id, updates);

            //* Manejar el caso en el que el TODO no se encuentra
            if (result === null) {
                return res.status(404).json({ error: 'TODO not found' });
            }

            res.status(200).json(result);
        } catch (error) {
            next(error)
        }
    }


}