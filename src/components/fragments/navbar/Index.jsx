import {
  MdNotifications,
  MdChat,
  MdList,
  MdClose,
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
} from "react-icons/md";
import { Link, useLocation, useMatch } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import { useEffect, useState } from "react";
import { getProfile, getPhoto } from "../../../services/profileService";

// Images
import logoImage from "../../../assets/images/Logo.png";
import agrolinkText from "../../../assets/images/agrolink.png";

// Components
import { LinkBtn } from "../../element/button/LinkBtn";
import { ShoppingCart } from "lucide-react";

const NavBar = () => {
  const { isAuthenticated, logout } = useAuth();
  // const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [profile, setProfile] = useState(null);
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const location = useLocation();
  const isCart = useMatch("/cart") !== null;
  const isNotification = useMatch("/notifications") !== null;
  const API = import.meta.env.VITE_SERVER_DOMAIN;

//   useEffect(() => {
//   const fetchData = async () => {
//     try {
//       const token = localStorage.getItem("access_token");
//       if (!token) {
//         setLoadingProfile(false);
//         return;
//       }

//       const res = await fetch(`${API}/me`, {
//         method: "GET",
//         headers: {
//           "Content-Type": "application/json",
//           "Authorization": `Bearer ${token}`,
//         },
//       });

//       if (!res.ok) {
//         throw new Error("Gagal mengecek kredensial");
//       }

//       const data = await res.json();

//       // simpan ke state
//       setProfile(data);
//       console.log(data)
//       setIsAuthenticated(true);
//       setProfilePhoto(data.profile_picture || null);
//     } catch (e) {
//       console.error(e);
//       setProfile(null);
//       setProfilePhoto(null);
//     } finally {
//       setLoadingProfile(false);
//     }
//   };

//   fetchData();
// }, [API]);


  useEffect(() => {
    if (isAuthenticated) {
      let isMounted = true;
      setLoadingProfile(true);

      const fetchProfileData = async () => {
        try {
          const response = await getProfile();
          if (isMounted && response) {
            setProfile(response.data);

            // Get profile photo URL using getPhoto service
            if (response.data?.profile_picture) {
              const photoRes = await getPhoto(response.data.profile_picture);
              setProfilePhoto(photoRes.data?.url);
            }
          }
        } catch (error) {
          console.error("Gagal mengambil profil:", error);
          if (isMounted) {
            setProfile(null);
            setProfilePhoto(null);
          }
        } finally {
          if (isMounted) {
            setLoadingProfile(false);
          }
        }
      };

      fetchProfileData();

      return () => {
        isMounted = false;
      };
    } else {
      setProfile(null);
      setProfilePhoto(null);
      setLoadingProfile(false);
    }
  }, [isAuthenticated]);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsProfileDropdownOpen(false);
  }, [location]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isMobileMenuOpen &&
        !event.target.closest(".mobile-menu") &&
        !event.target.closest(".hamburger-btn")
      ) {
        setIsMobileMenuOpen(false);
      }
      if (isProfileDropdownOpen && !event.target.closest(".profile-dropdown")) {
        setIsProfileDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMobileMenuOpen, isProfileDropdownOpen]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  const handleLogout = () => {
    logout();
    window.location.href = "/";
  };

  const getRoleDisplayText = (role) => {
    switch (role) {
      case "farmer":
        return "PETANI";
      case "driver":
        return "EKSPEDISI";
      case "worker":
        return "PEKERJA";
      case "general":
        return "UMUM";
      default:
        return "USER";
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  const NavLinks = ({ isMobile = false, onClose }) => {
    const linkClass = isMobile
      ? "block py-4 px-6 text-lg font-medium text-gray-700 hover:text-green-600 hover:bg-green-50 transition-all duration-300 rounded-lg mx-4 text-center"
      : "hover:text-green-600 transition-colors duration-300";

    return (
      <>
        <LinkBtn
          path="/"
          exact={true}
          variant={linkClass}
          onClick={isMobile ? onClose : undefined}
        >
          Beranda
        </LinkBtn>

        {(!isAuthenticated ||
          (profile?.role !== "farmer" && !loadingProfile)) && (
          <LinkBtn
            path="/projects"
            variant={linkClass}
            onClick={isMobile ? onClose : undefined}
          >
            Lowongan Pekerjaan
          </LinkBtn>
        )}

        {(!isAuthenticated || profile?.role === "farmer" || loadingProfile) && (
          <LinkBtn
            path="/worker"
            variant={linkClass}
            onClick={isMobile ? onClose : undefined}
          >
            Pekerja
          </LinkBtn>
        )}

        {(!isAuthenticated || profile?.role === "farmer" || loadingProfile) && (
          <LinkBtn
            path="/expedition"
            variant={linkClass}
            onClick={isMobile ? onClose : undefined}
          >
            Ekspedisi
          </LinkBtn>
        )}

        <LinkBtn
          path="/product"
          exact={true}
          variant={linkClass}
          onClick={isMobile ? onClose : undefined}
        >
          Pasar
        </LinkBtn>
      </>
    );
  };

  const AuthButtons = ({ isMobile = false, onClose }) => {
    if (isAuthenticated) return null;

    const buttonClass = isMobile
      ? "flex-1 px-8 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-full font-semibold hover:from-green-600 hover:to-green-700 transition-all duration-300 text-center shadow-lg transform hover:scale-105"
      : "px-6 py-2 bg-main text-secondary_text rounded-full font-medium hover:bg-green-600 transition-colors";

    return (
      <div
        className={
          isMobile
            ? "px-6 pt-6 pb-4 flex justify-around items-center gap-4"
            : "flex gap-3 items-center"
        }
      >
        <LinkBtn
          path="/auth/login"
          variant={buttonClass}
          onClick={isMobile ? onClose : undefined}
        >
          MASUK
        </LinkBtn>
        <LinkBtn
          path="/auth/register"
          variant={
            isMobile
              ? "flex-1 px-8 py-4 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-full font-semibold hover:from-green-700 hover:to-green-800 transition-all duration-300 text-center shadow-lg transform hover:scale-105"
              : "px-6 py-2 border border-main hover:bg-main text-main hover:text-secondary_text rounded-full font-medium hover:bg-green-700 transition-colors"
          }
          onClick={isMobile ? onClose : undefined}
        >
          DAFTAR
        </LinkBtn>
      </div>
    );
  };

  const UserActions = ({ isMobile = false, onClose }) => {
    if (!isAuthenticated) return null;

    if (isMobile) {
      const [showProfileItems, setShowProfileItems] = useState(false);

      return (
        <div className="px-6 pt-6 pb-4">
          {/* Profile Info with dropdown toggle */}
          <div
            className="flex items-center justify-between px-4 py-4 transition-all duration-300 border border-gray-200 shadow-sm cursor-pointer rounded-xl bg-gradient-to-r from-gray-50 to-white hover:shadow-md"
            onClick={() => setShowProfileItems(!showProfileItems)}
          >
            <div className="flex items-center gap-4">
              <div className="relative">
                <img
                  src={profilePhoto || profile?.profile_picture}
                  alt="Profile"
                  className="object-cover border-green-200 rounded-full shadow-md w-14 h-14 border-3"
                  onError={(e) => {
                    e.target.src = '/default-avatar.png';
                  }}
                />
                <div className="absolute w-4 h-4 bg-green-500 border-2 border-white rounded-full -bottom-1 -right-1"></div>
              </div>
              <div>
                <p className="text-lg font-semibold text-gray-800 truncate">
                  {loadingProfile ? "Loading..." : profile?.name || "User"}
                </p>
                <p className="text-sm font-medium text-green-600 truncate">
                  {loadingProfile
                    ? "Loading..."
                    : getRoleDisplayText(profile?.role)}
                </p>
              </div>
            </div>
            <div className="p-2">
              {showProfileItems ? (
                <MdKeyboardArrowUp className="w-6 h-6 text-gray-600 transition-transform duration-300" />
              ) : (
                <MdKeyboardArrowDown className="w-6 h-6 text-gray-600 transition-transform duration-300" />
              )}
            </div>
          </div>

          {/* Profile dropdown items */}
          <div
            className={`overflow-hidden transition-all duration-500 ease-in-out ${
              showProfileItems ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <div className="p-4 mt-4 space-y-2 bg-white border border-gray-200 shadow-sm rounded-xl">
              <Link
                to="/profile"
                state={{ from: "/" }}
                className="flex items-center gap-3 px-4 py-3 text-gray-700 transition-all duration-300 rounded-lg hover:text-green-600 hover:bg-green-50"
                onClick={onClose}
              >
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="font-medium">Profil</span>
              </Link>
              <Link
                to="/dashboard"
                className="flex items-center gap-3 px-4 py-3 text-gray-700 transition-all duration-300 rounded-lg hover:text-green-600 hover:bg-green-50"
                onClick={onClose}
              >
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <span className="font-medium">Dashboard</span>
              </Link>
              <Link
                to="/notifications"
                className="flex items-center justify-between px-4 py-3 text-gray-700 transition-all duration-300 rounded-lg hover:text-green-600 hover:bg-green-50"
                onClick={onClose}
              >
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                  <span className="font-medium">Notifikasi</span>
                </div>
                <span className="flex items-center justify-center w-6 h-6 text-xs font-bold text-white rounded-full shadow-sm bg-gradient-to-r from-red-400 to-red-500">
                  2
                </span>
              </Link>
              {/* <Link
                to="/inbox"
                className="flex items-center gap-3 px-4 py-3 text-gray-700 transition-all duration-300 rounded-lg hover:text-green-600 hover:bg-green-50"
                onClick={onClose}
              >
                <div className="w-2 h-2 bg-indigo-400 rounded-full"></div>
                <span className="font-medium">Kotak Masuk</span>
              </Link> */}
              {/* <Link
                to="/settings"
                className="flex items-center gap-3 px-4 py-3 text-gray-700 transition-all duration-300 rounded-lg hover:text-green-600 hover:bg-green-50"
                onClick={onClose}
              >
                <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                <span className="font-medium">Pengaturan</span>
              </Link> */}
            </div>
          </div>

          {/* Logout button */}
          <div className="mt-4">
            <button
              onClick={() => {
                handleLogout();
                onClose();
              }}
              className="w-full px-6 py-4 font-semibold text-white transition-all duration-300 transform rounded-full shadow-lg bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 hover:scale-105"
            >
              Keluar
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="flex items-center gap-4">
        <Link to="/cart" className="relative cursor-pointer">
          <div className={`p-3 rounded-full ${isCart ? "bg-green-500" : "hover:bg-gray-100"}  transition-all duration-300 hover:scale-110`}>
            <ShoppingCart className={`w-6 h-6 ${isCart ? "text-white": "text-gray-600"}`} />
            <span className="absolute flex items-center justify-center w-5 h-5 text-xs font-bold text-white rounded-full shadow-md -top-1 -right-1 bg-gradient-to-r from-red-400 to-red-500">
              2
            </span>
          </div>
        </Link>

        <Link to="/notifications" className="relative cursor-pointer">
          <div className={`p-3 rounded-full ${isNotification ? "bg-green-500" : "hover:bg-gray-100"} transition-all duration-300 hover:scale-110`}>
            <MdNotifications className={`w-6 h-6 ${isNotification ? "text-white": "text-gray-600"}`} />
            <span className="absolute flex items-center justify-center w-5 h-5 text-xs font-bold text-white rounded-full shadow-md -top-1 -right-1 bg-gradient-to-r from-red-400 to-red-500">
              2
            </span>
          </div>
        </Link>

        <div className="relative profile-dropdown">
          <div
            className="flex items-center gap-2 p-2 transition-all duration-300 rounded-full cursor-pointer hover:bg-gray-50"
            onClick={toggleProfileDropdown}
          >
            <img
              src={profilePhoto || profile?.profile_picture || '/default-avatar.png'}
              alt="Profile"
              className="object-cover w-10 h-10 transition-all duration-300 border-2 border-gray-200 rounded-full shadow-md hover:border-green-400"
              onError={(e) => {
                e.target.src = '/default-avatar.png';
              }}
            />
            <div
              className={`transition-transform duration-300 ${
                isProfileDropdownOpen ? "rotate-180" : ""
              }`}
            >
              <MdKeyboardArrowDown className="w-5 h-5 text-gray-600" />
            </div>
          </div>

          <div
            className={`absolute z-40 right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 transition-all duration-300 transform ${
              isProfileDropdownOpen
                ? "opacity-100 visible translate-y-0 scale-100"
                : "opacity-0 invisible -translate-y-2 scale-95"
            }`}
          >
            <div className="py-2">
              <Link
                to="/profile"
                state={{ from: "/" }}
                className="block px-4 py-4 transition-all duration-300 border-b border-gray-100 hover:bg-green-50"
                onClick={() => setIsProfileDropdownOpen(false)}
              >
                <p className="font-semibold text-gray-800 truncate">
                  {loadingProfile ? "Loading..." : profile?.name || "User"}
                </p>
                <p className="text-sm font-medium text-green-600 truncate">
                  {loadingProfile
                    ? "Loading..."
                    : getRoleDisplayText(profile?.role)}
                </p>
              </Link>
              <Link
                to="/dashboard"
                className="flex items-center gap-3 px-4 py-3 text-gray-700 transition-all duration-300 hover:bg-green-50 hover:text-green-600"
                onClick={() => setIsProfileDropdownOpen(false)}
              >
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <span>Dashboard</span>
              </Link>
              <Link
                to="/order"
                className="flex items-center gap-3 px-4 py-3 text-gray-700 transition-all duration-300 hover:bg-green-50 hover:text-green-600"
                onClick={() => setIsProfileDropdownOpen(false)}
              >
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <span>Pesanan Saya</span>
              </Link>
              {/* <Link
                to="/inbox"
                className="flex items-center gap-3 px-4 py-3 text-gray-700 transition-all duration-300 hover:bg-green-50 hover:text-green-600"
                onClick={() => setIsProfileDropdownOpen(false)}
              >
                <div className="w-2 h-2 bg-indigo-400 rounded-full"></div>
                <span>Kotak Masuk</span>
              </Link> */}
              {/* <Link
                to="/settings"
                className="flex items-center gap-3 px-4 py-3 text-gray-700 transition-all duration-300 hover:bg-green-50 hover:text-green-600"
                onClick={() => setIsProfileDropdownOpen(false)}
              >
                <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                <span>Pengaturan</span>
              </Link> */}
              <div className="flex justify-center mt-4">
                <button
                  onClick={() => {
                    handleLogout();
                    onClose();
                  }}
                  className="w-[70%] py-2 px-4 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold rounded-full hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-lg transform hover:scale-105"
                >
                  Keluar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Main Navigation */}
      <nav className="relative z-50 flex items-center justify-between px-4 py-4 bg-white/95 backdrop-blur-md">
        {/* Logo */}
        <LinkBtn
          path="/"
          variant="flex items-center gap-2 hover:scale-105 transition-transform duration-300"
        >
          <img src={logoImage} alt="logo" className="w-8 h-8" />
          <img src={agrolinkText} alt="logo-text" className="h-4 w-28" />
        </LinkBtn>

        {/* Desktop Navigation - Centered */}
        <div className="absolute items-center justify-center hidden gap-8 font-medium text-gray-600 transform -translate-x-1/2 lg:flex left-1/2">
          <NavLinks />
        </div>

        {/* Desktop Auth/User Actions */}
        <div className="hidden lg:block">
          <AuthButtons />
          <UserActions />
        </div>

        {/* Mobile Hamburger Button */}
        <button
          className={`lg:hidden hamburger-btn p-3 rounded-full hover:bg-gray-100 transition-all duration-300 ${
            isMobileMenuOpen ? "bg-gray-100 rotate-180" : ""
          }`}
          onClick={toggleMobileMenu}
          aria-label="Toggle mobile menu"
        >
          {isMobileMenuOpen ? (
            <MdClose className="w-6 h-6 text-gray-700" />
          ) : (
            <MdList className="w-6 h-6 text-gray-700" />
          )}
        </button>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-40 lg:hidden transition-all duration-500 ${
          isMobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      >
        {/* Enhanced Blur Background */}
        <div
          className={`absolute inset-0 bg-black/20 backdrop-blur-md transition-all duration-500 ${
            isMobileMenuOpen ? "backdrop-blur-md" : "backdrop-blur-none"
          }`}
          onClick={() => setIsMobileMenuOpen(false)}
        />

        {/* Centered Menu Content */}
        <div className="flex items-center justify-center min-h-screen p-4">
          <div
            className={`mobile-menu w-full max-w-sm bg-white/95 backdrop-blur-xl shadow-2xl rounded-3xl border border-white/20 max-h-[85vh] overflow-y-auto transition-all duration-500 transform ${
              isMobileMenuOpen
                ? "scale-100 opacity-100 translate-y-0"
                : "scale-95 opacity-0 translate-y-8"
            }`}
          >
            {/* Header */}
            <div className="px-6 py-6 text-center border-b border-gray-100 bg-gradient-to-r from-green-50 to-blue-50 rounded-t-3xl">
              <div className="flex items-center justify-center gap-3 mb-2">
                <img src={logoImage} alt="logo" className="w-10 h-10" />
                <img src={agrolinkText} alt="logo-text" className="w-32 h-5" />
              </div>
            </div>

            {/* Navigation Links */}
            <div className="py-4">
              <NavLinks
                isMobile={true}
                onClose={() => setIsMobileMenuOpen(false)}
              />
            </div>

            {/* Auth Buttons or User Actions */}
            <div className="border-t border-gray-100">
              <AuthButtons
                isMobile={true}
                onClose={() => setIsMobileMenuOpen(false)}
              />
              <UserActions
                isMobile={true}
                onClose={() => setIsMobileMenuOpen(false)}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NavBar;