# Farm2Factory – Farmer to Factory Platform (MVP)

Farm2Factory is a full‑stack platform that connects farmers and factories for transparent crop procurement. The MVP provides separate farmer and factory portals, secure APIs, and basic order/contract workflows built with a Node.js backend and React frontends.

---

## 🌾 Problem

- Farmers struggle to find reliable buyers and fair prices.  
- Factories find it hard to source consistent quality and quantity directly from farmers.  

Farm2Factory bridges this gap by digitizing how factories raise crop requirements and how farmers respond with offers.

---

## 🚀 MVP Features

### Farmer Side

- Create account and log in as farmer.  
- Manage crop listings (CRUD): name, quantity, price, location, quality notes.  
- View open factory requirements and send offers / responses.  
- Track orders / contracts status (pending, accepted, completed).  

### Factory Side

- Create account and log in as factory user.  
- Post crop requirements with quantity, price range, and delivery preferences.  
- Browse interested farmers and create contracts / orders.  
- View farmer KYC/verification status (basic).  

### Common / System Features

- JWT‑based authentication & authorization (farmer vs factory roles).  
- REST APIs for crops, requirements, orders, and users.  
- Basic validation and error handling.  
- MongoDB collections for Farmers, Factories, Crops, Requirements, Orders, and Notifications.

---

## 🏗️ Architecture Overview (MVP)

**Frontend**

- Farmer Web App: React + Tailwind CSS.  
- Factory Web App: React + Tailwind CSS.  

**Backend**

- Node.js + Express for REST APIs.  
- MongoDB Atlas for persistent data.  
- JWT for authentication middleware.  

The farmer and factory frontends communicate with the same backend via HTTPS/REST.

---

## 📂 Project Structure (example)

farm2factory/
server/ # Node.js + Express backend
src/
models/
routes/
controllers/
middleware/
.env
package.json

farmer-client/ # Farmer React frontend
src/
package.json

factory-client/ # Factory React frontend
src/
package.json
README.md
.gitignore


Adjust the folder names if your structure differs.

---

## ⚙️ Tech Stack

- **Frontend**: React, Tailwind CSS, React Router  
- **Backend**: Node.js, Express  
- **Database**: MongoDB Atlas (M0 free tier)  
- **Auth**: JSON Web Tokens (JWT)  

---

## 🧪 Getting Started (Local)

### 1. Clone the repo

git clone https://github.com/ygstudio-game/Fram2Factory.git
cd farm2factory


### 2. Backend setup

cd server
npm install

Create a `.env` file in `server`:

MONGODB_URI=<your-mongodb-uri>
JWT_SECRET=<strong-secret>
PORT=5000

Run the backend:
cd ./Backend
npm i 
npm run dev


### 3. Farmer frontend
cd ../Frontend
npm install
npm run dev

By default, you can configure:

- Backend: `http://localhost:5000`  
- Frontend: `http://localhost:5173`  

Update API base URLs in the frontend `.env` or config files accordingly.

---

## 🔐 Core API Endpoints (MVP Sketch)

**Auth**

- `POST /api/auth/register` – register farmer/factory.  
- `POST /api/auth/login` – login and receive JWT.  

**Farmer**

- `GET /api/farmer/profile`  
- `GET /api/farmer/crops`  
- `POST /api/farmer/crops`  
- `PUT /api/farmer/crops/:id`  
- `DELETE /api/farmer/crops/:id`  

**Factory**

- `GET /api/factory/requirements`  
- `POST /api/factory/requirements`  
- `PUT /api/factory/requirements/:id`  

**Orders / Contracts**

- `POST /api/orders` – create order/contract between farmer and factory.  
- `GET /api/orders` – list orders for logged‑in user.  
- `PATCH /api/orders/:id/status` – update status.  

Use role‑based middleware to ensure only farmers/factories access their respective routes.

---

## 🚦 MVP Limitations

- No advanced pricing engine; simple per‑contract fields.  
- No real‑time WebSocket notifications yet (polling or simple refresh).  
- Basic KYC and verification (document links / flags only).  
- No integrated payment gateway (cash / external payment handled offline).  

These trade‑offs keep the system lean enough to validate the core farmer–factory interaction.

---

## 🛣️ Roadmap (Post‑MVP)

- Real‑time notifications using WebSockets.  
- Full KYC workflow with document uploads and review.  
- Analytics dashboards for factories and admins.  
- Integrated payments and escrow.  
- Mobile app (React Native) for farmers.

---

 