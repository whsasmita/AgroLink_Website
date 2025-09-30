import { BASE_URL } from "../constants/api";
const API = import.meta.env.VITE_SERVER_DOMAIN;


export async function login(formData) {
	// try {
	// 	const response = await fetch(`${API}/login`, {
	// 		method: "POST",
	// 		headers: {
	// 			"Content-Type": "application/json",
	// 		},
	// 		body: JSON.stringify({ email, password }),
	// 	});
	// 	if (!response.ok) {
	// 		const errorData = await response.json();
	// 		throw new Error(errorData.message || "Login failed");
	// 	}
	// 	return await response.json();
	// } catch (error) {
	// 	throw error;
	// }
	fetch(`${API}/login`, {
		method: "POST",
		body: formData
	})
}

export async function register({ email, password, role, name, phone_number }) {
	try {
		const response = await fetch(`${BASE_URL}/public/auth/register`, {
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