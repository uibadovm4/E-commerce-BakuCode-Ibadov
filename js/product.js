async function renderProductDetail() {
  const container = document.querySelector('#product-detail');
  const namePro = document.querySelector(".name-product");

  if (!document.querySelector('#product-rating-styles')) {
    const style = document.createElement('style');
    style.id = 'product-rating-styles';
    style.textContent = `
      .rate-product { margin: 18px 0; }
      .rate-product-title { display: block; margin-bottom: 8px; font-weight: 600; }
      .rating-buttons { display: flex; gap: 4px; }
      .rating-star {
        border: 0; background: transparent; color: #c8c8c8; cursor: pointer;
        font-size: 28px; line-height: 1; padding: 2px;
        transition: color .2s, transform .2s;
      }
      .rating-star:hover, .rating-star.selected { color: #f5b301; transform: scale(1.1); }
      .rating-message { color: #4a4a4a; font-size: 14px; margin-top: 6px; }
    `;
    document.head.appendChild(style);
  }

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
            <span>★</span> ${product.averageRating != null && Number.isFinite(Number(product.averageRating))
              ? Number(product.averageRating).toFixed(1)
              : 'No rating'}

            <div class="rate-product" aria-label="Rate this product">
              <span class="rate-product-title">Rate this product:</span>
              <div class="rating-buttons">
                ${[1, 2, 3, 4, 5].map(rating => `
                  <button class="rating-star" type="button" data-rating="${rating}"
                    aria-label="Rate ${rating} out of 5">★</button>
                `).join('')}
              </div>
              <div class="rating-message" aria-live="polite"></div>
            </div>
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

      const ratingButtons = container.querySelectorAll('.rating-star');
      const ratingMessage = container.querySelector('.rating-message');
      ratingButtons.forEach(button => {
        button.addEventListener('click', () => {
          const selectedRating = Number(button.dataset.rating);
          ratingButtons.forEach(star => {
            star.classList.toggle('selected', Number(star.dataset.rating) <= selectedRating);
          });
          ratingMessage.textContent = `You rated this product ${selectedRating} out of 5.`;
        });
      });

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