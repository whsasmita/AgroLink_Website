import { BASE_URL } from "../constants/api";

export async function initiatePayment(invoiceId, projectId) {
    const token = localStorage.getItem("token");
    try {
        const response = await fetch(`${BASE_URL}/invoices/${invoiceId}/initiate-payment`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ orderId: projectId }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Gagal memulai pembayaran.");
        }
        
        return await response.json();
    } catch (error) {
        throw error;
    }
};

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

        const data = await response.json();
        
        if (!response.ok) {
            // Extract error message from response
            const errorMessage = data.message || data.error || data.details || 
                               `Failed to release payment (Status: ${response.status})`;
            throw new Error(errorMessage);
        }
        
        return data;
    } catch (error) {
        console.error("Release payment error:", error);
        throw error;
    }
}