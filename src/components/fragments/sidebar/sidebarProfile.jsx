import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { getProfile } from "../../../services/profileService";
import {
  MdMenu,
  MdClose,
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
  MdPerson,
  MdSettings,
} from "react-icons/md";

// Skeleton Components
const SkeletonMenuItem = () => (
  <div className="px-6 py-4">
    <div className="flex items-center gap-3">
      <div className="w-5 h-5 bg-gray-200 rounded animate-pulse"></div>
      <div className="w-20 h-4 bg-gray-200 rounded animate-pulse"></div>
    </div>
  </div>
);

const SidebarSkeleton = () => (
  <div className="w-full lg:w-80 h-full">
    <div className="w-full h-full bg-white border border-gray-200 rounded-lg overflow-hidden">
      <div className="border-t border-gray-200">
        {[...Array(2)].map((_, index) => (
          <div key={index}>
            <SkeletonMenuItem />
            {index < 1 && <div className="border-b border-gray-200" />}
          </div>
        ))}
      </div>
    </div>
  </div>
);

const SidebarProfile = () => {
  const location = useLocation();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const res = await getProfile();
        setProfile(res.data);
      } catch {
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isMobileMenuOpen &&
        !event.target.closest(".mobile-sidebar") &&
        !event.target.closest(".sidebar-toggle-btn")
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMobileMenuOpen]);

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

  let menuItems = [
    {
      id: "biography",
      label: "Biodata",
      path: "/profile/biography",
      icon: MdPerson,
    },
    {
      id: "account",
      label: "Akun",
      path: "/profile/account",
      icon: MdSettings,
    },
  ];

  const getActiveMenu = () => {
    const currentPath = location.pathname;
    const activeItem = menuItems.find((item) =>
      currentPath.startsWith(item.path)
    );
    return activeItem ? activeItem.id : "biography";
  };

  const activeMenu = getActiveMenu();
  const activeMenuItem = menuItems.find((item) => item.id === activeMenu);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  if (loading) {
    return <SidebarSkeleton />;
  }

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-80 h-full">
        <div className="w-full h-full bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
          <div className="border-t border-gray-200">
            {menuItems.map((item, index) => {
              const IconComponent = item.icon;
              return (
                <div key={item.id}>
                  <Link
                    to={item.path}
                    className={`flex items-center gap-3 w-full px-6 py-4 text-left font-medium transition-all duration-200 ${
                      activeMenu === item.id
                        ? "bg-main text-white shadow-md"
                        : "text-gray-700 hover:bg-gray-50 hover:text-main"
                    }`}
                  >
                    <IconComponent
                      className={`w-5 h-5 ${
                        activeMenu === item.id ? "text-white" : "text-gray-500"
                      }`}
                    />
                    {item.label}
                  </Link>
                  {index < menuItems.length - 1 && (
                    <div className="border-b border-gray-200" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Toggle Button */}
      <div className="lg:hidden mb-4">
        <button
          className={`sidebar-toggle-btn w-full flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg shadow-sm transition-all duration-300 hover:shadow-md ${
            isMobileMenuOpen ? "bg-gray-50" : ""
          }`}
          onClick={toggleMobileMenu}
          aria-label="Toggle profile menu"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-main/10 rounded-full">
              {activeMenuItem && (
                <activeMenuItem.icon className="w-5 h-5 text-main" />
              )}
            </div>
            <div>
              <p className="font-semibold text-gray-800 text-left">
                {activeMenuItem?.label || "Menu Profil"}
              </p>
              <p className="text-sm text-gray-600 text-left">
                Pilih menu profil
              </p>
            </div>
          </div>
          <div
            className={`transition-transform duration-300 ${
              isMobileMenuOpen ? "rotate-180" : ""
            }`}
          >
            {isMobileMenuOpen ? (
              <MdKeyboardArrowUp className="w-6 h-6 text-gray-600" />
            ) : (
              <MdKeyboardArrowDown className="w-6 h-6 text-gray-600" />
            )}
          </div>
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-50 lg:hidden transition-all duration-500 ${
          isMobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      >
        {/* Background Blur */}
        <div
          className={`absolute inset-0 bg-black/20 backdrop-blur-md transition-all duration-500 ${
            isMobileMenuOpen ? "backdrop-blur-md" : "backdrop-blur-none"
          }`}
          onClick={() => setIsMobileMenuOpen(false)}
        />

        {/* Mobile Menu Content */}
        <div className="flex items-center justify-center min-h-screen p-4">
          <div
            className={`mobile-sidebar w-full max-w-sm bg-white/95 backdrop-blur-xl shadow-2xl rounded-3xl border border-white/20 transition-all duration-500 transform ${
              isMobileMenuOpen
                ? "scale-100 opacity-100 translate-y-0"
                : "scale-95 opacity-0 translate-y-8"
            }`}
          >
            {/* Header */}
            <div className="text-center py-6 px-6 border-b border-gray-100 bg-gradient-to-r from-green-50 to-blue-50 rounded-t-3xl">
              <h3 className="text-xl font-bold text-gray-800 mb-1">
                Menu Profil
              </h3>
              <p className="text-gray-600 text-sm font-medium">
                Kelola informasi profil Anda
              </p>
            </div>

            {/* Menu Items */}
            <div className="py-4">
              {menuItems.map((item, index) => {
                const IconComponent = item.icon;
                return (
                  <div key={item.id}>
                    <Link
                      to={item.path}
                      className={`flex items-center gap-4 mx-4 py-4 px-6 text-lg font-medium transition-all duration-300 rounded-lg ${
                        activeMenu === item.id
                          ? "bg-gradient-to-r from-main to-green-600 text-white shadow-lg"
                          : "text-gray-700 hover:text-green-600 hover:bg-green-50"
                      }`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <IconComponent
                        className={`w-6 h-6 ${
                          activeMenu === item.id
                            ? "text-white"
                            : "text-gray-500"
                        }`}
                      />
                      <span>{item.label}</span>
                      {activeMenu === item.id && (
                        <div className="ml-auto">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                      )}
                    </Link>
                  </div>
                );
              })}
            </div>

            {/* Close Button */}
            <div className="px-6 pb-6">
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full py-3 px-4 bg-gradient-to-r from-gray-500 to-gray-600 text-white font-semibold rounded-full hover:from-gray-600 hover:to-gray-700 transition-all duration-300 shadow-lg transform hover:scale-105"
              >
                Tutup Menu
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SidebarProfile;