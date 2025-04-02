const UsdRate = require("../models/UsdRate");

// USD kursini olish
exports.getUsdRate = async (req, res) => {
  try {
    const usdRate = await UsdRate.findOne().sort({ date: -1 });
    if (!usdRate) {
      return res.status(404).json({ message: "USD kursi topilmadi." });
    }
    res.json(usdRate);
  } catch (error) {
    res.status(500).json({ message: "Server xatosi." });
  }
};

// USD kursini yangilash
exports.updateUsdRate = async (req, res) => {
  const rate = parseFloat(req.body.rate);
  if (isNaN(rate)) {
    return res
      .status(400)
      .json({
        message: "USD kursi kiritilishi kerak va raqam bo'lishi kerak.",
      });
  }

  try {
    const newRate = new UsdRate({ rate });
    await newRate.save();
    res.json({ message: "USD kursi muvaffaqiyatli yangilandi.", newRate });
  } catch (error) {
    res.status(500).json({ message: "Server xatosi." });
  }
};
