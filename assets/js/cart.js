// cart.js

class CartManager {
    constructor() {
        this.cartTableBody = document.querySelector('.table tbody');
        this.subtotalElement = document.querySelector('[data-subtotal]');
        this.taxElement = document.querySelector('[data-tax]');
        this.shippingElement = document.querySelector('[data-shipping]');
        this.totalElement = document.querySelector('[data-total]');
        this.productCountElement = document.querySelector('[data-product-count]');
        
        this.initialize();
    }

    async initialize() {
        try {
            await this.fetchCartData();
            this.setupEventListeners();
        } catch (error) {
            console.error('Failed to initialize cart:', error);
        }
    }

    async fetchCartData() {
        try {
            const response = await fetch('http://localhost:5002/api/web_cart?currency_code=AED', {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch cart data');
            }

            const data = await response.json();
            this.renderCart(data);
        } catch (error) {
            console.error('Error fetching cart data:', error);
        }
    }

    renderCart(data) {
        if (!data.success || !data.cart) {
            console.error('Invalid cart data');
            return;
        }

        // Clear existing cart items
        this.cartTableBody.innerHTML = '';

        // Render each product
        data.cart.products.forEach(item => {
            const productHtml = this.createProductHtml(item);
            this.cartTableBody.insertAdjacentHTML('beforeend', productHtml);
        });

        // Update summary
        this.updateCartSummary({
            subtotal: data.totalProductPrice,
            tax: data.totalTax,
            shipping: data.totalShippingPrice,
            total: data.totalProductPrice + data.totalTax + data.totalShippingPrice - data.totalProductDiscount
        });
    }

    createProductHtml(item) {
        const product = item.product;
        return `
            <tr data-product-id="${product._id}">
                <td>
                    <button type="button" class="remove-tr-btn flex-align gap-12 hover-text-danger-600">
                        <i class="ph ph-x-circle text-2xl d-flex"></i>
                        Remove
                    </button>
                </td>
                <td>
                    <div class="table-product d-flex align-items-center gap-24">
                        <a href="product-details-two.html" class="table-product__thumb border border-gray-100 rounded-8 flex-center">
                            <img src="${product.image}" alt="${product.name}">
                        </a>
                        <div class="table-product__content text-start">
                            <h6 class="title text-lg fw-semibold mb-8">
                                <a href="product-details.html" class="link text-line-2">${product.name}</a>
                            </h6>
                        </div>
                    </div>
                </td>
                <td>
                    <span class="text-lg h6 mb-0 fw-semibold">${item.product_currecy_code} ${item.product_price.toFixed(2)}</span>
                </td>
                <td>
                    <div class="d-flex rounded-4 overflow-hidden">
                        <button type="button" class="quantity__minus border border-end border-gray-100 flex-shrink-0 h-48 w-48 text-neutral-600 flex-center hover-bg-main-600 hover-text-white">
                            <i class="ph ph-minus"></i>
                        </button>
                        <input type="number" class="quantity__input flex-grow-1 border border-gray-100 border-start-0 border-end-0 text-center w-32 px-4"
                            value="${item.product_quantity}" min="1" data-product-id="${product._id}">
                        <button type="button" class="quantity__plus border border-end border-gray-100 flex-shrink-0 h-48 w-48 text-neutral-600 flex-center hover-bg-main-600 hover-text-white">
                            <i class="ph ph-plus"></i>
                        </button>
                    </div>
                </td>
                <td>
                    <span class="text-lg h6 mb-0 fw-semibold">${item.product_currecy_code} ${(item.product_price * item.product_quantity).toFixed(2)}</span>
                </td>
            </tr>
        `;
    }

    updateCartSummary({ subtotal, tax, shipping, total }) {
        if (this.subtotalElement) {
            this.subtotalElement.textContent = `AED ${subtotal.toFixed(2)}`;
        }
        if (this.taxElement) {
            this.taxElement.textContent = `AED ${tax.toFixed(2)}`;
        }
        if (this.shippingElement) {
            this.shippingElement.textContent = shipping === 0 ? 'Free' : `AED ${shipping.toFixed(2)}`;
        }
        if (this.totalElement) {
            this.totalElement.textContent = `AED ${total.toFixed(2)}`;
        }
    }

    setupEventListeners() {
        // Remove item
        this.cartTableBody.addEventListener('click', (e) => {
            if (e.target.closest('.remove-tr-btn')) {
                const row = e.target.closest('tr');
                const productId = row.dataset.productId;
                this.removeItem(productId);
            }
        });

        // Quantity changes
        this.cartTableBody.addEventListener('click', (e) => {
            const button = e.target.closest('.quantity__minus, .quantity__plus');
            if (!button) return;

            const input = button.parentElement.querySelector('.quantity__input');
            const productId = input.dataset.productId;
            const currentValue = parseInt(input.value);

            if (button.classList.contains('quantity__minus')) {
                if (currentValue > 1) {
                    input.value = currentValue - 1;
                    this.updateQuantity(productId, currentValue - 1);
                }
            } else {
                input.value = currentValue + 1;
                this.updateQuantity(productId, currentValue + 1);
            }
        });
    }

    async removeItem(productId) {
        try {
            const response = await fetch(`http://localhost:5002/api/remove_cart_item/${productId}`, {
                method: 'DELETE',
                credentials: 'include'
            });

            if (response.ok) {
                await this.fetchCartData(); // Refresh cart data
            } else {
                console.error('Failed to remove item');
            }
        } catch (error) {
            console.error('Error removing item:', error);
        }
    }

    async updateQuantity(productId, quantity) {
        try {
            const response = await fetch(`http://localhost:5002/api/update_cart_quantity`, {
                method: 'PUT',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    productId,
                    quantity
                })
            });

            if (response.ok) {
                await this.fetchCartData(); // Refresh cart data
            } else {
                console.error('Failed to update quantity');
            }
        } catch (error) {
            console.error('Error updating quantity:', error);
        }
    }
}

// Initialize cart manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new CartManager();
});