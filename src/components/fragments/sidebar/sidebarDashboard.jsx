import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { getProfile, getPhoto } from "../../../services/profileService";
import {
  MdArrowBackIos,
  MdDashboard,
  MdWork,
  MdRateReview,
  MdLandscape,
  MdPeople,
  MdHome,
  MdNotifications,
  MdInbox,
  MdLogout,
  MdHistory,
  MdTask,
} from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import { LucideSquareSplitHorizontal } from "lucide-react";
import Logo from "../../../assets/images/Logo.png";
import LogoText from "../../../assets/images/agrolink.png";
import { useAuth } from "../../../contexts/AuthContext";

// Skeleton Components
const SkeletonMenuItem = ({ isCollapsed }) => (
  <div
    className={`group flex items-center gap-3 ${
      isCollapsed ? "px-2 py-2 justify-center" : "px-3 py-3"
    } rounded-xl`}
  >
    <div
      className={`${
        isCollapsed ? "w-6 h-6" : "w-5 h-5"
      } bg-gray-200 rounded animate-pulse`}
    ></div>
    {!isCollapsed && (
      <div className="w-20 h-4 bg-gray-200 rounded animate-pulse"></div>
    )}
  </div>
);

const SkeletonMenuSection = ({
  title,
  itemCount = 3,
  isCollapsed,
  className = "",
}) => (
  <div className={`${className}`}>
    {!isCollapsed && (
      <div className="px-6 py-3 mb-2">
        <div className="w-24 h-3 bg-gray-200 rounded animate-pulse"></div>
      </div>
    )}
    <div className={`space-y-1 ${isCollapsed ? "px-2" : "px-3"}`}>
      {[...Array(itemCount)].map((_, index) => (
        <SkeletonMenuItem key={index} isCollapsed={isCollapsed} />
      ))}
    </div>
  </div>
);

const SkeletonProfile = ({ isCollapsed }) => (
  <div className={`${isCollapsed ? "p-2" : "p-4"}`}>
    {isCollapsed ? (
      <div className="flex justify-center">
        <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
      </div>
    ) : (
      <div className="w-full p-4 bg-gradient-to-r from-gray-50 to-gray-100/50 rounded-2xl flex items-center justify-between border border-gray-200/50">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 bg-gray-200 rounded-full animate-pulse"></div>
          <div className="text-left">
            <div className="w-24 h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
            <div className="w-16 h-3 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
        <div className="p-2 rounded-xl bg-white/50">
          <div className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>
    )}
  </div>
);

const SidebarSkeleton = ({ isCollapsed }) => (
  <div
    className={`${
      isCollapsed ? "w-20" : "w-80"
    } h-full flex flex-col transition-all duration-300`}
  >
    <div className="w-full h-full bg-white/80 overflow-hidden flex flex-col shadow-xl">
      {/* Fixed Header Skeleton */}
      <div className="flex-shrink-0 py-5 px-6">
        <div className="flex justify-between items-center gap-3">
          {isCollapsed ? (
            <div className="flex justify-center w-full">
              <div className="w-10 h-10 bg-gray-200 rounded-xl animate-pulse"></div>
            </div>
          ) : (
            <>
              <div className="flex gap-2 items-center">
                <div className="h-10 w-10 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
              </div>
              <div className="w-10 h-10 bg-gray-200 rounded-xl animate-pulse"></div>
            </>
          )}
        </div>
      </div>

      {/* Scrollable Content Area Skeleton */}
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400">
        {/* Menu Utama Skeleton */}
        <SkeletonMenuSection
          title="Menu Utama"
          itemCount={4}
          isCollapsed={isCollapsed}
        />

        {/* Menu Farmer Skeleton */}
        <SkeletonMenuSection
          title="Kelola Pertanian"
          itemCount={2}
          isCollapsed={isCollapsed}
          className="mt-6"
        />

        {/* Menu Lainnya Skeleton */}
        <SkeletonMenuSection
          title="Lainnya"
          itemCount={3}
          isCollapsed={isCollapsed}
          className="mt-6"
        />
      </div>

      {/* Fixed Profile Section Skeleton */}
      <div className="flex-shrink-0 relative">
        <SkeletonProfile isCollapsed={isCollapsed} />
      </div>
    </div>
  </div>
);

