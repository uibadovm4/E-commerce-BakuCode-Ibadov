const productForm = document.getElementById("product-form");
const formTitle = document.getElementById("form-title");
const productId = new URLSearchParams(window.location.search).get("id");

function showFormMessage(title, text, icon) {
	if (window.Swal) return Swal.fire({ title, text, icon, confirmButtonText: "OK" });
	window.alert(`${title}: ${text}`);
}

async function loadProductForEdit() {
	if (!productId) return;

	formTitle.textContent = "Edit product";

	try {
		const result = await fetchMyProducts();
		const { response, data } = result;
		if (isInvalidProductSession(response, data)) {
			clearProductSessionAndLogin();
			return;
		}
		if (!response.ok) throw new Error(data.message || "Could not load the product.");

		const product = result.products.find(item => String(item.id) === productId);
		if (!product) throw new Error("Product not found.");

		document.getElementById("brand").value = product.brand || "";
		document.getElementById("model").value = product.model || "";
		document.getElementById("category").value = product.categoryId || "";
		document.getElementById("description").value = product.description || "";
		document.getElementById("price").value = product.price ?? "";
		document.getElementById("imageUrl").value = product.imageUrl || "";
	} catch (error) {
		await showFormMessage("Load failed", error.message, "error");
		window.location.href = "./userProducts.html";
	}
}

productForm.addEventListener("submit", async event => {
	event.preventDefault();

	const formData = new FormData(productForm);
	const product = {
		brand: String(formData.get("brand") || "").trim(),
		model: String(formData.get("model") || "").trim(),
		description: String(formData.get("description") || "").trim(),
		imageUrl: String(formData.get("imageUrl") || "").trim(),
		price: Number(formData.get("price")),
		categoryId: Number(formData.get("categoryId"))
	};

	if (productId) product.id = Number(productId);

	const saveButton = document.getElementById("save-product-button");
	saveButton.disabled = true;

	try {
		const response = await fetch(productId ? `${PRODUCT_API_URL}/${encodeURIComponent(productId)}` : PRODUCT_API_URL, {
			method: productId ? "PUT" : "POST",
			headers: productHeaders(),
			body: JSON.stringify(product)
		});
		const data = await readProductResponse(response);
		if (isInvalidProductSession(response, data)) {
			clearProductSessionAndLogin();
			return;
		}
		if (!response.ok) throw new Error(data.message || "Could not save the product.");
		await showFormMessage("Saved", productId ? "Product updated." : "Product created.", "success");
		window.location.href = "./userProducts.html";
	} catch (error) {
		await showFormMessage("Save failed", error.message, "error");
	} finally {
		saveButton.disabled = false;
	}
});

loadProductForEdit();
