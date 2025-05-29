// script.js

// ====== Globals ======
const productsGrid = document.getElementById('productsGrid');
const searchInput = document.getElementById('searchInput');
const cartCountElem = document.getElementById('cartCount');
const cartItemsKey = 'bilezikCart';

// Sample products (for demo purposes, ideally load dynamically or from JSON)
const products = [
  // Bracelets
  { id: 1, category: 'bracelets', name: 'Pink Beaded Bracelet', description: 'Elegant pink beads with silver charms', price: 25, image: 'placeholder-bracelet1.jpg' },
  { id: 2, category: 'bracelets', name: 'Purple Luxe Bracelet', description: 'Luxurious purple beads with sparkling crystals', price: 30, image: 'placeholder-bracelet2.jpg' },
  { id: 3, category: 'bracelets', name: 'Red Charm Bracelet', description: 'Bright red beads with heart-shaped charms', price: 27, image: 'placeholder-bracelet3.jpg' },
  // Rings
  { id: 11, category: 'rings', name: 'Blue Beaded Ring', description: 'Delicate blue beads on a silver band', price: 20, image: 'placeholder-ring1.jpg' },
  { id: 12, category: 'rings', name: 'Orange Stone Ring', description: 'Vibrant orange stones in a classic setting', price: 28, image: 'placeholder-ring2.jpg' },
  { id: 13, category: 'rings', name: 'Purple Charm Ring', description: 'Purple beads and tiny charms around band', price: 26, image: 'placeholder-ring3.jpg' },
  // Phone charms
  { id: 21, category: 'charms', name: 'Pink Phone Charm', description: 'Cute pink beads with star charm', price: 15, image: 'placeholder-charm1.jpg' },
  { id: 22, category: 'charms', name: 'Blue Crystal Charm', description: 'Shiny blue crystals dangling charm', price: 18, image: 'placeholder-charm2.jpg' },
  { id: 23, category: 'charms', name: 'Orange Bead Charm', description: 'Warm orange beads with leaf charm', price: 17, image: 'placeholder-charm3.jpg' },
];

// ====== Utility Functions ======

function saveCart(cart) {
  localStorage.setItem(cartItemsKey, JSON.stringify(cart));
}

function loadCart() {
  const cart = localStorage.getItem(cartItemsKey);
  return cart ? JSON.parse(cart) : [];
}

function updateCartCount() {
  const cart = loadCart();
  const totalCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  if (cartCountElem) {
    cartCountElem.textContent = totalCount;
  }
}

// ====== Product Rendering ======

function createProductCard(product) {
  const card = document.createElement('div');
  card.className = 'product-card';

  card.innerHTML = `
    <img src="${product.image}" alt="${product.name}" />
    <h3>${product.name}</h3>
    <p>${product.description}</p>
    <div class="price">$${product.price.toFixed(2)}</div>
    <button data-id="${product.id}">Add to Cart</button>
  `;

  const btn = card.querySelector('button');
  btn.addEventListener('click', () => addToCart(product.id));

  return card;
}

function renderProducts(filterText = '', category = '') {
  if (!productsGrid) return;

  let filtered = products;

  if (category) {
    filtered = filtered.filter(p => p.category === category);
  }

  if (filterText) {
    const ft = filterText.toLowerCase();
    filtered = filtered.filter(p =>
      p.name.toLowerCase().includes(ft) ||
      p.description.toLowerCase().includes(ft)
    );
  }

  productsGrid.innerHTML = '';
  if (filtered.length === 0) {
    productsGrid.innerHTML = '<p>No products found.</p>';
    return;
  }

  filtered.forEach(product => {
    productsGrid.appendChild(createProductCard(product));
  });
}

// ====== Search Bar Handler ======

if (searchInput) {
  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.trim();
    renderProducts(query);
  });
}

// ====== Cart Functions ======

function addToCart(productId) {
  let cart = loadCart();
  const existing = cart.find(item => item.id === productId);
  if (existing) {
    existing.quantity++;
  } else {
    cart.push({ id: productId, quantity: 1 });
  }
  saveCart(cart);
  updateCartCount();
  alert('Added to cart!');
}

