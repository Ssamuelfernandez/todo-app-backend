import { todoModel } from '../models/todoModel.js'
import { checkDatabaseStatus } from '../mongoDB.js';

export class ToDoController {

    //Aqui se caoturan los errores lanzados por el modelo, se formatea la respuesta
    //para el cliente y se envia un mensaje adecuado y un codigo de estado HTTP

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
            res.status(500).json({ message: error.message });
        }
    }

    static async getToDosById(req, res) {
        const { id } = req.params;
        try {
            const todo = await todoModel.getToDosById( id );
            if (todo) {
                return res.json(todo);
            }
            return res.status(404).json({ message: 'TODO not found' });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Server error' });
        }
    }

    static async postToDos(req, res) {
        try {
            const { title, completed } = req.body;
            const insertedId = await todoModel.postToDos({ title, completed });
            res.status(201).json({ message: 'TODO created', id: insertedId });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    static async deleteToDos(req, res) {
        const { id } = req.params;
        try {
            const todo = await todoModel.deleteToDos( id );
            if (todo) {
                return res.json(todo);
            }
            return res.status(404).json({ message: 'TODO not found' });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Server error' });
        }
    }


}