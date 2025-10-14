// Bagian yang perlu diperbaiki di NavBar component
// Ganti bagian UserActions untuk mobile (sekitar baris 240-340)

const UserActions = ({ isMobile = false, onClose }) => {
  if (!isAuthenticated) return null;

  if (isMobile) {
    const [showProfileItems, setShowProfileItems] = useState(false);

    return (
      <div className="px-6 pt-6 pb-4">
        {/* Profile Info with dropdown toggle */}
        <div
          className="flex items-center justify-between cursor-pointer py-4 px-4 border border-gray-200 rounded-xl bg-gradient-to-r from-gray-50 to-white shadow-sm hover:shadow-md transition-all duration-300"
          onClick={() => setShowProfileItems(!showProfileItems)}
        >
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={profilePhoto || profile?.profile_picture || '/default-avatar.png'}
                alt="Profile"
                className="w-14 h-14 rounded-full border-3 border-green-200 shadow-md object-cover"
                onError={(e) => {
                  e.target.src = '/default-avatar.png';
                }}
              />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
            </div>
            <div>
              <p className="font-semibold text-gray-800 truncate text-lg">
                {loadingProfile ? "Loading..." : (profile?.name || "User")}
              </p>
              <p className="text-sm text-green-600 truncate font-medium">
                {loadingProfile
                  ? "Loading..."
                  : getRoleDisplayText(profile?.role) || "Role"}
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
          <div className="mt-4 p-4 space-y-2 bg-white rounded-xl border border-gray-200 shadow-sm">
            <Link
              to="/profile"
              state={{ from: "/" }}
              className="flex items-center gap-3 py-3 px-4 text-gray-700 hover:text-green-600 hover:bg-green-50 transition-all duration-300 rounded-lg"
              onClick={onClose}
            >
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="font-medium">Profil</span>
            </Link>
            <Link
              to="/dashboard"
              className="flex items-center gap-3 py-3 px-4 text-gray-700 hover:text-green-600 hover:bg-green-50 transition-all duration-300 rounded-lg"
              onClick={onClose}
            >
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <span className="font-medium">Dashboard</span>
            </Link>
            <Link
              to="/notifications"
              className="flex items-center justify-between py-3 px-4 text-gray-700 hover:text-green-600 hover:bg-green-50 transition-all duration-300 rounded-lg"
              onClick={onClose}
            >
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                <span className="font-medium">Notifikasi</span>
              </div>
              <span className="bg-gradient-to-r from-red-400 to-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-sm">
                2
              </span>
            </Link>
          </div>
        </div>

        {/* Logout button */}
        <div className="mt-4">
          <button
            onClick={() => {
              handleLogout();
              onClose();
            }}
            className="w-full py-4 px-6 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold rounded-full hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-lg transform hover:scale-105"
          >
            Keluar
          </button>
        </div>
      </div>
    );
  }

  // Desktop version
  return (
    <div className="flex gap-4 items-center">
      <Link to="/cart" className="relative cursor-pointer">
        <div className={`p-3 rounded-full ${isCart ? "bg-green-500" : "hover:bg-gray-100"}  transition-all duration-300 hover:scale-110`}>
          <ShoppingCart className={`w-6 h-6 ${isCart ? "text-white": "text-gray-600"}`} />
          <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-400 to-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-md">
            2
          </span>
        </div>
      </Link>

      <Link to="/notifications" className="relative cursor-pointer">
        <div className={`p-3 rounded-full ${isNotification ? "bg-green-500" : "hover:bg-gray-100"} transition-all duration-300 hover:scale-110`}>
          <MdNotifications className={`w-6 h-6 ${isNotification ? "text-white": "text-gray-600"}`} />
          <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-400 to-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-md">
            2
          </span>
        </div>
      </Link>

      <div className="relative profile-dropdown">
        <div
          className="flex items-center gap-2 cursor-pointer p-2 rounded-full hover:bg-gray-50 transition-all duration-300"
          onClick={toggleProfileDropdown}
        >
          <img
            src={profilePhoto || profile?.profile_picture || '/default-avatar.png'}
            alt="Profile"
            className="w-10 h-10 rounded-full border-2 border-gray-200 hover:border-green-400 transition-all duration-300 shadow-md object-cover"
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
              className="block px-4 py-4 border-b border-gray-100 hover:bg-green-50 transition-all duration-300"
              onClick={() => setIsProfileDropdownOpen(false)}
            >
              <p className="font-semibold text-gray-800 truncate">
                {loadingProfile ? "Loading..." : (profile?.name || "User")}
              </p>
              <p className="text-sm text-green-600 truncate font-medium">
                {loadingProfile
                  ? "Loading..."
                  : getRoleDisplayText(profile?.role) || "Role"}
              </p>
            </Link>
            <Link
              to="/dashboard"
              className="flex items-center gap-3 px-4 py-3 hover:bg-green-50 text-gray-700 hover:text-green-600 transition-all duration-300"
              onClick={() => setIsProfileDropdownOpen(false)}
            >
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <span>Dashboard</span>
            </Link>
            <Link
              to="/order"
              className="flex items-center gap-3 px-4 py-3 hover:bg-green-50 text-gray-700 hover:text-green-600 transition-all duration-300"
              onClick={() => setIsProfileDropdownOpen(false)}
            >
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <span>Pesanan Saya</span>
            </Link>
            <div className="mt-4 flex justify-center">
              <button
                onClick={() => {
                  handleLogout();
                  setIsProfileDropdownOpen(false);
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