// ====== Cart Page Rendering ======

function renderCartPage() {
  const cartContainer = document.getElementById('cartItemsContainer');
  const cartTotalElem = document.getElementById('cartTotal');
  if (!cartContainer || !cartTotalElem) return;

  const cart = loadCart();

  if (cart.length === 0) {
    cartContainer.innerHTML = '<p>Your cart is empty.</p>';
    cartTotalElem.textContent = '$0.00';
    return;
  }

  let total = 0;
  cartContainer.innerHTML = '';

  cart.forEach(item => {
    const product = products.find(p => p.id === item.id);
    if (!product) return;

    const itemTotal = product.price * item.quantity;
    total += itemTotal;

    const cartItem = document.createElement('div');
    cartItem.className = 'cart-item';

    cartItem.innerHTML = `
      <img src="${product.image}" alt="${product.name}" />
      <div class="cart-info">
        <h4>${product.name}</h4>
        <p>${product.description}</p>
        <div class="price">$${product.price.toFixed(2)}</div>
        <div class="quantity">
          <button class="decrease" data-id="${item.id}">-</button>
          <span>${item.quantity}</span>
          <button class="increase" data-id="${item.id}">+</button>
        </div>
        <div class="item-total">$${itemTotal.toFixed(2)}</div>
        <button class="remove" data-id="${item.id}">Remove</button>
      </div>
    `;

    cartContainer.appendChild(cartItem);
  });

  cartTotalElem.textContent = `$${total.toFixed(2)}`;

  // Event listeners for quantity buttons and remove
  cartContainer.querySelectorAll('button.decrease').forEach(btn => {
    btn.addEventListener('click', () => {
      changeQuantity(parseInt(btn.dataset.id), -1);
    });
  });
  cartContainer.querySelectorAll('button.increase').forEach(btn => {
    btn.addEventListener('click', () => {
      changeQuantity(parseInt(btn.dataset.id), 1);
    });
  });
  cartContainer.querySelectorAll('button.remove').forEach(btn => {
    btn.addEventListener('click', () => {
      removeFromCart(parseInt(btn.dataset.id));
    });
  });
}

function changeQuantity(productId, delta) {
  let cart = loadCart();
  const item = cart.find(i => i.id === productId);
  if (!item) return;

  item.quantity += delta;
  if (item.quantity <= 0) {
    cart = cart.filter(i => i.id !== productId);
  }

  saveCart(cart);
  updateCartCount();
  renderCartPage();
}

function removeFromCart(productId) {
  let cart = loadCart();
  cart = cart.filter(i => i.id !== productId);
  saveCart(cart);
  updateCartCount();
  renderCartPage();
}

// ====== Checkout Form Handling ======

function handleCheckoutForm() {
  const form = document.getElementById('checkoutForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const phone = form.phone.value.trim();

    if (!name || !email || !phone) {
      alert('Please fill in all required fields.');
      return;
    }

    // Basic email validation
    if (!email.match(/^\S+@\S+\.\S+$/)) {
      alert('Please enter a valid email address.');
      return;
    }

    // Here, you'd normally send order data to a backend or service
    alert(`Thank you, ${name}! Your order has been placed.`);

    localStorage.removeItem(cartItemsKey);
    updateCartCount();
    renderCartPage();
    form.reset();
  });
}

// ====== Initialization ======

function initPage() {
  updateCartCount();

  // Detect page by id on body to initialize specific page code
  const bodyId = document.body.id;

  if (bodyId === 'home') {
    renderProducts();
  } else if (bodyId === 'bracelets') {
    renderProducts('', 'bracelets');
  } else if (bodyId === 'rings') {
    renderProducts('', 'rings');
  } else if (bodyId === 'charms') {
    renderProducts('', 'charms');
  } else if (bodyId === 'cart') {
    renderCartPage();
  } else if (bodyId === 'checkout') {
    renderCartPage(); // Show order summary on checkout page
    handleCheckoutForm();
  }
}

document.addEventListener('DOMContentLoaded', initPage);
