import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();
const uri = process.env.MONGO_URI;

export async function connectToDatabase() {
  try {
      await mongoose.connect(uri);
      console.log('Connected to MongoDB with Mongoose');
  } catch (error) {
      console.error('Error connecting to database with Mongoose:', error);
      throw error;
  }
}

export async function checkDatabaseStatus() {
  const connectionState = mongoose.connection.readyState;

  switch (connectionState) {
      case 0:
          return { status: 'disconnected' };
      case 1:
          return { status: 'connected' };
      case 2:
          return { status: 'connecting' };
      case 3:
          return { status: 'disconnecting' };
      default:
          return { status: 'unknown' };
  }
}


/* import { MongoClient, ServerApiVersion } from 'mongodb';
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


*/