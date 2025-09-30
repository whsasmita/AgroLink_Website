/* eslint-disable no-unused-vars */
// src/hooks/usePrivateChat.js
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { WS_URL } from "../constants/api";
import { getWorkers } from "../services/workerService";

// WS_URL harus absolut: ws(s)://.../api/v1/ws
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

    // ===== Sidebar (workers) =====
    const [users, setUsers] = useState([]);
    const [queryInput, setQueryInput] = useState("");
    const [query, setQuery] = useState("");
    const [loadingUsers, setLoadingUsers] = useState(false);

    // ===== Refs kontrol koneksi & efek =====
    const wsRef = useRef(null);
    const reconnectRef = useRef(0);
    const mountedRef = useRef(false);

    // PATCH HOOKS — anti double connect (React Strict Mode) + kontrol reconnect
    const didConnectRef = useRef(false);
    const reconnectTimerRef = useRef(null);

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
        const t = setTimeout(() => setQuery(queryInput.trim().toLowerCase()), 350);
        return () => clearTimeout(t);
    }, [queryInput]);

    // ===== Fetch workers (public) untuk sidebar =====
    useEffect(() => {
        // boleh tetap jalan meski belum login (endpoint public); tahan saat authLoading
        if (authLoading) return;
        let ignore = false;

        (async () => {
            try {
                setLoadingUsers(true);
                const res = await getWorkers(); // { data: [...], pagination: {...} }
                if (ignore) return;

                const rows = Array.isArray(res?.data) ? res.data : [];
                const q = query;

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

                const myId = String(currentUser?.uuid || currentUser?.user_id || currentUser?.id || "");
                const filtered = normalized.filter((u) => String(u.uuid) !== myId);

                setUsers(filtered);
            } catch (e) {
                // 🔇 sistem log dimatikan: jangan appendLog
                // (bisa tampilkan toast/local error di UI jika perlu)
            } finally {
                if (!ignore) setLoadingUsers(false);
            }
        })();

        return () => { ignore = true; };
    }, [authLoading, query, currentUser]);

    // ===== Reconnect helpers =====
    const clearReconnectTimer = useCallback(() => {
        if (reconnectTimerRef.current) {
            clearTimeout(reconnectTimerRef.current);
            reconnectTimerRef.current = null;
        }
    }, []);

    const scheduleReconnect = useCallback(() => {
        if (!mountedRef.current) return;
        const attempt = Math.min(5, (reconnectRef.current || 0) + 1);
        reconnectRef.current = attempt;

        // Kurangi noise saat di background tab
        if (typeof document !== "undefined" && document.visibilityState !== "visible") {
            return; // saat kembali visible, listener di bawah akan memanggil connect()
        }

        clearReconnectTimer();
        reconnectTimerRef.current = setTimeout(() => connect(), attempt * 1000);
    }, [clearReconnectTimer]); // connect dideklarasi di bawah

    // ===== Buat koneksi WebSocket (PATCH: guard StrictMode & reconnect tertib) =====
    const connect = useCallback(() => {
        if (!token) {
            setStatus("error");
            // 🔇 jangan appendLog system
            return;
        }
        if (!wsUrl) {
            setStatus("error");
            // 🔇 jangan appendLog system
            return;
        }

        // Strict Mode guard: jangan buka dua koneksi pada mount-duplikat
        if (didConnectRef.current && wsRef.current) {
            return;
        }

        try {
            setStatus("connecting");
            const ws = new WebSocket(wsUrl);
            wsRef.current = ws;
            didConnectRef.current = true;

            ws.onopen = () => {
                if (!mountedRef.current) return;
                setStatus("open");
                reconnectRef.current = 0;
                clearReconnectTimer();
                // 🔇 jangan appendLog system
            };

            ws.onmessage = (evt) => {
                if (!mountedRef.current) return;
                const safeJSON = (raw) => { try { return JSON.parse(raw); } catch { return null; } };
                const msg = safeJSON(String(evt.data));
                if (msg && typeof msg === "object") {
                    if (msg.type === "self_id") {
                        setSelfId(String(msg.content || "-"));
                        // 🔇 jangan appendLog system
                        return;
                    }
                    if (msg.type === "error") {
                        // 🔇 jangan appendLog system
                        return;
                    }
                    if (msg.type === "delivery_status") {
                    // 🔇 jangan appendLog system
                        return;
                    }
                    // Pesan normal (user → user)
                    const sender = msg.sender_id ? String(msg.sender_id) : "?";
                    const content = msg.content ? String(msg.content) : String(evt.data);
                    appendLog({ kind: "recv", text: `From [${ sender }]: ${ content }`, content });
                    return;
                }
                // 🔇 pesan raw non-JSON → jangan appendLog system
            };

            ws.onclose = (evt) => {
                if (!mountedRef.current) return;
                setStatus("closed");
                wsRef.current = null;
                didConnectRef.current = false;
                // 🔇 jangan appendLog system
                scheduleReconnect();
            };

            ws.onerror = () => {
                if (!mountedRef.current) return;
                setStatus("error");
                // 🔇 jangan appendLog system
            };
        } catch (e) {
            setStatus("error");
            // 🔇 jangan appendLog system
        }
    }, [wsUrl, token, scheduleReconnect, clearReconnectTimer, appendLog]);

    // ===== Lifecycle mount/unmount =====
    useEffect(() => {
        mountedRef.current = true;
        connect();
        return () => {
            mountedRef.current = false;
            clearReconnectTimer();
            try { wsRef.current?.close(1000, "page unmount"); } catch { "" }
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
            try { wsRef.current.send(JSON.stringify({ type: "ping" })); } catch { "" }
        }, 30000);
        return () => clearInterval(t);
    }, [status]);

    // ===== Actions =====
    const pickUser = useCallback((u) => {
        // Response workers: gunakan user_id sebagai UUID
        const uuid = u.user_id || u.uuid || u.id;
        setRecipientId(String(uuid));
        setRecipient(u);
        // 🔇 jangan appendLog system
    }, []);

    const sendMessage = useCallback(() => {
        const rid = (recipientId || "").trim();
        const content = (input || "").trim();
        if (!rid) {
            // 🔇 jangan appendLog system
            return;
        }
        if (!content) {
            // 🔇 jangan appendLog system
            return;
        }
        if (status !== "open") {
            // 🔇 jangan appendLog system
            return;
        }
        try {
            wsRef.current?.send(JSON.stringify({ recipient_id: rid, content }));
            appendLog({ kind: "sent", text: `To [${ rid }]: ${ content }`, content });
            setInput("");
            // eslint-disable-next-line no-unused-vars
        } catch (e) {
            // 🔇 jangan appendLog system
        }
    }, [recipientId, input, status, appendLog]);

    const reconnectNow = useCallback(() => {
        clearReconnectTimer();
        try { wsRef.current?.close(1000, "manual reconnect"); } catch { "" }
        wsRef.current = null;
        didConnectRef.current = false;
        connect();
    }, [connect, clearReconnectTimer]);

    // ===== API Hook =====
    return {
        // state
        status, selfId, log, input, recipientId, recipient,
        users, queryInput, loadingUsers,
        wsBaseUrl, wsUrl,
        // setters
        setInput, setRecipientId, setQueryInput,
        // actions
        sendMessage, pickUser, reconnectNow,
    };
}
