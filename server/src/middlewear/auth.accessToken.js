import dotenv from "dotenv";
dotenv.config();
import { verifyToken } from "../utils/jwt.js";

export const isLogin = (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        error: "unauthorized",
        message: "Access token missing",
      });
    }

    const decoded = verifyToken(token);

    if (!decoded) {
      return res.status(401).json({
        error: "unauthorized",
        message: "Invalid or expired access token",
      });
    }

    req.user = {
      id: decoded.id,
      role: decoded.role,
    };

    next();
  } catch (error) {
    return res.status(401).json({
      error: "unauthorized",
      message: "Invalid or expired access token",
    });
  }
};
