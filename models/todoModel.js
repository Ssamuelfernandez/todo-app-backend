import ToDo from "../schema/todoSchema.js";
import mongoose from "mongoose";
import { handleDatabaseOperation } from "../utils/errorHandler.js"


//* Validar si el ID proporcionado es un ObjectId válido
async function invalidObject(id) { 
    if (!mongoose.isValidObjectId(id)) { 
        throw { status: 400, message: 'Invalid ObjectId' }; 
    }
}

export class todoModel {

    static async getToDos(filters = {}) {
        const query = { userId: filters.userId };
    
        //* Filtro por estado
        if (filters.status) {
            query.status = filters.status;
        }
    
        //* Filtro por prioridad
        if (filters.priority) {
            query.priority = filters.priority;
        }
    
        //* Filtro por categoría
        if (filters.category) {
            query.category = filters.category;
        }
    
        //* Filtro por fecha de vencimiento
        if (filters.dueBefore) {
            query.dueDate = { ...query.dueDate, $lt: new Date(filters.dueBefore) };
        }
        if (filters.dueAfter) {
            query.dueDate = { ...query.dueDate, $gt: new Date(filters.dueAfter) };
        }
    
        //* Filtro por etiquetas
        if (filters.tags) {
            query.tags = { $in: filters.tags.split(',') };
        }
    
        //* Filtro por recordatorio
        if (filters.reminderBefore) {
            query.reminder = { ...query.reminder, $lt: new Date(filters.reminderBefore) };
        }
        if (filters.reminderAfter) {
            query.reminder = { ...query.reminder, $gt: new Date(filters.reminderAfter) };
        }
    
        //* Filtro por fecha de creación
        if (filters.createdBefore) {
            query.createdAt = { ...query.createdAt, $lt: new Date(filters.createdBefore) };
        }
        if (filters.createdAfter) {
            query.createdAt = { ...query.createdAt, $gt: new Date(filters.createdAfter) };
        }
    
        return await handleDatabaseOperation(() => ToDo.find(query));
    }
    

    static async getToDosById(id, userId) {
        await invalidObject(id);
        return await handleDatabaseOperation(() => ToDo.findById({ _id: id, userId }) || null);
    }

    static async postToDos(todo) {
        const newToDo = new ToDo(todo);
        return await handleDatabaseOperation(() => newToDo.save());
    }

    static async patchToDos(id, updates, userId) {
        await invalidObject(id);
        updates.updatedAt = new Date();
        const result = await handleDatabaseOperation(() => ToDo.findByIdAndUpdate({ _id: id, userId }, updates, { new: true, runValidators: true }));

        if (!result) { return null; }
        return result;
    }


    static async deleteToDos(id, userId) {
        await invalidObject(id);
        const result = await handleDatabaseOperation(() => ToDo.findByIdAndDelete({ _id: id, userId }));

        if (!result) { throw { status: 404, message: 'TODO not found or not authorized' }; }

        return { message: 'TODO deleted successfully' };

    }
}
