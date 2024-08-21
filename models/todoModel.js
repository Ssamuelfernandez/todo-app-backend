import ToDo from "../schema/todoSchema.js";
import mongoose from "mongoose";

export class todoModel {

    static async getToDos() {
        try {
            return await ToDo.find({});
        } catch (error) {
            console.error('Error retrieving TODOs:', error);
            throw new Error('Database error');
        }
    }

    static async getToDosById(id) {

        //* Validar si el ID proporcionado es un ObjectId válido
        if (!mongoose.isValidObjectId(id)) { throw new Error('Invalid ObjectId'); }

        try {
            const todo = await ToDo.findById(id);
            if (!todo) { return null; }

            return todo

        } catch (error) {
            console.error(`Error retrieving TODO with ID ${id}:`, error);
            throw new Error('Database error');
        }
    }

    static async postToDos(todo) {
        try {
            const newToDo = new ToDo(todo);
            return await newToDo.save();
        } catch (error) {

            if (error instanceof mongoose.Error.ValidationError) {
                //! Manejo de errores de validación
                console.error('Validation Error:', error.errors);
                throw new Error(`Validation Error: ${Object.values(error.errors).map(e => e.message).join(', ')}`);

            } else if (error instanceof mongoose.Error.CastError) {
                //! Manejo de errores de tipo de datos
                console.error('Cast Error:', error.message);
                throw new Error('Invalid data type');

            } else {
                //! Manejo de otros errores
                console.error('Database Error:', error.message);
                throw new Error('Database error');
            }
        }
    }

    static async patchToDos(id, updates) {

        if (!mongoose.isValidObjectId(id)) { throw new Error('Invalid ObjectId'); }


        try {
            updates.updatedAt = new Date();
            const result = await ToDo.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
            if (!result) return null;
            return { message: 'TODO updated successfully' };
        } catch (error) {

            if (error instanceof mongoose.Error.ValidationError) {
                //! Manejo de errores de validación
                console.error('Validation Error:', error.errors);
                throw new Error(`Validation Error: ${Object.values(error.errors).map(e => e.message).join(', ')}`);

            } else if (error instanceof mongoose.Error.CastError) {
                //! Manejo de errores de tipo de datos
                console.error('Cast Error:', error.message);
                throw new Error('Invalid data type');

            } else {
                //! Manejo de otros errores
                console.error(`Error updating TODO with ID ${id}:`, error);
                console.error('Database Error:', error.message);
                throw new Error('Database error');
            }
        }

    }

    static async deleteToDos(id) {
        try {
            const result = await ToDo.findByIdAndDelete(id);
            if (!result) throw new Error('TODO not found');
            return { message: 'TODO deleted successfully' };
        } catch (error) {
            console.error(`Error deleting TODO with ID ${id}:`, error);
            throw new Error('Database error');
        }
    }
}
