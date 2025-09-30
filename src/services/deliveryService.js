import { BASE_URL } from "../constants/api";

export async function getMyDelivery() {
    const token = localStorage.getItem("token");
    try {
        const response = await fetch(`${BASE_URL}/deliveries/my`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to fetch deliveries");
        }
        return await response.json();
    } catch (error) {
        throw error;
    }
}

export async function getNearbyDelivery(deliveryId, radius = 100) {
    const token = localStorage.getItem("token");
    try {
        const response = await fetch(`${BASE_URL}/deliveries/${deliveryId}/find-drivers?radius=${radius}`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to fetch nearby drivers");
        }
        return await response.json();
    } catch (error) {
        throw error;
    }
}

export async function createDelivery(data) {
    const token = localStorage.getItem("token");
    try {
        const response = await fetch(`${BASE_URL}/deliveries/`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Invalid input data");
        }
        return await response.json();
    } catch (error) {
        throw error;
    }
}

export async function selectDriver(deliveryId, driverId) {
    const token = localStorage.getItem("token");
    try {
        const response = await fetch(`${BASE_URL}/deliveries/${deliveryId}/select-driver/${driverId}`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to select driver");
        }
        return await response.json();
    } catch (error) {
        throw error;
    }
}