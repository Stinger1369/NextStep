// src/routes/notificationRoutes.ts
import { Router, Request, Response } from "express";
import Notification from "../models/Notification";
import authMiddleware from "../middlewares/authMiddleware";

const router = Router();

interface AuthenticatedRequest extends Request {
  user?: any;
}

router.get(
  "/notifications",
  authMiddleware,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const notifications = await Notification.find({
        recipient: req.user._id,
      }).sort({ createdAt: -1 });
      res.json(notifications);
    } catch (error) {
      res.status(500).json({ error: "Error fetching notifications" });
    }
  }
);

router.post(
  "/notifications/mark-as-read/:id",
  authMiddleware,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const notification = await Notification.findById(req.params.id);
      if (!notification) {
        return res.status(404).json({ error: "Notification not found" });
      }

      // Convertir les valeurs en chaînes avant de les comparer
      if (notification.recipient.toString() !== req.user._id.toString()) {
        return res.status(403).json({ error: "Not authorized" });
      }

      notification.read = true;
      await notification.save();
      res.json(notification);
    } catch (error) {
      res.status(500).json({ error: "Error updating notification" });
    }
  }
);

export default router;
