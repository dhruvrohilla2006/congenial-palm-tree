import express from "express";

import mongoconnect from "./config/mongoconnect.js";
import AuthRoutes from "./Route/auth.Route.js";
import env from "./config/env.js";
import { authMiddleware } from "./Middleware/auth.middleware.js";
import foodRouter from "./Route/food.route.js";
import orderRouter from "./Route/order.Route.js";

// config imports

const app = express();
const PORT = env.PORT;
// app uses
app.use(express.json());
app.use("/uploads", express.static("uploads"));
app.use("/api/auth", AuthRoutes);
app.use("/api/food", foodRouter);
app.use("/api/order", orderRouter);
// app.use((err, req, res, next) => {
//   console.log(err);
//   res.status(400).json({
//     message: err.message,
//   });
// });

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

server();
