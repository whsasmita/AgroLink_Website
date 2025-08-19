import { BASE_URL } from "../constants/api";

export async function getProfile() {
	const token = localStorage.getItem("token");
	try {
		const response = await fetch(`${BASE_URL}/profile`, {
			method: "GET",
			headers: {
				"Authorization": `Bearer ${token}`,
				"Content-Type": "application/json",
			},
		});
		if (!response.ok) {
			const errorData = await response.json();
			throw new Error(errorData.message || "Failed to fetch profile");
		}
		return await response.json();
	} catch (error) {
		throw error;
	}
}

export async function editProfile(data) {
	const token = localStorage.getItem("token");
	try {
		const response = await fetch(`${BASE_URL}/profile`, {
			method: "PUT",
			headers: {
				"Authorization": `Bearer ${token}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify(data),
		});
		if (!response.ok) {
			const errorData = await response.json();
			throw new Error(errorData.message || "Failed to update profile");
		}
		return await response.json();
	} catch (error) {
		throw error;
	}
}

// Function specifically for updating profile picture only
export async function updateProfilePicture(profilePictureUrl, currentProfile) {
	const token = localStorage.getItem("token");
	
	// Send complete profile data with updated profile_picture
	const data = {
		name: currentProfile.name,
		phone_number: currentProfile.phone_number,
		profile_picture: profilePictureUrl,
		// Add other required fields if any
		email: currentProfile.email, // if required
		role: currentProfile.role,   // if required
	};
	
	console.log("Sending complete profile data to API:", data);
	
	try {
		const response = await fetch(`${BASE_URL}/profile`, {
			method: "PUT",
			headers: {
				"Authorization": `Bearer ${token}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify(data),
		});
		
		console.log("API Response status:", response.status);
		
		if (!response.ok) {
			const errorData = await response.json().catch(() => ({}));
			console.log("Error data:", errorData);
			throw new Error(errorData.message || errorData.error || `Failed to update profile picture (${response.status})`);
		}
		
		const result = await response.json();
		console.log("Success result:", result);
		return result;
	} catch (error) {
		console.error("Photo update error:", error);
		throw error;
	}
}