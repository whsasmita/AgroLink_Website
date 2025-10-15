import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Loading from "../../components/fragments/loading/Index";
import { useAuth } from "../../contexts/AuthContext";
import { register } from "../../services/authService";

// Modal Component For Register Page
const ConfirmationModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300 bg-black bg-opacity-60">
      <div className="w-full max-w-sm p-8 m-4 transition-all duration-300 transform scale-100 bg-white shadow-2xl rounded-2xl">
        <div className="text-center">
            {/* Ikon Centang Modern */}
            <div className="flex items-center justify-center w-16 h-16 mx-auto mb-5 bg-green-100 rounded-full">
                <svg className="w-8 h-8 text-main" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
            </div>
          <h3 className="text-2xl font-bold text-gray-800">Daftar Sebagai Mitra?</h3>
          <p className="mt-3 text-base text-gray-600">
            Anda bisa mendaftar menjadi Petani, Pekerja, dan Ekspedisi.
          </p>
        </div>
        <div className="flex flex-col gap-3 mt-8 sm:flex-row-reverse">
          <button
            onClick={onConfirm}
            className="w-full sm:w-auto flex-1 bg-main text-secondary_text font-semibold py-3 px-6 rounded-xl hover:bg-green-600 transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
          >
            Ya
          </button>
          <button
            onClick={onClose}
            className="flex-1 w-full px-6 py-3 font-semibold text-gray-700 transition-all duration-200 bg-gray-200 sm:w-auto rounded-xl hover:bg-gray-300"
          >
            Tidak
          </button>
        </div>
      </div>
    </div>
  );
};


const RegisterPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone_number: "",
  });

  const [error, setError] = useState("");
  const { login } = useAuth();

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
    
    setError("");
    
    setLoading(true);
    
    const cleanedData = {
      ...formData,
      phone_number: formData.phone_number.replace(/[\s-]/g, '')
    };
    
    sessionStorage.setItem('registerData', JSON.stringify(cleanedData));
    console.log("Storing registration data:", cleanedData);
    
    // Open Modal
    setIsModalOpen(true);

  };
  
// Function for user click yes in the modal
const handleConfirm = () => {
  setIsModalOpen(false);
  
  setTimeout(() => {
    setLoading(false);
    navigate('/auth/register/role-selection');
  }, 1000);
}

// Function for user click no in the modal
const handleClose = async () => {
    const storedDataString = sessionStorage.getItem('registerData');
    if (!storedDataString) {
        setError("Data registrasi tidak ditemukan. Silakan coba lagi.");
        setLoading(false);
        setIsModalOpen(false);
        return;
    }
    
    const finalData = {
        ...JSON.parse(storedDataString),
        role: 'general'
    };

    console.log("Attempting to register with general role:", finalData);
    
    try {
        const result = await register(finalData);
        console.log("Register result:", result);

        if (result.data && result.data.token) {
            login(result.data.token, result.data.user);
            sessionStorage.removeItem('registerData');
            navigate("/dashboard");
        } else {
            setError(result.message || "Registrasi gagal, tidak menerima token.");
        }

    } catch (err) {
        console.error("Registration error:", err);
        setError(err.message || "Terjadi kesalahan saat registrasi.");
    } finally {
        setLoading(false);
        setIsModalOpen(false);
    }
  }

  return (
    <div className="w-full max-w-4xl px-4 mx-auto sm:px-6 lg:px-8">
      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
        {/* Name and Phone Number Row */}
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-2 sm:gap-4">
          <div>
            <label
              htmlFor="name"
              className="block mb-1 text-sm font-medium text-main_text sm:text-base sm:mb-2"
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
              className="block mb-1 text-sm font-medium text-main_text sm:text-base sm:mb-2"
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
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-2 sm:gap-4">
          <div>
            <label
              htmlFor="email"
              className="block mb-1 text-sm font-medium text-main_text sm:text-base sm:mb-2"
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
              className="block mb-1 text-sm font-medium text-main_text sm:text-base sm:mb-2"
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

        {/* Menampilkan Pesan Error Jika Ada */}
        {error && (
            <div className="p-4 mt-4 text-sm text-red-800 bg-red-100 border border-red-200 rounded-lg">
                {error}
            </div>
        )}

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
                className="w-4 h-4 mr-2 -ml-1 text-current animate-spin sm:mr-3 sm:h-5 sm:w-5"
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
        <div className="mt-4 text-center sm:mt-6">
          <p className="text-sm text-gray-600 sm:text-base">
            Sudah memiliki akun?{" "}
            <Link
              to="/auth/login"
              className="font-medium text-blue-500 transition-colors duration-200 hover:text-blue-600 hover:underline"
            >
              Masuk di sini
            </Link>
          </p>
        </div>
      </form>

      {/* Render Modal */}
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={handleClose}
        onConfirm={handleConfirm}
      />
    </div>
  );
};

export default RegisterPage