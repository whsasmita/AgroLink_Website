import { BASE_URL } from "../constants/api";

export async function login({ email, password }) {
	try {
		const response = await fetch(`${BASE_URL}/auth/login`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ email, password }),
		});
		if (!response.ok) {
			const errorData = await response.json();
			throw new Error(errorData.message || "Login failed");
		}
		return await response.json();
	} catch (error) {
		throw error;
	}
}

export async function register({ email, password, role, name, phone_number }) {
	try {
		const response = await fetch(`${BASE_URL}/auth/register`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ email, password, role, name, phone_number }),
		});
		if (!response.ok) {
			const errorData = await response.json();
			throw new Error(errorData.message || "Register failed");
		}
		return await response.json();
	} catch (error) {
		throw error;
	}
}