import express from "express";
import prisma from "../lib/prisma.js";
import { isLogin } from "../middlewear/auth.accessToken.js";

const userRoutes = express.Router();

/*
=================================
GET PROFILE
GET /api/users/profile
=================================
*/
/**
 * @swagger
 * tags:
 *   name: User
 *   description: User profile management
 */

/**
 * @swagger
 * /users/profile:
 *   get:
 *     summary: Get current user profile
 *     tags: [User]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: The user profile
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
userRoutes.get("/profile", isLogin, async (req, res) => {
  try {
    const userId = req.user.id; // From middleware

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        doctorProfile: true,
        patientProfile: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { password, ...userWithoutPassword } = user;

    res.status(200).json(userWithoutPassword);
  } catch (error) {
    console.error("Get Profile Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

/*
=================================
UPDATE PROFILE
PUT /api/users/profile
=================================
*/
/**
 * @swagger
 * /users/profile:
 *   put:
 *     summary: Update user profile
 *     tags: [User]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               age:
 *                 type: integer
 *               gender:
 *                 type: string
 *               address:
 *                 type: string
 *               specialization:
 *                 type: string
 *               experience:
 *                 type: integer
 *               bio:
 *                 type: string
 *               consultationFee:
 *                 type: number
 *               isAvailable:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
userRoutes.put("/profile", isLogin, async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, ...profileData } = req.body;
    const role = req.user.role;

    // Update base user info if provided
    if (name) {
      await prisma.user.update({
        where: { id: userId },
        data: { name },
      });
    }

    let updatedProfile;

    if (role === "DOCTOR") {
      updatedProfile = await prisma.doctorProfile.update({
        where: { userId },
        data: {
          specialization: profileData.specialization,
          experience: parseInt(profileData.experience) || undefined,
          bio: profileData.bio,
          consultationFee: parseFloat(profileData.consultationFee) || undefined,
          isAvailable: profileData.isAvailable,
        },
      });
    } else if (role === "PATIENT") {
      updatedProfile = await prisma.patientProfile.update({
        where: { userId },
        data: {
          age: parseInt(profileData.age) || undefined,
          gender: profileData.gender,
          address: profileData.address,
        },
      });
    }

    res.status(200).json({
      message: "Profile updated successfully",
      profile: updatedProfile,
    });
  } catch (error) {
    console.error("Update Profile Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

/*
=================================
LIST DOCTORS
GET /api/users/doctors
=================================
*/
/**
 * @swagger
 * /users/doctors:
 *   get:
 *     summary: List all doctors
 *     tags: [User]
 *     responses:
 *       200:
 *         description: A list of doctors
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       500:
 *         description: Server error
 */
userRoutes.get("/doctors", async (req, res) => {
  try {
    const doctors = await prisma.user.findMany({
      where: { role: "DOCTOR" },
      select: {
        id: true,
        name: true,
        email: true,
        doctorProfile: {
          select: {
            id: true,
            specialization: true,
            experience: true,
            bio: true,
            consultationFee: true,
            isAvailable: true,
          },
        },
      },
    });

    res.status(200).json(doctors);
  } catch (error) {
    console.error("List Doctors Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default userRoutes;
