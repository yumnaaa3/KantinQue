// Menu Data
const menuData = [
    {
        id: 1,
        name: 'Nasi Goreng Spesial',
        category: 'Makanan',
        price: 15000,
        description: 'Nasi goreng dengan telur mata sapi, ayam, dan sayuran segar',
        image: 'Nasi Goreng.jpg',
        isUnggulan: true
    },
    {
        id: 2,
        name: 'Mie Ayam',
        category: 'Makanan',
        price: 12000,
        description: 'Mie ayam dengan pangsit goreng dan bakso',
        image: 'Mie Ayam.jpg',
        isUnggulan: true
    },
    {
        id: 3,
        name: 'Soto Ayam',
        category: 'Makanan',
        price: 13000,
        description: 'Soto ayam kuning dengan soun, telur, dan bawang goreng',
        image: 'Soto Ayam.jpg',
        isUnggulan: false
    },
    {
        id: 4,
        name: 'Es Teh Manis',
        category: 'Minuman',
        price: 5000,
        description: 'Es teh manis segar dengan es batu',
        image: 'es teh.jpg',
        isUnggulan: true
    },
    {
        id: 5,
        name: 'Kopi Hitam',
        category: 'Minuman',
        price: 8000,
        description: 'Kopi hitam premium dengan aroma khas',
        image: 'kopi.jpg',
        isUnggulan: false
    },
    {
        id: 6,
        name: 'Jus Jeruk',
        category: 'Minuman',
        price: 10000,
        description: 'Jus jeruk segar tanpa gula tambahan',
        image: 'jus jeruk.jpg',
        isUnggulan: true
    },
    {
        id: 7,
        name: 'Ayam Geprek',
        category: 'Makanan',
        price: 16000,
        description: 'Ayam crispy dengan sambal geprek pedas mantap',
        image: 'Ayam Geprek.jpg',
        isUnggulan: true
    },
    {
        id: 8,
        name: 'Bakso Solo',
        category: 'Makanan',
        price: 14000,
        description: 'Bakso sapi dengan kuah kaldu hangat, mie, dan sayuran',
        image: 'Bakso Solo.jpg',
        isUnggulan: true
    },
    {
        id: 9,
        name: 'Nasi Padang',
        category: 'Makanan',
        price: 18000,
        description: 'Nasi dengan lauk khas Padang pilihan, rendang dan sambal',
        image: 'nasi padang.jpg',
        isUnggulan: false
    }
];

// Cart State
let cart = [];

// Load cart from localStorage
function loadCart() {
    const savedCart = localStorage.getItem('kantinque_cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartBadge();
    }
}

// Save cart to localStorage
function saveCart() {
    localStorage.setItem('kantinque_cart', JSON.stringify(cart));
}

// Format currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(amount);
}

// Render menu items
function renderMenu(items, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = items.map(item => `
        <div class="menu-item" data-id="${item.id}">
            ${item.isUnggulan ? `
                <div class="menu-item-badge">
                    <i class="fas fa-star"></i>
                    Unggulan
                </div>
            ` : ''}
            <img src="${item.image}" alt="${item.name}" class="menu-item-image" onerror="this.src='https://via.placeholder.com/400x300/FF6B35/FFFFFF?text=${encodeURIComponent(item.name)}'">
            <div class="menu-item-content">
                <div class="menu-item-category">${item.category}</div>
                <h3 class="menu-item-name">${item.name}</h3>
                <p class="menu-item-description">${item.description}</p>
                <div class="menu-item-footer">
                    <div class="menu-item-price">${formatCurrency(item.price)}</div>
                    <button class="btn-add-cart" onclick="addToCart(${item.id})">
                        <i class="fas fa-plus"></i>
                        Tambah
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Render featured menu
function renderFeaturedMenu() {
    const featuredItems = menuData.filter(item => item.isUnggulan);
    renderMenu(featuredItems, 'menuUnggulanGrid');
}

// Render all menu
function renderAllMenu() {
    renderMenu(menuData, 'menuGrid');
}

// Filter state management
let currentCategory = 'semua';
let currentSearchQuery = '';

// Filter menu by category
function filterMenu(category) {
    currentCategory = category;
    applyFilters();
}

// Search menu by query
function searchMenu(query) {
    currentSearchQuery = query.toLowerCase();
    applyFilters();
}

// Apply all filters
function applyFilters() {
    let filtered = menuData;

    // Apply category filter
    if (currentCategory !== 'semua') {
        filtered = filtered.filter(item => item.category === currentCategory);
    }

    // Apply search filter
    if (currentSearchQuery.trim() !== '') {
        filtered = filtered.filter(item =>
            item.name.toLowerCase().includes(currentSearchQuery) ||
            item.description.toLowerCase().includes(currentSearchQuery)
        );
    }

    renderMenu(filtered, 'menuGrid');

    // Show no results message if needed
    const menuGrid = document.getElementById('menuGrid');
    if (filtered.length === 0) {
        menuGrid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 3rem; color: var(--text-muted);">
                <i class="fas fa-search" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.3;"></i>
                <p style="font-size: 1.2rem;">Tidak ada menu yang ditemukan</p>
                <p>Coba kata kunci lain atau pilih kategori berbeda</p>
            </div>
        `;
    }
}

