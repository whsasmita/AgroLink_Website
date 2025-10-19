import { getProfile, getPhoto } from "../../services/profileService";
import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import SidebarDashboard from "../fragments/sidebar/sidebarDashboard";
import { MdMenu, MdClose } from "react-icons/md";

const BackpageLayouts = () => {
  const [profile, setProfile] = useState(null);
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchProfileData = async () => {
      setLoading(true);
      try {
        const res = await getProfile();
        setProfile(res.data);

        // Get profile photo URL using getPhoto service
        if (res.data?.profile_picture) {
          const photoRes = await getPhoto(res.data.profile_picture);
          setProfilePhoto(photoRes.data?.url);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        setProfile(null);
        setProfilePhoto(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  // Close mobile sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isMobileSidebarOpen &&
        !event.target.closest(".mobile-sidebar") &&
        !event.target.closest(".mobile-sidebar-toggle")
      ) {
        setIsMobileSidebarOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMobileSidebarOpen]);

  // Prevent body scroll when mobile sidebar is open
  useEffect(() => {
    if (isMobileSidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileSidebarOpen]);

  const getRoleLabel = (role) => {
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
        return role?.toUpperCase() || "UNKNOWN";
    }
  };

  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <SidebarDashboard profile={profile} loading={loading} />
      </div>

      {/* Mobile Sidebar Overlay */}
      <div
        className={`fixed inset-0 z-50 lg:hidden transition-all duration-300 ${
          isMobileSidebarOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      >
        {/* Background Blur */}
        <div
          className={`absolute inset-0 bg-black/20 backdrop-blur-sm transition-all duration-300 ${
            isMobileSidebarOpen ? "backdrop-blur-sm" : "backdrop-blur-none"
          }`}
          onClick={() => setIsMobileSidebarOpen(false)}
        />

        {/* Mobile Sidebar */}
        <div
          className={`mobile-sidebar absolute left-0 top-0 h-full w-80 max-w-[85vw] bg-white shadow-2xl transform transition-transform duration-300 ${
            isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <SidebarDashboard 
            profile={profile} 
            loading={loading} 
            isMobile={true}
            onClose={() => setIsMobileSidebarOpen(false)}
          />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 min-h-screen">
        {/* Mobile Header with Sidebar Toggle */}
        <div className="sticky top-0 z-40 flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200 shadow-sm lg:hidden">
          <button
            className="p-2 transition-colors duration-200 rounded-lg mobile-sidebar-toggle hover:bg-gray-100"
            onClick={toggleMobileSidebar}
            aria-label="Toggle sidebar"
          >
            <MdMenu className="w-6 h-6 text-gray-700" />
          </button>

          {/* User Info on Mobile Header */}
          <div className="flex items-center gap-3">
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
                <div className="w-16 h-4 bg-gray-200 rounded animate-pulse"></div>
              </div>
            ) : profile ? (
              <div className="flex items-center gap-2">
                <img
                  src={profilePhoto || profile.profile_picture || '/default-avatar.png'}
                  alt="Profile"
                  className="object-cover w-8 h-8 border-2 border-gray-200 rounded-full shadow-sm"
                  onError={(e) => {
                    e.target.src = '/default-avatar.png';
                  }}
                />
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-800 truncate max-w-[120px]">
                    {profile.name}
                  </p>
                  <p className="text-xs font-medium text-green-600">
                    {getRoleLabel(profile.role)}
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-500">Guest</p>
                  <p className="text-xs text-gray-400">USER</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto bg-dashboard scrollbar-hide">
          <div className="min-h-full">
            <Outlet />
          </div>
        </div>

        {/* Mobile Bottom Safe Area */}
        <div className="lg:hidden pb-safe-area-inset-bottom"></div>
      </div>
    </div>
  );
};

export default BackpageLayouts;