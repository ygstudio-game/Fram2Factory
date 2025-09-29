import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import userRoutes from './routes/user.js';
import productRoutes from './routes/product.js';
import contactRoutes from './routes/contact.js';
import requirementRoutes from './routes/requirement.js';
import cors from 'cors';

const WEBSITE_URL = process.env.WEBSITE_URL || `http://localhost:${process.env.PORT}`;
 app.use(cors({
  origin: ['https://fram2factory.vercel.app/', 'https://farm2factory.onrender.com'],
  credentials: true // if you need cookies or auth headers
}));
 
const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/requirements', requirementRoutes);
app.use('/api/contact', contactRoutes);
app.get("/", (req, res) => {
  res.send("Server is alive!");
});

const PORT = process.env.PORT ;
const MONGO_URI = process.env.MONGO_URI ;
const pingWebsite = async () => {
  try {
    const res = await fetch(WEBSITE_URL);
    console.log(`Pinged ${WEBSITE_URL} - Status: ${res.status} - ${new Date()}`);
  } catch (err) {
    console.error(`Ping error: ${err}`);
  }
};

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      pingWebsite(); // initial ping
  setInterval(pingWebsite, 8 * 60 * 1000); 
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });
