const PRODUCT_API_URL = "http://195.26.245.5:9505/api/products";

function getProductToken() {
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

function productHeaders() {
    const token = getProductToken();
    return token
        ? { Accept: "*/*", "Content-Type": "application/json", Authorization: `Bearer ${token}` }
        : { Accept: "*/*", "Content-Type": "application/json" };
}

async function readProductResponse(response) {
    const text = await response.text();
    if (!text.trim()) return {};

    try {
        return JSON.parse(text);
    } catch {
        return { message: text };
    }
}

function getProductsFromResponse(data) {
    if (Array.isArray(data)) return data;
    return data.content || data.products || data.items || data.data?.content || data.data?.products || data.body?.content || [];
}

function clearProductSessionAndLogin() {
    localStorage.removeItem("token");
    localStorage.removeItem("response");
    window.location.href = "./login.html";
}

function isInvalidProductSession(response, data) {
    return response.status === 401 || (response.status === 404 && data.message === "User not found");
}

async function fetchMyProducts() {
    const firstPageResponse = await fetch(`${PRODUCT_API_URL}/myProducts?page=1&size=1`, {
        headers: productHeaders()
    });
    const firstPage = await readProductResponse(firstPageResponse);

    if (!firstPageResponse.ok) {
        return { response: firstPageResponse, data: firstPage, products: [] };
    }

    const totalPages = Math.max(1, Number(firstPage.totalPages) || 1);
    const products = [...getProductsFromResponse(firstPage)];

    for (let page = 2; page <= totalPages; page += 1) {
        const response = await fetch(`${PRODUCT_API_URL}/myProducts?page=${page}&size=1`, {
            headers: productHeaders()
        });
        const data = await readProductResponse(response);
        if (!response.ok) return { response, data, products };
        products.push(...getProductsFromResponse(data));
    }

    return { response: firstPageResponse, data: firstPage, products };
}
