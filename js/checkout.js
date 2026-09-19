const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

const cartTotalElement = document.querySelector('.total-amount');
const cartSubtotalElement = document.querySelector('.subtotal-amount');

function calculateCartTotal() {
    return cartItems.reduce((total, item) => {
        const price = Number(item.price) || 0;
        const quantity = Number(item.howMany) || 1;

        return total + (price * quantity);
    }, 0);
}

function updateCartTotal() {
    if (!cartTotalElement) return;

    const total = calculateCartTotal();

    cartTotalElement.textContent = `$${total.toFixed(2)}`;
}

function updateCartSubtotal() {
    if (!cartSubtotalElement) return;

    const subtotal = calculateCartTotal();

    cartSubtotalElement.textContent = `$${subtotal.toFixed(2)}`;
}

updateCartTotal();
updateCartSubtotal();


const checkoutForm = document.querySelector('.checkout-form');

if (checkoutForm) {
    checkoutForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const checkoutUser = {
            name: document.getElementById('first-name').value.trim(),
            surname: document.getElementById('last-name').value.trim(),
            email: document.getElementById('email').value.trim(),
            address: document.getElementById('address').value.trim(),
            city: document.getElementById('city').value.trim(),
            state: document.getElementById('state').value,
            zip: document.getElementById('zip').value.trim(),
            number: document.getElementById('tel').value.trim()
        };

        localStorage.setItem(
            'checkoutUser',
            JSON.stringify(checkoutUser)
        );

        const orderData = {
            products: cartItems,
            subtotal: calculateCartTotal(),
            shipping: 0,
            total: calculateCartTotal(),
            user: checkoutUser,
            date: new Date().toISOString()
        };

        localStorage.setItem(
            'orderData',
            JSON.stringify(orderData)
        );

        Swal.fire({
            title: 'Order Placed!',
            text: 'Your order has been placed successfully.',
            icon: 'success',
            confirmButtonText: 'OK'
        }).then(() => {
            window.location.href = 'order.html';
        });
    });
}
