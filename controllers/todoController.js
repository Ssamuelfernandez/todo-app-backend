import { todoModel } from '../models/todoModel.js'

export class ToDoController {

    static async getToDos(req, res, next) {
        try {
            const filters = req.query;
            filters.userId = req.user._id;
            const todos = await todoModel.getToDos(filters);
            res.status(200).json(todos);
        } catch (error) {
            next(error);
        }
    }

    static async getToDosById(req, res, next) {
        const { id } = req.params;
        const userId = req.user._id;
        try {
            const todo = await todoModel.getToDosById(id, userId);

            if (todo === null) {
                return res.status(404).json({ error: 'TODO not found or not authorized' });
            }

            return res.status(200).json(todo);

        } catch (error) {
            next(error);
        }
    }

    static async postToDos(req, res, next) {
        try {
            const todo = req.body;
            todo.userId = req.user._id;
            const insertedTodo = await todoModel.postToDos(todo);
            const { _id} = insertedTodo
            res.status(201).json({ message: `TODO created witch Id ${_id}`, todo: insertedTodo });
        } catch (error) {
            next(error);
        }
    }

    static async deleteToDos(req, res, next) {
        const { id } = req.params;
        const userId = req.user._id;
        try {
            const result = await todoModel.deleteToDos(id, userId);
            res.status(200).json(result);
        } catch (error) {
            next(error);

        }
    }

    static async patchToDos(req, res, next) {
        const { id } = req.params;
        const updates = req.body;
        const userId = req.user._id;

        try {
            //* Llamar al modelo para actualizar el TODO
            const result = await todoModel.patchToDos(id, updates, userId);

            //* Manejar el caso en el que el TODO no se encuentra
            if (result === null) {
                return res.status(404).json({ error: 'TODO not found or not authorized' });
            }

            const { _id } = result

            res.status(201).json({ message: `TODO witch Id ${_id} is updated correctly`, todo: result });
        } catch (error) {
            next(error)
        }
    }


}