import { Outlet, useNavigate } from 'react-router-dom';
import SidebarProfile from '../fragments/sidebar/sidebarProfile';
import { MdArrowBack } from 'react-icons/md';

const ProfileLayout = ({ onBack }) => {
  const navigate = useNavigate();

  const handleBackClick = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center space-x-4">
          <button
            onClick={handleBackClick}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
          >
            <MdArrowBack size={24} className="text-main_text" />
          </button>
          <h1 className="text-xl font-semibold text-gray-800">Profil</h1>
        </div>
      </div>

      <div className="flex p-6 space-x-6">
        <div className="flex-shrink-0">
          <SidebarProfile />
        </div>

        <div className="flex-1">
          <div className="bg-white rounded-lg border border-gray-200 min-h-96 p-6 shadow-sm">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileLayout;