import { BASE_URL } from "../constants/api";

export const createAgriculturalLand = async (landData) => {
    try {
        const response = await fetch(`${BASE_URL}/farms`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(landData),
        });

        if (!response.ok) {
            throw new Error("Failed to create agricultural land");
        }

        return await response.json();
    } catch (error) {
        console.error("Error creating agricultural land:", error);
        throw error;
    }
};