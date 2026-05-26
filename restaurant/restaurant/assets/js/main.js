// Base path detection for subfolder hosting (e.g. GitHub Pages)
const basePath = window.location.pathname.startsWith('/IT499-Capstone')
	? '/IT499-Capstone'
	: '';

// Cart State
let cart = JSON.parse(localStorage.getItem('cart')) || [];
window.currentFulfillment = 'delivery';

// UI Elements
const cartCount = document.querySelector('.cart-count');
const cartItemsContainer = document.getElementById('cartItems');
const subtotalEl = document.querySelector('.subtotal');
const taxEl = document.querySelector('.tax');
const totalEl = document.querySelector('.total-price');
const chatToggle = document.getElementById('chatToggle');
const chatWidget = document.getElementById('chatWidget');

// Initialize
function init() {
	updateCartUI();
	setupEventListeners();
	if (window.location.pathname.includes('cart')) renderCart();
	if (window.location.pathname.includes('checkout')) renderCheckout();
}

function setupEventListeners() {
	// Add to Cart
	document.querySelectorAll('.add-to-cart').forEach(btn => {
		btn.addEventListener('click', e => {
			const { id, name, price } = e.target.dataset;
			addToCart(id, name, parseFloat(price));

			// Animation
			btn.innerText = 'Added!';
			setTimeout(() => (btn.innerText = 'Add to Cart'), 1000);
		});
	});

	// Chat Toggle
	if (chatToggle) {
		chatToggle.addEventListener('click', () => {
			chatWidget.classList.toggle('active');
		});
	}

	document.querySelector('.close-chat')?.addEventListener('click', () => {
		chatWidget.classList.remove('active');
	});

	// Order Tracking
	document.getElementById('trackBtn')?.addEventListener('click', () => {
		const id = document.getElementById('orderIdInput').value;
		if (id) {
			document.getElementById('statusDisplay').style.display = 'block';
		}
	});

	// Fulfillment Selector in Checkout
	const deliveryBtn = document.getElementById('deliveryBtn');
	const pickupBtn = document.getElementById('pickupBtn');
	const deliveryDetails = document.getElementById('deliveryDetails');
	const pickupDetails = document.getElementById('pickupDetails');
	const deliveryAddressInput = document.getElementById('deliveryAddressInput');

	if (deliveryBtn && pickupBtn) {
		deliveryBtn.addEventListener('click', () => {
			if (window.currentFulfillment === 'delivery') return;
			window.currentFulfillment = 'delivery';
			deliveryBtn.classList.add('active');
			pickupBtn.classList.remove('active');

			// Show/Hide
			if (deliveryDetails) deliveryDetails.style.display = 'block';
			if (pickupDetails) pickupDetails.style.display = 'none';

			// Required state
			deliveryAddressInput?.setAttribute('required', 'true');

			// Recalculate
			recalculateCheckoutTotals();
		});

		pickupBtn.addEventListener('click', () => {
			if (window.currentFulfillment === 'pickup') return;
			window.currentFulfillment = 'pickup';
			pickupBtn.classList.add('active');
			deliveryBtn.classList.remove('active');

			// Show/Hide
			if (deliveryDetails) deliveryDetails.style.display = 'none';
			if (pickupDetails) pickupDetails.style.display = 'block';

			// Required state
			deliveryAddressInput?.removeAttribute('required');

			// Recalculate
			recalculateCheckoutTotals();
		});
	}

	// Checkout Form
	document.getElementById('checkoutForm')?.addEventListener('submit', e => {
		e.preventDefault();
		alert(
			'Thank you! Your payment of ' +
				totalEl.innerText +
				' was successful. Order GH-' +
				Math.floor(Math.random() * 90000 + 10000) +
				' confirmed.'
		);
		localStorage.removeItem('cart');
		window.location.href = basePath + '/order-confirmation';
	});

	// Reviews Slider Logic
	const prevReviewBtn = document.getElementById('prevReviewBtn');
	const nextReviewBtn = document.getElementById('nextReviewBtn');
	const reviewsTrack = document.getElementById('reviewsTrack');
	const reviewCards = document.querySelectorAll('.review-card');
	const sliderDots = document.querySelectorAll('.slider-dots .dot');

	if (reviewsTrack && reviewCards.length > 0) {
		let currentIdx = 0;
		const totalCards = reviewCards.length;

		const updateSlider = idx => {
			currentIdx = (idx + totalCards) % totalCards;

			// Transform track position
			reviewsTrack.style.transform = `translateX(-${currentIdx * 100}%)`;

			// Toggle active class on cards
			reviewCards.forEach((card, cI) => {
				if (cI === currentIdx) card.classList.add('active');
				else card.classList.remove('active');
			});

			// Toggle active class on dots
			sliderDots.forEach((dot, dI) => {
				if (dI === currentIdx) dot.classList.add('active');
				else dot.classList.remove('active');
			});
		};

		prevReviewBtn?.addEventListener('click', () =>
			updateSlider(currentIdx - 1)
		);
		nextReviewBtn?.addEventListener('click', () =>
			updateSlider(currentIdx + 1)
		);

		sliderDots.forEach(dot => {
			dot.addEventListener('click', e => {
				const idx = parseInt(e.target.dataset.index);
				updateSlider(idx);
			});
		});
	}
}

