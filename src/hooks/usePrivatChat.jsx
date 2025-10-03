/* eslint-disable no-unused-vars */
// src/hooks/usePrivateChat.js
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { WS_URL } from "../constants/api";
import { getWorkers } from "../services/workerService";
import { getRecentContacts, pushRecentContact } from "../utils/recentContacts";
import { getUsersBriefByIds } from "../services/userLookupService";

/** WS_URL harus absolut: ws(s)://.../api/v1/ws */
function resolveWsBase() {
    return WS_URL;
}

export default function usePrivateChat({ token, currentUser, authLoading }) {
    // ===== State utama =====
    const [status, setStatus] = useState("connecting"); // connecting | open | closed | error
    const [selfId, setSelfId] = useState("-");
    const [log, setLog] = useState([]);
    const [input, setInput] = useState("");

    // ===== Target chat =====
    const [recipientId, setRecipientId] = useState("");
    const [recipient, setRecipient] = useState(null);

    // ===== Sidebar (users) =====
    const [users, setUsers] = useState([]);
    const [queryInput, setQueryInput] = useState("");
    const [query, setQuery] = useState("");
    const [loadingUsers, setLoadingUsers] = useState(false);

    // ===== Refs kontrol koneksi & efek =====
    const wsRef = useRef(null);
    const reconnectRef = useRef(0);
    const mountedRef = useRef(false);

    // PATCH — anti double connect (React Strict Mode) + kontrol reconnect
    const didConnectRef = useRef(false);
    const reconnectTimerRef = useRef(null);

    // ===== Debounce status (hindari setState nilai sama) =====
    const lastStatusRef = useRef(null);
    const safeSetStatus = useCallback((next) => {
        if (lastStatusRef.current !== next) {
            lastStatusRef.current = next;
            setStatus(next);
        }
    }, []);

    // ===== URL WS =====
    const wsBaseUrl = useMemo(() => resolveWsBase(), []);
    const wsUrl = useMemo(() => {
        if (!wsBaseUrl) return "";
        try {
            const u = new URL(wsBaseUrl); // harus absolut
            if (token) u.searchParams.set("token", token);
            return u.toString();
        } catch {
            return ""; // WS_URL invalid → akan ditangani di UI/status
        }
    }, [wsBaseUrl, token]);

    // ===== Helper log (user messages only; system logs DISABLED) =====
    const appendLog = useCallback((entry) => {
        if (!mountedRef.current) return; // avoid setState after unmount
        // HANYA izinkan kind "sent" dan "recv"
        if (entry?.kind !== "sent" && entry?.kind !== "recv") return;
        setLog((prev) => [...prev, { ...entry, ts: entry.ts ?? Date.now() }]);
    }, []);

    // ===== Debounce search input → query =====
    useEffect(() => {
        const t = setTimeout(() => setQuery((queryInput || "").trim().toLowerCase()), 350);
        return () => clearTimeout(t);
    }, [queryInput]);

    // ===== Fetch users untuk sidebar =====
    // - Farmer  → tampilkan daftar workers (endpoint publik)
    // - Worker  → tampilkan recent farmers (disimpan lokal) lalu resolve profilnya
    useEffect(() => {
        if (authLoading) return;
        let ignore = false;

        (async () => {
            try {
                setLoadingUsers(true);

                const myId = String(currentUser?.uuid || currentUser?.user_id || currentUser?.id || "");
                const myRole = String(currentUser?.role || "").toLowerCase();
                const q = query;

                if (myRole === "worker") {
                    // === MODE WORKER: daftar farmer dari recent contacts ===
                    const recentIds = getRecentContacts(myId); // array of userId (farmer)
                    if (!recentIds.length) {
                        if (!ignore) setUsers([]);
                    } else {
                        const profiles = await getUsersBriefByIds(recentIds);
                        if (ignore) return;

                        const filtered = profiles
                            .filter((p) => String(p.uuid) !== myId)
                            .filter((p) => {
                                if (!q) return true;
                                const hay = `${ p.name || "" } ${ p.email || "" }`.toLowerCase();
                                return hay.includes(q);
                            });

                        setUsers(filtered);
                    }
                } else {
                // === MODE FARMER: tampilkan semua worker publik ===
                    const res = await getWorkers(); // { data: [...], pagination: {...} }
                    if (ignore) return;

                    const rows = Array.isArray(res?.data) ? res.data : [];
                    const normalized = rows
                        .map((u) => ({
                            id: String(u.user_id || ""),
                            uuid: String(u.user_id || ""),
                            name: u.name || "",
                            email: u.email || "",
                            role: "worker",
                            profile_picture: u.profile_picture || null,
                            raw: u,
                        }))
                        .filter(Boolean)
                        .filter((u) => {
                            if (!q) return true;
                            const hay = `${ u.name } ${ u.email }`.toLowerCase();
                            return hay.includes(q);
                        });

                    const filtered = normalized.filter((u) => String(u.uuid) !== myId);
                    setUsers(filtered);
                }
            } catch {
            // 🔇 sistem log dimatikan
            } finally {
                if (!ignore) setLoadingUsers(false);
            }
        })();

        return () => {
            ignore = true;
        };
    }, [authLoading, query, currentUser]);

    // ===== Reconnect helpers =====
    const clearReconnectTimer = useCallback(() => {
        if (reconnectTimerRef.current) {
            clearTimeout(reconnectTimerRef.current);
            reconnectTimerRef.current = null;
        }
    }, []);

    const MAX_ATTEMPTS = 5;
    const shouldReconnect = useCallback(
        (code) => {
            // token/URL invalid → jangan reconnect otomatis
            if (!token || !wsUrl) return false;
            // sudah mentok attempt
            if ((reconnectRef.current || 0) >= MAX_ATTEMPTS) return false;
            // hentikan untuk kode fatal/umum:
            // 1006: abnormal closure (sering karena 4xx sebelum upgrade)
            // 1008: policy violation
            // 1011: internal server error
            if (code === 1006 || code === 1008 || code === 1011) return false;
            return true;
        },
        [token, wsUrl]
    );

    const scheduleReconnect = useCallback(
        (code) => {
            if (!mountedRef.current) return;
            if (!shouldReconnect(code)) return;

            const attempt = Math.min(MAX_ATTEMPTS, (reconnectRef.current || 0) + 1);
            reconnectRef.current = attempt;

            // Kurangi noise saat di background tab
            if (typeof document !== "undefined" && document.visibilityState !== "visible") {
                return; // saat kembali visible, listener di bawah akan memanggil connect()
            }

            clearReconnectTimer();
            reconnectTimerRef.current = setTimeout(() => connect(), attempt * 1000);
        },
        [clearReconnectTimer, shouldReconnect] // connect dideklarasi di bawah
    );

    // ===== Buat koneksi WebSocket (PATCH: guard StrictMode & reconnect tertib) =====
    const connect = useCallback(() => {
        if (!token) {
            safeSetStatus("error");
            return;
        }
        if (!wsUrl) {
            safeSetStatus("error");
            return;
        }

        // Strict Mode guard: jangan buka dua koneksi pada mount-duplikat
        if (didConnectRef.current && wsRef.current) return;

        try {
            safeSetStatus("connecting");
            const ws = new WebSocket(wsUrl);
            wsRef.current = ws;
            didConnectRef.current = true;

            ws.onopen = () => {
                if (!mountedRef.current) return;
                safeSetStatus("open");
                reconnectRef.current = 0;
                clearReconnectTimer();
            };

            ws.onmessage = (evt) => {
                if (!mountedRef.current) return;

                const safeJSON = (raw) => {
                    try {
                        return JSON.parse(raw);
                    } catch {
                        return null;
                    }
                };
                const msg = safeJSON(String(evt.data));
                if (msg && typeof msg === "object") {
                    // sistem events (diam)
                    if (msg.type === "self_id") {
                        setSelfId(String(msg.content || "-"));
                        return;
                    }
                    if (msg.type === "error") return;
                    if (msg.type === "delivery_status") return;

                    // Pesan normal (user → user)
                    const sender = msg.sender_id ? String(msg.sender_id) : "?";
                    const content = msg.content ? String(msg.content) : String(evt.data);
                    appendLog({ kind: "recv", text: `From [${ sender }]: ${ content }`, content });

                    // simpan recent (si pengirim)
                    try {
                        const myId = String(currentUser?.uuid || currentUser?.user_id || currentUser?.id || "");
                        if (myId && sender && sender !== myId) pushRecentContact(myId, sender);
                    } catch { "" }
                    return;
                }
                // raw non-JSON → diam
            };

            ws.onclose = (evt) => {
                if (!mountedRef.current) return;
                safeSetStatus("closed");
                wsRef.current = null;
                didConnectRef.current = false;
                scheduleReconnect(evt.code);
            };

            ws.onerror = () => {
                if (!mountedRef.current) return;
                safeSetStatus("error");
            };
        } catch {
            safeSetStatus("error");
        }
    }, [wsUrl, token, scheduleReconnect, clearReconnectTimer, appendLog, safeSetStatus, currentUser]);

    // ===== Lifecycle mount/unmount =====
    useEffect(() => {
        mountedRef.current = true;
        connect();
        return () => {
            mountedRef.current = false;
            clearReconnectTimer();
            try {
                wsRef.current?.close(1000, "page unmount");
            } catch { "" }
            wsRef.current = null;
            didConnectRef.current = false;
        };
    }, [wsUrl, connect, clearReconnectTimer]);

    // ===== Reconnect saat tab kembali visible =====
    useEffect(() => {
        const onVis = () => {
            if (!mountedRef.current) return;
            if (document.visibilityState === "visible" && !wsRef.current) {
                connect();
            }
        };
        if (typeof document !== "undefined") {
            document.addEventListener("visibilitychange", onVis);
            return () => document.removeEventListener("visibilitychange", onVis);
        }
    }, [connect]);

    // ===== Heartbeat client (opsional) =====
    useEffect(() => {
        if (!wsRef.current || status !== "open") return;
        const t = setInterval(() => {
            try {
                wsRef.current.send(JSON.stringify({ type: "ping" }));
            } catch { "" }
        }, 30000);
        return () => clearInterval(t);
    }, [status]);

    // ===== Actions =====
    const pickUser = useCallback((u) => {
        const uuid = u.user_id || u.uuid || u.id;
        setRecipientId(String(uuid));
        setRecipient(u);
    }, []);

    const sendMessage = useCallback(() => {
        const rid = (recipientId || "").trim();
        const content = (input || "").trim();
        if (!rid) return;
        if (!content) return;
        if (status !== "open") return;

        try {
            wsRef.current?.send(JSON.stringify({ recipient_id: rid, content }));
            appendLog({ kind: "sent", text: `To [${ rid }]: ${ content }`, content });
            setInput("");

            // simpan recent (si penerima)
            try {
                const myId = String(currentUser?.uuid || currentUser?.user_id || currentUser?.id || "");
                if (myId && rid && rid !== myId) pushRecentContact(myId, rid);
            } catch { "" }
        } catch {
        // diamkan
        }
    }, [recipientId, input, status, appendLog, currentUser]);

    const reconnectNow = useCallback(() => {
        clearReconnectTimer();
        try {
            wsRef.current?.close(1000, "manual reconnect");
        } catch { "" }
        wsRef.current = null;
        didConnectRef.current = false;
        connect();
    }, [connect, clearReconnectTimer]);

    // ===== API Hook =====
    return {
        // state
        status,
        selfId,
        log,
        input,
        recipientId,
        recipient,
        users,
        queryInput,
        loadingUsers,
        wsBaseUrl,
        wsUrl,
        // setters
        setInput,
        setRecipientId,
        setQueryInput,
        // actions
        sendMessage,
        pickUser,
        reconnectNow,
    };
}
