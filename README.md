# E-commerce-BakuCode-Ibadov

A responsive e-commerce storefront built with HTML, CSS, and JavaScript. This project includes a landing page, shop catalog, product details, cart, checkout, login/register flows, user profile, and seller-side product creation pages.

## Overview

This repository is a front-end e-commerce web application for a modern online store. It is designed as a static website and uses JavaScript for dynamic behavior, localStorage for session persistence, and an external product API for product-related operations.

The app includes pages for:

- Home
- About
- Contact
- Shop
- Product details
- Cart
- Checkout
- Login
- Register
- User profile
- User products
- Product form creation
- Order management

## Live Demo

GitHub Pages:
https://uibadovm4.github.io/E-commerce-BakuCode-Ibadov/

## API

This project integrates with a backend product API.

- API Docs: https://vercel-api-six-beige.vercel.app/docs/
- Product API Base URL: http://195.26.245.5:9505/api/products

## Features

- Responsive storefront design
- Product catalog and browsing
- Search and shop navigation
- Add-to-cart functionality
- Cart summary and checkout flow
- User login and registration
- Local session handling using browser storage
- Product creation form for sellers
- Account, profile, and order pages
- Modern UI with CSS and JavaScript

## Tech Stack

- HTML5
- CSS3
- JavaScript (Vanilla JS)
- LocalStorage
- SweetAlert2
- Font Awesome

## Project Structure

```text
E-commerce-BakuCode-Ibadov/
├── assets/
├── configs/
│   └── products.json
├── css/
├── js/
│   ├── add-tocart.js
│   ├── cart.js
│   ├── checkout.js
│   ├── create-product.js
│   ├── loggedIn.js
│   ├── loggedInHome.js
│   ├── login.js
│   ├── order.js
│   ├── product-api.js
│   ├── product-form.js
│   ├── product.js
│   ├── products.js
│   ├── register.js
│   ├── scroll.js
│   ├── userDetails.js
│   └── ...
├── pages/
│   ├── about.html
│   ├── cart.html
│   ├── checkout.html
│   ├── contact.html
│   ├── login.html
│   ├── order.html
│   ├── product.html
│   ├── productForm.html
│   ├── register.html
│   ├── shop.html
│   ├── userProducts.html
│   ├── userProfile.html
│   └── ...
├── index.html
├── ibadov-api-link.md
├── README.md
└── ...