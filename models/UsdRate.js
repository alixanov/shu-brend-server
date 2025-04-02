const mongoose = require("mongoose");

const usdRateSchema = new mongoose.Schema({
  rate: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("UsdRate", usdRateSchema);
