const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

const cartProductsContainer = document.getElementById('cart-products');
const cartTotalElement = document.getElementById('cart-total');
const cartSubtotalElement = document.getElementById('cart-subtotal');

function updateCartTotal() {
    if (!cartTotalElement) return;

    const total = cartItems.reduce((sum, item) => {
        return sum + (Number(item.price) * Number(item.howMany || 1));
    }, 0);

    cartTotalElement.textContent = `$${total.toFixed(2)}`;
}

function updateCartSubtotal() {
    if (!cartSubtotalElement) return;

    const subtotal = cartItems.reduce((sum, item) => {
        return sum + (Number(item.price) * Number(item.howMany || 1));
    }, 0);

    cartSubtotalElement.textContent = `$${subtotal.toFixed(2)}`;
}

function saveCart() {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
}

function displayCartItems() {
    if (!cartProductsContainer) return;

    cartProductsContainer.innerHTML = '';

    cartItems.forEach((item) => {
        const productElement = document.createElement('div');
        productElement.classList.add('cart-item');

        productElement.innerHTML = `
            <div class="cart-product">
                <img src="${item.image}" alt="product">
                <span>${item.name}</span>
            </div>

            <span class="cart-price">
                $${Number(item.price).toFixed(2)}
            </span>

            <input
                class="cart-quantity"
                type="number"
                value="${item.howMany || 1}"
                min="1"
            >

            <span class="cart-subtotal">
                $${(
                    Number(item.price) * Number(item.howMany || 1)
                ).toFixed(2)}
            </span>

            <button class="cart-remove" type="button">
                Remove
            </button>
        `;

        const removeButton = productElement.querySelector('.cart-remove');

        removeButton.addEventListener('click', () => {
            removeButton.disabled = true;

            setTimeout(() => {
                const itemIndex = cartItems.indexOf(item);

                if (itemIndex === -1) {
                    return;
                }

                cartItems.splice(itemIndex, 1);

                saveCart();

                displayCartItems();
            }, 1000);
        });

        const quantityInput = productElement.querySelector('.cart-quantity');

        quantityInput.addEventListener('change', (event) => {
            const newQuantity = parseInt(event.target.value, 10);

            if (Number.isNaN(newQuantity) || newQuantity < 1) {
                event.target.value = item.howMany || 1;
                return;
            }

            item.howMany = newQuantity;

            saveCart();

            productElement.querySelector('.cart-subtotal').textContent =
                `$${(Number(item.price) * newQuantity).toFixed(2)}`;

            updateCartTotal();
            updateCartSubtotal();
        });

        cartProductsContainer.appendChild(productElement);
    });

    updateCartTotal();
    updateCartSubtotal();
}

displayCartItems();

document.querySelectorAll('.checkout-btn').forEach((button) => {
    button.addEventListener('click', () => {
        if (cartItems.length === 0) {
            Swal.fire({
                icon: 'error',
                title: 'Your cart is empty.',
                text: 'Please add items to your cart before proceeding to checkout.',
                showConfirmButton: true
            });
        } else {
            window.location.href = './checkout.html';
        }
    });
});
