// Sample products data
const products = [
  {
    id: 1,
    name: 'Luxury Pink Beaded Bracelet',
    category: 'bracelets',
    image: 'https://i.imgur.com/dqQf2NA.jpg',
    description: 'Handmade pink beads with charms.'
  },
  {
    id: 2,
    name: 'Elegant Purple Ring',
    category: 'rings',
    image: 'https://i.imgur.com/FgQ2Vg6.jpg',
    description: 'Purple stone ring with silver band.'
  },
  {
    id: 3,
    name: 'Blue Beaded Phone Charm',
    category: 'phone-charms',
    image: 'https://i.imgur.com/IcOgqQo.jpg',
    description: 'Cute blue beads with dangling charm.'
  },
  {
    id: 4,
    name: 'Orange Charm Bracelet',
    category: 'bracelets',
    image: 'https://i.imgur.com/xBPR4Tf.jpg',
    description: 'Vibrant orange beads with charms.'
  },
  {
    id: 5,
    name: 'Red Beaded Ring',
    category: 'rings',
    image: 'https://i.imgur.com/9F4hYcL.jpg',
    description: 'Bright red beads with adjustable band.'
  }
];

// Elements
const productList = document.getElementById('product-list');
const searchInput = document.getElementById('searchInput');
const navLinks = document.querySelectorAll('.nav-links a[data-category]');

function renderProducts(filteredProducts) {
  productList.innerHTML = '';

  if (filteredProducts.length === 0) {
    productList.innerHTML = `<p>No products found.</p>`;
    return;
  }

  filteredProducts.forEach(product => {
    const card = document.createElement('div');
    card.classList.add('product-card');
    card.innerHTML = `
      <img src="${product.image}" alt="${product.name}" />
      <h3>${product.name}</h3>
      <p>${product.description}</p>
    `;
    productList.appendChild(card);
  });
}

function filterProducts(category, searchTerm = '') {
  let filtered = products;

  if (category && category !== 'all') {
    filtered = filtered.filter(p => p.category === category);
  }

  if (searchTerm) {
    filtered = filtered.filter(p =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  return filtered;
}

// Initial render: show all products
renderProducts(products);

// Search input event
searchInput.addEventListener('input', e => {
  const term = e.target.value.trim();
  const activeCategory = document.querySelector('.nav-links a.active')?.dataset.category || 'all';
  const filtered = filterProducts(activeCategory, term);
  renderProducts(filtered);
});

// Navigation category clicks
navLinks.forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();

    // Remove active class from all links
    navLinks.forEach(l => l.classList.remove('active'));

    // Add active to clicked link
    e.target.classList.add('active');

    // Clear search input
    searchInput.value = '';

    // Filter products by category
    const category = e.target.dataset.category;
    renderProducts(filterProducts(category));
  });
});

// Set "All" category active initially
document.querySelector('.nav-links a[data-category="all"]').classList.add('active');
