import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { register } from "../../services/authService";

// Images
import WorkerImg from "../../assets/images/worker.png";
import FarmerImg from "../../assets/images/farmer.png";
import ExpeditionImg from "../../assets/images/expedition.png";

const RoleSelectionPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [selectedRole, setSelectedRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    const storedData = sessionStorage.getItem('registerData');
    if (!storedData) {
      navigate('/auth/register');
      return;
    }
    setFormData(JSON.parse(storedData));
  }, [navigate]);

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
  };

  const handleFinalSubmit = async () => {
    if (!selectedRole || !formData) return;

    setLoading(true);
    setError("");
    setSuccess(false);
    
    try {
      const finalData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone_number: formData.phone_number,
        role: selectedRole
      };
      
      console.log("Sending registration data:", finalData);
      
      const result = await register(finalData);
      console.log("Register result:", result);
      
      if (result.data && result.data.token) {
        login(result.data.token, result.data.user);
        sessionStorage.removeItem('registerData');
        navigate("/");
      } else if (result.token) {
        login(result.token, result.user);
        sessionStorage.removeItem('registerData');
        navigate("/");
      } else {
        setSuccess(true);
      }
    } catch (err) {
      console.error("Registration error:", err);
      console.error("Error message:", err.message);
      
      let errorMessage = "Terjadi kesalahan saat registrasi";
      
      if (err.message) {
        errorMessage = err.message;
      }
      
      if (err.message.includes('fetch')) {
        errorMessage = "Koneksi ke server gagal. Pastikan server berjalan.";
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleGoBack = () => {
    navigate('/auth/register');
  };

  if (!formData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-main mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-6xl w-full">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-main mb-6 tracking-wide">
            PILIH PERAN ANDA
          </h1>
          <p className="text-xl text-gray-600 mb-4">
            Bergabunglah dengan komunitas yang sesuai dengan kebutuhan Anda
          </p>
          <div className="w-32 h-1 bg-main mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-16">
          <div className="flex flex-col items-center text-center group">
            <div
              className={`relative border-4 rounded-3xl p-12 cursor-pointer transition-all duration-300 transform hover:scale-105 hover:shadow-2xl ${
                selectedRole === "worker"
                  ? "border-main bg-green-50 shadow-2xl scale-105 ring-8 ring-main/20"
                  : "border-gray-300 hover:border-gray-400 bg-white"
              }`}
              onClick={() => handleRoleSelect("worker")}
            >
              <div className="w-40 h-40 mx-auto mb-6 relative">
                <img
                  src={WorkerImg}
                  alt="Worker"
                  className="w-full h-full object-contain"
                />
              </div>
              {selectedRole === "worker" && (
                <div className="absolute top-6 right-6">
                  <div className="w-12 h-12 bg-main rounded-full flex items-center justify-center shadow-lg">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
              )}
            </div>
            <h3
              className={`text-2xl font-bold mt-6 transition-colors ${
                selectedRole === "worker"
                  ? "text-main"
                  : "text-gray-700 group-hover:text-main"
              }`}
            >
              PEKERJA
            </h3>
            <p className="text-gray-500 mt-2 text-lg">
              Cari pekerjaan sesuai keahlian Anda
            </p>
            <ul className="text-sm text-gray-600 mt-4 space-y-1">
              <li>• Akses ke berbagai lowongan kerja</li>
              <li>• Profile keahlian personal</li>
              <li>• Sistem rating dan review</li>
            </ul>
          </div>

          <div className="flex flex-col items-center text-center group">
            <div
              className={`relative border-4 rounded-3xl p-12 cursor-pointer transition-all duration-300 transform hover:scale-105 hover:shadow-2xl ${
                selectedRole === "farmer"
                  ? "border-main bg-green-50 shadow-2xl scale-105 ring-8 ring-main/20"
                  : "border-gray-300 hover:border-gray-400 bg-white"
              }`}
              onClick={() => handleRoleSelect("farmer")}
            >
              <div className="w-40 h-40 mx-auto mb-6 relative">
                <img
                  src={FarmerImg}
                  alt="Farmer"
                  className="w-full h-full object-contain"
                />
              </div>
              {selectedRole === "farmer" && (
                <div className="absolute top-6 right-6">
                  <div className="w-12 h-12 bg-main rounded-full flex items-center justify-center shadow-lg">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
              )}
            </div>
            <h3
              className={`text-2xl font-bold mt-6 transition-colors ${
                selectedRole === "farmer"
                  ? "text-main"
                  : "text-gray-700 group-hover:text-main"
              }`}
            >
              PETANI
            </h3>
            <p className="text-gray-500 mt-2 text-lg">
              Kelola dan jual hasil pertanian Anda
            </p>
            <ul className="text-sm text-gray-600 mt-4 space-y-1">
              <li>• Manajemen produk pertanian</li>
              <li>• Marketplace hasil tani</li>
              <li>• Tracking penjualan</li>
            </ul>
          </div>

          <div className="flex flex-col items-center text-center group">
            <div
              className={`relative border-4 rounded-3xl p-12 cursor-pointer transition-all duration-300 transform hover:scale-105 hover:shadow-2xl ${
                selectedRole === "expedition"
                  ? "border-main bg-green-50 shadow-2xl scale-105 ring-8 ring-main/20"
                  : "border-gray-300 hover:border-gray-400 bg-white"
              }`}
              onClick={() => handleRoleSelect("driver")}
            >
              <div className="w-40 h-40 mx-auto mb-6 relative">
                <img
                  src={ExpeditionImg}
                  alt="Ekspedisi"
                  className="w-full h-full object-contain"
                />
              </div>
              {selectedRole === "driver" && (
                <div className="absolute top-6 right-6">
                  <div className="w-12 h-12 bg-main rounded-full flex items-center justify-center shadow-lg">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
              )}
            </div>
            <h3
              className={`text-2xl font-bold mt-6 transition-colors ${
                selectedRole === "driver"
                  ? "text-main"
                  : "text-gray-700 group-hover:text-main"
              }`}
            >
              EKSPEDISI
            </h3>
            <p className="text-gray-500 mt-2 text-lg">
              Layanan pengiriman terpercaya
            </p>
            <ul className="text-sm text-gray-600 mt-4 space-y-1">
              <li>• Manajemen pengiriman</li>
              <li>• Tracking real-time</li>
              <li>• Jaringan distribusi luas</li>
            </ul>
          </div>
        </div>

        {error && (
          <div className="max-w-2xl mx-auto mb-8">
            <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-r-lg shadow-md">
              <div className="flex items-center">
                <svg
                  className="w-6 h-6 text-red-500 mr-3"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-red-700 font-medium text-lg">{error}</span>
              </div>
            </div>
          </div>
        )}

        {success && (
          <div className="max-w-2xl mx-auto mb-8">
            <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded-r-lg shadow-md">
              <div className="flex items-center">
                <svg
                  className="w-6 h-6 text-green-500 mr-3"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-green-700 font-medium text-lg">
                  Registrasi berhasil! Silakan lanjutkan.
                </span>
              </div>
            </div>
          </div>
        )}

        <div className="flex gap-8 max-w-2xl mx-auto">
          <button
            onClick={handleGoBack}
            className="flex-1 bg-gray-200 text-gray-700 py-4 px-8 rounded-2xl font-bold hover:bg-gray-300 transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg text-lg"
          >
            Kembali
          </button>
          <button
            onClick={handleFinalSubmit}
            disabled={!selectedRole || loading}
            className={`flex-1 py-4 px-8 rounded-2xl font-bold transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg text-lg ${
              selectedRole && !loading
                ? "bg-main text-white hover:bg-green-600 hover:shadow-xl"
                : "bg-gray-300 text-gray-500 cursor-not-allowed transform-none hover:scale-100"
            }`}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-6 w-6 text-current"
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
              "Daftar Sekarang"
            )}
          </button>
        </div>

        {selectedRole && (
          <div className="text-center mt-12">
            <p className="text-gray-600 text-lg">
              Selamat datang! Anda akan bergabung sebagai{" "}
              <span className="font-bold text-main">
                {selectedRole === "worker" && "PEKERJA"}
                {selectedRole === "farmer" && "PETANI"}
                {selectedRole === "driver" && "EKSPEDISI"}
              </span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoleSelectionPage;