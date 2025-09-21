import { BASE_URL } from "../constants/api";

// Get token from localStorage (adjust this based on your auth implementation)
const getAuthHeaders = () => {
    const token = localStorage.getItem('token') || localStorage.getItem('authToken');
    return {
        "Content-Type": "application/json",
        ...(token && { "Authorization": `Bearer ${token}` })
    };
};

// Create Agricultural Land
export const createAgriculturalLand = async (landData) => {
    try {
        const response = await fetch(`${BASE_URL}/farms/`, {
            method: "POST",
            headers: getAuthHeaders(),
            body: JSON.stringify(landData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to create agricultural land");
        }

        return await response.json();
    } catch (error) {
        console.error("Error creating agricultural land:", error);
        throw error;
    }
};

// Get Agricultural Land by ID
export const getAgriculturalLandById = async (id) => {
    try {
        const response = await fetch(`${BASE_URL}/farms/${id}`, {
            method: "GET",
            headers: getAuthHeaders(),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to get agricultural land");
        }

        return await response.json();
    } catch (error) {
        console.error("Error getting agricultural land:", error);
        throw error;
    }
};

// Get My Farms
export const getMyFarms = async () => {
    try {
        const response = await fetch(`${BASE_URL}/farms/my`, {
            method: "GET",
            headers: getAuthHeaders(),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to get my farms");
        }

        return await response.json();
    } catch (error) {
        console.error("Error getting my farms:", error);
        throw error;
    }
};

// Update Agricultural Land
export const updateAgriculturalLand = async (id, landData) => {
    try {
        const response = await fetch(`${BASE_URL}/farms/${id}`, {
            method: "PUT",
            headers: getAuthHeaders(),
            body: JSON.stringify(landData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to update agricultural land");
        }

        return await response.json();
    } catch (error) {
        console.error("Error updating agricultural land:", error);
        throw error;
    }
};

// Delete Agricultural Land
export const deleteAgriculturalLand = async (id) => {
    try {
        const response = await fetch(`${BASE_URL}/farms/${id}`, {
            method: "DELETE",
            headers: getAuthHeaders(),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to delete agricultural land");
        }

        return await response.json();
    } catch (error) {
        console.error("Error deleting agricultural land:", error);
        throw error;
    }
};

// Alternative function names for better readability
export const getFarmById = getAgriculturalLandById;
export const createFarm = createAgriculturalLand;
export const updateFarm = updateAgriculturalLand;
export const deleteFarm = deleteAgriculturalLand;

// Batch operations (if needed)
export const deleteMulitpleFarms = async (farmIds) => {
    try {
        const deletePromises = farmIds.map(id => deleteAgriculturalLand(id));
        const results = await Promise.allSettled(deletePromises);
        
        const successful = results.filter(result => result.status === 'fulfilled');
        const failed = results.filter(result => result.status === 'rejected');
        
        return {
            successful: successful.length,
            failed: failed.length,
            failedIds: farmIds.filter((_, index) => results[index].status === 'rejected')
        };
    } catch (error) {
        console.error("Error deleting multiple farms:", error);
        throw error;
    }
};