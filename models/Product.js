const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  product_name: { type: String, required: true },
  model: { type: String, required: true },
  stock: { type: Number, required: true },
  purchase_price: { type: Number, required: true },
  sell_price: { type: Number, required: true },
  purchase_currency: {
    type: String,
    required: true,
    default: "uzs",
    enum: ["uzs", "usd"],
  },
  sell_currency: {
    type: String,
    required: true,
    default: "uzs",
    enum: ["uzs", "usd"],
  },
  storeProduct: { type: Boolean, default: false },
  count_type: {
    type: String,
    required: true,
    enum: [
      "dona", // Alohida mahsulotlar uchun (masalan, bolg'a, tornavida)
      "komplekt", // Komplekt mahsulotlar uchun
      "metr", // Uzunlik o'lchovi (masalan, sim, truba)
      "cm", // Kichik uzunlik o'lchovi (masalan, vintlar)
      "litre", // Hajm o'lchovi (masalan, bo'yoq, yelim)
      "kg", // Og'irlik o'lchovi (masalan, sement, qum)
      "m2", // Maydon o'lchovi (masalan, plitka, oboi)
      "m3", // Hajm o'lchovi (masalan, beton, yog'och)
      "gramm", // Kichik og'irlik o'lchovi (masalan, kimyoviy moddalar)
      "tonna", // Katta og'irlik o'lchovi (masalan, armatura, g'isht)
    ],
    default: "dona",
  },
  barcode: { type: String, required: true, unique: true },
  kimdan_kelgan: { type: String, required: true },
  location: {
    type: String,
    required: true,
    enum: ["sklad", "dokon"],
    default: "sklad",
  }, // New field for location
  description: { type: String, default: "" }, // New field for product description
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

// Method to update stock
productSchema.methods.updateStock = async function (quantity) {
  this.stock -= quantity;
  if (this.stock < 0) {
    throw new Error("Insufficient stock");
  }
  await this.save();
};

// Method to calculate total price
productSchema.methods.calculateTotalPrice = function (quantity) {
  return this.sell_price * quantity;
};

module.exports = mongoose.model("Product", productSchema);
