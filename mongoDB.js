import { MongoClient, ServerApiVersion } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config()
const uri = process.env.MONGO_URI;

const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
  });

  export async function connectToDatabase() {
    try {
  
      await client.connect();
      console.log("Conected to MongoDB")
      const db = client.db('todo-app');
      const todosCollection = db.collection('todos');
      return todosCollection;
  
    } catch (error) {
      console.error("Error connecting to database");      
      console.error(error);
      await client.close();
      throw error;
    }
  }

  export async function checkDatabaseStatus() {
    try {
        const db = client.db('todo-app');
        await db.command({ ping: 1 }); // Realiza una operación simple para verificar el estado
        return { status: 'ok' };
    } catch (error) {
        console.error('Error checking database status:', error);
        return { status: 'error', message: 'Database connection issue' };
    }
}