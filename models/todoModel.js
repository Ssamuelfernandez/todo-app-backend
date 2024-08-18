import { connectToDatabase } from "../mongoDB.js";
import { ObjectId } from "mongodb";

export class todoModel {

    static async getToDos() {
        try {
            const todosCollection = await connectToDatabase();
            return await todosCollection.find({}).toArray();
        } catch (error) {
            console.error('Error retrieving TODOs:', error);
            throw new Error('Database error');
        }
    }

    static async getToDosById(id) {
        // Validar si el ID proporcionado es un ObjectId válido
        if (!ObjectId.isValid(id)) { throw new Error('Invalid ObjectId'); }

        // Convertir el ID en un ObjectId de MongoDB
        const objectId = ObjectId.createFromHexString(id);

        try {
            const todosCollection = await connectToDatabase();

            // Buscar el documento en la colección usando el ObjectId
            const todo = await todosCollection.findOne({ _id: objectId });

            // Verificar si se encontró el documento
            if (!todo) { return null; }

            return todo;
        } catch (error) {
            console.error(`Error retrieving TODO with ID ${id}:`, error);
            throw new Error('Database error');
        }
    }

    static async postToDos(todo) {
        try {
            const todosCollection = await connectToDatabase();
            const result = await todosCollection.insertOne({
                title: todo.title,
                completed: todo.completed || false,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            });
            return result.insertedId; // Devolver el ID del documento insertado
        } catch (error) {
            console.error('Error inserting TODO:', error);
            throw new Error('Database error');
        }
    }

    static async patchToDos(id, updates) {

        if (!ObjectId.isValid(id)) { throw new Error('Invalid ObjectId'); }

        const objectId = ObjectId.createFromHexString(id);

        try {
            const todosCollection = await connectToDatabase();

            // Actualizar el documento en la colección usando el ObjectId
            const result = await todosCollection.updateOne(
                { _id: objectId },
                {
                    $set: {
                        ...updates, // Actualiza los campos especificados en 'updates'
                        updatedAt: new Date().toISOString() // Actualiza la fecha de modificación
                    }
                }
            );

            // Verificar si se actualizó algún documento
            if (result.matchedCount === 0) { return null; }

            return { message: 'TODO updated successfully' };
        } catch (error) {
            console.error(`Error updating TODO with ID ${id}:`, error);
            throw new Error('Database error');
        }
    }

    static async deleteToDos(id) {

        if (!ObjectId.isValid(id)) { throw new Error('Invalid ObjectId'); }

        const objectId = ObjectId.createFromHexString(id);

        try {
            const todosCollection = await connectToDatabase();


            const result = await todosCollection.deleteOne({ _id: objectId });

            if (result.deletedCount === 0) { throw new Error('TODO not found'); }

            return { message: 'TODO deleted successfully' };

        } catch (error) {
            console.error(`Error deleting TODO with ID ${id}:`, error);
            throw new Error('Database error');
        }
    }

}