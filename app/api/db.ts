import { MongoClient } from "mongodb";

let MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  throw new Error(
    "error: define the MONGODB_URI environment variable inside .env",
  );
}

const client = await MongoClient.connect(MONGODB_URI);
export const users = client.db("hackrare").collection("users");
