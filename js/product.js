async function renderProductDetail() {
  const container = document.querySelector('#product-detail');
  const namePro = document.querySelector(".name-product");

  try {
    const id = new URLSearchParams(window.location.search).get('id');

    const response = await fetch("http://195.26.245.5:9505/api/products");
    
    if (!response.ok) {
      throw new Error("API request failed");
    }

    const data = await response.json();
    const products = Array.isArray(data) ? data : data.products || [];


    const product = products.find(p => String(p.id) === id) || products[+id];

    if (product) {
      const productName = `${product.brand || ''} ${product.model || 'Product'}`.trim();

      if (namePro) {
        namePro.textContent = productName;
      }

      container.innerHTML = `
        <div class="product-detail-image">
          <img
            src="${product.imageUrl || ''}"
            alt="${productName}"
          >
        </div>

        <div class="product-info-detail">
          <h1>${productName}</h1>

          <div class="rating">
            <span>★</span> ${product.averageRating ?? 'No rating'}
          </div>

          <div class="price">
            $${product.price ? Number(product.price).toFixed(2) : 'N/A'}
          </div>

          <p class="description">
            ${product.description || 'No description available for this product.'}
          </p>

          <button class="add-tocart" id="add-tocart">
            Add to Cart
          </button>
        </div>
      `;

      document.title = `E-Commerce - `;
    } else {
      if (namePro) namePro.textContent = "Not Found";
      container.innerHTML = `<h1>Product not found</h1>`;
    }
  } catch (error) {
    console.error("Error loading product:", error);
    if (namePro) namePro.textContent = "Error";
    container.innerHTML = `<h1>Failed to load product details</h1>`;
  }
}

// Detay sayfasını yükle
renderProductDetail();