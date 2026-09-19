function checkLoginStatus() {
    const response = localStorage.getItem("response");
    let user;

    try {
        user = response ? JSON.parse(response).body : null;
    } catch (error) {
        localStorage.removeItem("response");
        localStorage.removeItem("token");
        return;
    }

    const nav = document.querySelector(".nav");
    if (user && nav) {
        nav.innerHTML = `
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
                <a href="./pages/userProfile.html">${user.username || "Profile"} <i class="fas fa-user"></i></a>
                <button type="button" id="logout-btn">
                    Logout
                </button>
            </div>
        `;

        document
            .getElementById("logout-btn")
            .addEventListener("click", (event) => {
                event.preventDefault();

                const logout = () => {
                    localStorage.removeItem("response");
                    localStorage.removeItem("token");
                    window.location.reload();
                };

                if (typeof Swal === "undefined") {
                    if (window.confirm("Are you sure you want to log out?")) {
                        logout();
                    }
                    return;
                }

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
                        logout();
                    }
                });
            });
    }
}

checkLoginStatus();