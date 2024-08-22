import { NoteModel } from "../models/noteModel.js"

export class NoteController {


    static async getNotes(req, res) {
        const notes = await NoteModel.getNotes();
            res.json(notes);
    }

    static async getNotesById(req, res) {

    }

    static async postNotes(req, res) {

    }

    static async patchNotes(req, res) {

    }

    static async deleteNotes(req, res) {

    }
    
}