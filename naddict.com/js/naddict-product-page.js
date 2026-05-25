/**
 * Product PDP: NaddictShop add-to-cart + quantity × unit price display.
 * Include after naddict-shop.js with data-product-slug on the script tag.
 */
(function () {
  'use strict';

  const script = document.currentScript;
  const slug = script && script.getAttribute('data-product-slug');
  if (!slug || !window.NaddictShop) return;

  function getPurchaseType() {
    if (typeof window.currentPurchaseType === 'string') return window.currentPurchaseType;
    const active = document.querySelector('.purchase-type-btn--active');
    return active ? active.getAttribute('data-purchase-type') || 'one-time' : 'one-time';
  }

  function getQuantity() {
    const input = document.getElementById('quantity');
    return Math.max(1, parseInt(input && input.value, 10) || 1);
  }

  function syncPriceDisplay() {
    const qty = getQuantity();
    const purchaseType = getPurchaseType();
    const unit = window.NaddictShop.getUnitPricePounds(slug, purchaseType);
    const lineTotal = unit * qty;
    const label = window.NaddictShop.formatMoney(lineTotal);

    const current = document.querySelector('.price-current');
    if (current) current.textContent = label;

    const oneTime = document.getElementById('one-time-price');
    const subscribe = document.getElementById('subscribe-price');
    if (oneTime) {
      oneTime.textContent = window.NaddictShop.formatMoney(
        window.NaddictShop.getUnitPricePounds(slug, 'one-time')
      );
    }
    if (subscribe) {
      subscribe.textContent = window.NaddictShop.formatMoney(
        window.NaddictShop.getUnitPricePounds(slug, 'subscribe')
      );
    }
  }

  window.increaseQuantity = function () {
    const input = document.getElementById('quantity');
    if (!input) return;
    input.value = String(getQuantity() + 1);
    syncPriceDisplay();
  };

  window.decreaseQuantity = function () {
    const input = document.getElementById('quantity');
    if (!input) return;
    const next = getQuantity() - 1;
    if (next < 1) return;
    input.value = String(next);
    syncPriceDisplay();
  };

  async function naddictAddToCart(e) {
    if (e && e.preventDefault) e.preventDefault();
    const btn = (e && e.target && e.target.closest('button')) || document.getElementById('add-to-cart-btn');
    if (!btn) return;

    const originalHTML = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = '<span class="btn-text">Processing...</span>';

    try {
      const quantity = getQuantity();
      const purchaseType = getPurchaseType();
      await window.NaddictShop.init();
      window.NaddictShop.addToCart(slug, { quantity, purchaseType });

      if (typeof window.initializeCart === 'function') await window.initializeCart();

      if (purchaseType === 'subscribe') {
        const base = window.NaddictShop.getBasePath();
        window.location.href = (base ? base + '/' : '/') + 'checkout.html';
        return;
      }

      if (typeof window.openCartDrawer === 'function') window.openCartDrawer();

      btn.innerHTML = '<span class="btn-text">✓ Added!</span>';
      btn.style.background = '#34cfc7';
      setTimeout(() => {
        btn.innerHTML = originalHTML;
        btn.style.background = '';
        btn.disabled = false;
      }, 1500);
    } catch (err) {
      alert(err.message || 'Unable to add item to cart.');
      btn.disabled = false;
      btn.innerHTML = originalHTML;
      btn.style.background = '';
    }
  }

  window.handleAddToCart = naddictAddToCart;
  window.addToCartRegular = async function () {
    await naddictAddToCart({ preventDefault: function () {} });
  };
  window.createCartWithSellingPlan = window.addToCartRegular;

  function hookPurchaseTypeButtons() {
    document.querySelectorAll('.purchase-type-btn').forEach((btn) => {
      btn.addEventListener('click', function () {
        setTimeout(syncPriceDisplay, 0);
      });
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    window.NaddictShop.init().then(function () {
      syncPriceDisplay();
      hookPurchaseTypeButtons();
      const addBtn = document.getElementById('add-to-cart-btn');
      if (addBtn) {
        const clone = addBtn.cloneNode(true);
        addBtn.parentNode.replaceChild(clone, addBtn);
        clone.addEventListener('click', naddictAddToCart);
      }
    });
  });

  window.addEventListener('naddict:shop-ready', syncPriceDisplay);
})();
