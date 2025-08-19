import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Loading from "../../components/fragments/loading/Index";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone_number: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.name || !formData.email || !formData.password || !formData.phone_number) {
      alert("Semua field harus diisi!");
      return;
    }
    
    setLoading(true);
    
    // Clean phone number (remove spaces, hyphens)
    const cleanedData = {
      ...formData,
      phone_number: formData.phone_number.replace(/[\s-]/g, '')
    };
    
    // Store form data in sessionStorage
    sessionStorage.setItem('registerData', JSON.stringify(cleanedData));
    console.log("Storing registration data:", cleanedData);
    
    // Simulate delay for loading animation
    setTimeout(() => {
      setLoading(false);
      // Navigate to role selection page
      navigate('/auth/register/role-selection');
    }, 1000);
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="name"
              className="block text-main_text text-sm font-medium mb-2"
            >
              nama
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="masukkan nama lengkap"
              className="w-full px-4 py-3 border border-main rounded-xl focus:outline-none focus:border-green-500 transition-colors"
              required
            />
          </div>

          <div>
            <label
              htmlFor="phone_number"
              className="block text-main_text text-sm font-medium mb-2"
            >
              nomor telepon
            </label>
            <input
              type="tel"
              id="phone_number"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleChange}
              placeholder="contoh: 081234567890"
              className="w-full px-4 py-3 border border-main rounded-xl focus:outline-none focus:border-green-500 transition-colors"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              placeholder="contoh: user@gmail.com"
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
        </div>

        <button
          type="submit"
          className="w-full bg-main text-secondary_text py-3 px-6 rounded-xl font-semibold hover:bg-green-600 transition-colors mt-8"
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Memproses...
            </div>
          ) : (
            "Selanjutnya"
          )}
        </button>

        <p className="text-center text-gray-600 mt-6">
          sudah memiliki akun?{" "}
          <Link
            to="/auth/login"
            className="text-blue-500 hover:text-blue-600 font-medium"
          >
            masuk
          </Link>
        </p>
      </form>
    </>
  );
};

export default RegisterPage;