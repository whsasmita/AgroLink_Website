import { BASE_URL } from "../constants/api";

export async function getCartItems() {
    const token = localStorage.getItem("token");
    const response = await fetch(`${BASE_URL}/cart/`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    if (!response.ok) {
        throw new Error("Failed to fetch cart items");
    }
    return response.json();
}

export async function addItemToCart(productId, quantity) {
    const token = localStorage.getItem("token");
    const response = await fetch(`${BASE_URL}/cart/`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
            product_id: productId,
            quantity 
        }),
    });
    if (!response.ok) {
        throw new Error("Failed to add item to cart");
    }
    return response.json();
}

export async function updateCartItem(cartItemId, quantity) {
    const token = localStorage.getItem("token");
    const response = await fetch(`${BASE_URL}/cart/${cartItemId}`, {
        method: "PUT",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ quantity }),
    });
    if (!response.ok) {
        throw new Error("Failed to update cart item");
    }
    return response.json();
}

export async function removeItemFromCart(cartItemId) {
    const token = localStorage.getItem("token");
    const response = await fetch(`${BASE_URL}/cart/${cartItemId}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    });
    if (!response.ok) {
        throw new Error("Failed to remove item from cart");
    }
    return response.json();
}
