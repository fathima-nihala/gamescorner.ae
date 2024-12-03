class CartManager {
    constructor() {
        // Main cart elements
        this.cartTableBody = document.querySelector('.table tbody');
        this.cartSidebar = document.querySelector('.cart-sidebar');

        // Form elements
        this.couponInput = document.querySelector('.common-input');
        this.applyCouponButton = document.querySelector('.btn.btn-main');
        this.updateCartButton = document.querySelector('.text-lg.text-gray-500');

        // API configuration
        this.baseApiUrl = 'http://localhost:5002/api';

        this.initialize();
    }

    async initialize() {
        try {
            await this.fetchCartData();
            this.setupEventListeners();
        } catch (error) {
            console.error('Failed to initialize cart:', error);
            this.renderErrorState(error);
        }
    }

    setupEventListeners() {
        // Coupon application
        if (this.applyCouponButton && this.couponInput) {
            this.applyCouponButton.addEventListener('click', () => {
                const couponCode = this.couponInput.value.trim();
                if (couponCode) {
                    this.applyCoupon(couponCode);
                } else {
                    alert("Please enter a coupon code.");
                }
            });
        }

        // Update cart button
        if (this.updateCartButton) {
            this.updateCartButton.addEventListener('click', () => {
                this.updateAllQuantities();
            });
        }

        // Quantity controls - Rewritten to be more precise
        document.querySelectorAll('.quantity__minus_cart').forEach(button => {
            button.addEventListener('click', (e) => {
                const input = e.target.closest('.d-flex').querySelector('.quantity__input');
                if (input) {
                    const currentValue = parseInt(input.value) || 1;
                    input.value = Math.max(1, currentValue - 1);
                    this.updateProductSubtotal(input);
                }
            });
        });

        document.querySelectorAll('.quantity__plus_cart').forEach(button => {
            button.addEventListener('click', (e) => {
                const input = e.target.closest('.d-flex').querySelector('.quantity__input');
                if (input) {
                    const currentValue = parseInt(input.value) || 1;
                    input.value = currentValue + 1;
                    this.updateProductSubtotal(input);
                }
            });
        });

        // Direct input change event
        document.querySelectorAll('.quantity__input').forEach(input => {
            input.addEventListener('change', (e) => {
                const value = parseInt(e.target.value) || 1;
                e.target.value = Math.max(1, value);
                this.updateProductSubtotal(input);
            });
        });

        // Remove item buttons
        document.querySelectorAll('.remove-tr-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const row = e.target.closest('tr');
                const productId = this.getProductIdFromRow(row);
                if (productId) {
                    this.removeItem(productId);
                }
            });
        });
    }

    // New method to update product subtotal
    updateProductSubtotal(quantityInput) {
        const row = quantityInput.closest('tr');
        const priceElement = row.querySelector('td:nth-child(3) .h6');
        const productPrice = parseFloat(priceElement.textContent.replace('AED: ', '')) || 0;
        const quantity = parseInt(quantityInput.value) || 1;
        
        const subtotalElement = row.querySelector('td:nth-child(5) .h6');
        const subtotal = (productPrice * quantity).toFixed(2);
        
        subtotalElement.textContent = `AED ${subtotal}`;
    }

    getProductIdFromRow(row) {
        const productLink = row.querySelector('.table-product__content .title a');
        return productLink?.getAttribute('data-product-id');
    }

    async fetchCartData() {
        try {
            const token = localStorage.getItem('webtoken');
            if (!token) throw new Error('User is not authenticated.');

            const response = await fetch(`${this.baseApiUrl}/web_cart?currency_code=AED`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();

            if (data.success && data.cart) {
                this.renderCart(data.cart);
            } else {
                this.renderEmptyCart();
            }
        } catch (error) {
            console.error('Error fetching cart data:', error);
            this.renderErrorState(error);
        }
    }

    renderCart(cartData) {
        if (!cartData) return this.renderEmptyCart();

        // Render products in cart table
        if (this.cartTableBody && cartData.products) {
            this.cartTableBody.innerHTML = cartData.products
                .map(product => this.generateProductRow(product))
                .join('');
        }

        // Render cart totals in sidebar
        if (this.cartSidebar) {
            const totalsHtml = `
                <div class="cart-totals p-24 bg-color-three rounded-8 mb-24">
                    <div class="mb-32 flex-between gap-8">
                        <span class="text-gray-900 font-heading-two">Subtotal</span>
                        <span class="text-gray-900 fw-semibold">AED ${cartData.totalProductPrice?.toFixed(2) || '0.00'}</span>
                    </div>
                    <div class="mb-32 flex-between gap-8">
                        <span class="text-gray-900 font-heading-two">Estimated Delivery</span>
                        <span class="text-gray-900 fw-semibold">AED ${cartData.totalShippingPrice?.toFixed(2) || '0.00'}</span>
                    </div>
                    <div class="mb-0 flex-between gap-8">
                        <span class="text-gray-900 font-heading-two">Estimated Tax</span>
                        <span class="text-gray-900 fw-semibold">AED ${cartData.totalTax?.toFixed(2) || '0.00'}</span>
                    </div>
                </div>
                <div class="p-24 bg-color-three rounded-8">
                    <div class="flex-between gap-8">
                        <span class="text-gray-900 text-xl fw-semibold">Total</span>
                        <span class="text-gray-900 text-xl fw-semibold">AED ${(
                    (cartData.totalProductPrice || 0) +
                    (cartData.totalShippingPrice || 0) +
                    (cartData.totalTax || 0) -
                    (cartData.totalProductDiscount || 0)
                ).toFixed(2)}</span>
                    </div>
                </div>
            `;
            this.cartSidebar.innerHTML = totalsHtml;
        }

        this.setupEventListeners();
    }

    generateProductRow(product) {
        if (!product?.product) return '';

        function truncateText(text, wordLimit) {
            const words = text.split(' ');
            return words.length > wordLimit ? words.slice(0, wordLimit).join(' ') + '...' : text;
        }

        return `
            <tr>
             <td>
               <button type="button"
                class="remove-tr-btn flex-align gap-12 hover-text-danger-600">
                <i class="ph ph-x-circle text-2xl d-flex"></i>Remove</button>
             </td>
             <td>
              <div class="table-product d-flex align-items-center gap-24">
                <a href="product-details.html?${product._id}"
                  class="table-product__thumb border border-gray-100 rounded-8 flex-center ">
                    <img src="${product.product.image || ''}" alt="">
                 </a>
                  <div class="table-product__content text-start">
                    <h6 class="title text-lg fw-semibold mb-8">
                        <a href="product-details.html?${product._id}" class="link text-line-2"
                          tabindex="0">${truncateText(product.product.name || '', 4)}</a>
                    </h6>
                  </div>
              </div>
            </td>
             <td>
               <span class="text-lg h6 mb-0 fw-semibold">AED: ${product.product_discount}</span>
             </td>
             <td>
                <div class="d-flex rounded-4 overflow-hidden">
                        <button type="button" class="quantity__minus_cart border border-end border-gray-100 flex-shrink-0 h-48 w-48 text-neutral-600 flex-center hover-bg-main-600 hover-text-white">
                            <i class="ph ph-minus"></i>
                        </button>
                        <input type="number" class="quantity__input flex-grow-1 border border-gray-100 border-start-0 border-end-0 text-center w-32 px-4" value="${product.product_quantity || 1}" min="1">
                        <button type="button" class="quantity__plus_cart border border-end border-gray-100 flex-shrink-0 h-48 w-48 text-neutral-600 flex-center hover-bg-main-600 hover-text-white">
                            <i class="ph ph-plus"></i>
                        </button>
                 </div>
            </td>
            <td>
                <span class="text-lg h6 mb-0 fw-semibold">AED ${((product.product_discount || 0) * (product.product_quantity || 0)).toFixed(2)}</span>
            </td>
          </tr>
        `;
    }

    async removeItem(productId) {
        try {
            const token = localStorage.getItem('webtoken');
            const response = await fetch(`${this.baseApiUrl}/cart/remove/${productId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to remove item');
            }

            await this.fetchCartData();
        } catch (error) {
            console.error('Error removing item:', error);
            alert('Failed to remove item from cart');
        }
    }

    async updateAllQuantities() {
        try {
            const updates = [];
            document.querySelectorAll('.quantity__input').forEach(input => {
                const row = input.closest('tr');
                const productId = this.getProductIdFromRow(row);
                if (productId) {
                    updates.push({
                        productId,
                        quantity: parseInt(input.value) || 1
                    });
                }
            });

            const token = localStorage.getItem('webtoken');
            const response = await fetch(`${this.baseApiUrl}/cart/update-batch`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ updates })
            });

            if (!response.ok) {
                throw new Error('Failed to update quantities');
            }

            await this.fetchCartData();
        } catch (error) {
            console.error('Error updating quantities:', error);
            alert('Failed to update cart quantities');
        }
    }

    async applyCoupon(couponCode) {
        try {
            const token = localStorage.getItem('webtoken');
            const response = await fetch(`${this.baseApiUrl}/cart/apply-coupon`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ couponCode })
            });

            if (!response.ok) {
                throw new Error('Invalid coupon code');
            }

            await this.fetchCartData();
            alert('Coupon applied successfully');
        } catch (error) {
            console.error('Error applying coupon:', error);
            alert('Failed to apply coupon');
        }
    }

    renderEmptyCart() {
        if (this.cartTableBody) {
            this.cartTableBody.innerHTML = `
                <tr>
                    <td colspan="5" class="text-center py-32">
                        <h4 class="mb-8">Your cart is empty</h4>
                        <p class="text-gray-500">Add items to your cart to continue shopping</p>
                    </td>
                </tr>
            `;
        }

        if (this.cartSidebar) {
            this.cartSidebar.innerHTML = `
                <div class="text-center py-32">
                    <h6 class="text-xl mb-8">Cart Totals</h6>
                    <p class="text-gray-500">No items in cart</p>
                </div>
            `;
        }
    }

    renderErrorState(error) {
        if (this.cartTableBody) {
            this.cartTableBody.innerHTML = `
                <tr>
                    <td colspan="5" class="text-center py-32">
                        <h4 class="mb-8">Error loading cart</h4>
                        <p class="text-danger-600">${error.message}</p>
                    </td>
                </tr>
            `;
        }

        if (this.cartSidebar) {
            this.cartSidebar.innerHTML = `
                <div class="text-center py-32">
                    <h6 class="text-xl mb-8">Cart Totals</h6>
                    <p class="text-danger-600">Failed to load cart data</p>
                </div>
            `;
        }
    }
}

// Initialize cart manager when DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    new CartManager();
});