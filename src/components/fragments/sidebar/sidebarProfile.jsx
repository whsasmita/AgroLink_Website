import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { getProfile } from "../../../services/profileService";

const SidebarProfile = () => {
  const location = useLocation();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

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

  let menuItems = [
    { id: "biography", label: "Biodata", path: "/profile/biography" },
    { id: "account", label: "Akun", path: "/profile/account" },
  ];
  if (profile && profile.role === "farmer") {
    menuItems.push({
      id: "lahan-pertanian",
      label: "Lahan Pertanian",
      path: "/profile/agricultural-land",
    });
  }

  const getActiveMenu = () => {
    const currentPath = location.pathname;
    const activeItem = menuItems.find((item) =>
      currentPath.startsWith(item.path)
    );
    return activeItem ? activeItem.id : "biography";
  };

  const activeMenu = getActiveMenu();

  return (
    <div className="w-80 h-full">
      <div className="w-full h-full bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="border-t border-gray-200">
          {loading ? (
            <div className="p-6 text-center text-gray-400">Memuat menu...</div>
          ) : (
            menuItems.map((item, index) => (
              <div key={item.id}>
                <Link
                  to={item.path}
                  className={`block w-full px-6 py-4 text-left font-medium transition-colors duration-200 ${
                    activeMenu === item.id
                      ? "bg-main text-white"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {item.label}
                </Link>
                {index < menuItems.length - 1 && (
                  <div className="border-b border-gray-200" />
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default SidebarProfile;