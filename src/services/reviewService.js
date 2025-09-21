import { BASE_URL } from "../constants/api";

export async function addReview(projectId, workerId) {
    const token = localStorage.getItem("token");
    try {
        const response = await fetch(`${BASE_URL}/projects/${projectId}/workers/${workerId}/review`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to add review");
        }
        return await response.json();
    } catch (error) {
        throw error;
    }}