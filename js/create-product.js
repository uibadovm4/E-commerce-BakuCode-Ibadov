const productList = document.getElementById("product-list");
const productCount = document.getElementById("product-count");
const categories = {
	1: "Laptops", 2: "Gaming", 3: "Accessories", 4: "Electronics",
	5: "Audio", 6: "Phones", 7: "Tablets", 8: "TV",
	9: "SmartPhones", 10: "HeadPhones", 11: "Personal Computers"
};

function escapeProductHtml(value) {
	return String(value ?? "")
		.replaceAll("&", "&amp;")
		.replaceAll("<", "&lt;")
		.replaceAll(">", "&gt;")
		.replaceAll('"', "&quot;")
		.replaceAll("'", "&#039;");
}

function showProductMessage(title, text, icon) {
	if (window.Swal) return Swal.fire({ title, text, icon, confirmButtonText: "OK" });
	window.alert(`${title}: ${text}`);
}

function renderUserProducts(products) {
	productCount.textContent = `${products.length} product${products.length === 1 ? "" : "s"}`;

	if (!products.length) {
		productList.innerHTML = `<p class="empty-state">You have not created any products yet.</p>`;
		return;
	}

	productList.innerHTML = products.map(product => `
		<article class="product-row">
			<img src="${escapeProductHtml(product.imageUrl)}" alt="${escapeProductHtml(product.brand)} ${escapeProductHtml(product.model)}">
			<div class="product-row-details">
				<p class="product-category">${escapeProductHtml(categories[product.categoryId] || "Uncategorised")}</p>
				<h3>${escapeProductHtml(product.brand)} ${escapeProductHtml(product.model)}</h3>
				<p>${escapeProductHtml(product.description || "No description")}</p>
			</div>
			<div class="product-meta">
				<strong>$${Number(product.price || 0).toFixed(2)}</strong>
				<span>ID: ${escapeProductHtml(product.id)}</span>
			</div>
			<div class="product-actions">
				<button class="secondary-button edit-product" type="button" data-id="${escapeProductHtml(product.id)}">Edit</button>
				<button class="danger-button delete-product" type="button" data-id="${escapeProductHtml(product.id)}">Remove</button>
			</div>
		</article>
	`).join("");
}

async function loadUserProducts() {
	if (!getProductToken()) {
		productList.innerHTML = `<p class="empty-state">Please log in to manage your products.</p>`;
		return;
	}

	try {
		const result = await fetchMyProducts();
		const { response, data } = result;
		if (isInvalidProductSession(response, data)) {
			clearProductSessionAndLogin();
			return;
		}
		if (!response.ok) throw new Error(data.message || "Could not load your products.");
		renderUserProducts(result.products);
	} catch (error) {
		productList.innerHTML = `<p class="empty-state">${escapeProductHtml(error.message)}</p>`;
	}
}

productList.addEventListener("click", async event => {
	const button = event.target.closest("button");
	if (!button) return;

	if (button.classList.contains("edit-product")) {
		window.location.href = `./productForm.html?id=${encodeURIComponent(button.dataset.id)}`;
		return;
	}

	const confirmed = window.Swal
		? (await Swal.fire({ title: "Remove product?", text: "This cannot be undone.", icon: "warning", showCancelButton: true, confirmButtonText: "Remove" })).isConfirmed
		: window.confirm("Remove this product?");
	if (!confirmed) return;

	try {
		const response = await fetch(`${PRODUCT_API_URL}/delete/${encodeURIComponent(button.dataset.id)}`, {
			method: "DELETE",
			headers: productHeaders()
		});
		const data = await readProductResponse(response);
		if (isInvalidProductSession(response, data)) {
			clearProductSessionAndLogin();
			return;
		}
		if (!response.ok) throw new Error(data.message || "Could not remove the product.");
		await loadUserProducts();
	} catch (error) {
		showProductMessage("Remove failed", error.message, "error");
	}
});

loadUserProducts();
