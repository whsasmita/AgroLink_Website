import { BASE_URL } from "../constants/api";

export async function downloadContract(contractId) {
    const token = localStorage.getItem("token");
    try {
        const response = await fetch(`${BASE_URL}/contracts/${contractId}/download`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to fetch contracts");
        }
        return await response.json();
    } catch (error) {
        throw error;
    }
}

export async function signContract(contractId) {
    const token = localStorage.getItem("token");
    try {
        const response = await fetch(`${BASE_URL}/contracts/${contractId}/sign`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to sign contract");
        }
        return await response.json();
    } catch (error) {
        throw error;
    }
}