const SidebarDashboard = () => {
  const { isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const [profile, setProfile] = useState(null);
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [loading, setLoadingProfile] = useState(true);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

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

  // Menu utama untuk semua role
  let menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      path: "/dashboard",
      icon: MdDashboard,
    },
    {
      id: "history",
      label: "Riwayat Transaksi",
      path: "/dashboard/history",
      icon: MdHistory,
    },
    {
      id: "review",
      label: "Ulasan",
      path: "/dashboard/review",
      icon: MdRateReview,
    },
  ];

  // Menu khusus untuk farmer
  let menuItemsFarmer = [
    // {
    //   id: "agricultural-land",
    //   label: "Lahan Pertanian",
    //   path: "/dashboard/agricultural-land",
    //   icon: MdLandscape,
    // },
    {
      id: "projects",
      label: "Proyek",
      path: "/dashboard/projects",
      icon: MdWork,
    },
    {
      id: "worker",
      label: "Daftar Pekerja",
      path: "/dashboard/worker-list",
      icon: MdPeople,
    },
  ];

  // Menu khusus untuk role selain farmer
  let menuItemsExceptFarmer = [
    {
      id: "my-jobs",
      label: "Daftar Pekerjaan",
      path: "/dashboard/my-jobs",
      icon: MdWork,
    },
  ];

  // Menu lainnya
  let otherMenuItems = [
    {
      id: "home",
      label: "Halaman Utama",
      path: "/",
      icon: MdHome,
    },
    {
      id: "notification",
      label: "Notifikasi",
      path: "/notification",
      icon: MdNotifications,
    },
    {
      id: "inbox",
      label: "Kotak Masuk",
      path: "/inbox",
      icon: MdInbox,
    },
  ];

  const getActiveMenu = () => {
    const currentPath = location.pathname;

    // Check main menu items
    const activeMainItem = menuItems.find(
      (item) =>
        currentPath === item.path ||
        (item.path !== "/dashboard" && currentPath.startsWith(item.path))
    );
    if (activeMainItem) return activeMainItem.id;

    // Check farmer menu items
    const activeFarmerItem = menuItemsFarmer.find(
      (item) => currentPath === item.path || currentPath.startsWith(item.path)
    );
    if (activeFarmerItem) return activeFarmerItem.id;

    // Check except farmer menu items
    const activeExceptFarmerItem = menuItemsExceptFarmer.find(
      (item) => currentPath === item.path || currentPath.startsWith(item.path)
    );
    if (activeExceptFarmerItem) return activeExceptFarmerItem.id;

    // Check other menu items
    const activeOtherItem = otherMenuItems.find(
      (item) => currentPath === item.path || currentPath.startsWith(item.path)
    );
    if (activeOtherItem) return activeOtherItem.id;

    return "dashboard";
  };

  const activeMenu = getActiveMenu();
  const isFarmer = profile?.role === "farmer";
  const exceptFarmer = profile && profile.role !== "farmer";

  const toggleProfileDropdown = () => {
    if (!isCollapsed) {
      setIsProfileDropdownOpen(!isProfileDropdownOpen);
    }
  };

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
    // Close profile dropdown when collapsing
    if (!isCollapsed) {
      setIsProfileDropdownOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    window.location.href = "/";
  };

  // Function to get role label in Indonesian
  const getRoleLabel = (role) => {
    switch (role) {
      case "farmer":
        return "PETANI";
      case "driver":
        return "EKSPEDISI";
      case "worker":
        return "PEKERJA";
      default:
        return role?.toUpperCase() || "UNKNOWN";
    }
  };

  const MenuSection = ({ title, items, className = "" }) => (
    <div className={`${className}`}>
      {!isCollapsed && (
        <div className="px-6 py-3 mb-2">
          <h2 className="text-xs font-medium text-gray-400 uppercase tracking-wider">
            {title}
          </h2>
        </div>
      )}
      <div className={`space-y-1 ${isCollapsed ? "px-2" : "px-3"}`}>
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.id}
              to={item.path}
              className={`group flex items-center gap-3 ${
                isCollapsed ? "px-2 py-2 justify-center" : "px-3 py-3"
              } rounded-xl font-medium transition-all duration-300 ${
                activeMenu === item.id
                  ? "bg-gradient-to-r from-main to-secondary text-white shadow-lg transform scale-[1.02]"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50 hover:scale-[1.01]"
              }`}
              title={isCollapsed ? item.label : undefined}
            >
              <Icon
                className={`${
                  isCollapsed ? "w-6 h-6" : "w-5 h-5"
                } transition-colors duration-300 ${
                  activeMenu === item.id
                    ? "text-white"
                    : "text-gray-400 group-hover:text-gray-600"
                }`}
              />
              {!isCollapsed && (
                <>
                  <span className="text-sm">{item.label}</span>
                  {activeMenu === item.id && (
                    <div className="ml-auto w-2 h-2 bg-white rounded-full opacity-75"></div>
                  )}
                </>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );

  // Show skeleton while loading
  if (loading) {
    return <SidebarSkeleton isCollapsed={isCollapsed} />;
  }

  return (
    <div
      className={`${
        isCollapsed ? "w-20" : "w-80"
      } h-full flex flex-col transition-all duration-300`}
    >
      <div className="w-full h-full bg-white/80 overflow-hidden flex flex-col shadow-xl">
        {/* Fixed Header dengan Logo/Toggle */}
        <div className="flex-shrink-0 py-5 px-6">
          <div className="flex justify-between items-center gap-3">
            {isCollapsed ? (
              <div className="flex justify-center w-full">
                <button
                  onClick={toggleSidebar}
                  className="p-2 hover:bg-gradient-to-br hover:from-green-50 hover:to-lime-50 rounded-xl hidden md:block"
                >
                  <LucideSquareSplitHorizontal className="w-6 h-6 text-main" />
                </button>
              </div>
            ) : (
              <>
                <Link
                  to="/dashboard"
                  className="flex gap-2 items-center relative"
                >
                  <img src={Logo} alt="Logo" className="h-10 w-auto" />
                  <img src={LogoText} alt="Logo Text" className="h-4" />
                </Link>
                <button
                  onClick={toggleSidebar}
                  className="p-2 hover:bg-gradient-to-br hover:from-green-50 hover:to-lime-50 rounded-xl hidden md:block"
                >
                  <LucideSquareSplitHorizontal className="w-6 h-6 text-main" />
                </button>
              </>
            )}
          </div>
        </div>

        {/* Scrollable Content Area - Always scrollable */}
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400">
          {/* Menu Utama */}
          <MenuSection title="Menu Utama" items={menuItems} />

          {/* Menu Farmer (hanya tampil jika role farmer) */}
          {isFarmer && (
            <MenuSection
              title="Kelola Pertanian"
              items={menuItemsFarmer}
              className="mt-6"
            />
          )}

          {/* Menu Except Farmer (hanya tampil jika role bukan farmer) */}
          {exceptFarmer && (
            <MenuSection
              title="Kelola Pekerjaan"
              items={menuItemsExceptFarmer}
              className="mt-6"
            />
          )}

          {/* Menu Lainnya */}
          <MenuSection
            title="Lainnya"
            items={otherMenuItems}
            className="mt-6"
          />
        </div>

        {/* Fixed Profile Section */}
        <div className="flex-shrink-0 relative">
          {/* Dropdown Menu - hanya tampil jika tidak collapsed */}
          {!isCollapsed && isProfileDropdownOpen && (
            <div className="absolute bottom-full left-3 right-3 mb-2 bg-white/95 backdrop-blur-sm border border-gray-200/50 rounded-2xl shadow-2xl overflow-hidden">
              <Link
                to="/profile"
                className="block px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors duration-200 text-sm font-medium"
                onClick={() => setIsProfileDropdownOpen(false)}
              >
                <CgProfile className="w-5 h-5 inline-block mr-2" /> Profil Saya
              </Link>
              <div className="border-b border-gray-100" />
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-3 text-gray-700 hover:bg-red-50 hover:text-danger transition-colors duration-200 text-sm font-medium"
              >
                <MdLogout className="w-5 h-5 inline-block mr-2" /> Keluar
              </button>
            </div>
          )}

          {/* Profile Button */}
          <div className={`${isCollapsed ? "p-2" : "p-4"}`}>
            {isCollapsed ? (
              <div className="flex justify-center">
                <Link
                  to="/profile"
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-300"
                  title="Profil Saya"
                >
                  <img
                    src={profilePhoto || profile?.profile_picture || '/default-avatar.png'}
                    alt="Profile"
                    className="w-10 h-10 rounded-full border-2 border-green-200 shadow-md object-cover"
                    onError={(e) => {
                      e.target.src = '/default-avatar.png';
                    }}
                  />
                </Link>
              </div>
            ) : (
              <button
                onClick={toggleProfileDropdown}
                className="w-full p-4 bg-gradient-to-r from-gray-50 to-gray-100/50 rounded-2xl flex items-center justify-between hover:from-gray-100 hover:to-gray-150 transition-all duration-300 group border border-gray-200/50"
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img
                      src={profilePhoto || profile?.profile_picture || '/default-avatar.png'}
                      alt="Profile"
                      className="w-14 h-14 rounded-full border-3 border-green-200 shadow-md object-cover"
                      onError={(e) => {
                        e.target.src = '/default-avatar.png';
                      }}
                    />
                  </div>
                  <div className="text-left">
                    <h3 className="text-sm font-semibold text-gray-900">
                      {profile ? profile.name : "Pengguna"}
                    </h3>
                    <p className="text-xs text-gray-500 font-medium">
                      {profile ? getRoleLabel(profile.role) : "UNKNOWN"}
                    </p>
                  </div>
                </div>
                <div className="p-2 rounded-xl bg-white/50 group-hover:bg-white transition-colors duration-300">
                  <MdArrowBackIos
                    className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${
                      isProfileDropdownOpen ? "rotate-90" : "-rotate-90"
                    }`}
                  />
                </div>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SidebarDashboard;