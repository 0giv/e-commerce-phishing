// Global variables
let cart = JSON.parse(localStorage.getItem('cart')) || [];
const SHIPPING_COST = 9.99;
const TAX_RATE = 0.08; // 8% tax

// Initialize checkout page
document.addEventListener('DOMContentLoaded', function() {
    if (cart.length === 0) {
        window.location.href = 'index.html';
        return;
    }
    
    displayOrderSummary();
    setupFormValidation();
    setupPaymentMethods();
    updateCartCount();
});

// Display order summary
function displayOrderSummary() {
    const orderItems = document.getElementById('order-items');
    const subtotalElement = document.getElementById('subtotal');
    const taxElement = document.getElementById('tax');
    const totalElement = document.getElementById('total');
    
    // Display cart items
    orderItems.innerHTML = '';
    let subtotal = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        
        const orderItem = document.createElement('div');
        orderItem.className = 'order-item';
        orderItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="item-image">
            <div class="item-details">
                <div class="item-name">${item.name}</div>
                <div class="item-quantity">Quantity: ${item.quantity}</div>
            </div>
            <div class="item-price">${itemTotal.toFixed(2)}TL</div>
        `;
        orderItems.appendChild(orderItem);
    });
    
    // Calculate totals
    const tax = subtotal * TAX_RATE;
    const total = subtotal + SHIPPING_COST + tax;
    
    // Update totals display
    subtotalElement.textContent = `${subtotal.toFixed(2)}TL`;
    taxElement.textContent = `${tax.toFixed(2)}TL`;
    totalElement.textContent = `${total.toFixed(2)}TL`;
}

// Setup form validation
function setupFormValidation() {
    const form = document.querySelector('.checkout-form');
    const inputs = form.querySelectorAll('input[required]');
    
    inputs.forEach(input => {
        input.addEventListener('blur', validateField);
        input.addEventListener('input', clearFieldError);
    });
    
    // Card number formatting
    const cardNumber = document.getElementById('cardNumber');
    cardNumber.addEventListener('input', formatCardNumber);

    // Expiration date formatting
    const expiryDate = document.getElementById('expiryDate');
    expiryDate.addEventListener('input', formatExpiryDate);
    
    // CVV validation
    const cvv = document.getElementById('cvv');
    cvv.addEventListener('input', formatCVV);
}

// Setup payment methods
function setupPaymentMethods() {
    const paymentMethods = document.querySelectorAll('.payment-method');
    const cardForm = document.getElementById('card-form');
    
    paymentMethods.forEach(method => {
        method.addEventListener('click', function() {
            paymentMethods.forEach(m => m.classList.remove('active'));
            this.classList.add('active');
            
            const methodType = this.dataset.method;
            if (methodType === 'card') {
                cardForm.style.display = 'block';
            } else {
                cardForm.style.display = 'none';
            }
        });
    });
}

// Validate individual field
function validateField(event) {
    const field = event.target;
    const value = field.value.trim();
    
    clearFieldError(event);
    
    if (!value) {
        showFieldError(field, 'This field is required');
        return false;
    }
    
    // Email validation
    if (field.type === 'email') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            showFieldError(field, 'Please enter a valid email address');
            return false;
        }
    }
    
    // Card number validation
    if (field.id === 'cardNumber') {
        const cardRegex = /^\d{4}\s\d{4}\s\d{4}\s\d{4}$/;
        if (!cardRegex.test(value)) {
            showFieldError(field, 'Please enter a valid card number');
            return false;
        }
    }
    
    // Son Kullanma Tarihi validation
    if (field.id === 'expiryDate') {
        const expiryRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
        if (!expiryRegex.test(value)) {
            showFieldError(field, 'Please enter a valid expiration date (MM/YY)');
            return false;
        }
        
        const [month, year] = value.split('/');
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear() % 100;
        const currentMonth = currentDate.getMonth() + 1;
        
        if (parseInt(year) < currentYear || (parseInt(year) === currentYear && parseInt(month) < currentMonth)) {
            showFieldError(field, 'Card has expired');
            return false;
        }
    }
    
    // CVV validation
    if (field.id === 'cvv') {
        const cvvRegex = /^\d{3,4}$/;
        if (!cvvRegex.test(value)) {
            showFieldError(field, 'Please enter a valid CVV');
            return false;
        }
    }
    
    return true;
}

// Show field error
function showFieldError(field, message) {
    field.style.borderColor = '#ef4444';
    
    let errorElement = field.parentNode.querySelector('.field-error');
    if (!errorElement) {
        errorElement = document.createElement('div');
        errorElement.className = 'field-error';
        errorElement.style.cssText = 'color: #ef4444; font-size: 0.875rem; margin-top: 0.25rem;';
        field.parentNode.appendChild(errorElement);
    }
    errorElement.textContent = message;
}

// Clear field error
function clearFieldError(event) {
    const field = event.target;
    field.style.borderColor = '#e2e8f0';
    
    const errorElement = field.parentNode.querySelector('.field-error');
    if (errorElement) {
        errorElement.remove();
    }
}

    // Format card number
function formatCardNumber(event) {
    let value = event.target.value.replace(/\s/g, '').replace(/[^0-9]/gi, '');
    const formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
    event.target.value = formattedValue;
}

    // Format expiration date
function formatExpiryDate(event) {
    let value = event.target.value.replace(/\D/g, '');
    if (value.length >= 2) {
        value = value.substring(0, 2) + '/' + value.substring(2, 4);
    }
    event.target.value = value;
}

// Format CVV
function formatCVV(event) {
    event.target.value = event.target.value.replace(/[^0-9]/g, '');
}



// Update cart count
function updateCartCount() {
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
    }
}

// Show notification
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    const bgColor = type === 'error' ? '#ef4444' : '#10b981';
    
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${bgColor};
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
}function showOrderSuccess() {
    const main = document.querySelector('.checkout-main');
    main.innerHTML = `
        <div class="container">
            <div class="success-container" style="text-align: center; padding: 4rem 2rem;">
                <div style="background: #fc0505ff; color: white; width: 80px; height: 80px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 2rem; font-size: 2rem;">
                    <i class="fas fa-check"></i>
                </div>
                <h1 style="font-size: 2.5rem; margin-bottom: 1rem; color: #ff0404ff;">Error!</h1>
                <p style="font-size: 1.2rem; color: #64748b; margin-bottom: 2rem;">Order could not be processed. The bank declined the payment.</p>
                <div style="background: #f8fafc; padding: 2rem; border-radius: 12px; margin-bottom: 2rem; max-width: 500px; margin-left: auto; margin-right: auto;">
                    <h3 style="margin-bottom: 1rem; color: #1e293b;">Order Details</h3>
                    <p style="color: #64748b; margin-bottom: 0.5rem;">Order Number: #${Math.random().toString(36).substr(2,9).toUpperCase()}</p>
                    <p style="color: #64748b;">You will receive an email shortly.</p>
                </div>
                <button onclick="window.location.href='index.html'" style="background: #2563eb; color: white; border: none; padding: 1rem 2rem; border-radius: 8px; font-size: 1.1rem; font-weight: 600; cursor: pointer; transition: all 0.3s ease;">
                    Continue Shopping
                </button>
            </div>
        </div>
    `;
}
