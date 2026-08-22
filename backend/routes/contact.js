import express from "express";
import { sendContactEmail } from "../services/email.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!email || !message) {
      return res.status(400).json({
        message: "Email and message are required.",
      });
    }

    await sendContactEmail({
      name,
      email,
      message,
    });

    return res.status(200).json({
      success: true,
      message: "Message sent successfully.",
    });
  } catch (err) {
    console.error("[Contact] Failed:", err.message);

    return res.status(500).json({
      message: "Unable to send your message. Please try again.",
    });
  }
});

export default router;