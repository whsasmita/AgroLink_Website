import { BASE_URL } from "../constants/api";

export async function getProjects() {
    const token = localStorage.getItem("token");
    try {
        const response = await fetch(`${BASE_URL}/projects/`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to fetch projects");
        }
        return await response.json();
    } catch (error) {
        throw error;
    }
}

export async function getProjectById(id) {
    const token = localStorage.getItem("token");
    try {
        const response = await fetch(`${BASE_URL}/projects/${id}`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to fetch project");
        }
        return await response.json();
    } catch (error) {
        throw error;
    }
}

export async function getMyProjects() {
    const token = localStorage.getItem("token");
    try {
        const response = await fetch(`${BASE_URL}/projects/my`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to fetch projects");
        }
        return await response.json();
    } catch (error) {
        throw error;
    }
}

export async function createProject(data) {
    const token = localStorage.getItem("token");
    try {
        const response = await fetch(`${BASE_URL}/projects/`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to create project");
        }
        return await response.json();
    } catch (error) {
        throw error;
    }
}