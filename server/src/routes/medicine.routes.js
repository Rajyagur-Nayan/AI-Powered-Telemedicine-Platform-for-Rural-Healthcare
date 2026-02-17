import express from "express";
import prisma from "../lib/prisma.js";
import { isLogin } from "../middlewear/auth.accessToken.js";

const medicineRoutes = express.Router();

/**
 * @swagger
 * tags:
 *   name: Medicine
 *   description: Medicine schedule and log management
 */

/*
=================================
CREATE MEDICINE SCHEDULE
POST /api/medicine/schedule
=================================
*/
/**
 * @swagger
 * /medicine/schedule:
 *   post:
 *     summary: Add a medicine schedule
 *     tags: [Medicine]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - medicineName
 *               - dosage
 *             properties:
 *               medicineName:
 *                 type: string
 *               type:
 *                 type: string
 *                 enum: [PILL, SYRUP, INJECTION, OTHER]
 *                 default: PILL
 *               dosage:
 *                 type: string
 *               isMorning:
 *                 type: boolean
 *               isAfternoon:
 *                 type: boolean
 *               isEvening:
 *                 type: boolean
 *               isNight:
 *                 type: boolean
 *               isAfterFood:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Medicine schedule created
 *       400:
 *         description: Missing fields
 *       404:
 *         description: Patient profile not found
 *       500:
 *         description: Server error
 */
medicineRoutes.post("/schedule", isLogin, async (req, res) => {
  try {
    const {
      medicineName,
      type,
      dosage,
      isMorning,
      isAfternoon,
      isEvening,
      isNight,
      isAfterFood,
    } = req.body;
    const userId = req.user.id;
    const role = req.user.role;

    if (role !== "PATIENT") {
      return res
        .status(403)
        .json({ message: "Only patients can create schedules" });
    }

    const patientProfile = await prisma.patientProfile.findUnique({
      where: { userId },
    });
    if (!patientProfile)
      return res.status(404).json({ message: "Patient profile not found" });

    const schedule = await prisma.medicineSchedule.create({
      data: {
        patientId: patientProfile.id,
        medicineName,
        type: type || "PILL",
        dosage,
        isMorning: isMorning ?? true,
        isAfternoon: isAfternoon ?? false,
        isEvening: isEvening ?? true,
        isNight: isNight ?? false,
        isAfterFood: isAfterFood ?? true,
      },
    });

    res.status(201).json({
      message: "Medicine schedule created",
      schedule,
    });
  } catch (error) {
    console.error("Create Schedule Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

/*
=================================
LIST SCHEDULES
GET /api/medicine/schedule
=================================
*/
/**
 * @swagger
 * /medicine/schedule:
 *   get:
 *     summary: List medicine schedules
 *     tags: [Medicine]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: List of schedules
 *       500:
 *         description: Server error
 */
medicineRoutes.get("/schedule", isLogin, async (req, res) => {
  try {
    const userId = req.user.id;
    const role = req.user.role;

    if (role === "PATIENT") {
      const patientProfile = await prisma.patientProfile.findUnique({
        where: { userId },
      });
      if (!patientProfile) return res.status(200).json([]);

      const schedules = await prisma.medicineSchedule.findMany({
        where: { patientId: patientProfile.id, isActive: true },
      });
      return res.status(200).json(schedules);
    } else {
      // For now only patient sees their schedule
      return res.status(403).json({ message: "Unauthorized" });
    }
  } catch (error) {
    console.error("List Schedules Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

/*
=================================
LOG MEDICINE
POST /api/medicine/log
=================================
*/
/**
 * @swagger
 * /medicine/log:
 *   post:
 *     summary: Log a medicine dose
 *     tags: [Medicine]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - scheduleId
 *               - status
 *             properties:
 *               scheduleId:
 *                 type: integer
 *               status:
 *                 type: string
 *                 enum: [TAKEN, MISSED, SKIPPED]
 *               takenAt:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: Medicine logged
 *       404:
 *         description: Schedule not found
 *       500:
 *         description: Server error
 */
medicineRoutes.post("/log", isLogin, async (req, res) => {
  try {
    const { scheduleId, status, takenAt } = req.body;
    const userId = req.user.id;

    // Verify schedule belongs to patient
    const schedule = await prisma.medicineSchedule.findUnique({
      where: { id: parseInt(scheduleId) },
      include: { patient: true },
    });

    if (!schedule) {
      return res.status(404).json({ message: "Schedule not found" });
    }

    if (schedule.patient.userId !== userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const log = await prisma.medicineLog.create({
      data: {
        scheduleId: parseInt(scheduleId),
        status,
        takenAt: takenAt ? new Date(takenAt) : new Date(),
        scheduledFor: new Date(), // Ideally this should be passed or calculated
      },
    });

    res.status(201).json({
      message: "Medicine logged",
      log,
    });
  } catch (error) {
    console.error("Log Medicine Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default medicineRoutes;
