const Budget = require("../models/Budget");

// Byudjetni olish
exports.getBudget = async (req, res) => {
  try {
    const budget = await Budget.findOne();
    res.status(200).json(budget);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Byudjetni yangilash
exports.updateBudget = async (req, res) => {
  try {
    const { amount } = req.body;
    let budget = await Budget.findOne();

    if (!budget) {
      budget = new Budget({ totalBudget: 0 });
    }

    budget.totalBudget -= amount;
    await budget.save();

    res.status(200).json({ message: "Byudjet yangilandi", budget });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Byudjetni olish
exports.getBudget = async (req, res) => {
  try {
    const budget = await Budget.findOne();
    res.status(200).json(budget);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};




// Byudjetni olish
