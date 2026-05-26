(function(modules) {
    var installedModules = {};
    function __webpack_require__(moduleId) {
        if (installedModules[moduleId]) return installedModules[moduleId].exports;
        var module = installedModules[moduleId] = {
            i: moduleId,
            l: false,
            exports: {}
        };
        modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
        module.l = true;
        return module.exports;
    }
    __webpack_require__.m = modules;
    __webpack_require__.c = installedModules;
    __webpack_require__.d = function(exports, name, getter) {
        if (!__webpack_require__.o(exports, name)) Object.defineProperty(exports, name, {
            enumerable: true,
            get: getter
        });
    };
    __webpack_require__.r = function(exports) {
        if ("undefined" !== typeof Symbol && Symbol.toStringTag) Object.defineProperty(exports, Symbol.toStringTag, {
            value: "Module"
        });
        Object.defineProperty(exports, "__esModule", {
            value: true
        });
    };
    __webpack_require__.t = function(value, mode) {
        if (1 & mode) value = __webpack_require__(value);
        if (8 & mode) return value;
        if (4 & mode && "object" === typeof value && value && value.__esModule) return value;
        var ns = Object.create(null);
        __webpack_require__.r(ns);
        Object.defineProperty(ns, "default", {
            enumerable: true,
            value: value
        });
        if (2 & mode && "string" != typeof value) for (var key in value) __webpack_require__.d(ns, key, function(key) {
            return value[key];
        }.bind(null, key));
        return ns;
    };
    __webpack_require__.n = function(module) {
        var getter = module && module.__esModule ? function() {
            return module["default"];
        } : function() {
            return module;
        };
        __webpack_require__.d(getter, "a", getter);
        return getter;
    };
    __webpack_require__.o = function(object, property) {
        return Object.prototype.hasOwnProperty.call(object, property);
    };
    __webpack_require__.p = "";
    return __webpack_require__(__webpack_require__.s = "./assets/js/main.js");
})({
    "./assets/js/main.js": function(module, exports) {
        eval("// Cart State\nlet cart = JSON.parse(localStorage.getItem('cart')) || [];\nwindow.currentFulfillment = 'delivery';\n\n// UI Elements\nconst cartCount = document.querySelector('.cart-count');\nconst cartItemsContainer = document.getElementById('cartItems');\nconst subtotalEl = document.querySelector('.subtotal');\nconst taxEl = document.querySelector('.tax');\nconst totalEl = document.querySelector('.total-price');\nconst chatToggle = document.getElementById('chatToggle');\nconst chatWidget = document.getElementById('chatWidget');\n\n// Initialize\nfunction init() {\n  updateCartUI();\n  setupEventListeners();\n  if (window.location.pathname.includes('cart')) renderCart();\n  if (window.location.pathname.includes('checkout')) renderCheckout();\n}\nfunction setupEventListeners() {\n  var _document$querySelect, _document$getElementB, _document$getElementB2;\n  // Add to Cart\n  document.querySelectorAll('.add-to-cart').forEach(btn => {\n    btn.addEventListener('click', e => {\n      const {\n        id,\n        name,\n        price\n      } = e.target.dataset;\n      addToCart(id, name, parseFloat(price));\n\n      // Animation\n      btn.innerText = 'Added!';\n      setTimeout(() => btn.innerText = 'Add to Cart', 1000);\n    });\n  });\n\n  // Chat Toggle\n  if (chatToggle) {\n    chatToggle.addEventListener('click', () => {\n      chatWidget.classList.toggle('active');\n    });\n  }\n  (_document$querySelect = document.querySelector('.close-chat')) === null || _document$querySelect === void 0 || _document$querySelect.addEventListener('click', () => {\n    chatWidget.classList.remove('active');\n  });\n\n  // Order Tracking\n  (_document$getElementB = document.getElementById('trackBtn')) === null || _document$getElementB === void 0 || _document$getElementB.addEventListener('click', () => {\n    const id = document.getElementById('orderIdInput').value;\n    if (id) {\n      document.getElementById('statusDisplay').style.display = 'block';\n    }\n  });\n\n  // Fulfillment Selector in Checkout\n  const deliveryBtn = document.getElementById('deliveryBtn');\n  const pickupBtn = document.getElementById('pickupBtn');\n  const deliveryDetails = document.getElementById('deliveryDetails');\n  const pickupDetails = document.getElementById('pickupDetails');\n  const deliveryAddressInput = document.getElementById('deliveryAddressInput');\n  if (deliveryBtn && pickupBtn) {\n    deliveryBtn.addEventListener('click', () => {\n      if (window.currentFulfillment === 'delivery') return;\n      window.currentFulfillment = 'delivery';\n      deliveryBtn.classList.add('active');\n      pickupBtn.classList.remove('active');\n\n      // Show/Hide\n      if (deliveryDetails) deliveryDetails.style.display = 'block';\n      if (pickupDetails) pickupDetails.style.display = 'none';\n\n      // Required state\n      deliveryAddressInput === null || deliveryAddressInput === void 0 || deliveryAddressInput.setAttribute('required', 'true');\n\n      // Recalculate\n      recalculateCheckoutTotals();\n    });\n    pickupBtn.addEventListener('click', () => {\n      if (window.currentFulfillment === 'pickup') return;\n      window.currentFulfillment = 'pickup';\n      pickupBtn.classList.add('active');\n      deliveryBtn.classList.remove('active');\n\n      // Show/Hide\n      if (deliveryDetails) deliveryDetails.style.display = 'none';\n      if (pickupDetails) pickupDetails.style.display = 'block';\n\n      // Required state\n      deliveryAddressInput === null || deliveryAddressInput === void 0 || deliveryAddressInput.removeAttribute('required');\n\n      // Recalculate\n      recalculateCheckoutTotals();\n    });\n  }\n\n  // Checkout Form\n  (_document$getElementB2 = document.getElementById('checkoutForm')) === null || _document$getElementB2 === void 0 || _document$getElementB2.addEventListener('submit', e => {\n    e.preventDefault();\n    alert('Thank you! Your payment of ' + totalEl.innerText + ' was successful. Order GH-' + Math.floor(Math.random() * 90000 + 10000) + ' confirmed.');\n    localStorage.removeItem('cart');\n    window.location.href = '/order-confirmation';\n  });\n\n  // Reviews Slider Logic\n  const prevReviewBtn = document.getElementById('prevReviewBtn');\n  const nextReviewBtn = document.getElementById('nextReviewBtn');\n  const reviewsTrack = document.getElementById('reviewsTrack');\n  const reviewCards = document.querySelectorAll('.review-card');\n  const sliderDots = document.querySelectorAll('.slider-dots .dot');\n  if (reviewsTrack && reviewCards.length > 0) {\n    let currentIdx = 0;\n    const totalCards = reviewCards.length;\n    const updateSlider = idx => {\n      currentIdx = (idx + totalCards) % totalCards;\n\n      // Transform track position\n      reviewsTrack.style.transform = \"translateX(-\".concat(currentIdx * 100, \"%)\");\n\n      // Toggle active class on cards\n      reviewCards.forEach((card, cI) => {\n        if (cI === currentIdx) card.classList.add('active');else card.classList.remove('active');\n      });\n\n      // Toggle active class on dots\n      sliderDots.forEach((dot, dI) => {\n        if (dI === currentIdx) dot.classList.add('active');else dot.classList.remove('active');\n      });\n    };\n    prevReviewBtn === null || prevReviewBtn === void 0 || prevReviewBtn.addEventListener('click', () => updateSlider(currentIdx - 1));\n    nextReviewBtn === null || nextReviewBtn === void 0 || nextReviewBtn.addEventListener('click', () => updateSlider(currentIdx + 1));\n    sliderDots.forEach(dot => {\n      dot.addEventListener('click', e => {\n        const idx = parseInt(e.target.dataset.index);\n        updateSlider(idx);\n      });\n    });\n  }\n}\nfunction addToCart(id, name, price) {\n  const existing = cart.find(item => item.id === id);\n  if (existing) {\n    existing.quantity += 1;\n  } else {\n    cart.push({\n      id,\n      name,\n      price,\n      quantity: 1\n    });\n  }\n  saveCart();\n  updateCartUI();\n}\nfunction saveCart() {\n  localStorage.setItem('cart', JSON.stringify(cart));\n}\nfunction updateCartUI() {\n  if (cartCount) {\n    const count = cart.reduce((sum, item) => sum + item.quantity, 0);\n    cartCount.innerText = count;\n  }\n}\nconst itemImages = {\n  '1': '/img/products/appetizer.png',\n  '2': '/img/products/main.png',\n  '3': '/img/products/dessert.png',\n  '4': '/img/products/drink.png',\n  '5': '/img/products/turbot_roti.png',\n  '6': '/img/products/elixir_or.png',\n  '7': '/img/products/caviar.png',\n  '8': '/img/products/foie_gras.png',\n  '9': '/img/products/duck.png',\n  '10': '/img/products/venison.png',\n  '11': '/img/products/mille_feuille.png',\n  '12': '/img/products/souffle.png',\n  '13': '/img/products/emerald_fizz.png',\n  '14': '/img/products/nectar_noir.png'\n};\nfunction renderCart() {\n  if (!cartItemsContainer) return;\n  if (cart.length === 0) {\n    cartItemsContainer.innerHTML = \"\\n\\t\\t\\t<div class=\\\"empty-msg\\\">\\n\\t\\t\\t\\t<i class=\\\"fas fa-shopping-bag\\\"></i>\\n\\t\\t\\t\\t<p>Your culinary selections cart is currently empty.</p>\\n\\t\\t\\t\\t<a href=\\\"/menu\\\" class=\\\"browse-btn\\\">Browse our Menu</a>\\n\\t\\t\\t</div>\\n\\t\\t\";\n    return;\n  }\n  let html = '';\n  let subtotal = 0;\n  cart.forEach(item => {\n    const total = item.price * item.quantity;\n    subtotal += total;\n    const imgSrc = itemImages[item.id] || '/img/products/main.png';\n    html += \"\\n            <div class=\\\"cart-item\\\">\\n                <img src=\\\"\".concat(imgSrc, \"\\\" alt=\\\"\").concat(item.name, \"\\\" />\\n                <div class=\\\"item-details\\\">\\n                    <h4>\").concat(item.name, \"</h4>\\n                    <p>$\").concat(item.price.toFixed(2), \" x \").concat(item.quantity, \"</p>\\n                </div>\\n                <div class=\\\"item-price\\\">$\").concat(total.toFixed(2), \"</div>\\n                <button class=\\\"remove-item\\\" onclick=\\\"removeItem('\").concat(item.id, \"')\\\"><i class=\\\"fas fa-trash-alt\\\"></i></button>\\n            </div>\\n        \");\n  });\n  cartItemsContainer.innerHTML = html;\n  calculateTotals(subtotal);\n}\nfunction calculateTotals(subtotal) {\n  const tax = subtotal * 0.08;\n  const total = subtotal + tax;\n  if (subtotalEl) subtotalEl.innerText = \"$\".concat(subtotal.toFixed(2));\n  if (taxEl) taxEl.innerText = \"$\".concat(tax.toFixed(2));\n  if (totalEl) totalEl.innerText = \"$\".concat(total.toFixed(2));\n}\nwindow.removeItem = function (id) {\n  cart = cart.filter(item => item.id !== id);\n  saveCart();\n  updateCartUI();\n  renderCart();\n};\nfunction renderCheckout() {\n  const reviewItems = document.getElementById('reviewItems');\n  if (!reviewItems) return;\n  let subtotal = 0;\n  let html = '';\n  cart.forEach(item => {\n    const total = item.price * item.quantity;\n    subtotal += total;\n    html += \"<p>\".concat(item.name, \" x \").concat(item.quantity, \" <span>$\").concat(total.toFixed(2), \"</span></p>\");\n  });\n  reviewItems.innerHTML = html;\n  recalculateCheckoutTotals();\n}\nwindow.recalculateCheckoutTotals = function () {\n  const deliveryFeeEl = document.querySelector('.delivery-fee');\n  let subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);\n  const deliveryFee = window.currentFulfillment === 'delivery' ? 5.0 : 0.0;\n  const tax = subtotal * 0.08;\n  const total = subtotal + deliveryFee + tax;\n  if (subtotalEl) subtotalEl.innerText = \"$\".concat(subtotal.toFixed(2));\n  if (deliveryFeeEl) deliveryFeeEl.innerText = \"$\".concat(deliveryFee.toFixed(2));\n  if (taxEl) taxEl.innerText = \"$\".concat(tax.toFixed(2));\n  if (totalEl) totalEl.innerText = \"$\".concat(total.toFixed(2));\n};\ndocument.addEventListener('DOMContentLoaded', init);\n\n//# sourceURL=webpack:///./assets/js/main.js?");
    }
});