// src/pages/ChatPage.jsx
import React, { useEffect, useState, useRef, useMemo } from "react";
import { useAuth } from "../../contexts/AuthContext";
import usePrivateChat from "../../hooks/usePrivatChat";
// import usePrivateChat from "../../hooks/usePrivateChat"; // <-- perbaiki import (bukan usePrivatChat)


// --- UI parts (boleh tetap di file ini; atau pindahkan ke file terpisah) ---
function StatusBanner({ status, onReconnect }) {
    if (status === "open") return null;
    return (
        <div className="mb-4 flex items-center justify-between rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-700">
            <div>
                <b>Status:</b>{" "}
                {status === "connecting" ? "Connecting…" : status === "error" ? "Error" : "Disconnected"}
            </div>
            <button
                onClick={onReconnect}
                className="rounded-md border border-amber-300 bg-white px-3 py-1 text-xs font-medium hover:bg-amber-100"
            >
                Reconnect
            </button>
        </div>
    );
}

function ChatComposer({ value, setValue, disabled, onSend }) {
    return (
        <div className="p-3 flex gap-2 border-t border-slate-100 bg-white">
            <textarea
                rows={1}
                className="flex-1 rounded-xl border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-300 resize-none"
                placeholder={
                    disabled
                        ? "Connecting… / pick a user…"
                        : "Type a message… (Enter to send, Shift+Enter for newline)"
                }
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        onSend();
                    }
                }}
                disabled={disabled}
            />
            <button
                onClick={onSend}
                disabled={disabled}
                className={`shrink-0 rounded-xl px-4 py-2 text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-slate-300 ${ disabled ? "bg-slate-300 cursor-not-allowed" : "bg-slate-900 hover:bg-slate-800"
                    }`}
            >
                Send
            </button>
        </div>
    );
}

