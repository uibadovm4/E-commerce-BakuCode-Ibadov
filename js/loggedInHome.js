function checkLoginStatus() {
    const response = localStorage.getItem("response");
    const username = response ? JSON.parse(response).body.username : null;
    if (response) {
        document.querySelector(".nav").innerHTML = `
            <div class="logo">
                E-commerce
            </div>

            <div class="pages">
                <a href="./index.html">Home</a>
                <a href="./pages/about.html">About</a>
                <a href="./pages/contact.html">Contact</a>
                <a href="./pages/userProducts.html">Your Products</a>
                <a class="shop-link" href="./pages/shop.html">Shop</a>
            </div>

            <div class="search-bar">
                <input 
                    placeholder="What are you looking for?" 
                    id="search"
                >
                <label for="search">
                    <i class="fas fa-search"></i>
                </label>
            </div>

            <div class="user-actions">
            <a href="./pages/cart.html"><i class="fas fa-shopping-cart"></i></a>
                <a href="./pages/userProfile.html">${username} <i class="fas fa-user"></i></a>
                <button type="button" id="logout-btn">
                    Logout
                </button>
            </div>
        `;

        document
            .getElementById("logout-btn")
            .addEventListener("click", () => {
                

                
                Swal.fire({
                    title: "Are you sure?",
                    text: "You can log in again later.",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#3085d6",
                    cancelButtonColor: "#d33",
                    confirmButtonText: "Yes, log out!"
                }).then((result) => {
                    if (result.isConfirmed) {
                        localStorage.removeItem("response");
                        localStorage.removeItem("token");
                        Swal.fire({
                            title: "Logged out!",
                            text: "You have been logged out.",
                            icon: "success"
                        }).then(() => {
                        window.location.reload();
                        });
                    }
                });
            });
    }
}

checkLoginStatus();