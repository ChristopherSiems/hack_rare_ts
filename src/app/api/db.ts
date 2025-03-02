import { MongoClient } from "mongodb";

let MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  throw new Error(
    "error: define the MONGODB_URI environment variable inside .env",
  );
}

console.log("MONGODB_URI:", process.env.MONGODB_URI);
let client: any;
try {
  client = await MongoClient.connect(MONGODB_URI);
  console.log("✅ Connected to MongoDB");
} catch (error) {
  console.error("❌ MongoDB Connection Error:", error);
}

const db = client.db("hackrare");
export const users = db.collection("users");
export const orgs = db.collection("orgs");
