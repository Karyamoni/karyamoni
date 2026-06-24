/**
 * IKAS Extensions > Custom Script
 * Paste this into the IKAS Admin → Extensions → Custom Scripts panel.
 *
 * Injects a "3D Cabinet" button on the Product Detail Page (PDP).
 * The button opens the Karyamoni Try-On cabin in a new tab, passing
 * the current product ID so the correct garment model is loaded.
 *
 * Replace KARYAMONI_PLUGIN_URL with your deployed plugin URL.
 */
(function () {
  "use strict";

  var PLUGIN_URL = "https://YOUR_PLUGIN_URL"; // ← replace before deploying

  function getProductId() {
    // IKAS PDP URL pattern: /admin/product/:id or /admin/product/:id/edit
    var match = window.location.pathname.match(/\/admin\/product\/([^/]+)/);
    return match ? match[1] : null;
  }

  function injectButton() {
    // Avoid double-injection
    if (document.getElementById("karyamoni-3d-btn")) return;

    var productId = getProductId();
    if (!productId) return;

    var btn = document.createElement("button");
    btn.id = "karyamoni-3d-btn";
    btn.textContent = "3D Cabinet";
    btn.title = "Open Karyamoni Virtual Fitting Cabin";
    btn.setAttribute("type", "button");

    Object.assign(btn.style, {
      display: "inline-flex",
      alignItems: "center",
      gap: "6px",
      padding: "8px 16px",
      background: "#beff5c",
      color: "#0a0a0a",
      border: "none",
      borderRadius: "4px",
      fontSize: "14px",
      fontWeight: "600",
      letterSpacing: "-0.01em",
      cursor: "pointer",
      marginLeft: "8px",
      transition: "opacity 0.15s ease",
    });

    btn.onmouseenter = function () { btn.style.opacity = "0.85"; };
    btn.onmouseleave = function () { btn.style.opacity = "1"; };

    btn.onclick = function () {
      var url = PLUGIN_URL + "/dashboard/try-on?productId=" + encodeURIComponent(productId);
      window.open(url, "_blank", "noopener,noreferrer");
    };

    // Try known IKAS PDP action bar selectors; fall back to header area
    var targets = [
      "[data-testid='product-actions']",
      "[class*='product-detail__actions']",
      "[class*='ProductDetail__actions']",
      "header[class*='product']",
      "main h1",
    ];

    var container = null;
    for (var i = 0; i < targets.length; i++) {
      container = document.querySelector(targets[i]);
      if (container) break;
    }

    if (container) {
      container.appendChild(btn);
    } else {
      // Last-resort: fixed position overlay
      btn.style.position = "fixed";
      btn.style.bottom = "24px";
      btn.style.right = "24px";
      btn.style.zIndex = "9999";
      btn.style.boxShadow = "0 4px 24px rgba(0,0,0,0.3)";
      document.body.appendChild(btn);
    }
  }

  // Run on initial load and after SPA navigation
  injectButton();
  var observer = new MutationObserver(injectButton);
  observer.observe(document.body, { childList: true, subtree: true });
})();
