// src/utils/recentContacts.js
const KEY = "chat_recents_by_user"; // { [myUserId]: [uuid1, uuid2, ...] }

export function pushRecentContact(myId, otherId) {
  if (!myId || !otherId) return;
  try {
    const raw = localStorage.getItem(KEY);
    const map = raw ? JSON.parse(raw) : {};
    const arr = Array.isArray(map[myId]) ? map[myId] : [];
    const next = [String(otherId), ...arr.filter((x) => String(x) !== String(otherId))].slice(0, 20);
    map[myId] = next;
    localStorage.setItem(KEY, JSON.stringify(map));
  } catch {""}
}

export function getRecentContacts(myId) {
  if (!myId) return [];
  try {
    const raw = localStorage.getItem(KEY);
    const map = raw ? JSON.parse(raw) : {};
    const arr = Array.isArray(map[myId]) ? map[myId] : [];
    return arr.map(String);
  } catch {
    return [];
  }
}
