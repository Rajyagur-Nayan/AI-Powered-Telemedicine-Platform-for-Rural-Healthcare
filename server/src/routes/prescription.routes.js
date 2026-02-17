import express from "express";
import prisma from "../lib/prisma.js";
import { isLogin } from "../middlewear/auth.accessToken.js";

const prescriptionRoutes = express.Router();

/*
=================================
CREATE PRESCRIPTION
POST /api/prescriptions
=================================
*/
/**
 * @swagger
 * tags:
 *   name: Prescription
 *   description: Prescription management
 */

/**
 * @swagger
 * /prescriptions:
 *   post:
 *     summary: Create a prescription
 *     tags: [Prescription]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - patientId
 *               - medicines
 *             properties:
 *               patientId:
 *                 type: integer
 *               diagnosis:
 *                 type: string
 *               notes:
 *                 type: string
 *               medicines:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - medicineName
 *                     - dosage
 *                     - frequency
 *                     - durationDays
 *                   properties:
 *                     medicineName:
 *                       type: string
 *                     dosage:
 *                       type: string
 *                     frequency:
 *                       type: string
 *                     durationDays:
 *                       type: integer
 *     responses:
 *       201:
 *         description: Prescription created successfully
 *       400:
 *         description: Missing fields
 *       403:
 *         description: Only doctors can create prescriptions
 *       404:
 *         description: Profile not found
 *       500:
 *         description: Server error
 */
prescriptionRoutes.post("/", isLogin, async (req, res) => {
  try {
    const { patientId, diagnosis, notes, medicines } = req.body;
    const doctorId = req.user.id;

    if (req.user.role !== "DOCTOR") {
      return res
        .status(403)
        .json({ message: "Only doctors can create prescriptions" });
    }

    if (!patientId || !medicines || medicines.length === 0) {
      return res
        .status(400)
        .json({ message: "Patient ID and medicines are required" });
    }

    const doctorProfile = await prisma.doctorProfile.findUnique({
      where: { userId: doctorId },
    });

    if (!doctorProfile) {
      return res.status(404).json({ message: "Doctor profile not found" });
    }

    const patientProfile = await prisma.patientProfile.findUnique({
      where: { userId: parseInt(patientId) },
    });

    if (!patientProfile) {
      return res.status(404).json({ message: "Patient profile not found" });
    }

    const prescription = await prisma.prescription.create({
      data: {
        doctorId: doctorProfile.id,
        patientId: patientProfile.id,
        diagnosis,
        notes,
        medicines: {
          create: medicines.map((med) => ({
            medicineName: med.medicineName,
            dosage: med.dosage,
            frequency: med.frequency,
            durationDays: med.durationDays,
          })),
        },
      },
      include: { medicines: true },
    });

    res.status(201).json({
      message: "Prescription created successfully",
      prescription,
    });
  } catch (error) {
    console.error("Create Prescription Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

/*
=================================
LIST PRESCRIPTIONS
GET /api/prescriptions
=================================
*/
/**
 * @swagger
 * /prescriptions:
 *   get:
 *     summary: List prescriptions
 *     tags: [Prescription]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: A list of prescriptions
 *       500:
 *         description: Server error
 */
prescriptionRoutes.get("/", isLogin, async (req, res) => {
  try {
    const userId = req.user.id;
    const role = req.user.role;

    let prescriptions;

    if (role === "PATIENT") {
      const patientProfile = await prisma.patientProfile.findUnique({
        where: { userId },
      });
      if (!patientProfile) return res.status(200).json([]);

      prescriptions = await prisma.prescription.findMany({
        where: { patientId: patientProfile.id },
        include: {
          doctor: {
            include: { user: { select: { name: true } } },
          },
          medicines: true,
        },
      });
    } else if (role === "DOCTOR") {
      const doctorProfile = await prisma.doctorProfile.findUnique({
        where: { userId },
      });
      if (!doctorProfile) return res.status(200).json([]);

      prescriptions = await prisma.prescription.findMany({
        where: { doctorId: doctorProfile.id },
        include: {
          patient: {
            include: { user: { select: { name: true } } },
          },
          medicines: true,
        },
      });
    }

    res.status(200).json(prescriptions);
  } catch (error) {
    console.error("List Prescriptions Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default prescriptionRoutes;
