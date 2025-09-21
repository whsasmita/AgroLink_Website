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

export async function editInformationDetail(data, role) {
  const token = localStorage.getItem("token");
  try {
    let detailsPayload = {};

    switch (role) {
      case "worker":
        detailsPayload = {
          skills: JSON.stringify(data.skills || []),
          hourly_rate: Number(data.hourly_rate) || 0,
          daily_rate: Number(data.daily_rate) || 0,
          address: data.address || "",
          availability_schedule: JSON.stringify(
            data.availability_schedule || {}
          ),
        };
        break;
      case "farmer":
        detailsPayload = {
          address: data.address || "",
          additional_info: data.additional_info || "",
        };
        break;
      case "driver":
        detailsPayload = {
          company_address: data.company_address || "",
          pricing_scheme: JSON.stringify(data.pricing_scheme || {}),
          vehicle_types: JSON.stringify(data.vehicle_types || []),
        };
        break;
      default:
        throw new Error(`Peran tidak valid: ${role}`);
    }
    const requestBody = {
      details: detailsPayload,
    };

    console.log("Mengirim detail informasi ke API:", requestBody);

    const response = await fetch(`${BASE_URL}/profile/details`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || "Gagal memperbarui detail informasi"
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