document.addEventListener("click", (event) => {
    const button = event.target.closest(".add-tocart");

    if (!button) return;

    const product = button.closest(".product-card");

    if (!product) return;

    const name = product.querySelector(".product-brand").textContent.trim();
    const model = product.querySelector("h3").textContent.trim();
    const image = product.querySelector(".product-image").src;
    const priceText = product.querySelector(".product-price").textContent.trim();
    const price = Number(priceText.replace(/[^0-9.]/g, ""));

    const cartItem = {
        name,
        model,
        image,
        price,
        howMany: 1,
    };

    const storedItems = JSON.parse(localStorage.getItem("cartItems") || "[]");
    const cartItems = Array.isArray(storedItems) ? storedItems : [storedItems];

    const existingItem = cartItems.find(
        (item) => item.name === name && item.model === model
    );

    if (existingItem && localStorage.getItem("response")) {
        existingItem.howMany += 1;
        Swal.fire({
            position: "top",
            icon: "success",
            title: `${name} ${model} has been added again to your cart!`,
            showConfirmButton: true,
        });
    } else if (localStorage.getItem("response")) {
        cartItems.push(cartItem);
        Swal.fire({
            position: "top",
            icon: "success",
            title: `${name} ${model} has been added to your cart!`,
            showConfirmButton: true,
        });
    }else {
        Swal.fire({
            position: "top",
            icon: "error",
            title: "You need to log in to add items to your cart.",
            showConfirmButton: true,
        });
    }
    localStorage.setItem("cartItems", JSON.stringify(cartItems));

});