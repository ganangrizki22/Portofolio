const fs = require("fs");
const path = require("path");

const dataPath = path.join(__dirname, "..", "data", "products.json");

// GET /api/products
// Mengembalikan daftar seluruh produk, opsional difilter lewat query ?category=
function getProducts(req, res, next) {
  try {
    const raw = fs.readFileSync(dataPath, "utf-8");
    let products = JSON.parse(raw);

    const { category } = req.query;
    if (category) {
      products = products.filter(
        (product) => product.category.toLowerCase() === category.toLowerCase()
      );
    }

    res.json({ success: true, data: products });
  } catch (err) {
    next(err);
  }
}

module.exports = { getProducts };
