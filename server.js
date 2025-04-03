const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const bodyParser = require("body-parser");
const cors = require("cors");
const mainRoutes = require("./routes/mainRoutes");
const dbConfig = require("./config/dbConfig");
require("dotenv").config();
const app = express();
// MONGODB_URL="mongodb+srv://adelkauz6:JLY28oowpTDRqr9I@cluster0.2l6r6.mongodb.net/"

// MongoDB ulanishi
dbConfig.connectDB();
// CORS sozlamalari
const corsOptions = {
  origin: [
    "http://localhost:3000", // Backend lokal
    "http://localhost:3001", // Backend lokal
    "https://shu-brend.vercel.app", // Frontend lokal
  ],
  methods: ["GET", "POST", "PUT", "DELETE"], // Ruxsat etilgan HTTP metodlar
  credentials: true, // Cookie va autentifikatsiya uchun ruxsat
};
app.use(cors(corsOptions));
// Handle preflight requests
app.options("*", cors(corsOptions));
app.use(bodyParser.json());
app.use(
  session({
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);
// Yo'nalishlar
app.use("/api", mainRoutes);
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