// Add to cart
function addToCart(itemId) {
    const item = menuData.find(m => m.id === itemId);
    if (!item) return;

    const existingItem = cart.find(c => c.id === itemId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...item,
            quantity: 1
        });
    }

    saveCart();
    updateCartBadge();

    // Show feedback
    showNotification('Item ditambahkan ke keranjang!');
}

// Update cart badge
function updateCartBadge() {
    const badge = document.getElementById('cartBadge');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    badge.textContent = totalItems;
}

// Render cart items
function renderCart() {
    const cartItemsContainer = document.getElementById('cartItems');
    const cartEmpty = document.getElementById('cartEmpty');
    const totalPriceElement = document.getElementById('totalPrice');

    if (cart.length === 0) {
        cartItemsContainer.style.display = 'none';
        cartEmpty.style.display = 'block';
        totalPriceElement.textContent = formatCurrency(0);
        return;
    }

    cartItemsContainer.style.display = 'block';
    cartEmpty.style.display = 'none';

    cartItemsContainer.innerHTML = cart.map(item => `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.name}" class="cart-item-image" onerror="this.src='https://via.placeholder.com/80x80/FF6B35/FFFFFF?text=${encodeURIComponent(item.name)}'">
            <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">${formatCurrency(item.price)}</div>
                <div class="cart-item-actions">
                    <button class="qty-btn" onclick="updateQuantity(${item.id}, -1)">
                        <i class="fas fa-minus"></i>
                    </button>
                    <span class="qty-value">${item.quantity}</span>
                    <button class="qty-btn" onclick="updateQuantity(${item.id}, 1)">
                        <i class="fas fa-plus"></i>
                    </button>
                    <button class="btn-remove" onclick="removeFromCart(${item.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    totalPriceElement.textContent = formatCurrency(total);
}

// Update quantity
function updateQuantity(itemId, change) {
    const item = cart.find(c => c.id === itemId);
    if (!item) return;

    item.quantity += change;

    if (item.quantity <= 0) {
        removeFromCart(itemId);
        return;
    }

    saveCart();
    updateCartBadge();
    renderCart();
}

// Remove from cart
function removeFromCart(itemId) {
    cart = cart.filter(c => c.id !== itemId);
    saveCart();
    updateCartBadge();
    renderCart();
}

// Show notification
function showNotification(message) {
    // Simple notification - could be enhanced with a proper toast library
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: linear-gradient(135deg, #FF6B35 0%, #F7931E 100%);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
        z-index: 3000;
        animation: slideInRight 0.3s ease;
        font-weight: 600;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}

// Generate QRIS code (simulation)
function generateQRIS() {
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const orderData = `QRIS-KANTINQUE-${Date.now()}-${total}`;

    // Using QRCode library
    const qrcodeElement = document.getElementById('qrcode');
    qrcodeElement.innerHTML = '';
    qrcodeElement.classList.add('active');

    const qr = new QRCode(qrcodeElement, {
        text: orderData,
        width: 250,
        height: 250,
        colorDark: '#000000',
        colorLight: '#ffffff',
        correctLevel: QRCode.CorrectLevel.H
    });

    // Hide placeholder
    document.querySelector('.qr-placeholder').style.display = 'none';
}

// Render order summary
function renderOrderSummary() {
    const orderSummary = document.getElementById('orderSummary');
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    orderSummary.innerHTML = `
        <h4><i class="fas fa-receipt"></i> Ringkasan Pesanan</h4>
        ${cart.map(item => `
            <div class="summary-item">
                <span>${item.name} x${item.quantity}</span>
                <span>${formatCurrency(item.price * item.quantity)}</span>
            </div>
        `).join('')}
        <div class="summary-item summary-total">
            <span>Total Pembayaran:</span>
            <span>${formatCurrency(total)}</span>
        </div>
    `;
}

// Start countdown timer
function startCountdown() {
    let timeLeft = 300; // 5 minutes
    const countdownElement = document.getElementById('countdown');

    const timer = setInterval(() => {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        countdownElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

        if (timeLeft <= 0) {
            clearInterval(timer);
            showNotification('Waktu pembayaran habis. Silakan coba lagi.');
            closeQRISModal();
        }

        timeLeft--;
    }, 1000);

    return timer;
}

// Modal functions
function openCartModal() {
    renderCart();
    document.getElementById('cartModal').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeCartModal() {
    document.getElementById('cartModal').classList.remove('active');
    document.body.style.overflow = '';
}

function openQRISModal() {
    if (cart.length === 0) {
        showNotification('Keranjang masih kosong!');
        return;
    }

    renderOrderSummary();
    generateQRIS();
    document.getElementById('qrisModal').classList.add('active');
    closeCartModal();

    const timer = startCountdown();

    // Simulate payment success after 10 seconds (for demo)
    setTimeout(() => {
        clearInterval(timer);
        showPaymentSuccess();
    }, 10000);
}

function closeQRISModal() {
    document.getElementById('qrisModal').classList.remove('active');
    document.body.style.overflow = '';
}

function showPaymentSuccess() {
    const paymentStatus = document.getElementById('paymentStatus');
    paymentStatus.innerHTML = `
        <div style="text-align: center; padding: 2rem; background: rgba(76, 175, 80, 0.1); border-radius: 12px; border: 1px solid rgba(76, 175, 80, 0.3);">
            <i class="fas fa-check-circle" style="font-size: 4rem; color: #4CAF50; margin-bottom: 1rem;"></i>
            <h3 style="color: #4CAF50; margin-bottom: 0.5rem;">Pembayaran Berhasil!</h3>
            <p style="color: var(--text-secondary);">Pesanan Anda sedang diproses</p>
        </div>
    `;

    setTimeout(() => {
        closeQRISModal();
        cart = [];
        saveCart();
        updateCartBadge();
        showNotification('Terima kasih! Pesanan Anda sedang diproses.');
    }, 3000);
}

// Initialize app
function initApp() {
    loadCart();
    renderFeaturedMenu();
    renderAllMenu();

    // Category filter event listeners
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const category = btn.dataset.category;
            filterMenu(category);
        });
    });

    // Cart button
    document.getElementById('btnCart').addEventListener('click', openCartModal);

    // Close cart modal
    document.getElementById('btnCloseCart').addEventListener('click', closeCartModal);
    document.getElementById('modalOverlay').addEventListener('click', closeCartModal);

    // Checkout button
    document.getElementById('btnCheckout').addEventListener('click', openQRISModal);

    // Close QRIS modal
    document.getElementById('btnCloseQris').addEventListener('click', closeQRISModal);
    document.getElementById('qrisOverlay').addEventListener('click', closeQRISModal);

    // Search functionality
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        let searchTimeout;
        searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                searchMenu(e.target.value);
            }, 300);
        });
    }

    // Add CSS for animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}

// Start the app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}
