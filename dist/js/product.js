// Global variables
let products = [];
let currentProduct = null;
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let currentImageIndex = 0;

// Initialize the product page
document.addEventListener('DOMContentLoaded', function() {
    loadProducts();
    updateCartCount();
});

// Load products and display current product
async function loadProducts() {
    try {
        const response = await fetch('data/products.json');
        products = await response.json();
        
        const urlParams = new URLSearchParams(window.location.search);
        const productId = parseInt(urlParams.get('id'));
        
        currentProduct = products.find(p => p.id === productId);
        
        if (currentProduct) {
            displayProduct();
        } else {
            window.location.href = 'index.html';
        }
    } catch (error) {
        console.error('Error loading products:', error);
        window.location.href = 'index.html';
    }
}

// Display the current product
function displayProduct() {
    if (!currentProduct) return;

    // Update page title and breadcrumb
    document.title = `${currentProduct.name} - MCWoala`;
    document.getElementById('breadcrumb-product').textContent = currentProduct.name;

    const productDetails = document.getElementById('product-details');
    const discount = Math.round(((currentProduct.originalPrice - currentProduct.price) / currentProduct.originalPrice) * 100);
    const stars = generateStars(currentProduct.rating);

    productDetails.innerHTML = `
        <div class="product-gallery">
            <img src="${currentProduct.images[0]}" alt="${currentProduct.name}" class="main-image" id="main-image">
            <div class="thumbnail-images">
                ${currentProduct.images.map((image, index) => `
                    <img src="${image}" alt="${currentProduct.name}" class="thumbnail ${index === 0 ? 'active' : ''}" 
                         onclick="changeImage(${index})">
                `).join('')}
            </div>
        </div>
        
        <div class="product-info">
            <h1 class="product-title">${currentProduct.name}</h1>
            
            <div class="product-price-section">
                <span class="current-price">${currentProduct.price} TL</span>
                <span class="original-price">${currentProduct.originalPrice} TL</span>
                <span class="discount-badge">-${discount}%</span>
            </div>
            
            <div class="product-rating">
                <div class="stars">${stars}</div>
                <div class="rating-info">
                    <span>${currentProduct.rating}</span>
                    <span>(${currentProduct.reviews} İnceleme)</span>
                </div>
            </div>
            
            <div class="stock-status ${currentProduct.inStock ? '' : 'out-of-stock'}">
                <i class="fas ${currentProduct.inStock ? 'fa-check-circle' : 'fa-times-circle'}"></i>
                <span>${currentProduct.inStock ? 'Stokta var' : 'Stokta yok'}</span>
            </div>
            
            <p class="product-description">${currentProduct.description}</p>
            
            <div class="product-features">
                <h3>Özellikler</h3>
                <ul class="features-list">
                    ${currentProduct.features.map(feature => `<li>${feature}</li>`).join('')}
                </ul>
            </div>
            
            <div class="quantity-selector">
                <label>Miktar:</label>
                <div class="quantity-controls">
                    <button class="quantity-btn" onclick="changeQuantity(-1)">-</button>
                    <input type="number" class="quantity-input" id="quantity" value="1" min="1" max="10">
                    <button class="quantity-btn" onclick="changeQuantity(1)">+</button>
                </div>
            </div>
            
            <div class="add-to-cart-section">
                <button class="add-to-cart-btn" onclick="addToCart()" ${!currentProduct.inStock ? 'disabled' : ''}>
                    <i class="fas fa-shopping-cart"></i>
                    Sepete Ekle
                </button>
                <button class="buy-now-btn" onclick="buyNow()" ${!currentProduct.inStock ? 'disabled' : ''}>
                    Hemen Al
                </button>
            </div>
        </div>
    `;
}

// Change main product image
function changeImage(index) {
    currentImageIndex = index;
    const mainImage = document.getElementById('main-image');
    const thumbnails = document.querySelectorAll('.thumbnail');
    
    mainImage.src = currentProduct.images[index];
    
    thumbnails.forEach((thumb, i) => {
        thumb.classList.toggle('active', i === index);
    });
}

// Change quantity
function changeQuantity(change) {
    const quantityInput = document.getElementById('quantity');
    let newQuantity = parseInt(quantityInput.value) + change;
    
    if (newQuantity < 1) newQuantity = 1;
    if (newQuantity > 10) newQuantity = 10;
    
    quantityInput.value = newQuantity;
}

// Add product to cart
function addToCart() {
    if (!currentProduct || !currentProduct.inStock) return;
    
    const quantity = parseInt(document.getElementById('quantity').value);
    const existingItem = cart.find(item => item.id === currentProduct.id);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            id: currentProduct.id,
            name: currentProduct.name,
            price: currentProduct.price,
            image: currentProduct.image,
            quantity: quantity
        });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    showNotification(`${quantity} item(s) added to cart!`);
}

// Hemen Al - go directly to checkout
function buyNow() {
    if (!currentProduct || !currentProduct.inStock) return;
    
    addToCart();
    window.location.href = 'checkout.html';
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

// Update cart count in header
function updateCartCount() {
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
    }
}

// Show notification
function showNotification(message) {
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

    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);

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