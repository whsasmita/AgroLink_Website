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

export async function uploadProfilePhoto(photoFile) {
    const token = localStorage.getItem("token");

    const formData = new FormData();
    formData.append("photo", photoFile);

    console.log("Sending photo file to API...");

    try {
        const response = await fetch(`${BASE_URL}/profile/upload-photo`, {
            method: "POST", 
            headers: {
                "Authorization": `Bearer ${token}`,
            },
            body: formData,
        });

        console.log("API Response status:", response.status);

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.log("Error data:", errorData);
            throw new Error(errorData.message || errorData.error || `Failed to upload photo (${response.status})`);
        }

        const result = await response.json();
        console.log("Success result:", result);
        return result;
    } catch (error) {
        console.error("Photo upload error:", error);
        throw error;
    }
}