function addToCart(id, name, price) {
	const existing = cart.find(item => item.id === id);
	if (existing) {
		existing.quantity += 1;
	} else {
		cart.push({ id, name, price, quantity: 1 });
	}
	saveCart();
	updateCartUI();
}

function saveCart() {
	localStorage.setItem('cart', JSON.stringify(cart));
}

function updateCartUI() {
	if (cartCount) {
		const count = cart.reduce((sum, item) => sum + item.quantity, 0);
		cartCount.innerText = count;
	}
}

const itemImages = {
	'1': basePath + '/img/products/appetizer.png',
	'2': basePath + '/img/products/main.png',
	'3': basePath + '/img/products/dessert.png',
	'4': basePath + '/img/products/drink.png',
	'5': basePath + '/img/products/turbot_roti.png',
	'6': basePath + '/img/products/elixir_or.png',
	'7': basePath + '/img/products/caviar.png',
	'8': basePath + '/img/products/foie_gras.png',
	'9': basePath + '/img/products/duck.png',
	'10': basePath + '/img/products/venison.png',
	'11': basePath + '/img/products/mille_feuille.png',
	'12': basePath + '/img/products/souffle.png',
	'13': basePath + '/img/products/emerald_fizz.png',
	'14': basePath + '/img/products/nectar_noir.png'
};

function renderCart() {
	if (!cartItemsContainer) return;

	if (cart.length === 0) {
		cartItemsContainer.innerHTML = `
			<div class="empty-msg">
				<i class="fas fa-shopping-bag"></i>
				<p>Your culinary selections cart is currently empty.</p>
				<a href="${basePath}/menu" class="browse-btn">Browse our Menu</a>
			</div>
		`;
		return;
	}

	let html = '';
	let subtotal = 0;

	cart.forEach(item => {
		const total = item.price * item.quantity;
		subtotal += total;
		const imgSrc = itemImages[item.id] || basePath + '/img/products/main.png';
		html += `
            <div class="cart-item">
                <img src="${imgSrc}" alt="${item.name}" />
                <div class="item-details">
                    <h4>${item.name}</h4>
                    <p>$${item.price.toFixed(2)} x ${item.quantity}</p>
                </div>
                <div class="item-price">$${total.toFixed(2)}</div>
                <button class="remove-item" onclick="removeItem('${
									item.id
								}')"><i class="fas fa-trash-alt"></i></button>
            </div>
        `;
	});

	cartItemsContainer.innerHTML = html;
	calculateTotals(subtotal);
}

function calculateTotals(subtotal) {
	const tax = subtotal * 0.08;
	const total = subtotal + tax;

	if (subtotalEl) subtotalEl.innerText = `$${subtotal.toFixed(2)}`;
	if (taxEl) taxEl.innerText = `$${tax.toFixed(2)}`;
	if (totalEl) totalEl.innerText = `$${total.toFixed(2)}`;
}

window.removeItem = function(id) {
	cart = cart.filter(item => item.id !== id);
	saveCart();
	updateCartUI();
	renderCart();
};

function renderCheckout() {
	const reviewItems = document.getElementById('reviewItems');
	if (!reviewItems) return;

	let subtotal = 0;
	let html = '';

	cart.forEach(item => {
		const total = item.price * item.quantity;
		subtotal += total;
		html += `<p>${item.name} x ${item.quantity} <span>$${total.toFixed(
			2
		)}</span></p>`;
	});

	reviewItems.innerHTML = html;
	recalculateCheckoutTotals();
}

window.recalculateCheckoutTotals = function() {
	const deliveryFeeEl = document.querySelector('.delivery-fee');
	let subtotal = cart.reduce(
		(sum, item) => sum + item.price * item.quantity,
		0
	);
	const deliveryFee = window.currentFulfillment === 'delivery' ? 5.0 : 0.0;
	const tax = subtotal * 0.08;
	const total = subtotal + deliveryFee + tax;

	if (subtotalEl) subtotalEl.innerText = `$${subtotal.toFixed(2)}`;
	if (deliveryFeeEl) deliveryFeeEl.innerText = `$${deliveryFee.toFixed(2)}`;
	if (taxEl) taxEl.innerText = `$${tax.toFixed(2)}`;
	if (totalEl) totalEl.innerText = `$${total.toFixed(2)}`;
};

document.addEventListener('DOMContentLoaded', init);
