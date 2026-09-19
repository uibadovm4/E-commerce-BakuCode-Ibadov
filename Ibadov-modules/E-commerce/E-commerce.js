
class ECommerceKit {
  constructor(products = [], config = {}) {
    this.allProducts = Array.isArray(products) ? [...products] : [];
    this.filteredProducts = [...this.allProducts];

    this.itemsPerPage = Math.max(1, Number(config.itemsPerPage) || 8);
    this.currentPage = 1;

    this.currency = config.currency || "₼";
    this.cartStorageKey = config.cartStorageKey || "ecommerce_cart";
    this.persistCart = config.persistCart ?? true;

    this.cart = this.loadCart();

    // Aktif filtreler
    this.filters = {
      search: "",
      category: "all",
      minPrice: 0,
      maxPrice: Infinity
    };

    // Aktif sıralama
    this.sortType = null;

    this.apply();
  }

  /* =========================================================
     PRODUCTS
  ========================================================= */

  get products() {
    return [...this.filteredProducts];
  }

  get productCount() {
    return this.filteredProducts.length;
  }

  get categories() {
    return [
      ...new Set(
        this.allProducts
          .map(product => product.category)
          .filter(Boolean)
      )
    ];
  }

  getProduct(productId) {
    return this.allProducts.find(
      product => product.id === productId
    ) || null;
  }

  addProduct(product) {
    if (!product || product.id == null) {
      throw new Error("Product must have an id.");
    }

    if (this.getProduct(product.id)) {
      throw new Error(`Product with id "${product.id}" already exists.`);
    }

    this.allProducts.push({
      ...product
    });

    this.apply();

    return this;
  }

  removeProduct(productId) {
    this.allProducts = this.allProducts.filter(
      product => product.id !== productId
    );

    this.cart = this.cart.filter(
      item => item.id !== productId
    );

    this.saveCart();
    this.apply();

    return this;
  }

  /* =========================================================
     SEARCH
  ========================================================= */

  search(keyword = "") {
    this.filters.search = String(keyword).trim();

    this.currentPage = 1;
    this.apply();

    return this;
  }

  /* =========================================================
     FILTER
  ========================================================= */

  filter({
    category = "all",
    minPrice = 0,
    maxPrice = Infinity
  } = {}) {
    this.filters.category = category;
    this.filters.minPrice = Number(minPrice) || 0;
    this.filters.maxPrice =
      maxPrice === Infinity
        ? Infinity
        : Number(maxPrice);

    this.currentPage = 1;
    this.apply();

    return this;
  }

  /* =========================================================
     SORT
  ========================================================= */

  sort(type = null) {
    const validTypes = [
      "price-asc",
      "price-desc",
      "name-asc",
      "name-desc",
      "newest",
      "oldest"
    ];

    if (type !== null && !validTypes.includes(type)) {
      throw new Error(
        `Invalid sort type. Available: ${validTypes.join(", ")}`
      );
    }

    this.sortType = type;

    this.currentPage = 1;
    this.apply();

    return this;
  }

  /* =========================================================
     APPLY SEARCH + FILTER + SORT
  ========================================================= */

  apply() {
    const {
      search,
      category,
      minPrice,
      maxPrice
    } = this.filters;

    const term = search.toLowerCase();

    this.filteredProducts = this.allProducts.filter(product => {
      const title =
        String(product.title || "").toLowerCase();

      const description =
        String(product.description || "").toLowerCase();

      const matchSearch =
        !term ||
        title.includes(term) ||
        description.includes(term);

      const matchCategory =
        category === "all" ||
        product.category === category;

      const price = Number(product.price) || 0;

      const matchPrice =
        price >= minPrice &&
        price <= maxPrice;

      return (
        matchSearch &&
        matchCategory &&
        matchPrice
      );
    });

    this.applySort();

    return this;
  }

  applySort() {
    if (!this.sortType) return;

    this.filteredProducts.sort((a, b) => {
      const priceA = Number(a.price) || 0;
      const priceB = Number(b.price) || 0;

      switch (this.sortType) {
        case "price-asc":
          return priceA - priceB;

        case "price-desc":
          return priceB - priceA;

        case "name-asc":
          return String(a.title || "").localeCompare(
            String(b.title || "")
          );

        case "name-desc":
          return String(b.title || "").localeCompare(
            String(a.title || "")
          );

        case "newest":
          return (
            new Date(b.createdAt || 0) -
            new Date(a.createdAt || 0)
          );

        case "oldest":
          return (
            new Date(a.createdAt || 0) -
            new Date(b.createdAt || 0)
          );

        default:
          return 0;
      }
    });
  }

  /* =========================================================
     RESET
  ========================================================= */

  resetFilters() {
    this.filters = {
      search: "",
      category: "all",
      minPrice: 0,
      maxPrice: Infinity
    };

    this.sortType = null;
    this.currentPage = 1;

    this.apply();

    return this;
  }

