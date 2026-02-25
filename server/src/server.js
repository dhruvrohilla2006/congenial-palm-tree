import express from "express";
import dotenv from "dotenv";
import mongoconnect from "./config/mongoconnect.js";

// config imports
dotenv.configDotenv();
mongoconnect();


const app = express();



// app uses
app.use(express.json());

// const vaiables

const PORT = process.env.PORT;

app.get("/", async (request, response) => {
  try {
    return response.status(200).json({
      message: "Server started",
      success: true,
    });
  } catch (error) {
    console.log("error \t" + error.message)
    return response.status(500).json({
      message: "Server Error",
      success: false,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server Started At http://localhost:${PORT}`);
});
