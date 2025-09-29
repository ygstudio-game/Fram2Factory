import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import userRoutes from './routes/user.js';
import productRoutes from './routes/product.js';
import contactRoutes from './routes/contact.js';
import requirementRoutes from './routes/requirement.js';

const WEBSITE_URL = "https://fram2factory.vercel.app/";
const WEBSITEBackend_URL = "https://fram2factory.onrender.com/";

const app = express();
const FRONTEND_URL = "https://fram2factory.vercel.app";

// // --------------------- CORS CONFIGURATION ---------------------
// app.use(cors({
//   origin: FRONTEND_URL, // Allow your frontend
//   credentials: true,    // Allow cookies/auth headers
// }));

// // This ensures preflight OPTIONS requests are handled globally
// app.options('*', cors({
//   origin: FRONTEND_URL,
//   credentials: true,
// }));

// // ---------------------------------------------------------------
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', FRONTEND_URL); // Allow your frontend
  res.header('Access-Control-Allow-Credentials', 'true'); // Allow cookies/auth headers
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }

  next();
});
// --------------------------------------------------------

app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/requirements', requirementRoutes);
app.use('/api/contact', contactRoutes);

app.get("/", (req, res) => {
  res.send("Server is alive!");
});

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

const pingWebsite = async () => {
  try {
    const res = await fetch(WEBSITEBackend_URL);
    console.log(`Pinged ${WEBSITEBackend_URL} - Status: ${res.status} - ${new Date()}`);
  } catch (err) {
    console.error(`Ping error: ${err}`);
  }
};

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      pingWebsite(); // initial ping
      setInterval(pingWebsite, 8 * 60 * 1000); // ping every 8 mins
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });
