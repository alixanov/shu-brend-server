const mongoose = require("mongoose");

const debtorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    debt_amount: { type: Number, required: true, min: 0 },
    due_date: { type: Date, required: true },
    product_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    product_name: { type: String, required: true },
    product_quantity: { type: Number, required: true },
    sell_price: { type: Number, required: true },
    payment_log: {
      type: [
        {
          amount: Number,
          date: { type: Date, default: Date.now },
        },
      ],
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Debtor", debtorSchema);