import express from 'express';
import { register, login, getAllUsers } from '../controllers/userController.js';
import User from '../models/User.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/', getAllUsers);
// routes/userRoutes.js
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
