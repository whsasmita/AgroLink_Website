import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const API = import.meta.env.VITE_SERVER_DOMAIN;

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");


  useEffect(() => {
    console.log("Email: ", email)
    console.log("Password: ", password)
  }, [email, password])

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);

    try {
      const res = await fetch(`${API}/login`, {
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          email, password
        }),
      });

      if (!res.ok) {
        const dataError = await res.json();
        console.log(dataError.message)
        setError(dataError.message)
        throw new Error("Login gagal");
      }

      const data = await res.json();
      localStorage.setItem("access_token", data.access_token)
      window.location.reload();
      console.log(data);
    } catch (err) {
      console.log(err)
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
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
          {loading ? <span className="w-6 h-6 mx-auto animate-spin">⏳</span> : "Masuk"}
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
