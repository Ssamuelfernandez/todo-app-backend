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

    static async getToDos() {
        return await handleDatabaseOperation(() => ToDo.find({}));
    }

    static async getToDosById(id) {
        await invalidObject(id);
        return await handleDatabaseOperation(() => ToDo.findById(id) || null);
    }

    static async postToDos(todo) {
        const newToDo = new ToDo(todo);
        return await handleDatabaseOperation(() => newToDo.save());
    }

    static async patchToDos(id, updates) {
        await invalidObject(id);
        updates.updatedAt = new Date();
        const result = await handleDatabaseOperation(() => ToDo.findByIdAndUpdate(id, updates, { new: true, runValidators: true }));

        if (!result) { return null; }
        return { message: 'TODO updated successfully' };
    }


    static async deleteToDos(id) {
        await invalidObject(id);
        const result = await handleDatabaseOperation(() => ToDo.findByIdAndDelete(id));

        if (!result) { throw { status: 404, message: 'TODO not found' }; }

        return { message: 'TODO deleted successfully' };

    }
}
