import mongodb from "mongodb";
import dotenv from "dotenv";

const { MongoClient } = mongodb;
dotenv.config();

let dbClient;

async function connectDB() {
  const uri = process.env.MONGO_URI;
  const clientInstance = new MongoClient(uri);

  try {
    await clientInstance.connect();
    dbClient = clientInstance;
    console.log(" Mongo connection success");
    return dbClient;
  } catch (error) {
    console.error("Mongo connection failed:", error);
    await clientInstance.close();
    process.exit(1);
  }
}

async function getDB() {
  if (!dbClient) {
    throw new Error("db connection has not been established yet");
  }
  return dbClient.db("todoList");
}

export { connectDB, getDB };
