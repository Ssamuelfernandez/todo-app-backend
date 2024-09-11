import { noteModel } from '../models/noteModel.js';

export class NoteController {

    static async getNotes(req, res, next) {
        try {
            const filters = req.query;
            filters.userId = req.user._id;
            const notes = await noteModel.getNotes(filters);
            res.status(200).json(notes);
        } catch (error) {
            next(error);
        }
    }

    static async getNotesById(req, res, next) {
        const { id } = req.params;
        const userId = req.user._id;
        try {
            const note = await noteModel.getNotesById(id, userId);

            if (note === null) {
                return res.status(404).json({ error: 'Note not found or not authorized' });
            }

            return res.status(200).json(note);

        } catch (error) {
            next(error);
        }
    }

    static async postNotes(req, res, next) {
        try {
            const note = req.body;
            note.userId = req.user._id;
            const insertedNote = await noteModel.postNotes(note);
            const { _id } = insertedNote;
            res.status(201).json({ message: `Note created with Id ${_id}`, note: insertedNote });
        } catch (error) {
            next(error);
        }
    }

    static async deleteNotes(req, res, next) {
        const { id } = req.params;
        const userId = req.user._id;
        try {
            const result = await noteModel.deleteNotes(id, userId);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    }

    static async patchNotes(req, res, next) {
        const { id } = req.params;
        const updates = req.body;
        const userId = req.user._id;

        try {
            //* Llamar al modelo para actualizar la nota
            const result = await noteModel.patchNotes(id, userId);

            //* Manejar el caso en el que la nota no se encuentra
            if (result === null) {
                return res.status(404).json({ error: 'Note not found or not authorized' });
            }

            const { _id } = result;
            res.status(201).json({ message: `Note with Id ${_id} updated successfully`, note: result });
        } catch (error) {
            next(error);
        }
    }
}
