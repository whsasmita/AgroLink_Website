import { BASE_URL } from "../constants/api";

/**
 * Helper untuk ambil token auth dari localStorage.
 * Sesuaikan key "token" ini kalau di project kamu pakai nama lain
 * (misal "accessToken", "authToken", dll).
 */
const getToken = () => {
  return localStorage.getItem("token");
};

/**
 * Helper generic untuk handle response fetch.
 * Otomatis parse JSON dan lempar error kalau response tidak ok.
 */
const handleResponse = async (response) => {
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      data?.message || `Request gagal dengan status ${response.status}`;
    const error = new Error(message);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
};

/**
 * POST /public/ai/chat
 * Chat AI tanpa login (guest), dibatasi 3x kirim prompt / hari.
 *
 * @param {string} message - Pesan yang dikirim user
 * @returns {Promise<Object>} response dari server
 */
export const sendPublicChat = async (message) => {
  const response = await fetch(`${BASE_URL}/public/ai/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message }),
  });

  return handleResponse(response);
};

/**
 * POST /ai/chat
 * Chat AI dengan login (auth), limit harian lebih besar (tergantung premium/tidak).
 *
 * @param {string} message - Pesan yang dikirim user
 * @returns {Promise<Object>} response dari server
 */
export const sendAuthChat = async (message) => {
  const token = getToken();

  const response = await fetch(`${BASE_URL}/ai/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ message }),
  });

  return handleResponse(response);
};

/**
 * POST /ai/premium/checkout
 * Membuat transaksi checkout premium AI (Midtrans Snap).
 *
 * @returns {Promise<Object>} response berisi snap_token, order_id, amount, redirect_url
 */
export const createPremiumCheckout = async () => {
  const token = getToken();

  const response = await fetch(`${BASE_URL}/ai/premium/checkout`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  return handleResponse(response);
};

/**
 * GET /ai/premium/status
 * Mengecek status premium AI user saat ini.
 *
 * @returns {Promise<Object>} response berisi status premium, limit, dsb
 */
export const getPremiumStatus = async () => {
  const token = getToken();

  const response = await fetch(`${BASE_URL}/ai/premium/status`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  return handleResponse(response);
};

export default {
  sendPublicChat,
  sendAuthChat,
  createPremiumCheckout,
  getPremiumStatus,
};
