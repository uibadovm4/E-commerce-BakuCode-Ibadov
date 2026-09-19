const productsContainer = document.getElementById("products");
const categoriesContainer = document.getElementById("categories");
const productCount = document.getElementById("productCount");
const showAllButton = document.getElementById("showAllProducts");
const sortSelect = document.getElementById("sortProducts");
const searchInput = document.getElementById("searchInput");

const categories = {
    1: "Laptops",
    2: "Gaming",
    3: "Accessories",
    4: "Electronics",
    5: "Audio",
    6: "Phones",
    7: "Tablets",
    8: "TV",
    9: "SmartPhones",
    10: "HeadPhones",
    11: "Personal Computers"
};

let allProducts = [];
let selectedCategory = null;
let selectedRating = null;
let selectedSort = null;
let selectedSearch = "";

function getToken() {
    const directToken = localStorage.getItem("token");
    if (directToken) return directToken;

    const savedResponse = localStorage.getItem("response");
    if (!savedResponse) return null;

    try {
        const saved = JSON.parse(savedResponse);
        return saved.body?.token || saved.response?.body?.token || saved.respons?.body?.token || saved.token || saved.data?.token || null;
    } catch {
        return null;
    }
}

async function loadProducts() {
    try {
        const response = await fetch(
            "http://195.26.245.5:9505/api/products",
            {
                headers: {
                    Accept: "*/*",
                    ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {})
                }
            }
        );

        if (!response.ok) {
            throw new Error("Failed to fetch products");
        }

        const data = await response.json();

        console.log("Products:", data);

        allProducts = Array.isArray(data)
            ? data
            : data.content || data.products || data.items || data.data?.content || data.data?.products || [];

        allProducts = await Promise.all(
            allProducts.map(async product => ({
                ...product,
                averageRating: await getProductRating(product.id)
            }))
        );

        renderProducts(allProducts);
        renderCategories(allProducts);

    } catch (error) {
        console.error("Error:", error);

        productsContainer.innerHTML = `
            <p>Failed to load products.</p>
        `;
    }
}

async function getProductRating(productId) {
    try {
        const response = await fetch(
            `http://195.26.245.5:9505/api/ratings/${productId}`,
            {
                headers: {
                    Accept: "*/*",
                    ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {})
                }
            }
        );

        if (!response.ok) return "No rating";

        const data = await response.json();
        const rating = data.averageRating ?? data.rating ?? data.ratingValue ?? data.value ?? data.score;

        if (rating !== undefined && Number.isFinite(Number(rating))) {
            return Number(rating).toFixed(1);
        }

        const ratings = Array.isArray(data)
            ? data
            : data.content || data.ratings || data.data || [];
        const values = ratings
            .map(item => Number(item.averageRating ?? item.rating ?? item.ratingValue ?? item.value ?? item.score))
            .filter(Number.isFinite);

        return values.length
            ? (values.reduce((sum, value) => sum + value, 0) / values.length).toFixed(1)
            : "No rating";
    } catch (error) {
        console.error(`Failed to fetch rating for product ${productId}:`, error);
        return "No rating";
    }
}

function renderProducts(products) {
    productCount.textContent = `${products.length} Products`;

    if (products.length === 0) {
        productsContainer.innerHTML = `
            <p>No products found.</p>
        `;
        return;
    }

    productsContainer.innerHTML = products.map(product => `
        <div class="product-card">

            <img
                src="${product.imageUrl || ""}"
                alt="${product.brand || ""} ${product.model || "Product"}"
                class="product-image"
                data-id="${product.id}"
            >

            <div class="product-info">

                <span class="product-brand">
                    ${product.brand || "Unknown Brand"}
                </span>

                <h3>
                    ${product.model || "Unnamed Product"}
                </h3>

                <p class="product-description">
                    ${product.description || "Discover this amazing product."}
                </p>

                <div class="product-rating">
                    <span>★</span>
                    ${product.averageRating ?? "No rating"}
                </div>

                <div class="product-bottom">

                    <span class="product-price">
                        $${Number(product.price || 0).toFixed(2)}
                    </span>

                    <button
                        type="button"
                        class="add-tocart"
                    >
                        Add to cart
                    </button>

                </div>

            </div>

        </div>
    `).join("");
}

function renderCategories(products) {
    const productCategories = [
        ...new Set(products.map(product => product.categoryId))
    ];

    categoriesContainer.innerHTML = productCategories.map(categoryId => `
        <button
            class="category-btn"
            data-category="${categoryId}"
        >
            ${categories[categoryId] || `Category ${categoryId}`}
        </button>
    `).join("");
}

function filterProducts() {
    const search = selectedSearch.trim().toLowerCase();
    const filteredProducts = allProducts.filter(product => {
        const text = [product.brand, product.model, product.description,
            categories[product.categoryId]].filter(Boolean).join(" ").toLowerCase();
        return (selectedCategory === null || product.categoryId === Number(selectedCategory)) &&
            (selectedRating === null || Number(product.averageRating) >= Number(selectedRating)) &&
            (!search || text.includes(search));
    });

    if (selectedSort) {
        const direction = selectedSort === "low-high" ? 1 : -1;
        filteredProducts.sort((a, b) => direction * (Number(a.price) - Number(b.price)));
    }

    renderProducts(filteredProducts);
}

categoriesContainer.addEventListener("click", event => {
    const button = event.target.closest(".category-btn");

    if (!button) return;

    document.querySelectorAll(".category-btn").forEach(btn => btn.classList.remove("active"));
    button.classList.add("active");
    selectedCategory = button.dataset.category;
    filterProducts();
});

document.querySelectorAll('input[name="rating"]').forEach(input => {
    input.addEventListener("change", event => (selectedRating = event.target.value, filterProducts()));
});

sortSelect.addEventListener("change", event => (selectedSort = event.target.value, filterProducts()));

if (searchInput) {
    searchInput.addEventListener("input", event => (selectedSearch = event.target.value, filterProducts()));
}

showAllButton.addEventListener("click", () => {
    selectedCategory = selectedRating = selectedSort = null;
    selectedSearch = "";

    document.querySelectorAll(".category-btn").forEach(button => button.classList.remove("active"));
    document.querySelectorAll('input[name="rating"]').forEach(input => input.checked = false);
    sortSelect.value = "";
    if (searchInput) searchInput.value = "";
    renderProducts(allProducts);
});

document.addEventListener("click", event => {
    const productImage = event.target.closest(".product-image");
    if (!productImage) return;
    window.location.href = `./product.html?id=${productImage.dataset.id}`;
});

loadProducts();

