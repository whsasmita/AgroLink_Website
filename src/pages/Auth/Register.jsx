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
    
    if (!formData.name || !formData.email || !formData.password || !formData.phone_number) {
      alert("Semua field harus diisi!");
      return;
    }
    
    setLoading(true);
    
    const cleanedData = {
      ...formData,
      phone_number: formData.phone_number.replace(/[\s-]/g, '')
    };
    
    sessionStorage.setItem('registerData', JSON.stringify(cleanedData));
    console.log("Storing registration data:", cleanedData);
    
    setTimeout(() => {
      setLoading(false);
      navigate('/auth/register/role-selection');
    }, 1000);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
        {/* Name and Phone Number Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
          <div>
            <label
              htmlFor="name"
              className="block text-main_text text-sm sm:text-base font-medium mb-1 sm:mb-2"
            >
              Nama Lengkap
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Masukkan nama lengkap"
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-main rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
              required
            />
          </div>

          <div>
            <label
              htmlFor="phone_number"
              className="block text-main_text text-sm sm:text-base font-medium mb-1 sm:mb-2"
            >
              Nomor Telepon
            </label>
            <input
              type="tel"
              id="phone_number"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleChange}
              placeholder="contoh: 081234567890"
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-main rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
              required
            />
          </div>
        </div>

        {/* Email and Password Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
          <div>
            <label
              htmlFor="email"
              className="block text-main_text text-sm sm:text-base font-medium mb-1 sm:mb-2"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="contoh: user@gmail.com"
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-main rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
              required
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-main_text text-sm sm:text-base font-medium mb-1 sm:mb-2"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Masukkan password anda"
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-main rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
              required
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 sm:py-3.5 px-6 rounded-lg sm:rounded-xl font-semibold text-sm sm:text-base transition-all duration-200 mt-6 sm:mt-8 ${
            loading
              ? "bg-gray-400 text-gray-600 cursor-not-allowed"
              : "bg-main text-secondary_text hover:bg-green-600 hover:shadow-lg active:transform active:scale-[0.98]"
          }`}
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <svg
                className="animate-spin -ml-1 mr-2 sm:mr-3 h-4 w-4 sm:h-5 sm:w-5 text-current"
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
              <span>Memproses...</span>
            </div>
          ) : (
            "Selanjutnya"
          )}
        </button>

        {/* Login Link */}
        <div className="text-center mt-4 sm:mt-6">
          <p className="text-gray-600 text-sm sm:text-base">
            Sudah memiliki akun?{" "}
            <Link
              to="/auth/login"
              className="text-blue-500 hover:text-blue-600 font-medium transition-colors duration-200 hover:underline"
            >
              Masuk di sini
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default RegisterPage