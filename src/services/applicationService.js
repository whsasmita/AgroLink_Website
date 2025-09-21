import { BASE_URL } from "../constants/api";

export async function getApplications(projectId) {
    const token = localStorage.getItem("token");
    try {
        const response = await fetch(`${BASE_URL}/projects/${projectId}`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to fetch applications");
        }
        return await response.json();
    } catch (error) {
        throw error;
    }
}

export async function applyToProject(projectId) {
    const token = localStorage.getItem("token");
    try {
        const response = await fetch(`${BASE_URL}/projects/${projectId}/apply`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to apply to project");
        }
        return await response.json();
    } catch (error) {
        throw error;
    }
}

export async function acceptApplication(applicationId) {
    const token = localStorage.getItem("token");
    try {
        const response = await fetch(`${BASE_URL}/applications/${applicationId}/accept`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to accept application");
        }
        return await response.json();
    } catch (error) {
        throw error;
    }
}

export async function directOffer(workerId) {
    const token = localStorage.getItem("token");
    try {
        const response = await fetch(`${BASE_URL}/workers/${workerId}/direct-offer`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to create direct offer");
        }
        return await response.json();
    } catch (error) {
        throw error;
    }
}
