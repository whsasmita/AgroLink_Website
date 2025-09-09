// App.jsx
import { Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";

// Protected Route
import ProtectedRoute from "./components/auth/ProtectedRoute";
import RoleBasedRoute from "./components/auth/RoleBasedRoute";

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
import AgriculturalLandPage from "./pages/Profile/Farmer/AgriculturalLand";
import EditProfileForm from "./components/fragments/form/EditProfile";
import ListWorkerPage from "./pages/FrontPage/Worker/ListWorker";
import ListExpeditionPage from "./pages/FrontPage/Expedition/ListExpedition";
import CreateAgriculturalLand from "./pages/Profile/Farmer/Create";
import ListFarmerJobPage from "./pages/FrontPage/Farmer/ListFarmerJob";
import DetailExpedition from "./pages/FrontPage/Expedition/DetailExpedition";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<FrontPageLayouts />}>
          <Route index element={<HomePage />} />

          <Route path="/auth" element={<AuthLayouts />}>
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
          </Route>
          <Route
            path="/auth/register/role-selection"
            element={<RoleSelectionPage />}
          />

          <Route
            path="farmer"
            element={
              <RoleBasedRoute allowedRoles={["worker", "driver"]}>
                <ListFarmerJobPage />
              </RoleBasedRoute>
            }
          />

          <Route
            path="worker"
            element={
              <RoleBasedRoute allowedRoles={["farmer"]}>
                <ListWorkerPage />
              </RoleBasedRoute>
            }
          />

          <Route
            path="expedition"
            element={
              <RoleBasedRoute allowedRoles={["farmer"]}>
                <ListExpeditionPage />
              </RoleBasedRoute>
            }
          />

          <Route
            path="expedition/:expeditionId"
            element={
              <RoleBasedRoute allowedRoles={["farmer"]}>
                <DetailExpedition />
              </RoleBasedRoute>
            }
          />
        </Route>

        <Route path="/profile" element={<ProfileLayout />}>
          <Route path="biography" element={<ProfilePage />} />
          <Route path="biography/edit" element={<EditProfileForm />} />
          <Route path="account" element={<AccountPage />} />

          <Route index element={<Navigate to="biography" replace />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={["farmer"]} />}>
          <Route path="/profile" element={<ProfileLayout />}>
            <Route
              path="agricultural-land"
              element={<AgriculturalLandPage />}
            />
            <Route
              path="agricultural-land/create"
              element={<CreateAgriculturalLand />}
            />
          </Route>
        </Route>

        <Route element={<ProtectedRoute allowedRoles={["worker"]} />}></Route>

        <Route element={<ProtectedRoute allowedRoles={["driver"]} />}></Route>

        <Route path="/unauthorized" element={<UnauthorizedPage />} />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
