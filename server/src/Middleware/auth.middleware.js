import { verfiyToken } from "../libs/token.js";

export const authMiddleware = async (request, response, next) => {
  try {
    // const {token} = request.;
    const authHeader = request.headers["authorization"];

    const token = authHeader && authHeader.split(" ")[1];

    const decoded = await verfiyToken(token);

    request.userId = decoded.userId;
    request.role = decoded.role;

    next();
  } catch (error) {
    console.log("Error at authMiddleware : \t" + error.message);

    return response.status(500).json({
      message: "U Are Not Authorize",
      success: false,
    });
  }
};
