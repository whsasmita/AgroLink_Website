import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

import {
  sendAuthChat,
  sendPublicChat,
  createPremiumCheckout,
  getPremiumStatus,
} from "../../../services/chatbotService";

import AlistaIMG from "../../../assets/images/Elika.png";

const getWelcomeMessage = (variant) => {
  const content =
    variant === "public"
      ? "Halo! Saya **Elika** 🌱 asisten AgroLink. Kamu bisa kirim **3 pertanyaan gratis hari ini** tanpa login. Silakan tanya apa saja seputar pertanian, hasil panen, atau layanan AgroLink."
      : "Halo! Saya **Elika** 🌱 asisten AgroLink. Silakan tanya apa saja seputar pertanian, hasil panen, logistik, atau layanan AgroLink di daerahmu.";

  return {
    id: "welcome",
    role: "assistant",
    content,
    displayed: content,
    isTyping: false,
  };
};

// Render sederhana untuk bold dan line break
const renderContent = (text) => {
  if (!text) return null;

  return text.split("\n").map((line, lineIdx) => {
    const parts = line.split(/(\*\*[^*]+\*\*)/g).filter(Boolean);

    return (
      <p key={lineIdx} className={lineIdx > 0 ? "mt-2" : ""}>
        {parts.map((part, i) =>
          part.startsWith("**") && part.endsWith("**") ? (
            <strong key={i} className="font-semibold">
              {part.slice(2, -2)}
            </strong>
          ) : (
            <span key={i}>{part}</span>
          ),
        )}
      </p>
    );
  });
};

const LeafAvatar = () => (
  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-secondary_text shadow-sm">
    <img
      src={AlistaIMG}
      alt="Alista"
      className="h-full w-full rounded-full object-cover"
    />
  </div>
);

const SendIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-5 w-5"
  >
    <path d="m3 3 3 9-3 9 19-9Z" />
    <path d="M6 12h16" />
  </svg>
);

const LockIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-5 w-5"
  >
    <rect x="3" y="11" width="18" height="11" rx="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const CrownIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="h-3.5 w-3.5"
  >
    <path d="M2.5 19h19l-1.4-8.4-4.6 3.4-3-5.6-3 5.6-4.6-3.4L2.5 19Z" />
  </svg>
);

const SparkleIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-3.5 w-3.5"
  >
    <path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M18.4 5.6l-2.8 2.8M8.4 15.6l-2.8 2.8" />
  </svg>
);

const TypingDots = () => (
  <div className="flex items-center gap-1 px-1 py-1">
    <span className="h-2 w-2 animate-bounce rounded-full bg-main [animation-delay:-0.3s]" />
    <span className="h-2 w-2 animate-bounce rounded-full bg-main [animation-delay:-0.15s]" />
    <span className="h-2 w-2 animate-bounce rounded-full bg-main" />
  </div>
);

/**
 * AgroChat
 *
 * variant="public"
 * -> endpoint /public/ai/chat
 * -> tanpa login
 * -> limit 3x/hari
 *
 * variant="private"
 * -> endpoint /ai/chat
 * -> login
 * -> limit sesuai daily_limit dari server
 */
