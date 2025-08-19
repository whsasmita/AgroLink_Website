import { Link, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getProfile } from '../../../services/profileService';

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
    { id: 'biodata', label: 'Biodata', path: '/profile/biodata' },
    { id: 'akun', label: 'Akun', path: '/profile/akun' }
  ];
  if (profile && profile.role === 'farmer') {
    menuItems.push({ id: 'lahan-pertanian', label: 'Lahan Pertanian', path: '/profile/lahan-pertanian' });
  }
  if (profile && (profile.role === 'worker' || profile.role === 'driver')) {
    menuItems.push({ id: 'curriculum-vitae', label: 'Curriculum Vitae', path: '/profile/curriculum-vitae' });
  }
  if (profile && profile.role === 'driver') {
    menuItems.push({ id: 'vehicle', label: 'Kendaraan', path: '/profile/vehicle' });
  }

  const getActiveMenu = () => {
    const currentPath = location.pathname;
    const activeItem = menuItems.find(item => currentPath === item.path);
    return activeItem ? activeItem.id : 'biodata';
  };

  const activeMenu = getActiveMenu();

  return (
    <div className="w-80 bg-white border border-gray-200 rounded-lg overflow-hidden">
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
                    ? 'bg-main text-white'
                    : 'text-gray-700 hover:bg-gray-50'
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
  );
};

export default SidebarProfile;