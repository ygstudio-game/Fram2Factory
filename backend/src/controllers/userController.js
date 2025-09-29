import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';


export const register = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role,
      location,
      phone,
      company,
      rating,
      totalContracts,
      joinedDate,
      certifications,
      avatar,
      bio
    } = req.body;

    // Check required fields
    if (!name || !email || !password || !role || !location) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists with this email' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      role,
      location,
      phone: phone || '',
      company: company || '',
      rating: rating || 0,
      totalContracts: totalContracts || 0,
      joinedDate: joinedDate || new Date().toISOString(),
      certifications: certifications || [],
      avatar: avatar || '',
      bio: bio || '',
      verified: false
    });

    await user.save();

    // Generate JWT
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        location: user.location,
        verified: user.verified,
        rating: user.rating,
        totalContracts: user.totalContracts,
        joinedDate: user.joinedDate,
        certifications: user.certifications,
        avatar: user.avatar,
        phone: user.phone,
        company: user.company,
        bio: user.bio
      }
    });

  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


export const login = async (req, res) => {
    
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: 'User not found' });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
    // Return full user details and token
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        location: user.location,
        verified: true,
        rating: user.rating || 0,
        totalContracts: user.totalContracts || 0,
        joinedDate: user.joinedDate || '',
        certifications: user.certifications || [],
        avatar: user.avatar || '',
        phone: user.phone || '',
        company: user.company || ''
      }
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const role = req.query.role;
    const query = role ? { role } : {};
    const users = await User.find(query).select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
