(() => {
  const CART_KEY = "ash_cart_v1";

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  function loadCart() {
    try {
      const raw = localStorage.getItem(CART_KEY);
      return raw ? JSON.parse(raw) : { items: [] };
    } catch {
      return { items: [] };
    }
  }

  function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }

  function cartCount(cart) {
    return (cart.items || []).reduce((sum, it) => sum + (Number(it.qty) || 0), 0);
  }

  function setCartBadge(count) {
    $$("[data-cart-count]").forEach((el) => (el.textContent = String(count)));
  }

  function addToCart({ sku, name, price, qty = 1 }) {
    const cart = loadCart();
    const items = Array.isArray(cart.items) ? cart.items : [];
    const existing = items.find((i) => i.sku === sku);
    if (existing) existing.qty = (Number(existing.qty) || 0) + qty;
    else items.push({ sku, name, price: Number(price) || 0, qty });
    const next = { items };
    saveCart(next);
    setCartBadge(cartCount(next));
  }

  function fmtMoney(value) {
    try {
      return new Intl.NumberFormat(undefined, { style: "currency", currency: "USD" }).format(value);
    } catch {
      return `$${Number(value).toFixed(2)}`;
    }
  }

  function initNav() {
    const btn = $("[data-nav-toggle]");
    const links = $("[data-nav-links]");
    if (!btn || !links) return;

    btn.addEventListener("click", () => {
      const next = !links.classList.contains("is-open");
      links.classList.toggle("is-open", next);
      btn.setAttribute("aria-expanded", String(next));
      btn.setAttribute("aria-label", next ? "Close menu" : "Open menu");
    });

    document.addEventListener("click", (e) => {
      if (!links.classList.contains("is-open")) return;
      const target = e.target;
      if (!(target instanceof Element)) return;
      if (links.contains(target) || btn.contains(target)) return;
      links.classList.remove("is-open");
      btn.setAttribute("aria-expanded", "false");
      btn.setAttribute("aria-label", "Open menu");
    });
  }

  function initYear() {
    const el = $("[data-year]");
    if (el) el.textContent = String(new Date().getFullYear());
  }

  function initAddToCartButtons() {
    $$("[data-add-to-cart]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const sku = btn.getAttribute("data-sku") || "unknown";
        const name = btn.getAttribute("data-name") || "Product";
        const price = Number(btn.getAttribute("data-price") || 0);
        addToCart({ sku, name, price, qty: 1 });

        btn.animate(
          [
            { transform: "translateY(0) scale(1)", filter: "drop-shadow(0 0 0 rgba(233,106,167,0))" },
            { transform: "translateY(-1px) scale(1.03)", filter: "drop-shadow(0 18px 38px rgba(233,106,167,.26))" },
            { transform: "translateY(0) scale(1)" },
          ],
          { duration: 420, easing: "cubic-bezier(.2,.8,.2,1)" }
        );
      });
    });
  }

  function initTilt() {
    const card = $("[data-tilt]");
    if (!card) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const max = 6;
    const enter = () => (card.style.transition = "transform 140ms ease, box-shadow 140ms ease");
    const move = (e) => {
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      const rx = (-py * max).toFixed(2);
      const ry = (px * max).toFixed(2);
      card.style.transition = "transform 40ms ease";
      card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg)`;
    };
    const leave = () => {
      card.style.transition = "transform 180ms ease";
      card.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg)";
    };

    card.addEventListener("pointerenter", enter);
    card.addEventListener("pointermove", move);
    card.addEventListener("pointerleave", leave);
  }

  function initCartPage() {
    const root = $("#cart");
    if (!root) return;

    const list = $("#cart-items", root);
    const subtotalEl = $("#cart-subtotal", root);
    const shippingEl = $("#cart-shipping", root);
    const totalEl = $("#cart-total", root);

    const cart = loadCart();

    const SHIPPING = cartCount(cart) ? 8 : 0;
    const subtotal = (cart.items || []).reduce((sum, it) => sum + (Number(it.price) || 0) * (Number(it.qty) || 0), 0);
    const total = subtotal + SHIPPING;

    const render = () => {
      const c = loadCart();
      const items = Array.isArray(c.items) ? c.items : [];
      if (!list) return;

      list.innerHTML = items
        .map((it) => {
          const line = (Number(it.price) || 0) * (Number(it.qty) || 0);
          return `
            <div class="cartItem">
              <div class="cartItem__media" aria-hidden="true"></div>
              <div class="cartItem__info">
                <div class="cartItem__name">${escapeHtml(it.name || "Product")}</div>
                <div class="cartItem__meta muted small">${escapeHtml(it.sku || "")}</div>
              </div>
              <div class="cartItem__qty">
                <button class="qtyBtn" type="button" data-qty-dec="${escapeAttr(it.sku)}" aria-label="Decrease quantity">−</button>
                <div class="qtyNum" aria-label="Quantity">${Number(it.qty) || 0}</div>
                <button class="qtyBtn" type="button" data-qty-inc="${escapeAttr(it.sku)}" aria-label="Increase quantity">+</button>
              </div>
              <div class="cartItem__price">${fmtMoney(line)}</div>
              <button class="iconBtn" type="button" data-remove="${escapeAttr(it.sku)}" aria-label="Remove item">✕</button>
            </div>
          `;
        })
        .join("");

      const SHIPPING2 = cartCount(c) ? 8 : 0;
      const subtotal2 = items.reduce((sum, it) => sum + (Number(it.price) || 0) * (Number(it.qty) || 0), 0);
      const total2 = subtotal2 + SHIPPING2;
      if (subtotalEl) subtotalEl.textContent = fmtMoney(subtotal2);
      if (shippingEl) shippingEl.textContent = SHIPPING2 ? fmtMoney(SHIPPING2) : "Free";
      if (totalEl) totalEl.textContent = fmtMoney(total2);
      setCartBadge(cartCount(c));

      if (!items.length) {
        list.innerHTML = `<div class="emptyState">
          <div class="emptyState__title">Your cart is empty</div>
          <div class="muted">Add a scent you love — Veloura is a perfect start.</div>
          <a class="btn btn--primary" href="./products.html" style="width:fit-content;margin-top:14px;">Go shopping</a>
        </div>`;
      }
    };

    root.addEventListener("click", (e) => {
      const t = e.target;
      if (!(t instanceof Element)) return;

      const skuDec = t.getAttribute("data-qty-dec");
      const skuInc = t.getAttribute("data-qty-inc");
      const skuRem = t.getAttribute("data-remove");

      const cart2 = loadCart();
      const items = Array.isArray(cart2.items) ? cart2.items : [];
      if (skuDec) {
        const it = items.find((i) => i.sku === skuDec);
        if (it) it.qty = Math.max(0, (Number(it.qty) || 0) - 1);
      }
      if (skuInc) {
        const it = items.find((i) => i.sku === skuInc);
        if (it) it.qty = (Number(it.qty) || 0) + 1;
      }
      if (skuRem) {
        const idx = items.findIndex((i) => i.sku === skuRem);
        if (idx >= 0) items.splice(idx, 1);
      }

      cart2.items = items.filter((i) => (Number(i.qty) || 0) > 0);
      saveCart(cart2);
      render();
    });

    if (subtotalEl) subtotalEl.textContent = fmtMoney(subtotal);
    if (shippingEl) shippingEl.textContent = SHIPPING ? fmtMoney(SHIPPING) : "Free";
    if (totalEl) totalEl.textContent = fmtMoney(total);
    render();
  }

  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, (m) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[m]));
  }
  function escapeAttr(str) {
    return String(str).replace(/"/g, "&quot;");
  }

  document.addEventListener("DOMContentLoaded", () => {
    initNav();
    initYear();
    initAddToCartButtons();
    initTilt();
    setCartBadge(cartCount(loadCart()));
    initCartPage();
  });
})();

