import { BASE_URL } from "../constants/api";

export async function getProfile() {
  const token = localStorage.getItem("token");
  try {
    const response = await fetch(`${BASE_URL}/profile`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
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

export async function getPhoto(profilePicturePath) {
  // Jika path sudah lengkap (dimulai dengan http), gunakan langsung
  if (profilePicturePath?.startsWith('http')) {
    return {
      data: {
        url: profilePicturePath
      }
    };
  }

  // Jika path relatif, gabungkan dengan base URL
  if (profilePicturePath) {
    const fullUrl = `https://api.goagrolink.com${profilePicturePath}`;
    return {
      data: {
        url: fullUrl
      }
    };
  }

  // Jika tidak ada path, return null
  return {
    data: {
      url: null
    }
  };
}

export async function editProfile(data) {
  const token = localStorage.getItem("token");
  try {
    const response = await fetch(`${BASE_URL}/profile`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
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
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    console.log("API Response status:", response.status);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.log("Error data:", errorData);
      throw new Error(
        errorData.message ||
          errorData.error ||
          `Failed to upload photo (${response.status})`
      );
    }

    const result = await response.json();
    console.log("Success result:", result);
    return result;
  } catch (error) {
    console.error("Photo upload error:", error);
    throw error;
  }
}

// Fixed version - sesuaikan dengan format yang berhasil di Postman
export async function editInformationDetail(data, role) {
    const token = localStorage.getItem("token");
    try {
        // Format payload sesuai dengan yang berhasil di Postman
        const requestBody = {
            details: data // Langsung kirim data tanpa wrapper tambahan
        };
        
        console.log("Mengirim detail informasi ke API:", requestBody);
        console.log("Data yang akan dikirim:", JSON.stringify(requestBody, null, 2));

        const response = await fetch(`${BASE_URL}/profile/details`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(requestBody),
        });

        console.log("Response status:", response.status);
        console.log("Response headers:", response.headers);

        if (!response.ok) {
            const errorText = await response.text();
            console.log("Error response:", errorText);
            
            let errorData;
            try {
                errorData = JSON.parse(errorText);
            } catch {
                errorData = { message: errorText || `HTTP Error ${response.status}` };
            }
            
            throw new Error(
                errorData.message || errorData.error || `Gagal memperbarui detail informasi (${response.status})`
            );
        }

        const result = await response.json();
        console.log("Berhasil memperbarui detail informasi:", result);
        return result;

    } catch (error) {
        console.error("Error memperbarui detail informasi:", error);
        throw error;
    }
}