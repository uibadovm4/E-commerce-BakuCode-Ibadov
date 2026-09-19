const PRODUCT_DETAIL_API_URL = "http://195.26.245.5:9505/api/products";
const PRODUCT_RATING_API_URL = "http://195.26.245.5:9505/api/ratings";

function getStoredToken() {
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

function buildAuthHeaders(extraHeaders = {}) {
  const token = getStoredToken();
  return {
    Accept: "*/*",
    "Content-Type": "application/json",
    ...extraHeaders,
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
}

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

    const response = await fetch(PRODUCT_DETAIL_API_URL, {
      headers: buildAuthHeaders()
    });
    
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
      let alreadyRated = false;

      ratingButtons.forEach(button => {
        button.addEventListener('click', async () => {
          if (alreadyRated) {
            ratingMessage.textContent = "You have already rated this product.";
            return;
          }

          const selectedRating = Number(button.dataset.rating);
          ratingButtons.forEach(star => {
            star.classList.toggle('selected', Number(star.dataset.rating) <= selectedRating);
          });

          try {
            const token = getStoredToken();
            const ratingResponse = await fetch(PRODUCT_RATING_API_URL, {
              method: "POST",
              headers: buildAuthHeaders(),
              body: JSON.stringify({
                rating: Number(selectedRating),
                productId: Number(id)
              })
            });

            if (!ratingResponse.ok) {
              const errorText = await ratingResponse.text();
              let errorMessage = "Could not submit rating.";

              try {
                const parsed = JSON.parse(errorText);
                if (parsed?.message) errorMessage = parsed.message;
              } catch {
                if (typeof errorText === "string" && errorText.trim()) errorMessage = errorText;
              }

              if (ratingResponse.status === 409 || /already rated|artiq.*qiym|qiymətləndirmisiniz/i.test(errorMessage)) {
                alreadyRated = true;
                ratingButtons.forEach(star => star.disabled = true);
                ratingMessage.textContent = errorMessage || "You have already rated this product.";
                return;
              }

              throw new Error(errorMessage || `Could not submit rating. Status: ${ratingResponse.status}`);
            }

            alreadyRated = true;
            ratingButtons.forEach(star => star.disabled = true);
            ratingMessage.textContent = `You rated this product ${selectedRating} out of 5.`;
            if (token) {
              ratingMessage.textContent += " Saved.";
            }
          } catch (error) {
            const messageText = error && error.message ? error.message : "Unable to save the rating.";
            ratingMessage.textContent = messageText;
            console.error("Rating save failed:", error);
          }
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


renderProductDetail();