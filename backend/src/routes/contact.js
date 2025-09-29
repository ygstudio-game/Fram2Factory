import express from 'express';
import User from '../models/User.js';
import sendContactNotificationEmail from '../utils/sendContactNotificationEmail.js';

const router = express.Router();

/**
 * POST /api/contact
 * Body: { senderId, receiverId, contract (optional) }
 */
router.post('/', async (req, res) => {
  try {
    const { senderId, receiverId, contract } = req.body;

    if (!senderId || !receiverId) {
      return res.status(400).json({ message: "senderId and receiverId are required" });
    }

    // Get sender and receiver details from DB
    const sender = await User.findById(senderId).select('name email phone role location');
    const receiver = await User.findById(receiverId).select('name email');

    if (!sender || !receiver) {
      return res.status(404).json({ message: "Sender or receiver not found" });
    }

    // Send email
    await sendContactNotificationEmail(receiver.email, sender, contract);

    res.status(200).json({ message: `Contact email sent to ${receiver.email}` });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to send contact email", error: err.message });
  }
});

export default router;
