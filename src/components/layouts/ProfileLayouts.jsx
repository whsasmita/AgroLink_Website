import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import SidebarProfile from '../fragments/sidebar/sidebarProfile';
import { MdArrowBack } from 'react-icons/md';

const ProfileLayout = ({ onBack }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleBackClick = () => {
    if (onBack) {
      onBack();
    } else {
      const fromPath = location.state?.from;
      
      if (fromPath === '/dashboard') {
        navigate('/dashboard');
      } else if (fromPath === '/' || fromPath === '/home') {
        navigate('/');
      } else {
        navigate(-1);
      }
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex-shrink-0">
        <div className="flex items-center space-x-4">
          <button
            onClick={handleBackClick}
            className="p-2"
          >
            <MdArrowBack size={24} className="text-main_text hover:text-black" />
          </button>
          <h1 className="text-xl font-semibold text-gray-800">Profil</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 p-6 space-x-6 overflow-hidden">
        {/* Sidebar */}
        <div className="flex-shrink-0">
          <SidebarProfile />
        </div>

        {/* Content Area */}
        <div className="flex-1 flex flex-col">
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm flex-1 p-6 overflow-y-auto">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileLayout;