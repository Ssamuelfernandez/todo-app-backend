import { connectToDatabase } from "../mongoDB.js";

export class todoModel {

    static async getToDos() { 
        const db = await connectToDatabase()

        return db.find({}).toArray()

    }

}