import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import wakeNeon from "./src/connection/DB.wakeNeon.js";
import authRoutes from "./src/routes/auth.routes.js";
import userRoutes from "./src/routes/user.routes.js";
import appointmentRoutes from "./src/routes/appointment.routes.js";
import prescriptionRoutes from "./src/routes/prescription.routes.js";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./src/config/swagger.js";

const app = express();

(async () => {
  await wakeNeon(); // ⬅️ CRITICAL
})();

// Middleware
// ✅ CORS (still needed for APIs)
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Base Route
app.get("/", (req, res) => {
  res.status(200).json({ message: "API is running 🚀" });
});

// Swagger Docs
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/prescriptions", prescriptionRoutes);

export default app;
