````md
# ECommerceKit

A lightweight JavaScript utility class for handling common e-commerce functionality.

ECommerceKit provides:

- Product search
- Category filtering
- Price filtering
- Product sorting
- Pagination
- Shopping cart management
- Cart quantity controls
- LocalStorage cart persistence
- Product management
- Price formatting
- Complete state management

---

## Features

### Product Search

Search through product titles and descriptions.

```js
kit.search("laptop");
````

The search is case-insensitive.

---

### Category Filtering

Filter products by category.

```js
kit.filter({
  category: "electronics"
});
```

Use `"all"` to show every category.

```js
kit.filter({
  category: "all"
});
```

---

### Price Filtering

Filter products by minimum and maximum price.

```js
kit.filter({
  minPrice: 500,
  maxPrice: 5000
});
```

You can also combine category and price filtering.

```js
kit.filter({
  category: "electronics",
  minPrice: 500,
  maxPrice: 5000
});
```

---

## Sorting

Available sorting methods:

```js
kit.sort("price-asc");
kit.sort("price-desc");

kit.sort("name-asc");
kit.sort("name-desc");

kit.sort("newest");
kit.sort("oldest");
```

### Price ascending

```js
kit.sort("price-asc");
```

### Price descending

```js
kit.sort("price-desc");
```

### Name ascending

```js
kit.sort("name-asc");
```

### Name descending

```js
kit.sort("name-desc");
```

---

## Combining Search, Filters and Sorting

Search, filters and sorting can be used together.

```js
kit
  .search("phone")
  .filter({
    category: "electronics",
    minPrice: 500,
    maxPrice: 5000
  })
  .sort("price-asc");
```

The library automatically recalculates the resulting product list.

---

## Reset

Reset all active search, filters and sorting.

```js
kit.resetFilters();
```

This returns the product list to its original state.

---

# Pagination

Create a kit with a custom number of products per page.

```js
const kit = new ECommerceKit(products, {
  itemsPerPage: 12
});
```

Get a specific page:

```js
const page = kit.getPage(2);

console.log(page.products);
console.log(page.currentPage);
console.log(page.totalPages);
```

The returned object contains:

```js
{
  products: [],
  currentPage: 2,
  totalPages: 5,
  totalItems: 50,
  itemsPerPage: 12,
  hasNext: true,
  hasPrev: true
}
```

---

## Pagination Helpers

Go to the next page:

```js
kit.nextPage();
```

Go to the previous page:

```js
kit.previousPage();
```

Go to the first page:

```js
kit.firstPage();
```

Go to the last page:

```js
kit.lastPage();
```

---

# Shopping Cart

Add a product:

```js
kit.addToCart(1);
```

Add multiple quantities:

```js
kit.addToCart(1, 3);
```

If the product is already in the cart, its quantity will be increased.

---

## Remove Product

```js
kit.removeFromCart(1);
```

---

## Update Quantity

```js
kit.updateQuantity(1, 5);
```

A quantity of `0` or less removes the product.

---

## Increase Quantity

```js
kit.increaseQuantity(1);
```

Or increase by a specific amount:

```js
kit.increaseQuantity(1, 3);
```

---

## Decrease Quantity

```js
kit.decreaseQuantity(1);
```

Or:

```js
kit.decreaseQuantity(1, 2);
```

If the quantity reaches zero, the product is automatically removed.

---

## Check Cart

```js
const cart = kit.getCartSummary();

