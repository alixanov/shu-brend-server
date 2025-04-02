const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
  name: { type: String, required: true },
  login: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true, default: "user" }, // Role qo'shildi
  success: {
    xisobot: { type: Boolean, default: false },
    qarzdorlar: { type: Boolean, default: false },
    xarajatlar: { type: Boolean, default: false },
    skaladorlar: { type: Boolean, default: false },
    vazvratlar: { type: Boolean, default: false },
    adminlar: { type: Boolean, default: false },
    sotuv_tarixi: { type: Boolean, default: false },
    dokon: { type: Boolean, default: false },
    SalesStatistics: { type: Boolean, default: false },
  },
});

module.exports = mongoose.model("Admin", adminSchema);
