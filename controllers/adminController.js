const Admin = require("../models/adminModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.registerAdmin = async (req, res) => {
  try {
    const { name, login, password, role, success } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = new Admin({
      name,
      login,
      password: hashedPassword,
      role,
      success,
    });
    await newAdmin.save();
    res.status(201).json({ message: "Admin registered successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.loginAdmin = async (req, res) => {
  try {
    const { login, password } = req.body;
    const admin = await Admin.findOne({ login });
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid login or password" });
    }

    const token = jwt.sign(
      { adminId: admin._id, role: admin.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "24h",
      }
    );

    res.status(200).json({ token, success: admin.success, role: admin.role });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Yangi admin yaratish funksiyasi
exports.createAdmin = async (req, res) => {
  try {
    const { name, login, password, role, success } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = new Admin({
      name,
      login,
      password: hashedPassword,
      role,
      success,
    });
    await newAdmin.save();
    res.status(201).json({ message: "New admin created successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Barcha adminlarni olish funksiyasi
exports.getAllAdmins = async (req, res) => {
  try {
    const admins = await Admin.find();
    res.status(200).json(admins);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Adminni o'chirish funksiyasi
exports.deleteAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const admin = await Admin.findByIdAndDelete(id);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }
    res.status(200).json({ message: "Admin deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Adminni tahrirlash funksiyasi
exports.updateAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, login, role, success } = req.body;
    const updatedAdmin = await Admin.findByIdAndUpdate(
      id,
      { name, login, role, success },
      { new: true }
    );
    if (!updatedAdmin) {
      return res.status(404).json({ message: "Admin not found" });
    }
    res
      .status(200)
      .json({ message: "Admin updated successfully", admin: updatedAdmin });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
