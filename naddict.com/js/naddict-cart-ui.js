/**
 * Binds cart drawer UI to NaddictShop (include after naddict-shop.js).
 */
(function () {
  'use strict';

  let cartItems = [];

  async function refreshCartState() {
    await window.NaddictShop.init();
    cartItems = window.NaddictShop.getCartForDisplay();
  }

  window.initializeCart = async function () {
    await refreshCartState();
    updateCartDisplay();
    updateCartBadge();
  };

  window.openCartDrawer = function () {
    const drawer = document.getElementById('cart-drawer');
    if (!drawer) return;
    drawer.classList.add('active');
    document.body.style.overflow = 'hidden';
    initializeCart();
  };

  window.closeCartDrawer = function () {
    const drawer = document.getElementById('cart-drawer');
    if (!drawer) return;
    drawer.classList.remove('active');
    document.body.style.overflow = '';
  };

  window.addToCart = async function (productId, productName, price, image, quantity = 1, purchaseType = 'one-time') {
    await window.NaddictShop.init();
    const product = window.NaddictShop.getProduct(productId);
    const unitCents = product
      ? (purchaseType === 'subscribe'
          ? product.subscribe_price_cents ?? product.price_cents
          : product.price_cents)
      : Math.round(parseFloat(price) * 100);

    window.NaddictShop.addToCart(productId, {
      quantity,
      purchaseType,
      image,
      unitPriceCents: unitCents,
    });

    await initializeCart();
    if (typeof showAddToCartFeedback === 'function') {
      showAddToCartFeedback(productName);
    }
  };

  window.addSuggestedItem = async function (productId, productName, price, image) {
    await addToCart(productId, productName, price, image, 1);
  };

  window.updateQuantity = async function (button, change) {
    const cartItem = button.closest('.cart-item');
    if (!cartItem) return;

    const lineKey = cartItem.dataset.lineItemKey;
    const display = button.parentElement.querySelector('.quantity-display');
    const currentQty = parseInt(display.textContent, 10) || 1;
    const newQty = currentQty + change;
    if (newQty < 1) return;

    const container = cartItem.querySelector('.cart-item__quantity');
    const minusBtn = container.querySelector('.quantity-btn--minus');
    const plusBtn = container.querySelector('.quantity-btn--plus');
    minusBtn.disabled = plusBtn.disabled = true;

    display.textContent = newQty;
    window.NaddictShop.updateQuantity(lineKey, change);
    await initializeCart();

    minusBtn.disabled = plusBtn.disabled = false;
  };

  window.removeCartItem = async function (button) {
    button.disabled = true;
    const cartItem = button.closest('.cart-item');
    const lineKey = cartItem?.dataset.lineItemKey;
    if (lineKey) {
      window.NaddictShop.removeLine(lineKey);
      await initializeCart();
    }
    button.disabled = false;
  };

  window.proceedToCheckout = function () {
    const base = window.NaddictShop.getBasePath();
    window.location.href = (base ? base + '/' : '/') + 'checkout.html';
  };

  function updateCartDisplay() {
    const container = document.querySelector('.cart-drawer__items');
    if (!container) return;

    container.innerHTML = '';

    if (cartItems.length === 0) {
      container.innerHTML = `
        <div class="empty-cart-drawer">
          <h3 class="empty-cart-drawer__title">Your cart is empty</h3>
          <p class="empty-cart-drawer__text">Start adding items to your cart!</p>
        </div>`;

      ['.cart-drawer__suggestions', '.cart-drawer__summary', '.cart-drawer__checkout'].forEach((sel) => {
        const el = document.querySelector(sel);
        if (el) el.style.display = 'none';
      });
      updateCartTotal();
      return;
    }

    ['.cart-drawer__suggestions', '.cart-drawer__summary', '.cart-drawer__checkout'].forEach((sel) => {
      const el = document.querySelector(sel);
      if (el) el.style.display = 'block';
    });

    cartItems.forEach((item) => {
      const lineKey = item.key;
      const priceLabel = window.NaddictShop.formatMoney(window.NaddictShop.centsToPounds(item.price));
      container.insertAdjacentHTML(
        'beforeend',
        `<div class="cart-item" data-line-item-key="${lineKey}">
          <div class="cart-item__image">
            <img src="${item.image || ''}" alt="${item.product_title}" class="cart-item__img">
          </div>
          <div class="cart-item__details">
            <h3 class="cart-item__name">${item.product_title}</h3>
            <p class="cart-item__price">${priceLabel}${item.purchase_type === 'subscribe' ? ' <small>(subscribe)</small>' : ''}</p>
          </div>
          <div class="cart-item__quantity">
            <button type="button" class="quantity-btn quantity-btn--minus" onclick="updateQuantity(this, -1)">−</button>
            <span class="quantity-display">${item.quantity}</span>
            <button type="button" class="quantity-btn quantity-btn--plus" onclick="updateQuantity(this, 1)">+</button>
          </div>
          <button type="button" class="cart-item__remove" onclick="removeCartItem(this)">×</button>
        </div>`
      );
    });

    updateCartTotal();
  }

  function updateCartBadge() {
    const count = cartItems.reduce((s, i) => s + i.quantity, 0);
    const el = document.getElementById('cart-count');
    if (!el) return;
    el.textContent = count;
    el.style.display = count > 0 ? 'flex' : 'none';
  }

  function updateCartTotal() {
    const subtotalCents = cartItems.reduce((s, i) => s + i.price * i.quantity, 0);
    const subtotal = window.NaddictShop.centsToPounds(subtotalCents);
    const subtotalEl = document.getElementById('subtotal');
    const totalEl = document.getElementById('total');
    if (subtotalEl) subtotalEl.textContent = window.NaddictShop.formatMoney(subtotal);
    if (totalEl) totalEl.textContent = window.NaddictShop.formatMoney(subtotal);
  }

  window.showAddToCartFeedback = function (productName) {
    const el = document.createElement('div');
    el.className = 'cart-feedback';
    el.textContent = productName + ' added to cart';
    el.style.cssText =
      'position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:#34cfc7;color:#fff;padding:12px 24px;border-radius:8px;z-index:10001;font-weight:600;';
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 2500);
  };

  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('cart-drawer__overlay')) closeCartDrawer();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeCartDrawer();
  });

  window.addEventListener('naddict:cart-updated', () => {
    refreshCartState().then(() => {
      updateCartDisplay();
      updateCartBadge();
    });
  });

  document.addEventListener('DOMContentLoaded', () => {
    window.NaddictShop.init().then(() => initializeCart());
  });
})();
