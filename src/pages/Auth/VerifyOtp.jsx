import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { verifyOtp, resendOtp } from "../../services/authService";
import { Mail, CheckCircle2, AlertCircle, RotateCcw, ArrowLeft, ShieldCheck } from "lucide-react";

const VerifyOtp = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  // Retrieve email from state, sessionStorage, or query params
  const [email, setEmail] = useState(() => {
    return (
      location.state?.email ||
      sessionStorage.getItem("pendingOtpEmail") ||
      ""
    );
  });

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  // If no email found, redirect back to register
  useEffect(() => {
    if (!email) {
      navigate("/auth/register");
    }
  }, [email, navigate]);

  // Focus first input on mount
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  // Countdown timer for Resend OTP
  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else {
      setCanResend(true);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  // Handle single digit input
  const handleChange = (index, value) => {
    // Only allow numeric
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    // Take the last entered character if multiple typed
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    setError("");

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // If all 6 digits filled, automatically verify
    const currentCode = newOtp.join("");
    if (currentCode.length === 6 && !newOtp.includes("")) {
      handleVerify(currentCode);
    }
  };

  // Handle Backspace and navigation
  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace") {
      if (!otp[index] && index > 0) {
        // Move to previous box if current is empty
        inputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle Paste event (supports copying 6-digit code)
  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").trim();
    if (!/^\d+$/.test(pastedData)) return;

    const digits = pastedData.slice(0, 6).split("");
    const newOtp = [...otp];
    digits.forEach((digit, i) => {
      if (i < 6) newOtp[i] = digit;
    });
    setOtp(newOtp);
    setError("");

    // Focus last filled index or next available
    const nextFocusIndex = Math.min(digits.length, 5);
    inputRefs.current[nextFocusIndex]?.focus();

    if (newOtp.join("").length === 6 && !newOtp.includes("")) {
      handleVerify(newOtp.join(""));
    }
  };

  // Verification request
  const handleVerify = async (codeToVerify) => {
    const otpCode = typeof codeToVerify === "string" ? codeToVerify : otp.join("");
    if (otpCode.length !== 6) {
      setError("Silakan masukkan 6 digit kode OTP secara lengkap.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccessMsg("");

    try {
      const response = await verifyOtp({
        email: email,
        otp_code: otpCode,
      });

      console.log("OTP Verification response:", response);

      if (response && response.data && response.data.token) {
        const { token, user } = response.data;
        setSuccessMsg("Verifikasi Berhasil! Selamat datang di AgroLink.");

        // Store login session
        login(token, user);
        sessionStorage.removeItem("pendingOtpEmail");
        sessionStorage.removeItem("registerData");

        // Direct routing based on user role
        setTimeout(() => {
          const userRole = user?.role?.toLowerCase();
          if (userRole === "mitra") {
            navigate("/mitra/cooperations");
          } else if (userRole === "farmer" || userRole === "worker" || userRole === "driver") {
            navigate("/dashboard");
          } else {
            navigate("/");
          }
        }, 1200);
      } else {
        setError(response.message || "Kode OTP tidak valid.");
      }
    } catch (err) {
      console.error("Verification error:", err);
      setError(err.message || "Kode OTP tidak valid atau sudah kedaluwarsa.");
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP request
  const handleResend = async () => {
    if (!canResend || resending) return;

    setResending(true);
    setError("");
    setSuccessMsg("");

    try {
      const response = await resendOtp({ email });
      setSuccessMsg(
        response.message || "Kode verifikasi baru telah dikirim ke email Anda."
      );
      setCountdown(60);
      setCanResend(false);
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } catch (err) {
      console.error("Resend OTP error:", err);
      setError(err.message || "Gagal mengirim ulang kode OTP.");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      {/* Visual Header */}
      <div className="text-center space-y-2">
        <div className="w-16 h-16 bg-green-50 text-main rounded-2xl flex items-center justify-center mx-auto border border-green-200/60 shadow-xs">
          <ShieldCheck size={36} className="text-main" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">
          Verifikasi Kode OTP
        </h2>
        <p className="text-xs sm:text-sm text-gray-500 max-w-sm mx-auto">
          Kode verifikasi 6 digit telah dikirimkan ke email pendaftaran Anda:
        </p>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 rounded-full text-xs font-semibold text-gray-700">
          <Mail size={13} className="text-gray-500" />
          <span>{email}</span>
        </div>
      </div>

      {/* Alerts */}
      {error && (
        <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 rounded-2xl text-xs flex items-center gap-2">
          <AlertCircle size={16} className="flex-shrink-0 text-red-500" />
          <span>{error}</span>
        </div>
      )}

      {successMsg && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs flex items-center gap-2">
          <CheckCircle2 size={16} className="flex-shrink-0 text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* 6 Digit Input Boxes */}
      <div className="space-y-4">
        <div className="flex justify-between gap-2 sm:gap-3" onPaste={handlePaste}>
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className={`w-12 h-14 sm:w-14 sm:h-16 text-center text-xl sm:text-2xl font-bold rounded-2xl border transition-all duration-200 bg-white shadow-xs focus:outline-none ${
                digit
                  ? "border-main text-main ring-2 ring-main/20 bg-green-50/30"
                  : "border-gray-300 text-gray-800 focus:border-main focus:ring-2 focus:ring-main/20"
              }`}
            />
          ))}
        </div>

        {/* Action Button */}
        <button
          onClick={() => handleVerify()}
          disabled={loading || otp.join("").length !== 6}
          className={`w-full py-3 sm:py-3.5 px-6 rounded-2xl font-semibold text-sm transition-all duration-200 shadow-sm ${
            loading || otp.join("").length !== 6
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-main text-white hover:bg-green-600 hover:shadow-md active:scale-[0.99]"
          }`}
        >
          {loading ? (
            <div className="flex items-center justify-center gap-2">
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              <span>Memverifikasi...</span>
            </div>
          ) : (
            "Verifikasi & Masuk"
          )}
        </button>
      </div>

      {/* Resend and Email Correction Section */}
      <div className="text-center space-y-3 pt-2">
        <p className="text-xs text-gray-500">
          Tidak menerima kode verifikasi?
        </p>

        {canResend ? (
          <button
            onClick={handleResend}
            disabled={resending}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-main hover:text-green-700 transition-colors"
          >
            <RotateCcw size={14} className={resending ? "animate-spin" : ""} />
            <span>{resending ? "Mengirim ulang..." : "Kirim Ulang Kode OTP"}</span>
          </button>
        ) : (
          <p className="text-xs text-gray-400 font-medium">
            Kirim ulang kode dalam{" "}
            <span className="font-bold text-gray-700">
              00:{countdown < 10 ? `0${countdown}` : countdown}
            </span>
          </p>
        )}

        <div className="pt-3 border-t border-gray-100">
          <Link
            to="/auth/register"
            className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft size={13} />
            <span>Ganti Alamat Email / Daftar Ulang</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default VerifyOtp;
