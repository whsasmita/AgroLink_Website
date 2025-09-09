import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { login as loginService } from "../../services/authService";
import { getProfile } from "../../services/profileService";
import Loading from "../../components/fragments/loading/Index";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const loginResult = await loginService(formData);

      if (!loginResult.data || !loginResult.data.token) {
        throw new Error(
          loginResult.message || "Token tidak ditemukan saat login."
        );
      }

      const token = loginResult.data.token;

      login(token, null);

      console.log("Mencoba mengambil profil setelah login...");
      const profileResult = await getProfile();

      const userData = profileResult.data;

      if (!userData) {
        throw new Error("Data pengguna tidak ditemukan dalam respons profil.");
      }

      login(token, userData);

      console.log("Login sukses! Navigasi ke halaman utama.");
      navigate("/");
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Terjadi kesalahan yang tidak diketahui.";
      console.error(">>> DETAIL ERROR LOGIN:", err);
      setError(errorMessage);

      logout();
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div>
          <label
            htmlFor="email"
            className="block text-main_text text-sm font-medium mb-2"
          >
            email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="masukkan email anda"
            className="w-full px-4 py-3 border border-main rounded-xl focus:outline-none focus:border-green-500 transition-colors"
            required
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-main_text text-sm font-medium mb-2"
          >
            password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="masukkan password anda"
            className="w-full px-4 py-3 border border-main rounded-xl focus:outline-none focus:border-green-500 transition-colors"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-main text-secondary_text py-3 px-6 rounded-xl font-semibold hover:bg-green-600 transition-colors mt-8 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={loading}
        >
          {loading ? <Loading className="w-6 h-6 mx-auto" /> : "Masuk"}
        </button>

        <p className="text-center text-gray-600 mt-6">
          belum memiliki akun?{" "}
          <Link
            to="/auth/register"
            className="text-blue-500 hover:text-blue-600 font-medium"
          >
            daftar
          </Link>
        </p>
      </form>
    </>
  );
};

export default LoginPage;
