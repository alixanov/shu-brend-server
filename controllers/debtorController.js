const Debtor = require("../models/Debtor");
const Sale = require("../models/Sale");
const Store = require("../models/Store");
const Product = require("../models/Product");

// Yangi qarzdor yaratish
exports.createDebtor = async (req, res) => {
  try {
    const { name, phone, debt_amount, due_date, product_id, sell_price, product_name, product_quantity } =
      req.body;
    // Qarzdor obyektini yaratish
    const newDebtor = new Debtor({
      name,
      phone,
      debt_amount,
      due_date,
      product_id,
      product_quantity,
      sell_price,
      product_name,
    });
    await newDebtor.save();
    res.status(201).json(newDebtor);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



exports.updatePrice = async (req, res) => {
  try {
    const { sell_price } = req.body
    const { id } = req.params
    await Debtor.findByIdAndUpdate(id, { sell_price })
    res.status(200).json({ message: "Muvaffaqiyatli o'zgartirildi" })

  } catch (err) {
    return res.status(500).json({ message: "Serverda xatolik" });
  }
}

exports.payDebt = async (req, res) => {
  try {
    const { id } = req.params
    console.log(id);
    
    const debtor = await Debtor.findById(id);
    if (!debtor) {
      return res.status(404).json({ message: "Debtor not found" });
    }
    const product = await Product.findById(debtor.product_id)
    const newSale = new Sale({
      product_id: debtor.product_id,
      product_name: debtor.product_name,
      sell_price: debtor.sell_price,
      buy_price: product.purchase_price,
      quantity: debtor.product_quantity,
      total_price: debtor.sell_price*debtor.product_quantity,
      payment_method: "qarz",
      debtor_name: debtor.name,
      debtor_phone: debtor.phone,
      debt_due_date: debtor.due_date,
    });
    await debtor.deleteOne();
    await newSale.save();

    return res.status(200).json({
      message: "Debtor fully paid and sale recorded",
      sale: newSale,
    });
  } catch (err) {
    console.log(err);
    
    return res.status(500).json({ message: "Serverda xatolik" });
  }
}

exports.updateDebtor = async (req, res) => {
  try {
    const { id } = req.params;
    const { paid_amount } = req.body;

    const parsedAmount = parseFloat(paid_amount);

    if (!paid_amount || isNaN(parsedAmount) || parsedAmount <= 0) {
      return res
        .status(400)
        .json({ message: "To'langan summa to'g'ri kiritilmagan" });
    }

    const debtor = await Debtor.findById(id);
    const product = await Product.findById(debtor.product_id)


    if (!debtor) {
      return res.status(404).json({ message: "Debtor not found" });
    }

    debtor.debt_amount -= parsedAmount;

    if (debtor.debt_amount <= 0) {
      const newSale = new Sale({
        product_id: debtor.product_id,
        product_name: debtor.product_name,
        sell_price: parsedAmount,
        buy_price: product.purchase_price,
        quantity: debtor.quantity,
        total_price: parsedAmount,
        payment_method: "qarz",
        debtor_name: debtor.name,
        debtor_phone: debtor.phone,
        debt_due_date: debtor.due_date,
      });

      await newSale.save();
      await debtor.deleteOne();

      return res.status(200).json({
        message: "Debtor fully paid and sale recorded",
        sale: newSale,
      });
    } else {
      debtor.payment_log.push({
        amount: parsedAmount,
        date: new Date().toISOString(),
      });
    }

    await debtor.save();
    res.status(200).json(debtor);
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log(error);

  }
};



// Barcha qarzdorlarni olish
exports.getAllDebtors = async (req, res) => {
  try {
    const debtors = await Debtor.find();
    res.status(200).json(debtors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ID bo'yicha qarzdorni o'chirish
exports.deleteDebtor = async (req, res) => {
  try {
    const { id } = req.params;
    await Debtor.findByIdAndDelete(id);
    res.status(200).json({ message: "Debtor deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.vazvratDebt = async (req, res) => {
  try {
    const { quantity, id } = req.body
    const debtor = await Debtor.findById(id);
    const product = await Product.findById(debtor.product_id);
    if (!debtor) {
      return res.status(404).json({ message: "Qarzdor topilmadi" });
    }
    const skladProduct = await Product.findById(debtor.product_id);
    if (!skladProduct) {
      return res.status(404).json({ message: "Mahsulot omborda topilmadi" });
    }
    const storeProduct = await Store.findOne({ product_id: debtor.product_id });
    if (!storeProduct) {
      new Store({
        product_id: skladProduct._id,
        product_name: skladProduct.product_name,
        quantity,
      })
    } else {
      storeProduct.quantity += quantity
      await storeProduct.save()
    }

    const remainingDebt = debtor.debt_amount - (product.purchase_price * quantity);
    if (debtor.product_quantity <= quantity) {
      await Debtor.findByIdAndDelete(id)
    } else {
      debtor.debt_amount = remainingDebt;
      debtor.product_quantity -= quantity;
      await debtor.save();
    }
    res.status(200).json({ message: "Vazrat" });

  } catch (err) {
    console.log(err.message)
    return res.status(500).json({ message: "Serverda xatolik" });
  }
}