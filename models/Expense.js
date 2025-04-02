const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema({
  payment_summ: { type: Number, required: true },
  comment: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Expense", expenseSchema);
