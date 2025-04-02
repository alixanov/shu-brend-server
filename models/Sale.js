const mongoose = require("mongoose");

const saleSchema = new mongoose.Schema(
  {
    product_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    product_name: { type: String, required: true },
    sell_price: { type: Number, required: true },
    buy_price: { type: Number, required: true },
    quantity: {
      type: Number,
      required: true,
      validate: {
        validator: async function (value) {
          const product = await mongoose
            .model("Product")
            .findById(this.product_id);
          if (product.count_type === "kg") {
            return value > 0;
          } else {
            return value >= 1;
          }
        },
        message: function (props) {
          return `Invalid quantity: ${props.value}`;
        },
      },
    },
    total_price: { type: Number, required: true },
    payment_method: {
      type: String,
      enum: ["naqd", "plastik", "qarz"],
      required: true,
    },
    debtor_name: { type: String },
    debtor_phone: { type: String },
    debt_due_date: { type: Date },
    usd_rate: { type: Number }, // Yangi maydon: sotuv vaqtidagi USD kursi
  },
  { timestamps: true }
);

module.exports = mongoose.model("Sale", saleSchema);
