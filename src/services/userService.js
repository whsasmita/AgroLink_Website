// services/userService.js
// ------------------------------------------------------------
// User Service (React JS, tanpa TS)
// - axios instance dengan JWT interceptor (ambil dari localStorage 'token')
// - ENV fleksibel: REACT_APP_API_BASE_URL / NEXT_PUBLIC_API_BASE_URL
// - listUsers() dengan dukungan AbortSignal & query params
// - getUserById()
// - helper recent recipients (localStorage)
// - normalisasi shape user agar UI konsisten
// ------------------------------------------------------------

import axiosLib from "axios";
import { BASE_URL } from "../constants/api";

// ====== Konfigurasi Base URL API ======
const API_BASE = BASE_URL

// ====== Buat axios instance (mandiri) ======
function createAxios() {
  const instance = axiosLib.create({
    baseURL: API_BASE, // contoh: "https://api.goagrolink.com"
    // timeout: 15000, // opsional
  });

  // Tambah Authorization header dari localStorage (token disimpan oleh AuthProvider)
  instance.interceptors.request.use(
    (config) => {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : "";
      if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // (Opsional) Response interceptor untuk logging / error handling global
  instance.interceptors.response.use(
    (res) => res,
    (err) => {
      // Kamu bisa tambahkan handling khusus 401/403 di sini jika ingin
      return Promise.reject(err);
    }
  );

  return instance;
}

const axios = createAxios();

// ====== Normalisasi data user agar konsisten di UI ======
function normalizeUser(u) {
  if (!u || typeof u !== "object") return null;
  return {
    id: String(u.id || u.ID || u.user_id || ""),
    name: u.name || u.full_name || u.username || "",
    email: u.email || "",
    role: u.role || u.user_role || "",
    profile_picture: u.profile_picture || u.avatar || (u.profile && u.profile.picture) || null,
    // properti tambahan jika ada
    ...u,
  };
}

// ====== Util: Ambil payload data array secara aman ======
function extractDataArray(res) {
  // Beberapa API membungkus array dalam { data: [...] }
  // Yang lain langsung mengembalikan array
  const raw = res?.data;
  if (Array.isArray(raw)) return raw;
  if (raw && Array.isArray(raw.data)) return raw.data;
  return [];
}

// ====== SERVICES ======

/**
 * List users (mendukung pencarian & pagination).
 *
 * @param {Object} opts
 * @param {string} [opts.q] - kata kunci pencarian (nama/email)
 * @param {string} [opts.role] - filter role (farmer/worker/driver)
 * @param {number} [opts.page=1] - halaman
 * @param {number} [opts.perPage=20] - item per halaman
 * @param {AbortSignal} [opts.signal] - AbortSignal untuk cancel request
 *
 * @returns {Promise<{ data: any[], pagination?: any }>}
 */
export async function listUsers(opts = {}) {
  const { q = "", role = "", page = 1, perPage = 20, signal } = opts;

  // ---- Sesuaikan endpoint di bawah dengan API kamu ----
  // Misal kamu punya: GET /api/v1/users?search=...&role=...&page=...&per_page=...
  const url = "/api/v1/users";
  const params = {
    search: q || undefined,
    role: role || undefined,
    page,
    per_page: perPage,
  };

  const res = await axios.get(url, { params, signal });
  const rows = extractDataArray(res).map(normalizeUser).filter(Boolean);

  // Optional: ambil pagination dari response kalau ada
  const pagination =
    res?.data?.pagination || (res?.data && typeof res.data.total !== "undefined" ? { total: res.data.total, page, perPage } : undefined);

  return { data: rows, pagination };
}

/**
 * Ambil detail user by ID.
 *
 * @param {string} userId
 * @param {Object} opts
 * @param {AbortSignal} [opts.signal]
 *
 * @returns {Promise<any>}
 */
export async function getUserById(userId, opts = {}) {
  if (!userId) throw new Error("userId is required");
  const { signal } = opts;

  // ---- Sesuaikan endpoint ini jika berbeda ----
  // Contoh: GET /api/v1/users/:id
  const url = `/api/v1/users/${encodeURIComponent(userId)}`;
  const res = await axios.get(url, { signal });

  // kalau API bungkus di {data: {...}}, tangani di sini
  const raw = res?.data?.data || res?.data || null;
  return normalizeUser(raw);
}

/**
 * Cari user (alias ke listUsers) — disediakan untuk semantic API di FE.
 *
 * @param {string} term
 * @param {Object} opts - opsi yang sama dengan listUsers
 * @returns {Promise<{ data: any[], pagination?: any }>}
 */
export function searchUsers(term, opts = {}) {
  return listUsers({ ...opts, q: term });
}

// ====== Recent Recipients (localStorage) ======
const RECENTS_KEY = "chat_recents";

/**
 * Ambil daftar recipient ID terbaru (array of string).
 */
export function getRecentRecipients() {
  try {
    const raw = localStorage.getItem(RECENTS_KEY);
    const arr = JSON.parse(raw || "[]");
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

/**
 * Tambahkan recipient ke daftar recent (max 10).
 * @param {string} recipientId
 */
export function addRecentRecipient(recipientId) {
  try {
    const curr = getRecentRecipients();
    const updated = [recipientId, ...curr.filter((x) => x !== recipientId)].slice(0, 10);
    localStorage.setItem(RECENTS_KEY, JSON.stringify(updated));
  } catch {""}
}

/**
 * Hapus satu recipient dari recent.
 * @param {string} recipientId
 */
export function removeRecentRecipient(recipientId) {
  try {
    const curr = getRecentRecipients().filter((x) => x !== recipientId);
    localStorage.setItem(RECENTS_KEY, JSON.stringify(curr));
  } catch {""}
}

/**
 * Kosongkan semua recent recipients.
 */
export function clearRecentRecipients() {
  try {
    localStorage.removeItem(RECENTS_KEY);
  } catch {""}
}
