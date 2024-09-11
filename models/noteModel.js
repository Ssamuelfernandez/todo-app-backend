import Note from '../schema/noteSchema.js';
import mongoose from 'mongoose';
import { handleDatabaseOperation } from '../utils/errorHandler.js';

//* Validar si el ID proporcionado es un ObjectId válido
async function invalidObject(id) { 
    if (!mongoose.isValidObjectId(id)) { 
        throw { status: 400, message: 'Invalid ObjectId' }; 
    }
}

export class noteModel {

    static async getNotes(filters = {}) {
        const query = { userId: filters.userId };

        //* Filtro por contenido del título (búsqueda por palabra clave)
        if (filters.title) {
            query.title = new RegExp(filters.title, 'i');
        }

        //* Filtro por categoría
        if (filters.category) {
            query.category = filters.category;
        }

        //* Filtro por etiquetas
        if (filters.tags) {
            query.tags = { $in: filters.tags.split(',') };
        }

        //* Filtro por fecha de creación
        if (filters.createdBefore) {
            query.createdAt = { ...query.createdAt, $lt: new Date(filters.createdBefore) };
        }
        if (filters.createdAfter) {
            query.createdAt = { ...query.createdAt, $gt: new Date(filters.createdAfter) };
        }

        return await handleDatabaseOperation(() => Note.find(query));
    }

    static async getNotesById(id, userId) {
        await invalidObject(id);
        return await handleDatabaseOperation(() => Note.findById({ _id: id, userId }) || null);
    }

    static async postNotes(note) {
        const newNote = new Note(note);
        return await handleDatabaseOperation(() => newNote.save());
    }

    static async patchNotes(id, updates, userId) {
        await invalidObject(id);
        updates.updatedAt = new Date();
        const result = await handleDatabaseOperation(() => 
            Note.findByIdAndUpdate({ _id: id, userId }, updates, { new: true, runValidators: true })
        );

        if (!result) {
            return null;
        }
        return result;
    }

    static async deleteNotes(id, userId) {
        await invalidObject(id);
        const result = await handleDatabaseOperation(() => Note.findByIdAndDelete({ _id: id, userId }));

        if (!result) {
            throw { status: 404, message: 'Note not found or not authorized' };
        }

        return { message: 'Note deleted successfully' };
    }
}
