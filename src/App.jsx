// App.jsx
import { Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";

// Protected Route
import ProtectedRoute from "./components/auth/ProtectedRoute";

// Page Layouts
import FrontPageLayouts from "./components/layouts/FrontPageLayouts";
import AuthLayouts from "./components/layouts/AuthLayouts";

// Pages
import HomePage from "./pages/FrontPage/home";
import LoginPage from "./pages/Auth/login";
import RegisterPage from "./pages/Auth/Register";
import UnauthorizedPage from "./pages/Error/Unauthorized";
import ErrorPage from "./pages/Error/Error";
import RoleSelectionPage from "./pages/Auth/RoleSelection";
import ProfilePage from "./pages/Profile/Profile";
import ProfileLayout from "./components/layouts/ProfileLayouts";
import AccountPage from "./pages/Profile/Account";
import AgriculturalLandPage from "./pages/FrontPage/Farmer/AgriculturalLand";
import EditProfileForm from "./pages/Profile/Form/EditProfile";

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* === Public Route === */}
        <Route path="/" element={<FrontPageLayouts />}>
          <Route index element={<HomePage />} />
        </Route>

        {/* === Authenticate === */}
        <Route path="/auth" element={<AuthLayouts />}>
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
        </Route>
        {/* Select Role */}
        <Route path="/auth/register/role-selection" element={<RoleSelectionPage />} />

        {/* Profile Route */}
        <Route path="/profile" element={<ProfileLayout />} >
          <Route path="biodata" element={<ProfilePage />} />
            <Route path="biodata/edit" element={<EditProfileForm />} />
          <Route path="akun" element={<AccountPage />} />
          <Route path="lahan-pertanian" element={<AgriculturalLandPage />} />

          <Route index element={<Navigate to="biodata" replace />} />
        </Route>

        {/* === Role Route === */}
        {/* <Route element={<DashboardLayout />}> */}
          
          {/* <Route element={<ProtectedRoute allowedRoles={['farmer']} />}> */}
            {/* <Route path="/dashboard/farmer" element={<DashboardFarmerPage />} /> */}
          {/* </Route> */}

          {/* <Route element={<ProtectedRoute allowedRoles={['worker']} />}> */}
            {/* <Route path="/dashboard/worker" element={<DashboardWorkerPage />} /> */}
          {/* </Route> */}

          {/* <Route element={<ProtectedRoute allowedRoles={['expedition']} />}> */}
            {/* <Route path="/dashboard/expedition" element={<DashboardExpeditionPage />} /> */}
          {/* </Route> */}
          
          {/* <Route element={<ProtectedRoute allowedRoles={['farmer', 'worker']} />}> */}
            {/* <Route path="/shared/profile" element={<div>Halaman Profil</div>} /> */}
          {/* </Route>

        </Route> */}

        <Route path="/unauthorized" element={<UnauthorizedPage />} />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;