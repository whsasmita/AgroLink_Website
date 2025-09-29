import { BASE_URL } from "../constants/api";

export async function getContracts() {
    const token = localStorage.getItem("token");
    try {
        const response = await fetch(`${BASE_URL}/contracts/my`, {
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

export async function downloadContract(contractId) {
    const token = localStorage.getItem("token");
    try {
        const response = await fetch(`${BASE_URL}/contracts/${contractId}/download`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to download contract");
        }
        
        // Get the PDF as blob
        const blob = await response.blob();
        
        // Create download link
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `contract_${contractId}.pdf`;
        document.body.appendChild(link);
        link.click();
        
        // Cleanup
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        
        return { success: true };
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