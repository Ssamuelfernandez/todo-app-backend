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
            res.status(500).json({ message: 'Error retrieving TODOs', error: error.message });
        }
    }

    static async getToDosById(req, res) {
        const { id } = req.params;
        try {
            const todo = await todoModel.getToDosById(id);

            if (todo === null) {
                return res.status(404).json({ error: 'TODO not found' });
            }

            return res.status(200).json(todo);

        } catch (error) {
            if (error.message === 'Invalid ObjectId') {
                return res.status(400).json({ error: 'Invalid ID format' });
            }

            res.status(500).json({ error: 'Error retrieving TODO', details: error.message });
        }
    }

    static async postToDos(req, res) {
        try {
            const todo = req.body;
            const insertedTodo = await todoModel.postToDos(todo);
            res.status(201).json({ message: 'TODO created', todo: insertedTodo });
        } catch (error) {
            res.status(500).json({ message: 'Error creating TODO', error: error.message });
        }
    }

    static async deleteToDos(req, res) {
        const { id } = req.params;
        try {
            const result = await todoModel.deleteToDos(id);
            res.status(200).json(result);
        } catch (error) {
            if (error.message === 'Invalid ObjectId') {
                return res.status(400).json({ error: 'Invalid ID format' });
            } else if (error.message === 'TODO not found') {
                return res.status(404).json({ error: 'TODO not found' });
            }
            res.status(500).json({ message: 'Error deleting TODO', error: error.message });
        }
    }

    static async patchToDos(req, res) {
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
            //! Manejar errores del modelo de manera específica
            if (error.message === 'Invalid ObjectId') {
                return res.status(400).json({ error: 'Invalid ID format' });
            } 

            //! Para otros errores generales de la base de datos
            return res.status(500).json({ error: 'Database error', details: error.message });
        }
    }


}