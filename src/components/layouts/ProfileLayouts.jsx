import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import SidebarProfile from '../fragments/sidebar/sidebarProfile';
import { MdArrowBack } from 'react-icons/md';

const ProfileLayout = ({ onBack }) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4 flex-shrink-0 sticky top-0 z-30 shadow-sm">
        <div className="flex items-center space-x-3 sm:space-x-4">
          <Link
            to='/dashboard'
            className="p-2 hover:bg-gray-100 rounded-full transition-all duration-200 hover:scale-110"
            aria-label="Kembali ke dashboard"
          >
            <MdArrowBack 
              size={24} 
              className="text-main_text hover:text-black transition-colors duration-200" 
            />
          </Link>
          <div>
            <h1 className="text-xl sm:text-2xl font-semibold text-gray-800">
              Profil
            </h1>
            <p className="text-sm text-gray-600 hidden sm:block">
              Kelola informasi profil Anda
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:flex-row">
        {/* Mobile Content Area - Full width on mobile */}
        <div className="flex-1 flex flex-col lg:hidden">
          {/* Mobile Sidebar */}
          <div className="p-4 pb-2">
            <SidebarProfile />
          </div>
          
          {/* Mobile Content */}
          <div className="flex-1 px-4 pb-4">
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm h-full">
              <div className="p-4 sm:p-6 h-full overflow-y-auto">
                <Outlet />
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Layout - Side by side */}
        <div className="hidden lg:flex flex-1 p-6 space-x-6 overflow-hidden">
          {/* Desktop Sidebar */}
          <div className="flex-shrink-0">
            <SidebarProfile />
          </div>

          {/* Desktop Content Area */}
          <div className="flex-1 flex flex-col min-w-0">
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm flex-1 overflow-hidden">
              <div className="p-6 h-full overflow-y-auto">
                <Outlet />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Padding for safe area */}
      <div className="lg:hidden pb-safe-area-inset-bottom"></div>
    </div>
  );
};

export default ProfileLayout;