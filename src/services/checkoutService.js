import { BASE_URL } from "../constants/api";

export async function checkout() {
    const token = localStorage.getItem("token");
    const response = await fetch(`${BASE_URL}/checkout/`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    });
    if (!response.ok) {
        throw new Error("Failed to checkout");
    }
    return await response.json();
}