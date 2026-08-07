import mongoose from "mongoose";

export default async function db() {
  const connectionString =
    process.env.MONGODB_URI || process.env.connection_string;

  if (!connectionString) {
    throw new Error("MONGODB_URI is missing in the backend environment file");
  }

  await mongoose.connect(connectionString);
  console.log("Database connected");
}


