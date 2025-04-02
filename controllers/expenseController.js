const Expense = require("../models/Expense");

// Xarajat yaratish
exports.addExpense = async (req, res) => {
  try {
    const { payment_summ, comment } = req.body;
    const newExpense = new Expense({ payment_summ, comment });
    await newExpense.save();
    res.status(201).json({ message: "Xarajat qo'shildi", newExpense });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Xarajatlarni olish
exports.getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find();
    res.status(200).json(expenses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
