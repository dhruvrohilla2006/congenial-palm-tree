import express from "express";

import mongoconnect from "./config/mongoconnect.js";
import AuthRoutes from "./Route/auth.Route.js";
import env from "./config/env.js";
import { authMiddleware } from "./Middleware/auth.middleware.js";

// config imports

const app = express();
const PORT = env.PORT
// app uses
app.use(express.json());
app.use("/api/auth",AuthRoutes);

// const vaiables



app.get("/", async (request, response) => {
  try {
    return response.status(200).json({
      message: "Server started",
      success: true,
    });
  } catch (error) {
    console.log("error \t" + error.message);
    return response.status(500).json({
      message: "Server Error",
      success: false,
    });
  }
});

async function server() {
  await mongoconnect();

  app.listen(PORT, () => {
    console.log(`Server Started At http://localhost:${PORT}`);
  });
}

server()