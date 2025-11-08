import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { login as loginService } from "../../services/authService";
import { getProfile } from "../../services/profileService";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, logout } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [validationErrors, setValidationErrors] = useState({
    email: "",
    password: "",
  });

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = "Email tidak boleh kosong";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Format email tidak valid";
    }

    if (!formData.password) {
      newErrors.password = "Password tidak boleh kosong";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password minimal 6 karakter";
    }

    setValidationErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

 const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const loginResult = await loginService(formData);

      if (!loginResult.data || !loginResult.data.token) {
        throw new Error(
          loginResult.message || "Token tidak ditemukan saat login."
        );
      }

      const token = loginResult.data.token;

      localStorage.setItem("token", token);

      console.log("Mencoba mengambil profil setelah login...");
      const profileResult = await getProfile();

      const userData = profileResult.data;

      if (!userData) {
        throw new Error("Data pengguna tidak ditemukan dalam respons profil.");
      }

      login(token, userData);

      console.log("Login sukses! Navigasi ke halaman dashboard.");
      navigate("/dashboard");
    } catch (err) {
      const rawErrorMessage =
        err.response?.data?.message ||
        err.message ||
        "Terjadi kesalahan yang tidak diketahui.";
      console.error(">>> DETAIL ERROR LOGIN:", err);

      let finalErrorMessage = rawErrorMessage;

      const lowerMessage = rawErrorMessage.toLowerCase();
      if (
        lowerMessage.includes("invalid") ||
        lowerMessage.includes("unauthorized") ||
        lowerMessage.includes("credentials")
      ) {
        finalErrorMessage = "Email atau password salah";
      }

      setError(finalErrorMessage);

      logout();
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="px-4 py-3 text-sm text-red-600 border border-red-200 rounded-lg bg-red-50">
            {error}
          </div>
        )}

        <div>
          <label
            htmlFor="email"
            className="block mb-2 text-sm font-medium text-main_text"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="masukkan email anda"
            className={`w-full px-4 py-3 transition-colors border rounded-xl focus:outline-none ${
              validationErrors.email
                ? "border-red-500 focus:border-red-500"
                : "border-main focus:border-green-500"
            }`}
          />
          {validationErrors.email && (
            <p className="mt-1 text-sm text-red-600">
              {validationErrors.email}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="password"
            className="block mb-2 text-sm font-medium text-main_text"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="masukkan password anda"
            className={`w-full px-4 py-3 transition-colors border rounded-xl focus:outline-none ${
              validationErrors.password
                ? "border-red-500 focus:border-red-500"
                : "border-main focus:border-green-500"
            }`}
          />
          {validationErrors.password && (
            <p className="mt-1 text-sm text-red-600">
              {validationErrors.password}
            </p>
          )}
        </div>

        <button
          type="submit"
          className="w-full px-6 py-3 mt-8 font-semibold transition-colors bg-main text-secondary_text rounded-xl hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={loading}
        >
          {loading ? (
            <span className="w-6 h-6 mx-auto animate-spin">⏳</span>
          ) : (
            "Masuk"
          )}
        </button>

        <p className="mt-6 text-center text-gray-600">
          belum memiliki akun?{" "}
          <Link
            to="/auth/register"
            className="font-medium text-blue-500 hover:text-blue-600"
          >
            daftar
          </Link>
        </p>
      </form>
    </>
  );
};

export default LoginPage;
