
    (function() {
      var preconnectOrigins = ["https://cdn.shopify.com"];
      var scripts = ["/cdn/shopifycloud/checkout-web/assets/c1/polyfills-legacy.8-IUM0k7.js","/cdn/shopifycloud/checkout-web/assets/c1/app-legacy.BnDatSKi.js","/cdn/shopifycloud/checkout-web/assets/c1/esnext-vendor-legacy.CNgpDVuc.js","/cdn/shopifycloud/checkout-web/assets/c1/browser-legacy.DDtqmfOj.js","/cdn/shopifycloud/checkout-web/assets/c1/shared-is-shop-pay-active-legacy.Bc0L8x1E.js","/cdn/shopifycloud/checkout-web/assets/c1/types-UnauthenticatedErrorModalPayload-legacy.CAjbZfTG.js","/cdn/shopifycloud/checkout-web/assets/c1/images-payment-icon-legacy.BW3R3WiF.js","/cdn/shopifycloud/checkout-web/assets/c1/context-utilities-legacy.BJNQWj-5.js","/cdn/shopifycloud/checkout-web/assets/c1/utilities-shop-discount-offer-legacy.C-gT1QGT.js","/cdn/shopifycloud/checkout-web/assets/c1/NotFound-legacy.BTKVoPDc.js","/cdn/shopifycloud/checkout-web/assets/c1/shared-unactionable-errors-legacy.Ca8-yBNp.js","/cdn/shopifycloud/checkout-web/assets/c1/helpers-installmentsNotSupportedForAddress-legacy.EDZ_3xy_.js","/cdn/shopifycloud/checkout-web/assets/c1/extensibility-shared-legacy.CCjYiTqi.js","/cdn/shopifycloud/checkout-web/assets/c1/hooks-useShopPayCheckoutGqlVersion-legacy.BKQp0Unj.js","/cdn/shopifycloud/checkout-web/assets/c1/graphql-ShopPayCheckoutSessionQuery-legacy.mTetygxv.js","/cdn/shopifycloud/checkout-web/assets/c1/helpers-setAddressErrors-legacy._EEgpTo5.js","/cdn/shopifycloud/checkout-web/assets/c1/types-index-legacy.D3zVVVe-.js","/cdn/shopifycloud/checkout-web/assets/c1/images-flag-icon-legacy.Bfupgm8k.js","/cdn/shopifycloud/checkout-web/assets/c1/locale-en-legacy.Bc4hhVTA.js","/cdn/shopifycloud/checkout-web/assets/c1/page-OnePage-legacy.DHtBXeCu.js","/cdn/shopifycloud/checkout-web/assets/c1/hooks-useWalletsTimeout-legacy.3-83tAAg.js","/cdn/shopifycloud/checkout-web/assets/c1/remember-me-hooks-legacy.Cq11ZKX9.js","/cdn/shopifycloud/checkout-web/assets/c1/MarketsProDisclaimer-legacy.nKu-fAlw.js","/cdn/shopifycloud/checkout-web/assets/c1/SplitDeliveryMerchandiseContainer-legacy.BmMjLmK3.js","/cdn/shopifycloud/checkout-web/assets/c1/useShopPayButtonClassName-legacy.D5qQZFTj.js","/cdn/shopifycloud/checkout-web/assets/c1/ChangeCompanyLocationLink-legacy.ByAfqqtB.js","/cdn/shopifycloud/checkout-web/assets/c1/WalletsSandbox-WalletSandbox-legacy.CIUtny08.js","/cdn/shopifycloud/checkout-web/assets/c1/hooks-useUnauthenticatedErrorModal-legacy.Dqx7t5jV.js","/cdn/shopifycloud/checkout-web/assets/c1/hooks-useForceShopPayUrl-legacy.B5K-x3Ng.js","/cdn/shopifycloud/checkout-web/assets/c1/GooglePayButton-index-legacy.BQR_ktgQ.js","/cdn/shopifycloud/checkout-web/assets/c1/ShippingGroupsSummaryLine-legacy.Dp1r10vK.js","/cdn/shopifycloud/checkout-web/assets/c1/StackedMerchandisePreview-legacy.4angiKSe.js","/cdn/shopifycloud/checkout-web/assets/c1/AutocompleteField-hooks-legacy.BphTiGtT.js","/cdn/shopifycloud/checkout-web/assets/c1/LocalizationExtensionField-legacy.CZzpNq8G.js","/cdn/shopifycloud/checkout-web/assets/c1/hooks-useShopPayPaymentRequiredMethod-legacy.VN6ue1aN.js","/cdn/shopifycloud/checkout-web/assets/c1/hooks-useUpdateCheckoutAddress-legacy.Dd6EZKT_.js","/cdn/shopifycloud/checkout-web/assets/c1/ShopPayOptInDisclaimer-legacy.BfzSkU8x.js","/cdn/shopifycloud/checkout-web/assets/c1/hooks-useShowShopPayOptin-legacy.D3CSDp3T.js","/cdn/shopifycloud/checkout-web/assets/c1/hooks-useHasOrdersFromMultipleShops-legacy.BS91l39X.js","/cdn/shopifycloud/checkout-web/assets/c1/hooks-useGeneralPaymentErrorMessage-legacy.CiOmW72C.js","/cdn/shopifycloud/checkout-web/assets/c1/PayPalOverCaptureInfoBanner-legacy.BsbJtVK3.js","/cdn/shopifycloud/checkout-web/assets/c1/RememberMeDescriptionText-legacy.DvD0qSHk.js","/cdn/shopifycloud/checkout-web/assets/c1/Section-legacy.Ckc-0v5L.js","/cdn/shopifycloud/checkout-web/assets/c1/MobileOrderSummary-legacy.jrDH6LFW.js","/cdn/shopifycloud/checkout-web/assets/c1/hooks-useOnePageFormSubmit-legacy.CAGT_MHT.js","/cdn/shopifycloud/checkout-web/assets/c1/utilities-get-negotiation-input-legacy.CIO1Si_V.js","/cdn/shopifycloud/checkout-web/assets/c1/shop-cash-constants-legacy.BaJZmjmN.js","/cdn/shopifycloud/checkout-web/assets/c1/PaymentErrorBanner-legacy.BdldF68A.js","/cdn/shopifycloud/checkout-web/assets/c1/StockProblems-StockProblemsLineItemList-legacy.xwgaUuRV.js","/cdn/shopifycloud/checkout-web/assets/c1/DutyOptions-legacy.DRHFobq_.js","/cdn/shopifycloud/checkout-web/assets/c1/ShipmentBreakdown-legacy.CaJdTKPG.js","/cdn/shopifycloud/checkout-web/assets/c1/MerchandiseModal-legacy.uIVfeZoj.js","/cdn/shopifycloud/checkout-web/assets/c1/extension-targets-shipping-options-legacy.1Ax4toSV.js","/cdn/shopifycloud/checkout-web/assets/c1/ShippingMethodSelector-legacy.VEOtGNUn.js","/cdn/shopifycloud/checkout-web/assets/c1/SubscriptionPriceBreakdown-legacy.DQUnm1uo.js","/cdn/shopifycloud/checkout-web/assets/c1/hooks-useSubscribeMessenger-legacy.CyYLeyHt.js"];
      var styles = [];
      var fontPreconnectUrls = [];
      var fontPrefetchUrls = [];
      var imgPrefetchUrls = ["https://cdn.shopify.com/s/files/1/0953/5468/3775/files/Naddict_logo_black_x320.png?v=1762804505"];

      function preconnect(url, callback) {
        var link = document.createElement('link');
        link.rel = 'dns-prefetch preconnect';
        link.href = url;
        link.crossOrigin = '';
        link.onload = link.onerror = callback;
        document.head.appendChild(link);
      }

      function preconnectAssets() {
        var resources = preconnectOrigins.concat(fontPreconnectUrls);
        var index = 0;
        (function next() {
          var res = resources[index++];
          if (res) preconnect(res, next);
        })();
      }

      function prefetch(url, as, callback) {
        var link = document.createElement('link');
        if (link.relList.supports('prefetch')) {
          link.rel = 'prefetch';
          link.fetchPriority = 'low';
          link.as = as;
          if (as === 'font') link.type = 'font/woff2';
          link.href = url;
          link.crossOrigin = '';
          link.onload = link.onerror = callback;
          document.head.appendChild(link);
        } else {
          var xhr = new XMLHttpRequest();
          xhr.open('GET', url, true);
          xhr.onloadend = callback;
          xhr.send();
        }
      }

      function prefetchAssets() {
        var resources = [].concat(
          scripts.map(function(url) { return [url, 'script']; }),
          styles.map(function(url) { return [url, 'style']; }),
          fontPrefetchUrls.map(function(url) { return [url, 'font']; }),
          imgPrefetchUrls.map(function(url) { return [url, 'image']; })
        );
        var index = 0;
        function run() {
          var res = resources[index++];
          if (res) prefetch(res[0], res[1], next);
        }
        var next = (self.requestIdleCallback || setTimeout).bind(self, run);
        next();
      }

      function onLoaded() {
        try {
          if (parseFloat(navigator.connection.effectiveType) > 2 && !navigator.connection.saveData) {
            preconnectAssets();
            prefetchAssets();
          }
        } catch (e) {}
      }

      if (document.readyState === 'complete') {
        onLoaded();
      } else {
        addEventListener('load', onLoaded);
      }
    })();
  