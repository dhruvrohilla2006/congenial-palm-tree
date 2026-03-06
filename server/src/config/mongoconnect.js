// src/config/db.js
import mongoose from "mongoose"
import  env  from "./env.js"

// const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } };
const mongoconnect = async () => {
  try {
    // await mongoose.connect(env.MONGO_URI,clientOptions)
    await mongoose.connect(env.MONGO_URI)
    await mongoose.connection.db.admin().command({ ping: 1 });
    console.log("✅ Database Connected")
  } catch (error) {
    console.error("❌ Database connection failed:", error.message)
    process.exit(1)
  }
}

export default mongoconnect;