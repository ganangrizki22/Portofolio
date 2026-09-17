import { useEffect, useMemo, useState } from "react";
import useFetch from "../../hooks/useFetch.js";
import { getStoreProducts } from "../../services/api.js";
import ThemeToggle from "../../components/ThemeToggle/ThemeToggle.jsx";

const CART_STORAGE_KEY = "portfolio-toko-cart";

function loadCart() {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    return [];
  }
}

function formatRupiah(value) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);
}

function TokoApp() {
  const { data: products, loading, error } = useFetch(getStoreProducts, []);
  const [category, setCategory] = useState("Semua");
  const [cart, setCart] = useState(loadCart);
  const [checkoutMessage, setCheckoutMessage] = useState("");

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (err) {
      // localStorage tidak bisa diakses -- abaikan, keranjang cukup hidup di memori.
    }
  }, [cart]);

  const categories = useMemo(() => {
    if (!products) return ["Semua"];
    const unique = [...new Set(products.map((p) => p.category))];
    return ["Semua", ...unique];
  }, [products]);

  const filteredProducts = useMemo(() => {
    if (!products) return [];
    if (category === "Semua") return products;
    return products.filter((p) => p.category === category);
  }, [products, category]);

  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [
        ...prev,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          qty: 1,
        },
      ];
    });
  };

  const changeQty = (id, delta) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === id ? { ...item, qty: item.qty + delta } : item
        )
        .filter((item) => item.qty > 0)
    );
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);
  const cartTotal = cart.reduce((sum, item) => sum + item.qty * item.price, 0);

  const handleCheckout = () => {
    if (cart.length === 0) return;
    setCheckoutMessage(
      `Pesanan berhasil dibuat! Total ${formatRupiah(cartTotal)} untuk ${cartCount} barang. (Ini demo, belum ada pembayaran sungguhan.)`
    );
    setCart([]);
  };

  return (
    <div className="toko-page">
      <div className="container">
        <header className="toko-header">
          <a href="/#projects" className="toko-back-link">
            <i className="bi bi-arrow-left me-2"></i>
            Kembali ke Portofolio
          </a>

          <div className="toko-header-row">
            <div>
              <h1 className="toko-title">Toko Online Sederhana</h1>
              <p className="toko-subtitle">
                Katalog produk dengan keranjang belanja sisi klien, data
                produk diambil dari API Node.js/Express.
              </p>
            </div>

            <button
              type="button"
              className="btn btn-primary toko-cart-btn"
              data-bs-toggle="offcanvas"
              data-bs-target="#cartOffcanvas"
              aria-controls="cartOffcanvas"
            >
              <i className="bi bi-cart3 me-2"></i>
              Keranjang
              {cartCount > 0 && (
                <span className="badge toko-cart-badge ms-2">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </header>

        {checkoutMessage && (
          <div className="toko-checkout-alert" role="status">
            <i className="bi bi-check-circle-fill me-2"></i>
            {checkoutMessage}
          </div>
        )}

        <div className="toko-categories">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              className={`toko-filter-btn${
                category === cat ? " active" : ""
              }`}
              onClick={() => setCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading && <p>Memuat produk...</p>}
        {error && (
          <p className="text-danger">
            Gagal memuat produk. Pastikan server backend sedang berjalan.
          </p>
        )}

        {!loading && !error && (
          <div className="toko-grid">
            {filteredProducts.map((product) => (
              <div className="toko-product-card" key={product.id}>
                <div className="toko-product-icon">
                  <i className={`bi ${product.icon}`}></i>
                </div>
                <span className="badge toko-badge toko-product-category">
                  {product.category}
                </span>
                <h3 className="toko-product-name">{product.name}</h3>
                <p className="toko-product-desc">{product.description}</p>
                <div className="toko-product-footer">
                  <span className="toko-product-price">
                    {formatRupiah(product.price)}
                  </span>
                  <button
                    type="button"
                    className="btn btn-outline-secondary btn-sm"
                    onClick={() => addToCart(product)}
                  >
                    <i className="bi bi-plus-lg me-1"></i>
                    Keranjang
                  </button>
                </div>
              </div>
            ))}

            {filteredProducts.length === 0 && (
              <p className="toko-empty">Tidak ada produk pada kategori ini.</p>
            )}
          </div>
        )}
      </div>

      {/* Panel keranjang belanja */}
      <div
        className="offcanvas offcanvas-end toko-cart-offcanvas"
        tabIndex="-1"
        id="cartOffcanvas"
        aria-labelledby="cartOffcanvasLabel"
      >
        <div className="offcanvas-header">
          <span className="offcanvas-title" id="cartOffcanvasLabel">
            Keranjang Belanja
          </span>
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="offcanvas"
            aria-label="Tutup"
          ></button>
        </div>
        <div className="offcanvas-body d-flex flex-column">
          {cart.length === 0 ? (
            <p className="toko-empty">Keranjang kamu masih kosong.</p>
          ) : (
            <ul className="toko-cart-list list-unstyled flex-grow-1">
              {cart.map((item) => (
                <li className="toko-cart-item" key={item.id}>
                  <div className="toko-cart-item-info">
                    <span className="toko-cart-item-name">{item.name}</span>
                    <span className="toko-cart-item-price">
                      {formatRupiah(item.price)}
                    </span>
                  </div>
                  <div className="toko-cart-item-qty">
                    <button
                      type="button"
                      onClick={() => changeQty(item.id, -1)}
                      aria-label={`Kurangi ${item.name}`}
                    >
                      <i className="bi bi-dash"></i>
                    </button>
                    <span>{item.qty}</span>
                    <button
                      type="button"
                      onClick={() => changeQty(item.id, 1)}
                      aria-label={`Tambah ${item.name}`}
                    >
                      <i className="bi bi-plus"></i>
                    </button>
                  </div>
                  <button
                    type="button"
                    className="toko-cart-remove"
                    onClick={() => removeFromCart(item.id)}
                    aria-label={`Hapus ${item.name}`}
                  >
                    <i className="bi bi-trash3"></i>
                  </button>
                </li>
              ))}
            </ul>
          )}

          <div className="toko-cart-total">
            <span>Total</span>
            <strong>{formatRupiah(cartTotal)}</strong>
          </div>

          <button
            type="button"
            className="btn btn-primary w-100"
            disabled={cart.length === 0}
            data-bs-dismiss="offcanvas"
            onClick={handleCheckout}
          >
            Checkout
          </button>
        </div>
      </div>

      <ThemeToggle />
    </div>
  );
}

export default TokoApp;