const MessageListBase = ({ log, recipient }) => {
    const listRef = useRef(null);

    // Hanya pesan non-system (agar tidak re-render karena log sistem)
    const messages = useMemo(
        () => (Array.isArray(log) ? log.filter((l) => l.kind !== "system") : []),
        [log]
    );

    // Kunci perubahan untuk auto-scroll (panjang + timestamp pesan terakhir)
    const messagesKey = useMemo(() => {
        const len = messages.length;
        const lastTs = len ? messages[len - 1]?.ts || 0 : 0;
        return `${ len }:${ lastTs }`;
    }, [messages]);

    useEffect(() => {
        if (listRef.current) {
            listRef.current.scrollTop = listRef.current.scrollHeight;
        }
    }, [messagesKey]);

    // Ambil konten dari format "To/From [id]: ..."
    const getContent = (entry) => {
        if (entry.content) return String(entry.content);
        const t = String(entry.text || "");
        const idx = t.indexOf("]:");
        if (idx >= 0) return t.slice(idx + 2).trim();
        return t;
    };

    // sent => bubble kanan (hijau), recv => kiri (putih)
    const isOutgoing = (entry) => entry.kind === "sent";

    if (messages.length === 0) {
        return (
            <div
                ref={listRef}
                className="h-[60vh] max-h-[520px] overflow-y-auto px-4 py-6 bg-[url('/whatsapp-bg.png')] bg-repeat"
            >
                {recipient ? (
                    <div className="text-sm text-slate-500">
                        Mulai chat dengan{" "}
                        <span className="font-semibold text-slate-700">
                            {recipient.name || recipient.email || recipient.user_id}
                        </span>
                    </div>
                ) : (
                    <div className="text-sm text-slate-400">Pilih pekerja di sebelah kiri…</div>
                )}
            </div>
        );
    }

    return (
        <div
            ref={listRef}
            className="h-[60vh] max-h-[520px] overflow-y-auto px-3 py-4 space-y-2 bg-[url('/whatsapp-bg.png')] bg-repeat"
        >
            {messages.map((m, i) => {
                const out = isOutgoing(m);
                const content = getContent(m);
                const time = new Date(m.ts || Date.now()).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                });

                return (
                    <div key={i} className={`flex w-full ${ out ? "justify-end" : "justify-start" }`}>
                        <div
                            className={[
                                "max-w-[75%] rounded-2xl px-3 py-2 shadow-sm whitespace-pre-wrap break-words",
                                out
                                    ? "bg-green-100 text-slate-900 rounded-br-md"
                                    : "bg-white text-slate-900 rounded-bl-md border border-slate-100",
                            ].join(" ")}
                        >
                            <div className="text-[13px] leading-relaxed">{content}</div>
                            <div
                                className={`mt-1 text-[10px] text-right ${ out ? "text-green-700/70" : "text-slate-500/80"
                                    }`}
                            >
                                {time}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

// Comparator ketat: re-render hanya jika jumlah pesan atau pesan terakhir berubah,
// atau recipient berubah (id)
const areEqualMsg = (prev, next) => {
    const prevLen = Array.isArray(prev.log) ? prev.log.length : 0;
    const nextLen = Array.isArray(next.log) ? next.log.length : 0;
    if (prevLen !== nextLen) return false;

    if (nextLen > 0) {
        const pLast = prev.log[prevLen - 1] || {};
        const nLast = next.log[nextLen - 1] || {};
        if (
            pLast.ts !== nLast.ts ||
            pLast.kind !== nLast.kind ||
            pLast.text !== nLast.text ||
            pLast.content !== nLast.content
        ) {
            return false;
        }
    }

    const prevRid =
        prev.recipient?.user_id || prev.recipient?.uuid || prev.recipient?.id || null;
    const nextRid =
        next.recipient?.user_id || next.recipient?.uuid || next.recipient?.id || null;

    return prevRid === nextRid;
};

export const MessageList = React.memo(MessageListBase, areEqualMsg);

function ChatSidebar({ users, loading, queryInput, setQueryInput, onPick, activeId }) {
    return (
        <aside className="md:col-span-4 lg:col-span-3 xl:col-span-3 bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
            <div className="px-4 py-3 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
                <h2 className="text-sm font-semibold">Chats</h2>
                <span className="text-[10px] text-slate-500">{loading ? "loading…" : `${ users.length } users`}</span>
            </div>

            <div className="p-3">
                <input
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-300"
                    placeholder="Search name/email…"
                    value={queryInput}
                    onChange={(e) => setQueryInput(e.target.value)}
                />
            </div>

            <div className="max-h-[65vh] overflow-y-auto divide-y divide-slate-100">
                {loading ? (
                    <div className="p-4 space-y-3">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-full bg-slate-200 animate-pulse" />
                                <div className="flex-1 space-y-2">
                                    <div className="h-3 w-1/2 bg-slate-200 rounded animate-pulse" />
                                    <div className="h-3 w-1/3 bg-slate-200 rounded animate-pulse" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : users.length === 0 ? (
                    <div className="p-4 text-xs text-slate-500">No users found.</div>
                ) : (
                    users.map((u) => {
                        const uid = String(u.user_id || u.uuid || u.id);
                        const active = uid === activeId;
                        return (
                            <button
                                key={uid}
                                className={`w-full text-left px-4 py-3 hover:bg-slate-50 flex items-center gap-3 ${ active ? "bg-slate-50" : ""
                                    }`}
                                onClick={() => onPick(u)}
                            >
                                <img
                                    src={u.profile_picture || "/src/assets/images/pp.png"}
                                    alt="avatar"
                                    className="w-9 h-9 rounded-full object-cover border border-slate-200"
                                    onError={(e) => {
                                        e.target.src = "/src/assets/images/pp.png";
                                    }}
                                />
                                <div className="min-w-0">
                                    <div className="text-sm font-medium text-slate-800 truncate">
                                        {u.name || u.email || uid}
                                    </div>
                                    <div className="text-[11px] text-slate-500 truncate">WORKER</div>
                                </div>
                            </button>
                        );
                    })
                )}
            </div>
        </aside>
    );
}

function StatusBadge({ status }) {
    const map = {
        connecting: { label: "Connecting", cls: "bg-yellow-100 text-yellow-800" },
        open: { label: "Connected", cls: "bg-emerald-100 text-emerald-800" },
        closed: { label: "Disconnected", cls: "bg-slate-100 text-slate-700" },
        error: { label: "Error", cls: "bg-rose-100 text-rose-800" },
    };
    const s = map[status] || { label: status, cls: "bg-slate-100 text-slate-700" };

    return (
        <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${ s.cls }`}>
            <span className="relative flex h-2 w-2 mr-2">
                <span
                    className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-50 ${ status === "open"
                        ? "bg-emerald-400"
                        : status === "connecting"
                            ? "bg-yellow-400"
                            : status === "error"
                                ? "bg-rose-400"
                                : "bg-slate-400"
                        }`}
                />
                <span
                    className={`relative inline-flex rounded-full h-2 w-2 ${ status === "open"
                        ? "bg-emerald-500"
                        : status === "connecting"
                            ? "bg-yellow-500"
                            : status === "error"
                                ? "bg-rose-500"
                                : "bg-slate-500"
                        }`}
                />
            </span>
            {s.label}
        </span>
    );
}

// ===================== PAGE =====================
export default function ChatPage() {
    const { isAuthenticated, user, token: tokenFromContext, loading: authLoading } = useAuth();

    // Hook #1: token state
    const [token, setToken] = useState("");

    // Hook #2: sinkronkan token sekali saat auth berubah
    useEffect(() => {
        const t =
            tokenFromContext || (typeof window !== "undefined" ? localStorage.getItem("token") : "");
        setToken(t || "");
    }, [tokenFromContext, isAuthenticated]);

    // Hook #3: SELALU panggil usePrivateChat — tidak di-dalam conditional
    const chat = usePrivateChat({
        token,
        currentUser: user,
        authLoading,
    });

    const connected = chat.status === "open";

    // Setelah semua hooks terpanggil, lakukan conditional rendering
    if (authLoading) {
        return (
            <div className="p-4 m-4 text-sm text-slate-600 border border-slate-200 bg-white rounded-lg">
                Loading session…
            </div>
        );
    }

    if (!isAuthenticated) {
        return (
            <div className="p-4 m-4 text-sm text-rose-600 border border-rose-300 bg-rose-50 rounded-lg">
                You must login to use chat.
            </div>
        );
    }

    return (
        <div className="px-4 py-6">
            <StatusBanner status={chat.status} onReconnect={chat.reconnectNow} />

            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                <ChatSidebar
                    users={chat.users}
                    loading={chat.loadingUsers}
                    queryInput={chat.queryInput}
                    setQueryInput={chat.setQueryInput}
                    onPick={chat.pickUser}
                    activeId={chat.recipientId}
                />

                <section className="md:col-span-8 lg:col-span-9 xl:col-span-9">
                    <div className="rounded-2xl border border-slate-200 shadow-sm overflow-hidden bg-white">
                        {/* Header */}
                        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50">
                            <div className="space-y-0.5">
                                <div className="text-sm text-slate-700">
                                    {chat.recipient ? (
                                        <span>
                                            Chatting with{" "}
                                            <span className="font-semibold">
                                                {chat.recipient.name || chat.recipient.email || chat.recipient.user_id}
                                            </span>
                                        </span>
                                    ) : (
                                        <span className="text-slate-500">Pick a worker from the left</span>
                                    )}
                                </div>
                                <div className="text-[11px] text-slate-500">
                                    Endpoint: <span className="font-mono">{chat.wsBaseUrl || "(auto)"}</span>
                                </div>
                            </div>
                            <StatusBadge status={chat.status} />
                        </div>

                        {/* Info row */}
                        <div className="px-4 py-3 grid grid-cols-1 md:grid-cols-2 gap-3 border-b border-slate-100">
                            <div className="text-xs">
                                <div className="flex items-center gap-2">
                                    <div className="text-slate-500">Your ID</div>
                                    <button
                                        onClick={() => navigator.clipboard?.writeText(chat.selfId)}
                                        className="rounded border border-slate-300 px-2 py-[2px] text-[11px] hover:bg-slate-100"
                                    >
                                        Copy
                                    </button>
                                </div>
                                <div className="font-mono text-[11px] bg-slate-100 rounded px-2 py-1 break-all">
                                    {chat.selfId}
                                </div>
                            </div>
                            <div className="text-xs">
                                <label className="text-slate-500">Recipient</label>
                                {chat.recipient ? (
                                    <div className="mt-1 flex items-center gap-3">

                                        <div className="min-w-0">
                                            <div className="text-sm font-semibold text-slate-800 truncate">
                                                {chat.recipient.name || chat.recipient.email}
                                            </div>
                                            <div className="text-[11px] text-slate-500 truncate">WORKER</div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="mt-1 text-[11px] text-slate-400">Pick a worker from the left</div>
                                )}
                            </div>
                        </div>

                        <MessageList log={chat.log} />
                        <ChatComposer
                            value={chat.input}
                            setValue={chat.setInput}
                            disabled={!chat.recipientId || !connected}
                            onSend={chat.sendMessage}
                        />
                    </div>

                    <div className="mt-2 text-[11px] text-slate-500">
                        Connected to{" "}
                        <span className="font-mono">
                            {(() => {
                                try {
                                    return new URL(chat.wsUrl).origin;
                                } catch {
                                    return "(invalid ws url)";
                                }
                            })()}
                        </span>
                    </div>
                </section>
            </div>
        </div>
    );
}
