import { BASE_URL } from "../constants/api";

export async function getProducts() {
    const token = localStorage.getItem("token");
    const response = await fetch(`${BASE_URL}/public/products/`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    if (!response.ok) {
        throw new Error("Failed to fetch products");
    }
    return response.json();
}

export async function getProductDetails(productId) {
    const token = localStorage.getItem("token");
    const response = await fetch(`${BASE_URL}/public/products/${productId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    if (!response.ok) {
        throw new Error("Failed to fetch product details");
    }
    return response.json();
}