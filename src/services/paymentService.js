import { BASE_URL } from "../constants/api";

export async function initiatePayment(invoiceId) {
    const token = localStorage.getItem("token");
    try {
        const response = await fetch(`${BASE_URL}/invoices/${invoiceId}/initiate-payment`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ orderId }),
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to initiate payment");
        }
        return await response.json();
    } catch (error) {
        throw error;
    }
}

export async function releasePayment(projectId) {
    const token = localStorage.getItem("token");
    try {
        const response = await fetch(`${BASE_URL}/projects/${projectId}/release-payment`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to release fee");
        }
        return await response.json();
    } catch (error) {
        throw error;
    }
}