  /* =========================================================
     PAGINATION
  ========================================================= */

  get totalPages() {
    return Math.max(
      1,
      Math.ceil(
        this.filteredProducts.length /
        this.itemsPerPage
      )
    );
  }

  getPage(page = this.currentPage) {
    const requestedPage = Number(page) || 1;

    this.currentPage = Math.max(
      1,
      Math.min(
        requestedPage,
        this.totalPages
      )
    );

    const start =
      (this.currentPage - 1) *
      this.itemsPerPage;

    const end =
      start + this.itemsPerPage;

    return {
      products: this.filteredProducts.slice(start, end),

      currentPage: this.currentPage,

      totalPages: this.totalPages,

      totalItems:
        this.filteredProducts.length,

      itemsPerPage:
        this.itemsPerPage,

      hasNext:
        this.currentPage <
        this.totalPages,

      hasPrev:
        this.currentPage > 1
    };
  }

  nextPage() {
    return this.getPage(
      this.currentPage + 1
    );
  }

  previousPage() {
    return this.getPage(
      this.currentPage - 1
    );
  }

  firstPage() {
    return this.getPage(1);
  }

  lastPage() {
    return this.getPage(
      this.totalPages
    );
  }

  /* =========================================================
     CART
  ========================================================= */

  loadCart() {
    if (!this.persistCart) {
      return [];
    }

    try {
      const saved =
        localStorage.getItem(
          this.cartStorageKey
        );

      if (!saved) {
        return [];
      }

      const parsed =
        JSON.parse(saved);

      return Array.isArray(parsed)
        ? parsed
        : [];
    } catch {
      return [];
    }
  }

  saveCart() {
    if (!this.persistCart) {
      return;
    }

    try {
      localStorage.setItem(
        this.cartStorageKey,
        JSON.stringify(this.cart)
      );
    } catch {
      console.warn(
        "ECommerceKit: Could not save cart."
      );
    }
  }

  addToCart(productId, quantity = 1) {
    const product =
      this.getProduct(productId);

    if (!product) {
      return false;
    }

    quantity = Math.floor(
      Number(quantity)
    );

    if (quantity <= 0) {
      return false;
    }

    const existingItem =
      this.cart.find(
        item => item.id === productId
      );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      this.cart.push({
        ...product,
        quantity
      });
    }

    this.saveCart();

    return this.getCartSummary();
  }

  removeFromCart(productId) {
    this.cart = this.cart.filter(
      item => item.id !== productId
    );

    this.saveCart();

    return this.getCartSummary();
  }

  updateQuantity(productId, quantity) {
    const item =
      this.cart.find(
        item => item.id === productId
      );

    if (!item) {
      return false;
    }

    quantity = Math.floor(
      Number(quantity)
    );

    if (quantity <= 0) {
      return this.removeFromCart(
        productId
      );
    }

    item.quantity = quantity;

    this.saveCart();

    return this.getCartSummary();
  }

  increaseQuantity(productId, amount = 1) {
    const item =
      this.cart.find(
        item => item.id === productId
      );

    if (!item) {
      return false;
    }

    return this.updateQuantity(
      productId,
      item.quantity + Number(amount)
    );
  }

  decreaseQuantity(productId, amount = 1) {
    const item =
      this.cart.find(
        item => item.id === productId
      );

    if (!item) {
      return false;
    }

    return this.updateQuantity(
      productId,
      item.quantity - Number(amount)
    );
  }

  clearCart() {
    this.cart = [];

    this.saveCart();

    return this.getCartSummary();
  }

  hasInCart(productId) {
    return this.cart.some(
      item => item.id === productId
    );
  }

  getCartItem(productId) {
    return (
      this.cart.find(
        item => item.id === productId
      ) || null
    );
  }

  getCartSummary() {
    const total = this.cart.reduce(
      (sum, item) =>
        sum +
        (
          Number(item.price) *
          Number(item.quantity)
        ),
      0
    );

    const itemCount =
      this.cart.reduce(
        (sum, item) =>
          sum +
          Number(item.quantity),
        0
      );

    return {
      items: [...this.cart],
      itemCount,
      uniqueItems: this.cart.length,
      totalPrice: total,
      formattedTotal: this.formatPrice(total)
    };
  }

  /* =========================================================
     PRICE
  ========================================================= */

  formatPrice(price) {
    return `${Number(price).toFixed(2)} ${this.currency}`;
  }

  getCartTotal() {
    return this.cart.reduce(
      (total, item) =>
        total +
        Number(item.price) *
        Number(item.quantity),
      0
    );
  }

  /* =========================================================
     STATE
  ========================================================= */

  getState() {
    return {
      products: [...this.filteredProducts],
      filters: { ...this.filters },
      sort: this.sortType,
      pagination: this.getPage(),
      cart: this.getCartSummary()
    };
  }
}

if (typeof module !== "undefined") {
  module.exports = ECommerceKit;
}
