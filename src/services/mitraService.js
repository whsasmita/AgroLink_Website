import { BASE_URL } from "../constants/api";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token") || localStorage.getItem("authToken");
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

/**
 * Mengambil data profil mitra saat ini
 * GET /api/v1/mitra/profile/my
 */
export async function getMitraProfile() {
  try {
    const response = await fetch(`${BASE_URL}/mitra/profile/my`, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Gagal mengambil profil mitra (${response.status})`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error in getMitraProfile:", error);
    throw error;
  }
}

/**
 * Menyimpan / memperbarui data profil mitra
 * POST /api/v1/mitra/profile
 */
export async function updateMitraProfile(profileData) {
  try {
    const response = await fetch(`${BASE_URL}/mitra/profile`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(profileData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Gagal menyimpan profil mitra (${response.status})`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error in updateMitraProfile:", error);
    throw error;
  }
}

/**
 * Mengambil daftar penawaran / kerja sama milik user saat ini
 * GET /api/v1/cooperations/my
 */
export async function getMyCooperations() {
  try {
    const response = await fetch(`${BASE_URL}/cooperations/my`, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Gagal mengambil daftar kerja sama (${response.status})`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error in getMyCooperations:", error);
    throw error;
  }
}

/**
 * Mengambil detail satu kerja sama by ID
 * GET /api/v1/cooperations/:id
 */
export async function getCooperationById(id) {
  try {
    const response = await fetch(`${BASE_URL}/cooperations/${id}`, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Gagal mengambil detail kerja sama (${response.status})`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error in getCooperationById:", error);
    throw error;
  }
}

/**
 * Mitra membuat penawaran kerja sama ke Petani
 * POST /api/v1/cooperations/offer
 * @param {Object} data - { farmer_id, title, description, proposed_amount, start_date, end_date, notes }
 */
export async function createCooperationOffer(data) {
  try {
    const response = await fetch(`${BASE_URL}/cooperations/offer`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Gagal membuat penawaran kerja sama (${response.status})`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error in createCooperationOffer:", error);
    throw error;
  }
}

/**
 * Menyetujui penawaran kerja sama
 * POST /api/v1/cooperations/:id/approve
 * @param {string} id
 * @param {Object} data - { agreed_amount, notes }
 */
export async function approveCooperation(id, data) {
  try {
    const response = await fetch(`${BASE_URL}/cooperations/${id}/approve`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Gagal menyetujui kerja sama (${response.status})`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error in approveCooperation:", error);
    throw error;
  }
}

/**
 * Menolak penawaran kerja sama
 * POST /api/v1/cooperations/:id/reject
 * @param {string} id
 * @param {Object} data - { notes }
 */
export async function rejectCooperation(id, data) {
  try {
    const response = await fetch(`${BASE_URL}/cooperations/${id}/reject`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Gagal menolak kerja sama (${response.status})`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error in rejectCooperation:", error);
    throw error;
  }
}

/**
 * Inisiasi pembayaran Midtrans Snap (khusus Mitra)
 * POST /api/v1/cooperations/:id/initiate-payment
 * @param {string} id
 * @returns {Promise<Object>} Object containing snap_token
 */
export async function initiateCooperationPayment(id) {
  try {
    const response = await fetch(`${BASE_URL}/cooperations/${id}/initiate-payment`, {
      method: "POST",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Gagal menginisiasi pembayaran (${response.status})`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error in initiateCooperationPayment:", error);
    throw error;
  }
}
