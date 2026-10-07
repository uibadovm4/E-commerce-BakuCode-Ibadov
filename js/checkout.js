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
            firstName: document.getElementById('first-name').value.trim(),
            lastName: document.getElementById('last-name').value.trim(),
            email: document.getElementById('email').value.trim(),
            address: document.getElementById('address').value.trim(),
            city: document.getElementById('city').value.trim(),
            stateId: +document.getElementById('state').value,
            zip: +document.getElementById('zip').value.trim(),
            phone: document.getElementById('tel').value.trim(),
            isAgree: true,
            cardNumber: +document.getElementById('card-number').value,
            expirationMonth: +document.getElementById('exp-month').value,
            expirationYear: +document.getElementById('exp-year').value,
            cardSecurityCode: + document.getElementById('cvc').value,
            products: cartItems.map(cart => ({
                productId: cart.productId,
                quantity: cart.howMany
            }))
        };

        localStorage.setItem(
            'checkoutUser',
            JSON.stringify(checkoutUser)
        );

        fetch('http://195.26.245.5:9505/api/orders', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(checkoutUser)
        })
            .then(response => {
                if (response.ok) {
                    Swal.fire({
                        title: 'Order Placed!',
                        text: 'Your order has been placed successfully.',
                        icon: 'success',
                        confirmButtonText: 'OK'
                    }).then(() => {
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

                        window.location.href = 'order.html';
                    });
                }
            })

    });
}
