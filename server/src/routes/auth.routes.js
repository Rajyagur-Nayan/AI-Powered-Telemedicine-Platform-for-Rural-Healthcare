import express from "express";
import prisma from "../lib/prisma.js";
import { hashPassword, comparePassword } from "../utils/hash.js";
import { generateToken } from "../utils/jwt.js";

const authRoutes = express.Router();

/*
=================================
REGISTER
POST /api/auth/register
=================================
*/
/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - email
 *         - password
 *         - name
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated id of the user
 *         email:
 *           type: string
 *           description: The user email
 *         name:
 *           type: string
 *           description: The user name
 *         role:
 *           type: string
 *           enum: [PATIENT, DOCTOR, ADMIN]
 *           default: PATIENT
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date the user was added
 *       example:
 *         id: 1
 *         email: user@example.com
 *         name: John Doe
 *         role: PATIENT
 *         createdAt: 2023-01-01T00:00:00.000Z
 */

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: The authentication managing API
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - name
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               name:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [PATIENT, DOCTOR]
 *     responses:
 *       201:
 *         description: The user was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 token:
 *                   type: string
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Missing fields or user already exists
 *       500:
 *         description: Some server error
 */
authRoutes.post("/register", async (req, res) => {
  try {
    const { email, password, name, role } = req.body;

    // Basic validation
    if (!email || !password || !name || !role) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({
        message: "Email already exists",
      });
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role,
      },
    });

    // Auto create profile based on role
    if (role === "DOCTOR") {
      await prisma.doctorProfile.create({
        data: { userId: user.id },
      });
    }

    if (role === "PATIENT") {
      await prisma.patientProfile.create({
        data: { userId: user.id },
      });
    }

    // Generate JWT
    const token = generateToken({
      id: user.id,
      role: user.role,
    });

    // Remove password before sending response
    const { password: _, ...userWithoutPassword } = user;

    res
      .status(201)
      .cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000 * 7, // 7 days
      })
      .json({
        message: "User registered successfully",
        token,
        user: userWithoutPassword,
      });
  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
});

/*
=================================
LOGIN
POST /api/auth/login
=================================
*/
/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 token:
 *                   type: string
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Invalid credentials
 *       500:
 *         description: Some server error
 */
authRoutes.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    const isMatch = await comparePassword(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    const token = generateToken({
      id: user.id,
      role: user.role,
    });

    const { password: _, ...userWithoutPassword } = user;

    res
      .status(200)
      .cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000 * 7, // 7 days
      })
      .json({
        message: "Login successful",
        token,
        user: userWithoutPassword,
      });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
});

export default authRoutes;
