const Store = require("../models/Store");
const Product = require("../models/Product");
const Sale = require("../models/Sale");

// Dokonga mahsulot qo'shish
exports.addProductToStore = async (req, res) => {
  try {
    const { product_id, quantity } = req.body;
    const product = await Product.findById(product_id);
    if (!product) {
      return res.status(404).json({ message: "Mahsulot topilmadi" });
    }
    const storeProduct = await Store.findOne({ product_id });
    if (storeProduct) {
      storeProduct.quantity += quantity;
      await storeProduct.save();
    } else {
      const newStoreProduct = new Store({
        product_id: product._id,
        product_name: product.product_name,
        quantity,
      });
      await newStoreProduct.save();
    }

    product.stock -= quantity;
    await product.save({ validateBeforeSave: false });

    res.status(201).json({ message: "Mahsulot dokonga qo'shildi", product });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Dokondan mahsulot olish
exports.getStoreProducts = async (req, res) => {
  try {
    const storeProducts = await Store.find().populate("product_id");
    res.status(200).json(storeProducts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Dokondan mahsulotni o'chirish
exports.removeProductFromStore = async (req, res) => {
  try {
    const { id } = req.params;
    await Store.findByIdAndDelete(id);
    res.status(200).json({ message: "Mahsulot dokondan o'chirildi" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Dokondan mahsulot sotish
exports.sellProductFromStore = async (req, res) => {
  try {
    const { product_id, quantity } = req.body;
    const storeProduct = await Store.findOne({ product_id });

    if (!storeProduct) {
      return res.status(404).json({ message: "Mahsulot dokonda topilmadi" });
    }

    if (storeProduct.quantity < quantity) {
      return res.status(400).json({ message: "Dokonda yetarli mahsulot yo'q" });
    }

    storeProduct.quantity -= quantity;
    await storeProduct.save();

    res
      .status(200)
      .json({ message: "Mahsulot dokondan sotildi", storeProduct });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.vazvratTovar = async (req, res) => {
  try {
    const { quantity, product_id, sale_id } = req.body
    const sale = await Sale.findById(sale_id)

    if (!sale) {
      return res.status(404).json({ message: "Sotuv topilmadi" });
    }
    const skladProduct = await Product.findById(product_id);
    if (!skladProduct) {
      return res.status(404).json({ message: "Mahsulot omborda topilmadi" });
    }
    const storeProduct = await Store.findOne({ product_id });
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

    if (quantity >= sale.quantity) {
      await Sale.findByIdAndDelete(sale_id)
    } else {
      sale.quantity -= quantity
      await sale?.save()
    }
    res.status(200).json({ message: "Mahsulot qaytarildi" })

  } catch (err) {
    console.log(err.message)
    return res.status(500).json({ message: "Serverda xatolik" });
  }
}

exports.createProductToStore = async (req, res) => {
  try {
    const newProduct = new Product({
      ...req.body,
      stock: 0,
      storeProduct: true
    })
    await newProduct.save()
    const newStoreProduct = new Store({
      product_id: newProduct._id,
      product_name: newProduct.product_name,
      quantity: req.body.stock,
    })
    await newStoreProduct.save()
    res.status(201).json({ message: "Mahsulot do'konga qo'shildi", product: newProduct })

  } catch (err) {
    console.log(err.message)
    return res.status(500).json({ message: "Serverda xatolik" });
  }
}

exports.updateStoreProduct = async (req, res) => {
  try {
    const { id } = req.params
    const { quantity } = req.body
    const storeProduct = await Store.findById(id)
    if (!storeProduct) {
      return res.status(404).json({ message: "Mahsulot dokonda topilmadi" });
    }
    storeProduct.quantity = quantity
    await storeProduct.save()
    res.status(200).json({ message: "Mahsulot qiymati o'zgartirildi", storeProduct })
  } catch (err) {
    console.log(err.message)
    return res.status(500).json({ message: "Serverda xatolik" });
  }
}