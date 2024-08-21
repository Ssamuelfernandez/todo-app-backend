import Note from "../schema/noteSchema.js";
import mongoose from "mongoose";

export class NoteModel {

    static async getNotes() {
   
            return await {message: "Hola notas!!"};
       
    }

}