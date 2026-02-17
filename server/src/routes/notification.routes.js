import express from "express";
import prisma from "../lib/prisma.js";
import { isLogin } from "../middlewear/auth.accessToken.js";

const notificationRoutes = express.Router();

/**
 * @swagger
 * tags:
 *   name: Notification
 *   description: Notification management
 */

/*
=================================
LIST NOTIFICATIONS
GET /api/notifications
=================================
*/
/**
 * @swagger
 * /notifications:
 *   get:
 *     summary: List my notifications
 *     tags: [Notification]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: List of notifications
 *       500:
 *         description: Server error
 */
notificationRoutes.get("/", isLogin, async (req, res) => {
  try {
    const userId = req.user.id;

    const notifications = await prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    res.status(200).json(notifications);
  } catch (error) {
    console.error("List Notifications Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

/*
=================================
MARK AS READ
PUT /api/notifications/:id/read
=================================
*/
/**
 * @swagger
 * /notifications/{id}/read:
 *   put:
 *     summary: Mark notification as read
 *     tags: [Notification]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Notification marked as read
 *       404:
 *         description: Notification not found
 *       500:
 *         description: Server error
 */
notificationRoutes.put("/:id/read", isLogin, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Verify notification belongs to user
    const notification = await prisma.notification.findUnique({
      where: { id: parseInt(id) },
    });

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    if (notification.userId !== userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const updated = await prisma.notification.update({
      where: { id: parseInt(id) },
      data: { isRead: true },
    });

    res.status(200).json({
      message: "Notification marked as read",
      notification: updated,
    });
  } catch (error) {
    console.error("Mark Read Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default notificationRoutes;