const AgroChat = ({ variant = "private" }) => {
  const isPublic = variant === "public";

  const sendMessage = isPublic ? sendPublicChat : sendAuthChat;

  const [messages, setMessages] = useState(() => [getWelcomeMessage(variant)]);

  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);

  const [quota, setQuota] = useState(null);

  const [errorMsg, setErrorMsg] = useState("");

  const [limitReached, setLimitReached] = useState(false);

  // Premium
  const [premiumStatus, setPremiumStatus] = useState(null);

  const [isCheckingOut, setIsCheckingOut] = useState(false);

  // Refs
  const scrollRef = useRef(null);
  const textareaRef = useRef(null);
  const typingTimerRef = useRef(null);

  // =========================================================
  // AUTO SCROLL CHAT
  // =========================================================

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  // =========================================================
  // CLEANUP
  // =========================================================

  useEffect(() => {
    return () => {
      if (typingTimerRef.current) {
        clearInterval(typingTimerRef.current);
      }
    };
  }, []);

  // =========================================================
  // GET PREMIUM STATUS
  // =========================================================

  useEffect(() => {
    if (isPublic) return;

    let isMounted = true;

    (async () => {
      try {
        const res = await getPremiumStatus();

        if (!isMounted) return;

        const data = res?.data;

        if (data) {
          setPremiumStatus(data);

          setQuota(
            (prev) =>
              prev || {
                daily_used:
                  typeof data.daily_limit === "number" &&
                  typeof data.remaining_today === "number"
                    ? data.daily_limit - data.remaining_today
                    : undefined,

                daily_limit: data.daily_limit,

                remaining: data.remaining_today,

                is_premium: data.is_premium,
              },
          );
        }
      } catch {
        // Tidak menghalangi chat
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [isPublic]);

  // =========================================================
  // AUTO RESIZE TEXTAREA
  // =========================================================

  const autoResizeTextarea = () => {
    const el = textareaRef.current;

    if (!el) return;

    el.style.height = "auto";

    el.style.height = Math.min(el.scrollHeight, 120) + "px";
  };

  // =========================================================
  // TYPING ANIMATION
  // =========================================================

  const typeOutMessage = (id, fullText) => {
    let index = 0;

    const speed = 12;
    const chunkSize = 2;

    typingTimerRef.current = setInterval(() => {
      index += chunkSize;

      setMessages((prev) =>
        prev.map((m) =>
          m.id === id
            ? {
                ...m,
                displayed: fullText.slice(0, index),
                isTyping: index < fullText.length,
              }
            : m,
        ),
      );

      if (index >= fullText.length) {
        clearInterval(typingTimerRef.current);

        typingTimerRef.current = null;
      }
    }, speed);
  };

  // =========================================================
  // SEND MESSAGE
  // =========================================================

  const handleSend = async () => {
    const trimmed = input.trim();

    if (!trimmed || isSending || limitReached) {
      return;
    }

    setErrorMsg("");

    const userMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: trimmed,
      displayed: trimmed,
      isTyping: false,
    };

    const placeholderId = `assistant-${Date.now()}`;

    const placeholder = {
      id: placeholderId,
      role: "assistant",
      content: "",
      displayed: "",
      isTyping: true,
      isThinking: true,
    };

    setMessages((prev) => [...prev, userMessage, placeholder]);

    setInput("");

    setIsSending(true);

    requestAnimationFrame(() => {
      autoResizeTextarea();
    });

    try {
      const res = await sendMessage(trimmed);

      const meta = res?.data?.meta;

      const reply =
        res?.data?.reply ||
        meta?.reply ||
        "Maaf, saya tidak menerima balasan yang valid.";

      // Update quota
      if (meta) {
        setQuota({
          daily_used: meta.daily_used,

          daily_limit: meta.daily_limit,

          remaining: meta.remaining,

          is_premium: meta.is_premium,
        });

        // Update premium
        if (typeof meta.is_premium === "boolean") {
          setPremiumStatus((prev) => ({
            ...prev,
            is_premium: meta.is_premium,
          }));
        }

        // Limit public
        if (
          isPublic &&
          typeof meta.remaining === "number" &&
          meta.remaining <= 0
        ) {
          setLimitReached(true);
        }
      }

      // Update placeholder
      setMessages((prev) =>
        prev.map((m) =>
          m.id === placeholderId
            ? {
                ...m,
                content: reply,
                isThinking: false,
                isTyping: true,
              }
            : m,
        ),
      );

      // Typing animation
      typeOutMessage(placeholderId, reply);
    } catch (err) {
      // Remove placeholder
      setMessages((prev) => prev.filter((m) => m.id !== placeholderId));

      const isLimitError =
        isPublic && (err?.status === 403 || err?.status === 429);

      if (isLimitError) {
        setLimitReached(true);
      } else {
        const message =
          err?.data?.message ||
          err?.message ||
          "Terjadi kesalahan saat menghubungi Elika. Silakan coba lagi.";

        setErrorMsg(message);
      }
    } finally {
      setIsSending(false);
    }
  };

  // =========================================================
  // ENTER TO SEND
  // =========================================================

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();

      handleSend();
    }
  };

  // =========================================================
  // BUY PREMIUM
  // =========================================================

  const handleBuyPremium = async () => {
    if (isCheckingOut) return;

    setErrorMsg("");

    // Pending transaction
    if (premiumStatus?.status === "pending" && premiumStatus?.redirect_url) {
      window.location.href = premiumStatus.redirect_url;

      return;
    }

    setIsCheckingOut(true);

    try {
      const res = await createPremiumCheckout();

      const redirectUrl = res?.data?.redirect_url;

      if (redirectUrl) {
        window.location.href = redirectUrl;
      } else {
        setErrorMsg("Gagal mendapatkan link pembayaran. Silakan coba lagi.");
      }
    } catch (err) {
      const message =
        err?.data?.message ||
        err?.message ||
        "Gagal memulai pembayaran premium. Silakan coba lagi.";

      setErrorMsg(message);
    } finally {
      setIsCheckingOut(false);
    }
  };

  // =========================================================
  // PREMIUM STATE
  // =========================================================

  const isPending = premiumStatus?.status === "pending";

  const isPremiumActive = Boolean(
    premiumStatus?.is_premium || quota?.is_premium,
  );

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div className="relative flex h-[calc(100vh-4rem)] flex-col overflow-hidden bg-dashboard">
      {/* =====================================================
          HEADER
      ====================================================== */}

      <div className="sticky top-0 z-20 mx-4 mt-4 shrink-0 rounded-2xl border border-secondary/30 bg-white/90 px-4 py-4 shadow-sm backdrop-blur sm:mx-6 sm:px-6">
        <div className="mx-auto flex w-full max-w-3xl items-center justify-between gap-3">
          {/* Logo + Title */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-main text-secondary_text">
              <img
                src={AlistaIMG}
                alt="Alista"
                className="h-full w-full rounded-2xl object-cover"
              />
            </div>

            <div>
              <h1 className="text-lg font-bold text-main_text">Elika</h1>

              <p className="text-xs text-main_text/60">
                {isPublic
                  ? "Asisten AgroLink · mode tamu"
                  : "Asisten AgroLink untuk pertanian & logistik"}
              </p>
            </div>
          </div>

          {/* Header Actions */}
          <div className="flex shrink-0 items-center gap-2">
            {/* Quota */}
            {quota && !isPremiumActive && (
              <div className="hidden rounded-full bg-select px-3 py-1.5 text-xs font-medium text-main_text sm:block">
                {`${quota.remaining}/${quota.daily_limit} chat tersisa hari ini`}
              </div>
            )}

            {/* Premium Active */}
            {!isPublic && isPremiumActive && (
              <span className="flex items-center gap-1 rounded-full bg-main px-3 py-1.5 text-xs font-semibold text-secondary_text">
                <CrownIcon />
                Premium Aktif
              </span>
            )}

            {/* Buy Premium */}
            {!isPublic && !isPremiumActive && (
              <button
                onClick={handleBuyPremium}
                disabled={isCheckingOut}
                className="flex items-center gap-1.5 rounded-full bg-main px-3 py-1.5 text-xs font-semibold text-secondary_text shadow-sm transition-colors hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-60"
              >
                <SparkleIcon />

                {isCheckingOut
                  ? "Memproses..."
                  : isPending
                    ? "Lanjutkan Pembayaran"
                    : "Beli Premium"}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* =====================================================
          CHAT AREA
          HANYA BAGIAN INI YANG SCROLL
      ====================================================== */}

      <div
        ref={scrollRef}
        className="min-h-0 flex-1 overflow-y-auto px-4 pb-36 pt-6 sm:px-6"
      >
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-5">
          {/* Messages */}
          {messages.map((msg) => {
            const isUser = msg.role === "user";

            return (
              <div
                key={msg.id}
                className={`flex items-end gap-2 ${
                  isUser ? "flex-row-reverse" : "flex-row"
                }`}
              >
                {/* Avatar Assistant */}
                {!isUser && <LeafAvatar />}

                {/* Message Bubble */}
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm sm:max-w-[70%] ${
                    isUser
                      ? "rounded-br-sm bg-main text-secondary_text"
                      : "rounded-bl-sm border border-secondary/30 bg-white text-main_text"
                  }`}
                >
                  {msg.isThinking ? (
                    <TypingDots />
                  ) : (
                    <>
                      <div>{renderContent(msg.displayed)}</div>

                      {msg.isTyping && (
                        <span className="ml-0.5 inline-block h-4 w-0.5 animate-pulse align-middle bg-main_text/50" />
                      )}
                    </>
                  )}
                </div>
              </div>
            );
          })}

          {/* Error */}
          {errorMsg && (
            <div className="mx-auto flex items-center gap-2 rounded-xl border border-danger/30 bg-danger/10 px-4 py-2 text-sm text-danger">
              {errorMsg}
            </div>
          )}

          {/* Limit Reached */}
          {limitReached && (
            <div className="mx-auto flex w-full flex-col items-center gap-3 rounded-2xl border border-secondary/40 bg-white px-6 py-5 text-center shadow-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-select text-main">
                <LockIcon />
              </div>

              <div>
                <p className="text-sm font-semibold text-main_text">
                  Kuota chat gratis hari ini sudah habis
                </p>

                <p className="mt-1 text-xs text-main_text/60">
                  Login atau daftar untuk lanjut chat dengan Elika.
                </p>
              </div>

              <div className="flex gap-2">
                <Link
                  to="/login"
                  className="rounded-xl bg-main px-4 py-2 text-xs font-medium text-secondary_text transition-colors hover:bg-secondary"
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  className="rounded-xl border border-main px-4 py-2 text-xs font-medium text-main transition-colors hover:bg-select"
                >
                  Daftar
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* =====================================================
          FIXED INPUT AREA
          SELALU DI BAGIAN PALING BAWAH
      ====================================================== */}

      {!limitReached && (
        <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-secondary/30 bg-white/95 px-4 py-3 shadow-[0_-4px_15px_rgba(0,0,0,0.05)] backdrop-blur-md sm:px-6">
          <div className="mx-auto w-full max-w-3xl">
            <div className="flex items-end gap-2">
              {/* Textarea */}
              <div className="flex-1 rounded-2xl border border-secondary/40 bg-dashboard px-4 py-2 transition-colors focus-within:border-main">
                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => {
                    setInput(e.target.value);

                    autoResizeTextarea();
                  }}
                  onKeyDown={handleKeyDown}
                  placeholder="Tulis pertanyaanmu di sini..."
                  rows={1}
                  className="max-h-[120px] w-full resize-none bg-transparent text-sm text-main_text placeholder:text-main_text/40 focus:outline-none"
                />
              </div>

              {/* Send Button */}
              <button
                onClick={handleSend}
                disabled={!input.trim() || isSending}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-main text-secondary_text shadow-sm transition-all hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="Kirim pesan"
              >
                <SendIcon />
              </button>
            </div>

            {/* Mobile Quota */}
            {quota && !isPremiumActive && (
              <p className="mx-auto mt-2 w-full text-center text-xs text-main_text/50 sm:hidden">
                {quota.remaining}/{quota.daily_limit} chat tersisa hari ini
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AgroChat;
