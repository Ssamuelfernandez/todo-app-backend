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
    }
  }