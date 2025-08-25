// Global variables
let products = [];
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    loadProducts();
    updateCartCount();
});

// Load products from JSON file
async function loadProducts() {
    try {
        const response = await fetch('data/products.json');
        products = await response.json();
        displayProducts();
    } catch (error) {
        console.error('Error loading products:', error);
    }
}

// Display products in the grid
function displayProducts() {
    const productsGrid = document.getElementById('products-grid');
    if (!productsGrid) return;

    productsGrid.innerHTML = '';

    products.forEach(product => {
        const productCard = createProductCard(product);
        productsGrid.appendChild(productCard);
    });
}

// Create a product card element
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.onclick = () => goToProduct(product.id);

    const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
    const stars = generateStars(product.rating);

    card.innerHTML = `
        <img src="${product.image}" alt="${product.name}" class="product-image">
        <div class="product-info">
            <h3 class="product-name">${product.name}</h3>
            <div class="product-price">
                <span class="current-price">${product.price}TL</span>
                <span class="original-price">${product.originalPrice}TL</span>
            </div>
            <div class="product-rating">
                <div class="stars">${stars}</div>
                <span class="rating-text">${product.rating} (${product.reviews} Reviews)</span>
            </div>
            <button class="add-to-cart" onclick="event.stopPropagation(); addToCart(${product.id})">
                <i class="fas fa-shopping-cart"></i> Add to Cart
            </button>
        </div>
    `;

    return card;
}

// Generate star rating HTML
function generateStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    let stars = '';

    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="fas fa-star"></i>';
    }

    if (hasHalfStar) {
        stars += '<i class="fas fa-star-half-alt"></i>';
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
        stars += '<i class="far fa-star"></i>';
    }

    return stars;
}

// Add product to cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    showNotification('Product added to cart!');
}

// Update cart count in header
function updateCartCount() {
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
    }
}

// Navigate to product page
function goToProduct(productId) {
    window.location.href = `product.html?id=${productId}`;
}

// Scroll to products section
function scrollToProducts() {
    document.getElementById('products').scrollIntoView({ 
        behavior: 'smooth' 
    });
}

// Show notification
function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: #10b981;
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 1001;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    notification.textContent = message;

    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);

    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Cart icon click handler
document.addEventListener('DOMContentLoaded', function() {
    const cartIcon = document.querySelector('.cart-icon');
    if (cartIcon) {
        cartIcon.addEventListener('click', function() {
            if (cart.length > 0) {
                window.location.href = 'checkout.html';
            } else {
                showNotification('Your cart is empty!');
            }
        });
    }
});