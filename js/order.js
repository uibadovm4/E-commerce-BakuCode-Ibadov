const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
const checkoutUser = JSON.parse(localStorage.getItem('checkoutUser')) || null;
const orderData = JSON.parse(localStorage.getItem('orderData')) || {};

// Order Summary Elements
const customerName = document.getElementById('customer-name');
const customerEmail = document.getElementById('customer-email');
const customerPhone = document.getElementById('customer-phone');
const customerAddress = document.getElementById('customer-address');

// Total Price Element
const totalPriceElement = document.getElementById('order-total');
const countdownElement = document.getElementById('countdown');

if (!checkoutUser && !orderData) {
    console.error('could not find checkoutUser or orderData!');
    window.location.href = '../index.html';
}else if (!checkoutUser) {
    console.error('could not find checkoutUser!');
    window.location.href = '../index.html';
}else if (!orderData) {
    console.error('could not find orderData!');
    window.location.href = '../index.html';
}else if (!cartItems || cartItems.length === 0) {
    console.error('could not find cartItems!');
    window.location.href = '../index.html';
}

function displayOrderSummary() {

    if (checkoutUser) {

        if (customerName) {
            customerName.textContent = checkoutUser.name || '-';
        }

        if (customerEmail) {
            customerEmail.textContent = checkoutUser.email || '-';
        }

        if (customerPhone) {
            customerPhone.textContent = checkoutUser.number || '-';
        }

        if (customerAddress) {
            customerAddress.textContent = checkoutUser.address || '-';
        }
    }

    if (totalPriceElement) {

        const total = orderData.totalPrice ?? orderData.total ?? 0;

        totalPriceElement.textContent = `$${Number(total).toFixed(2)}`;
    }
}


function startCountdown() {

    if (!countdownElement) {
        console.error('could not find countdown element');
        return;
    }

    let countdown = 5;

    countdownElement.textContent = countdown;

    const countdownInterval = setInterval(() => {

        countdown--;

        countdownElement.textContent = countdown;

        if (countdown <= 0) {

            clearInterval(countdownInterval);
            localStorage.removeItem('cartItems');
            localStorage.removeItem('checkoutUser');
            localStorage.removeItem('orderData');

            window.location.href = '../index.html';

        }

    }, 1000);
}


displayOrderSummary();
startCountdown();