console.log(cart);
```

Example:

```js
{
  items: [
    {
      id: 1,
      title: "Laptop",
      price: 2500,
      quantity: 2
    }
  ],

  itemCount: 2,

  uniqueItems: 1,

  totalPrice: 5000,

  formattedTotal: "5000.00 ₼"
}
```

---

## Clear Cart

```js
kit.clearCart();
```

---

## Check Product In Cart

```js
kit.hasInCart(1);
```

Returns:

```js
true
```

or:

```js
false
```

---

## Get Cart Item

```js
const item = kit.getCartItem(1);
```

Returns the cart item or `null`.

---

# LocalStorage

Cart persistence is enabled by default.

The cart is stored in:

```text
localStorage
```

Default storage key:

```text
ecommerce_cart
```

You can change the key:

```js
const kit = new ECommerceKit(products, {
  cartStorageKey: "my_shop_cart"
});
```

Disable LocalStorage:

```js
const kit = new ECommerceKit(products, {
  persistCart: false
});
```

---

# Products

Products should generally follow this structure:

```js
const products = [
  {
    id: 1,
    title: "Gaming Laptop",
    description: "High-performance gaming laptop",
    category: "electronics",
    price: 2500,
    createdAt: "2026-09-01"
  },

  {
    id: 2,
    title: "Wireless Mouse",
    description: "Wireless gaming mouse",
    category: "electronics",
    price: 80,
    createdAt: "2026-09-02"
  }
];
```

Only `id` is required for product management.

The following properties are recommended:

```text
id
title
description
category
price
createdAt
```

---

# Product Management

Get a product:

```js
const product = kit.getProduct(1);
```

Add a new product:

```js
kit.addProduct({
  id: 3,
  title: "Mechanical Keyboard",
  description: "RGB mechanical keyboard",
  category: "electronics",
  price: 150,
  createdAt: "2026-09-03"
});
```

Remove a product:

```js
kit.removeProduct(3);
```

Removing a product also removes it from the cart if it exists there.

---

# Categories

Get all available categories:

```js
console.log(kit.categories);
```

Example:

```js
[
  "electronics",
  "furniture",
  "clothing"
]
```

---

# Price Formatting

Format a price:

```js
kit.formatPrice(2500);
```

Result:

```text
2500.00 ₼
```

The currency can be configured:

```js
const kit = new ECommerceKit(products, {
  currency: "$"
});
```

Then:

```js
kit.formatPrice(2500);
```

Result:

```text
2500.00 $
```

---

# Complete Example

```js
const products = [
  {
    id: 1,
    title: "iPhone 17",
    description: "Latest Apple smartphone",
    category: "electronics",
    price: 2500,
    createdAt: "2026-09-01"
  },

  {
    id: 2,
    title: "Gaming Laptop",
    description: "Powerful gaming laptop",
    category: "electronics",
    price: 3500,
    createdAt: "2026-09-02"
  },

  {
    id: 3,
    title: "Office Chair",
    description: "Ergonomic office chair",
    category: "furniture",
    price: 450,
    createdAt: "2026-09-03"
  }
];

const kit = new ECommerceKit(products, {
  itemsPerPage: 8,
  currency: "₼",
  cartStorageKey: "my_shop_cart",
  persistCart: true
});
```

Search:

```js
kit.search("gaming");
```

Filter:

```js
kit.filter({
  category: "electronics",
  minPrice: 1000,
  maxPrice: 5000
});
```

Sort:

```js
kit.sort("price-asc");
```

Get products:

```js
const page = kit.getPage(1);

console.log(page.products);
```

Add to cart:

```js
kit.addToCart(2, 2);
```

Read cart:

```js
console.log(
  kit.getCartSummary()
);
```

---

# Full State

You can retrieve the entire current state:

```js
const state = kit.getState();

console.log(state);
```

Example:

```js
{
  products: [],
  filters: {
    search: "",
    category: "all",
    minPrice: 0,
    maxPrice: Infinity
  },
  sort: null,
  pagination: {
    currentPage: 1,
    totalPages: 3,
    totalItems: 24,
    itemsPerPage: 8,
    hasNext: true,
    hasPrev: false
  },
  cart: {
    items: [],
    itemCount: 0,
    uniqueItems: 0,
    totalPrice: 0,
    formattedTotal: "0.00 ₼"
  }
}
```

---

# Browser Usage

```html
<script src="./ECommerceKit.js"></script>
<script src="./products.js"></script>

<script>
  const kit = new ECommerceKit(products, {
    itemsPerPage: 8,
    currency: "₼"
  });

  console.log(
    kit.getPage()
  );
</script>
```

---

# Node.js

ECommerceKit can also be loaded with CommonJS:

```js
const ECommerceKit =
  require("./ECommerceKit");

const kit =
  new ECommerceKit(products);
```

---

# API Reference

| Method / Property    | Description                  |
| -------------------- | ---------------------------- |
| `search()`           | Search products              |
| `filter()`           | Filter by category and price |
| `sort()`             | Sort products                |
| `resetFilters()`     | Reset search/filter/sort     |
| `getPage()`          | Get paginated products       |
| `nextPage()`         | Next page                    |
| `previousPage()`     | Previous page                |
| `firstPage()`        | First page                   |
| `lastPage()`         | Last page                    |
| `addToCart()`        | Add product to cart          |
| `removeFromCart()`   | Remove product               |
| `updateQuantity()`   | Set quantity                 |
| `increaseQuantity()` | Increase quantity            |
| `decreaseQuantity()` | Decrease quantity            |
| `clearCart()`        | Empty cart                   |
| `hasInCart()`        | Check cart item              |
| `getCartItem()`      | Get cart item                |
| `getCartSummary()`   | Get cart information         |
| `getCartTotal()`     | Get numeric cart total       |
| `getProduct()`       | Find product                 |
| `addProduct()`       | Add product                  |
| `removeProduct()`    | Remove product               |
| `formatPrice()`      | Format price                 |
| `getState()`         | Get complete library state   |
| `categories`         | Get available categories     |
| `totalPages`         | Get total pagination pages   |

---

# License

MIT License.

```
```
