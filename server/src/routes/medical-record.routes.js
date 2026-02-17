import express from "express";
import prisma from "../lib/prisma.js";
import { isLogin } from "../middlewear/auth.accessToken.js";

const medicalRecordRoutes = express.Router();

/**
 * @swagger
 * tags:
 *   name: MedicalRecord
 *   description: Medical Record management
 */

/*
=================================
CREATE MEDICAL RECORD
POST /api/medical-records
=================================
*/
/**
 * @swagger
 * /medical-records:
 *   post:
 *     summary: Create a medical record
 *     tags: [MedicalRecord]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *             properties:
 *               patientId:
 *                 type: integer
 *                 description: Required if doctor is creating record
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: Medical record created successfully
 *       400:
 *         description: Missing fields
 *       404:
 *         description: Patient profile not found
 *       500:
 *         description: Server error
 */
medicalRecordRoutes.post("/", isLogin, async (req, res) => {
  try {
    const { patientId, title, description, date } = req.body;
    const userId = req.user.id;
    const role = req.user.role;

    let targetPatientId;

    if (role === "PATIENT") {
      const patientProfile = await prisma.patientProfile.findUnique({
        where: { userId },
      });
      if (!patientProfile)
        return res.status(404).json({ message: "Patient profile not found" });
      targetPatientId = patientProfile.id;
    } else if (role === "DOCTOR") {
      if (!patientId)
        return res
          .status(400)
          .json({ message: "Patient ID is required for doctors" });
      // Verify patient exists
      const patientProfile = await prisma.patientProfile.findUnique({
        where: { userId: parseInt(patientId) },
      });
      if (!patientProfile)
        return res.status(404).json({ message: "Patient profile not found" });
      targetPatientId = patientProfile.id;
    } else {
      return res.status(403).json({ message: "Unauthorized" });
    }

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    const record = await prisma.medicalRecord.create({
      data: {
        patientId: targetPatientId,
        title,
        description,
        date: date ? new Date(date) : new Date(),
      },
    });

    res.status(201).json({
      message: "Medical record created",
      record,
    });
  } catch (error) {
    console.error("Create Medical Record Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

/*
=================================
LIST MEDICAL RECORDS
GET /api/medical-records
=================================
*/
/**
 * @swagger
 * /medical-records:
 *   get:
 *     summary: List medical records
 *     tags: [MedicalRecord]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: patientId
 *         schema:
 *           type: integer
 *         description: Optional patient ID for doctors to view specific patient records
 *     responses:
 *       200:
 *         description: List of medical records
 *       500:
 *         description: Server error
 */
medicalRecordRoutes.get("/", isLogin, async (req, res) => {
  try {
    const userId = req.user.id;
    const role = req.user.role;
    const { patientId } = req.query;

    let records;

    if (role === "PATIENT") {
      const patientProfile = await prisma.patientProfile.findUnique({
        where: { userId },
      });
      if (!patientProfile) return res.status(200).json([]);

      records = await prisma.medicalRecord.findMany({
        where: { patientId: patientProfile.id },
        orderBy: { date: "desc" },
      });
    } else if (role === "DOCTOR") {
      if (patientId) {
        const patientProfile = await prisma.patientProfile.findUnique({
          where: { userId: parseInt(patientId) },
        });
        if (!patientProfile)
          return res.status(404).json({ message: "Patient not found" });

        records = await prisma.medicalRecord.findMany({
          where: { patientId: patientProfile.id },
          orderBy: { date: "desc" },
        });
      } else {
        // Return empty or maybe all records? For now empty if no patient specified.
        return res.status(200).json([]);
      }
    }

    res.status(200).json(records);
  } catch (error) {
    console.error("List Medical Records Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default medicalRecordRoutes;
