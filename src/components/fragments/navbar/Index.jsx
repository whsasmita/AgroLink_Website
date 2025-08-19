import { MdNotifications, MdChat } from "react-icons/md";
import { Link } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import { useEffect, useState } from "react";
import { getProfile } from "../../../services/profileService";

// Images
import logoImage from "../../../assets/images/Logo.png";
import agrolinkText from "../../../assets/images/agrolink.png";

// Components
import { LinkBtn } from "../../element/button/LinkBtn";

const NavBar = () => {
  const { isAuthenticated, logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  useEffect(() => {
    if (isAuthenticated) {
      let isMounted = true;
      setLoadingProfile(true);

      getProfile()
        .then((response) => {
          if (isMounted && response) {
            setProfile(response.data);
          }
        })
        .catch((error) => {
          console.error("Gagal mengambil profil:", error);
          if (isMounted) {
            setProfile(null);
          }
        })
        .finally(() => {
          if (isMounted) {
            setLoadingProfile(false);
          }
        });

      return () => {
        isMounted = false;
      };
    } else {
      setProfile(null);
      setLoadingProfile(false);
    }
  }, [isAuthenticated]);

  const handleLogout = () => {
    logout();
    window.location.href = "/";
  };

  return (
    <nav className="flex justify-between items-center pt-4 px-4">
      <div className="flex items-center gap-2">
        <img src={logoImage} alt="logo" className="w-8 h-8" />
        <img src={agrolinkText} alt="logo-text" className="w-28 h-4" />
      </div>

      <div className="flex gap-8 items-center text-gray-600 font-medium">
        <LinkBtn path="/" variant="hover:text-green-600 transition-colors">
          Beranda
        </LinkBtn>
        <LinkBtn
          path="/farmer"
          variant="hover:text-green-600 transition-colors"
        >
          Petani
        </LinkBtn>
        <LinkBtn
          path="/worker"
          variant="hover:text-green-600 transition-colors"
        >
          Pekerja
        </LinkBtn>
        <LinkBtn
          path="/expedition"
          variant="hover:text-green-600 transition-colors"
        >
          Ekspedisi
        </LinkBtn>
      </div>

      {!isAuthenticated ? (
        <div className="flex gap-3 items-center">
          <LinkBtn
            path="/auth/login"
            variant="px-6 py-2 bg-main text-secondary_text rounded-full font-medium hover:bg-green-600 transition-colors"
          >
            MASUK
          </LinkBtn>
          <LinkBtn
            path="/auth/register"
            variant="px-6 py-2 bg-main text-secondary_text rounded-full font-medium hover:bg-green-700 transition-colors"
          >
            DAFTAR
          </LinkBtn>
        </div>
      ) : (
        <div className="flex gap-4 items-center">
          <div className="relative cursor-pointer">
            <div className="p-2 rounded-full hover:bg-gray-100 transition-colors">
              <MdNotifications className="w-6 h-6 text-gray-600" />
              <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                2
              </span>
            </div>
          </div>

          <div className="relative cursor-pointer">
            <div className="p-2 rounded-full hover:bg-gray-100 transition-colors">
              <MdChat className="w-6 h-6 text-gray-600" />
              <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                2
              </span>
            </div>
          </div>

          <div className="relative group">
            <div className="flex items-center cursor-pointer">
              <img
                src={
                  profile?.profile_picture || "https://via.placeholder.com/40"
                }
                alt="Profile"
                className="w-10 h-10 rounded-full border-2 border-gray-200 hover:border-green-400 transition-colors"
              />
            </div>

            <div className="absolute z-40 right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
              <div className="py-2">
                <Link
                  to="/profile"
                  className="block px-4 py-3 border-b border-gray-100 hover:bg-select transition-colors"
                >
                  <p className="font-medium text-gray-800 truncate">
                    {" "}
                    {loadingProfile ? "Loading..." : profile?.name || "User"}
                  </p>
                  <p className="text-sm text-main_text truncate">
                    {" "}
                    {loadingProfile
                      ? "Loading..."
                      : profile?.email || "user@example.com"}
                  </p>
                </Link>
                <Link
                  to="/dashboard"
                  className="block w-full text-left px-4 py-2 hover:bg-select text-main_text transition-colors"
                >
                  Dashboard
                </Link>
                <Link
                  to="/offers"
                  className="block w-full text-left px-4 py-2 hover:bg-select text-main_text transition-colors"
                >
                  Tawaran
                </Link>
                <Link
                  to="/history"
                  className="block w-full text-left px-4 py-2 hover:bg-select text-main_text transition-colors"
                >
                  Riwayat
                </Link>
                <Link
                  to="/settings"
                  className="block w-full text-left px-4 py-2 hover:bg-select text-main_text transition-colors"
                >
                  Pengaturan
                </Link>
                <hr className="my-1" />
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-600 transition-colors"
                >
                  Keluar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
