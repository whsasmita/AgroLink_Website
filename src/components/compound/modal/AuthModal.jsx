import { useState } from "react";
import { Link } from "react-router-dom";

const AuthModal = ({ isOpen, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);

  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={handleOverlayClick}
    >
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold text-gray-800">
            {isLogin ? "Masuk Akun" : "Daftar Akun"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          <div className="text-center mb-6">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <p className="text-gray-600 text-sm">
              Untuk menggunakan layanan ini, Anda perlu masuk atau mendaftar terlebih dahulu
            </p>
          </div>

          {/* Login/Register Toggle */}
          <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
            <button
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                isLogin
                  ? "bg-white text-gray-800 shadow-sm"
                  : "text-gray-600 hover:text-gray-800"
              }`}
              onClick={() => setIsLogin(true)}
            >
              Masuk
            </button>
            <button
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                !isLogin
                  ? "bg-white text-gray-800 shadow-sm"
                  : "text-gray-600 hover:text-gray-800"
              }`}
              onClick={() => setIsLogin(false)}
            >
              Daftar
            </button>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            {isLogin ? (
              <>
                <Link
                  to="/auth/login"
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition-colors text-center block"
                  onClick={onClose}
                >
                  Masuk ke Akun Saya
                </Link>
                <div className="text-center text-sm text-gray-600">
                  Belum punya akun?{" "}
                  <button
                    onClick={() => setIsLogin(false)}
                    className="text-green-600 hover:text-green-700 font-medium"
                  >
                    Daftar di sini
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/auth/register"
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition-colors text-center block"
                  onClick={onClose}
                >
                  Buat Akun Baru
                </Link>
                <div className="text-center text-sm text-gray-600">
                  Sudah punya akun?{" "}
                  <button
                    onClick={() => setIsLogin(true)}
                    className="text-green-600 hover:text-green-700 font-medium"
                  >
                    Masuk di sini
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Terms */}
          {/* <div className="mt-6 text-xs text-gray-500 text-center">
            Dengan melanjutkan, Anda menyetujui{" "}
            <Link to="/terms" className="text-green-600 hover:underline" onClick={onClose}>
              Syarat & Ketentuan
            </Link>{" "}
            dan{" "}
            <Link to="/privacy" className="text-green-600 hover:underline" onClick={onClose}>
              Kebijakan Privasi
            </Link>{" "}
            kami
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;