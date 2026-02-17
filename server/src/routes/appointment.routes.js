import express from "express";
import prisma from "../lib/prisma.js";
import { isLogin } from "../middlewear/auth.accessToken.js";

const appointmentRoutes = express.Router();

/*
=================================
BOOK APPOINTMENT
POST /api/appointments
=================================
*/
/**
 * @swagger
 * tags:
 *   name: Appointment
 *   description: Appointment management
 */

/**
 * @swagger
 * /appointments:
 *   post:
 *     summary: Book an appointment
 *     tags: [Appointment]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - doctorId
 *               - dateTime
 *             properties:
 *               doctorId:
 *                 type: integer
 *               dateTime:
 *                 type: string
 *               notes:
 *                 type: string
 *     responses:
 *       201:
 *         description: Appointment booked successfully
 *       400:
 *         description: Doctor ID and Date/Time are required
 *       403:
 *         description: Only patients can book appointments
 *       404:
 *         description: Doctor or Patient profile not found
 *       500:
 *         description: Server error
 */
appointmentRoutes.post("/", isLogin, async (req, res) => {
  try {
    const { doctorId, dateTime, notes } = req.body;
    const patientId = req.user.id;

    if (req.user.role !== "PATIENT") {
      return res
        .status(403)
        .json({ message: "Only patients can book appointments" });
    }

    if (!doctorId || !dateTime) {
      return res
        .status(400)
        .json({ message: "Doctor ID and Date/Time are required" });
    }

    // Verify doctor exists
    const doctor = await prisma.doctorProfile.findUnique({
      where: { userId: parseInt(doctorId) },
    });

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    const patientProfile = await prisma.patientProfile.findUnique({
      where: { userId: patientId },
    });

    if (!patientProfile) {
      return res.status(404).json({
        message: "Patient profile not found. Please update your profile first.",
      });
    }

    const appointment = await prisma.appointment.create({
      data: {
        doctorId: doctor.id,
        patientId: patientProfile.id,
        dateTime: new Date(dateTime),
        notes,
        status: "PENDING",
      },
    });

    res.status(201).json({
      message: "Appointment booked successfully",
      appointment,
    });
  } catch (error) {
    console.error("Book Appointment Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

/*
=================================
LIST APPOINTMENTS
GET /api/appointments
=================================
*/
/**
 * @swagger
 * /appointments:
 *   get:
 *     summary: List my appointments
 *     tags: [Appointment]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: A list of appointments
 *       500:
 *         description: Server error
 */
appointmentRoutes.get("/", isLogin, async (req, res) => {
  try {
    const userId = req.user.id;
    const role = req.user.role;

    let appointments;

    if (role === "PATIENT") {
      const patientProfile = await prisma.patientProfile.findUnique({
        where: { userId },
      });
      if (!patientProfile) return res.status(200).json([]);

      appointments = await prisma.appointment.findMany({
        where: { patientId: patientProfile.id },
        include: {
          doctor: {
            include: { user: { select: { name: true, email: true } } },
          },
        },
      });
    } else if (role === "DOCTOR") {
      const doctorProfile = await prisma.doctorProfile.findUnique({
        where: { userId },
      });
      if (!doctorProfile) return res.status(200).json([]);

      appointments = await prisma.appointment.findMany({
        where: { doctorId: doctorProfile.id },
        include: {
          patient: {
            include: { user: { select: { name: true, email: true } } },
          },
        },
      });
    } else {
      // ADMIN or other
      appointments = await prisma.appointment.findMany({
        include: {
          doctor: { include: { user: { select: { name: true } } } },
          patient: { include: { user: { select: { name: true } } } },
        },
      });
    }

    res.status(200).json(appointments);
  } catch (error) {
    console.error("List Appointments Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

/*
=================================
UPDATE APPOINTMENT STATUS
PUT /api/appointments/:id/status
=================================
*/
/**
 * @swagger
 * /appointments/{id}/status:
 *   put:
 *     summary: Update appointment status
 *     tags: [Appointment]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [PENDING, CONFIRMED, COMPLETED, CANCELLED]
 *     responses:
 *       200:
 *         description: Appointment status updated
 *       404:
 *         description: Appointment not found
 *       403:
 *         description: Not authorized
 *       500:
 *         description: Server error
 */
appointmentRoutes.put("/:id/status", isLogin, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const userId = req.user.id;
    const role = req.user.role;

    const appointment = await prisma.appointment.findUnique({
      where: { id: parseInt(id) },
      include: { doctor: true, patient: true },
    });

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    // Authorization check
    // Doctor can change to CONFIRMED, COMPLETED, CANCELLED
    // Patient can change to CANCELLED only

    let isAuthorized = false;

    if (role === "DOCTOR") {
      if (appointment.doctor.userId === userId) isAuthorized = true;
    } else if (role === "PATIENT") {
      if (appointment.patient.userId === userId) {
        if (status === "CANCELLED") isAuthorized = true;
        else
          return res
            .status(403)
            .json({ message: "Patients can only cancel appointments" });
      }
    }

    if (!isAuthorized) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this appointment" });
    }

    const updatedAppointment = await prisma.appointment.update({
      where: { id: parseInt(id) },
      data: { status },
    });

    res.status(200).json({
      message: "Appointment status updated",
      appointment: updatedAppointment,
    });
  } catch (error) {
    console.error("Update Appointment Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default appointmentRoutes;
