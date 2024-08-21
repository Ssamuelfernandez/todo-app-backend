import { NoteModel } from "../models/noteModel.js"

export class NoteController {


    static async getNotes(req, res) {
        const notes = await NoteModel.getNotes();
            res.json(notes);
    }
}