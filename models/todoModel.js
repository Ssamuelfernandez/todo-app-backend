import { connectToDatabase } from "../mongoDB.js";
import { ObjectId } from "mongodb";

export class todoModel {

    //Aqui se manejan y registran errores relacionados con las operaciones de base de datos y
    //lanzar errores especificos

    static async getToDos() {
        try {
            const todosCollection = await connectToDatabase();
            return await todosCollection.find({}).toArray();
        } catch (error) {
            console.error('Error retrieving TODOs:', error);
            throw new Error('Could not retrieve TODOs');
        }
    }

    static async getToDosById(id) {
        
        try {
            const todosCollection = await connectToDatabase();

            // Validar si el ID proporcionado es un ObjectId válido
            if (!ObjectId.isValid(id)) { throw new Error('Invalid ObjectId'); }

            // Convertir el ID en un ObjectId de MongoDB
            const objectId = ObjectId.createFromHexString(id);

            // Buscar el documento en la colección usando el ObjectId
            const todo = await todosCollection.findOne({ _id: objectId });

            // Verificar si se encontró el documento
            if (!todo) { throw new Error('TODO not found'); }

            return todo;
        } catch (error) {
            console.error(`Error retrieving TODO with ID ${id}:`, error);
            throw new Error('Could not retrieve TODO');
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
            throw new Error('Could not insert TODO');
        }
    }

    static async patchToDos() {

        //Modifica solo los campos especificados en la solicitud, sin afectar los demás campos del recurso.

    }

    //No usar PUT
    static async putToDos() {

        //Reemplaza todo el recurso con la nueva representación enviada.

    }

    static async deleteToDos(id) {
        try {
            const todosCollection = await connectToDatabase();

            if (!ObjectId.isValid(id)) { throw new Error('Invalid ObjectId'); }

            const objectId = ObjectId.createFromHexString(id);

            const result = await todosCollection.deleteOne({ _id: objectId });

            if (result.deletedCount === 0) { throw new Error('TODO not found'); }

            return { message: 'TODO deleted successfully' };

        } catch (error) {
            console.error(`Error deleting TODO with ID ${id}:`, error);
            throw new Error('Could not delete TODO');
        }
    }

}