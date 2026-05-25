/**
 * Naddict shop — localStorage cart + Supabase products/orders via /api/*
 */
(function (global) {
  'use strict';

  const CART_KEY = 'naddict_cart_v1';
  const CURRENCY = 'GBP';

  const FALLBACK_PRODUCTS = [
    {
      slug: 'nad-smartstrip',
      name: 'NAD SmartStrip+',
      description: 'Smartstrip+ with SpeedRelease.',
      price_cents: 6900,
      subscribe_price_cents: 4900,
      image_url: 'cdn/shop/t/32/assets/Nad%20Strip9321.png?v=172847355907439936341775885985',
    },
    {
      slug: 'nad-prime-vials',
      name: 'Nad+Prime Vial kit',
      description: 'Pure, potent NAD+ vial kit.',
      price_cents: 24900,
      subscribe_price_cents: 21165,
      image_url: 'cdn/shop/t/32/assets/Vialsff43.png?v=90810362016220207791775885985',
    },
  ];

  let productsBySlug = {};
  let readyPromise = null;

  function formatMoney(pounds) {
    return '£' + Number(pounds).toFixed(2);
  }

  function centsToPounds(cents) {
    return cents / 100;
  }

  function getBasePath() {
    const path = global.location.pathname || '/';
    if (path.includes('/pages/') || path.includes('/products/')) return '..';
    return '';
  }

  function apiUrl(path) {
    const base = getBasePath();
    const prefix = base ? base + '/' : '/';
    return prefix + path.replace(/^\//, '');
  }

  function loadCart() {
    try {
      const raw = global.localStorage.getItem(CART_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  function saveCart(items) {
    global.localStorage.setItem(CART_KEY, JSON.stringify(items));
    global.dispatchEvent(new CustomEvent('naddict:cart-updated', { detail: { items } }));
  }

  function getProduct(slug) {
    return productsBySlug[slug] || null;
  }

  function unitPriceCents(product, purchaseType) {
    if (!product) return 0;
    if (purchaseType === 'subscribe' && product.subscribe_price_cents != null) {
      return product.subscribe_price_cents;
    }
    return product.price_cents;
  }

  function lineKey(slug, purchaseType) {
    return slug + ':' + (purchaseType || 'one-time');
  }

  function toShopifyShape(items) {
    return items.map((line, index) => ({
      key: line.key,
      variant_id: line.slug,
      id: line.slug,
      product_title: line.name,
      title: line.name,
      quantity: line.quantity,
      price: line.unit_price_cents,
      image: line.image_url,
      purchase_type: line.purchase_type,
    }));
  }

  async function init() {
    if (readyPromise) return readyPromise;

    readyPromise = (async () => {
      try {
        const res = await fetch(apiUrl('api/products'));
        const data = await res.json();
        const list = data.products?.length ? data.products : FALLBACK_PRODUCTS;
        productsBySlug = Object.fromEntries(list.map((p) => [p.slug, p]));
      } catch {
        productsBySlug = Object.fromEntries(FALLBACK_PRODUCTS.map((p) => [p.slug, p]));
      }
    })();

    return readyPromise;
  }

  function getItems() {
    return loadCart();
  }

  function getCartForDisplay() {
    return toShopifyShape(loadCart());
  }

  function getItemCount() {
    return loadCart().reduce((n, l) => n + l.quantity, 0);
  }

  function getSubtotalCents() {
    return loadCart().reduce((n, l) => n + l.unit_price_cents * l.quantity, 0);
  }

  function addToCart(slug, options = {}) {
    const product = getProduct(slug);
    if (!product) {
      throw new Error('Unknown product: ' + slug);
    }

    const purchaseType = options.purchaseType || 'one-time';
    const quantity = Math.max(1, parseInt(options.quantity, 10) || 1);
    const key = lineKey(slug, purchaseType);
    const unit = options.unitPriceCents != null
      ? options.unitPriceCents
      : unitPriceCents(product, purchaseType);

    const cart = loadCart();
    const existing = cart.find((l) => l.key === key);

    if (existing) {
      existing.quantity += quantity;
    } else {
      cart.push({
        key,
        slug: product.slug,
        name: product.name,
        image_url: options.image || product.image_url,
        quantity,
        unit_price_cents: unit,
        purchase_type: purchaseType,
      });
    }

    saveCart(cart);
    return cart;
  }

  function setQuantity(lineKey, quantity) {
    const cart = loadCart();
    const line = cart.find((l) => l.key === lineKey);
    if (!line) return cart;

    const qty = parseInt(quantity, 10);
    if (qty < 1) return cart;

    line.quantity = qty;
    saveCart(cart);
    return cart;
  }

  function updateQuantity(lineKey, delta) {
    const cart = loadCart();
    const line = cart.find((l) => l.key === lineKey);
    if (!line) return cart;

    const next = line.quantity + delta;
    if (next < 1) return cart;

    line.quantity = next;
    saveCart(cart);
    return cart;
  }

  function removeLine(lineKey) {
    const cart = loadCart().filter((l) => l.key !== lineKey);
    saveCart(cart);
    return cart;
  }

  function clearCart() {
    saveCart([]);
  }

  async function submitOrder({ email, fullName, notes }) {
    const items = loadCart();
    if (!items.length) throw new Error('Cart is empty');

    const res = await fetch(apiUrl('api/checkout'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        fullName,
        notes,
        items: items.map((l) => ({
          product_slug: l.slug,
          product_name: l.name,
          quantity: l.quantity,
          unit_price_cents: l.unit_price_cents,
          purchase_type: l.purchase_type,
          image_url: l.image_url,
        })),
      }),
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data.error || 'Checkout failed');
    }

    clearCart();
    return data;
  }

  /** Effective unit price in GBP for showcase / product picker */
  function getUnitPricePounds(slug, purchaseType) {
    const product = getProduct(slug);
    if (!product) return 0;
    return centsToPounds(unitPriceCents(product, purchaseType));
  }

  const NaddictShop = {
    init,
    getProduct,
    getProducts: () => Object.values(productsBySlug),
    getItems,
    getCartForDisplay,
    getItemCount,
    getSubtotalCents,
    addToCart,
    setQuantity,
    updateQuantity,
    removeLine,
    clearCart,
    submitOrder,
    getUnitPricePounds,
    formatMoney,
    centsToPounds,
    apiUrl,
    getBasePath,
  };

  global.NaddictShop = NaddictShop;

  global.addEventListener('DOMContentLoaded', () => {
    init().then(() => {
      global.dispatchEvent(new CustomEvent('naddict:shop-ready'));
    });
  });
})(typeof window !== 'undefined' ? window : globalThis);
