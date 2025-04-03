const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const productController = require("../controllers/productController");
const authMiddleware = require("../middleware/authMiddleware");
const saleController = require("../controllers/saleController");
const debtorController = require("../controllers/debtorController");
const storeController = require("../controllers/storeController");
const budgetController = require("../controllers/budgetController");
const expenseController = require("../controllers/expenseController"); // Expense controllerini import qilish
const usdRateController = require("../controllers/UsdRateController"); // USD kursi uchun kontrollerni import qilish

// Ro'yxatdan o'tish marshruti
router.post("/register", adminController.registerAdmin);
// Kirish marshruti
router.post("/login", adminController.loginAdmin);

// Yangi admin yaratish marshruti (faqat autentifikatsiya qilingan adminlar uchun)
router.post(
  "/create-admin",
  authMiddleware.verifyToken,
  authMiddleware.verifyRole(["admin"]),
  adminController.createAdmin
);
// Barcha adminlarni olish marshruti (faqat autentifikatsiya qilingan adminlar uchun)
router.get(
  "/admins",
  authMiddleware.verifyToken,
  authMiddleware.verifyRole(["admin"]),
  adminController.getAllAdmins
);
// Adminni o'chirish marshruti (faqat autentifikatsiya qilingan adminlar uchun)
router.delete(
  "/admin/:id",
  authMiddleware.verifyToken,
  authMiddleware.verifyRole(["admin"]),
  adminController.deleteAdmin
);
// Adminni tahrirlash marshruti (faqat autentifikatsiya qilingan adminlar uchun)
router.put(
  "/admin/:id",
  authMiddleware.verifyToken,
  authMiddleware.verifyRole(["admin"]),
  adminController.updateAdmin
);
// Mahsulot yaratish marshruti (faqat autentifikatsiya qilingan foydalanuvchilar uchun)
router.post(
  "/products",
  authMiddleware.verifyToken,
  productController.createProduct
);
// Barcha mahsulotlarni olish marshruti (faqat autentifikatsiya qilingan foydalanuvchilar uchun)
router.get(
  "/products",
  authMiddleware.verifyToken,
  productController.getAllProducts
);
// Mahsulotni tahrirlash marshruti (faqat autentifikatsiya qilingan foydalanuvchilar uchun)
router.put(
  "/products/:id",
  authMiddleware.verifyToken,
  productController.updateProduct
);
// Mahsulotni o'chirish marshruti (faqat autentifikatsiya qilingan foydalanuvchilar uchun)
router.delete(
  "/products/:id",
  authMiddleware.verifyToken,
  productController.deleteProduct
);
// Autentifikatsiya qilingan marshrutlar
router.get("/protected-route", authMiddleware.verifyToken, (req, res) => {
  res.status(200).send("This is a protected route");
});
// Sotuvni yozish marshruti
router.post("/sales", saleController.recordSale);
// Sotuv tarixini olish marshruti
router.get("/sales", saleController.getSalesHistory);
// Kunlik sotuvlar statistikasi
router.get("/sales/daily", saleController.getDailySales);
// Haftalik sotuvlar statistikasi
router.get("/sales/weekly", saleController.getWeeklySales);
// Oylik sotuvlar statistikasi
router.get("/sales/monthly", saleController.getMonthlySales);
// Yillik sotuvlar statistikasi
router.get("/sales/yearly", saleController.getYearlySales);
// Sklad va dokonlardagi mahsulotlarni taqqoslash
router.get("/stock/compare", saleController.compareStockLevels);
// Shtrix kod bo'yicha mahsulotni olish marshruti
router.get("/products/barcode/:barcode", productController.getProductByBarcode);
// Yangi qarzdor yaratish marshruti
router.post(
  "/debtors",
  authMiddleware.verifyToken,
  debtorController.createDebtor
);
router.post(
  "/debtors/return",
  authMiddleware.verifyToken,
  debtorController.vazvratDebt
);
// Barcha qarzdorlarni olish marshruti
router.get(
  "/debtors",
  authMiddleware.verifyToken,
  debtorController.getAllDebtors
);
router.put("/debtors/:id/price", authMiddleware.verifyToken, debtorController.updatePrice)
router.put("/debtors/:id/pay", authMiddleware.verifyToken, debtorController.payDebt)
// ID bo'yicha qarzdorni yangilash marshruti
router.put(
  "/debtors/:id",
  authMiddleware.verifyToken,
  debtorController.updateDebtor
);
// ID bo'yicha qarzdorni o'chirish marshruti
router.delete(
  "/debtors/:id",
  authMiddleware.verifyToken,
  debtorController.deleteDebtor
);



router.get("/stat/year", authMiddleware.verifyToken, saleController.getLast12MonthsSales)
// Dokonga mahsulot qo'shish
router.post("/store/add", storeController.addProductToStore);
// Dokondan mahsulot olish
router.get("/store", storeController.getStoreProducts);
// Dokondan mahsulotni o'chirish
router.delete("/store/:id", storeController.removeProductFromStore);
// Dokondan mahsulot sotish
router.post("/store/sell", storeController.sellProductFromStore);
router.post("/store/return", storeController.vazvratTovar);
// Byudjetni olish marshruti
router.get("/budget", budgetController.getBudget);
// Byudjetni yangilash marshruti
router.put("/budget", budgetController.updateBudget);
// Xarajat yaratish marshruti
router.post("/harajat/expenses", expenseController.addExpense);
// Xarajatlarni olish marshruti
router.get("/harajat/expenses", expenseController.getExpenses);
// USD kursini olish
router.get("/usd", usdRateController.getUsdRate);
// USD kursini yangilash
router.post("/usd", usdRateController.updateUsdRate);

router.post("/store/product/create", storeController.createProductToStore);
router.post("/store/quantity/:id", storeController.updateStoreProduct);
module.exports = router;
