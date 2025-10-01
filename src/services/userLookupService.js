// src/services/userLookupService.js
import { BASE_URL } from "../constants/api";

/**
 * Coba resolve profil user (farmer) berdasarkan id.
 * Urutan percobaan (semua aman, fallback ke "minimal profile"):
 * 1) /public/users/:id   (jika backend punya)
 * 2) /public/farmers/:id (jika tersedia)
 * 3) fallback minimal: { id, uuid, name: null, email: null }
 */ 
async function tryFetch(url) {
  const res = await fetch(url, { credentials: "include" });
  if (!res.ok) throw new Error("not ok");
  return res.json();
}

export async function getUserBriefById(id) {
  const uid = String(id);
  // 1) /public/users/:id
  try {
    const j = await tryFetch(`${BASE_URL}/public/users/${uid}`);
    // Normalisasi output kalau perlu
    if (j?.id || j?.user_id || j?.uuid) {
      return {
        id: String(j.user_id || j.uuid || j.id),
        uuid: String(j.user_id || j.uuid || j.id),
        name: j.name || null,
        email: j.email || null,
        role: j.role || "user",
        profile_picture: j.profile_picture || null,
        raw: j,
      };
    }
  } catch {""}
  // 2) /public/farmers/:id
  try {
    const j = await tryFetch(`${BASE_URL}/public/farmers/${uid}`);
    if (j?.user_id || j?.id || j?.uuid) {
      return {
        id: String(j.user_id || j.uuid || j.id),
        uuid: String(j.user_id || j.uuid || j.id),
        name: j.name || null,
        email: j.email || null,
        role: "farmer",
        profile_picture: j.profile_picture || null,
        raw: j,
      };
    }
  } catch {""}
  // 3) fallback minimal
  return {
    id: uid,
    uuid: uid,
    name: null,
    email: null,
    role: "user",
    profile_picture: null,
    raw: null,
  };
}

/**
 * Resolve banyak id secara paralel (dengan batas sederhana)
 */
export async function getUsersBriefByIds(ids = []) {
  const uniq = Array.from(new Set(ids.map(String)));
  const tasks = uniq.map((id) => getUserBriefById(id));
  const results = await Promise.allSettled(tasks);
  return results.map((r) => (r.status === "fulfilled" ? r.value : null)).filter(Boolean);
}
