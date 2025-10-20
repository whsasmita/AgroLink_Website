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
import HomePage from "./pages/FrontPage/Home";
import LoginPage from "./pages/Auth/Login";
import RegisterPage from "./pages/Auth/Register";
import UnauthorizedPage from "./pages/Error/Unauthorized";
import ErrorPage from "./pages/Error/Error";
import RoleSelectionPage from "./pages/Auth/RoleSelection";
import ProfilePage from "./pages/Profile/Profile";
import ProfileLayout from "./components/layouts/ProfileLayouts";
import AccountPage from "./pages/Profile/Account";
import EditProfileForm from "./components/fragments/form/profile/EditProfile";
import ListWorkerPage from "./pages/FrontPage/Worker/ListWorker";
import ListExpeditionPage from "./pages/FrontPage/Expedition/ListExpedition";
import DetailExpedition from "./pages/FrontPage/Expedition/DetailExpedition";
import DetailWorker from "./pages/FrontPage/Worker/DetailWorker";
import BackpageLayouts from "./components/layouts/BackPageLayouts";
import DashboardPage from "./pages/BackPage/DashboadPage";
import ReviewPage from "./pages/BackPage/Review";
import WorkerListPage from "./pages/BackPage/Farmer/WorkerListPage";
// import AgriculturalLandPage from "./pages/BackPage/Farmer/AgriculturanLand/AgriculturalLandPage";
// import AgriculturalLandForm from "./components/fragments/form/backpage/farmer/InputAgriculturalLand";
// import DetailAgriculturalLand from "./pages/BackPage/Farmer/AgriculturanLand/DetailAgriculturalLand";
import HistoryPage from "./pages/BackPage/HistoryPage";
import ProjectListPage from "./pages/BackPage/Farmer/Project/ProjectListPage";
import InputProject from "./components/fragments/form/backpage/farmer/InputProject";
import ProjectDetailPage from "./pages/BackPage/Farmer/Project/DetailProject";
import MyJobListPage from "./pages/BackPage/Workers/MyJobListPage";
import ListProjectPage from "./pages/FrontPage/Farmer/ListProject";
import DetailProject from "./pages/FrontPage/Farmer/DetailProject";
import InboxPage from "./pages/FrontPage/Application/InboxPage";
import NotificationPage from "./pages/FrontPage/Application/Notification";
import MyDeliveryListPage from "./pages/BackPage/Expedition/MyDeliveryListPage";
import DeliveryListPage from "./pages/BackPage/Farmer/Delivery/DeliveryListPage";
import ApplicationPage from "./pages/BackPage/Farmer/Application/ApplicationPage";
import PaymentListPage from "./pages/BackPage/Farmer/Payments/PaymentListPage";
import ContractsPage from "./pages/BackPage/Workers/Application/ContractsPage";
import InputDelivery from "./components/fragments/form/backpage/farmer/inputDelivery";
import ListProduct from "./pages/FrontPage/E-Commerce/ListProduct";
import DetailProduct from "./pages/FrontPage/E-Commerce/DetailProduct";
import AuthRequiredRoute from "./components/auth/AuthRequiredRoute";
import ListCheckoutProduct from "./pages/FrontPage/Checkout/ListCheckoutProduct";
import CartProduct from "./pages/FrontPage/Cart/CartProduct";
import OrderList from "./pages/FrontPage/Order/OrderView";
import OrderView from "./pages/FrontPage/Order/OrderView";
import ChatPage from "./pages/BackPage/ChatPage"
import ProductListPage from "./pages/BackPage/Farmer/Product/ProductListPage";
import InputProduct from "./components/fragments/form/backpage/farmer/InputProduct";
import BackpageDetailProduct from "./pages/BackPage/Farmer/Product/BackPageDetailProduct";
import MyOrderViewPage from "./pages/BackPage/General/MyOrderViewPage";


function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route
          path="checkout"
          element={
            <ListCheckoutProduct />
          }
        />

        <Route path="/" element={<FrontPageLayouts />}>
          <Route index element={<HomePage />} />
          <Route
            path="inbox"
            element={
              <RoleBasedRoute allowedRoles={["farmer","worker", "driver"]}>
                <InboxPage />
              </RoleBasedRoute>
            }
          />
          
          

          <Route path="/auth" element={<AuthLayouts />}>
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
          </Route>
          <Route
            path="/auth/register/role-selection"
            element={<RoleSelectionPage />}
          />

          <Route
            path="projects"
            element={
              <RoleBasedRoute allowedRoles={["worker", "driver"]}>
                <ListProjectPage />
              </RoleBasedRoute>
            }
          />
          {/* The fix is to separate the parent route from the child route
            to resolve the "a <Route> is only ever to be used as the child of <Routes> element, never rendered directly" error. 
          */}
          <Route
            path="projects/view/:projectId"
            element={
              <RoleBasedRoute allowedRoles={["worker", "driver"]}>
                <DetailProject />
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
            path="worker/:workerId"
            element={
              <RoleBasedRoute allowedRoles={["farmer"]}>
                <DetailWorker />
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
            path="product"
            element={
              <ListProduct />
            }
          />
          
          <Route
            path="product/:id"
            element={
              <DetailProduct />
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
          
          <Route
            path="cart"
            element={
              <CartProduct />
            }
          />

          <Route path="order" element={ <OrderView /> } />
        </Route>


        <Route path="/profile" element={<ProfileLayout />}>
          <Route path="biography" element={<ProfilePage />} />
          <Route path="biography/edit" element={<EditProfileForm />} />
          <Route path="account" element={<AccountPage />} />

          <Route index element={<Navigate to="biography" replace />} />
        </Route>

        <Route path="/dashboard" element={<BackpageLayouts />}>
          <Route index element={<DashboardPage />} />
          <Route path="history" element={<HistoryPage />} />
          <Route path="review" element={<ReviewPage />} />
          <Route path="chat" element={<ChatPage />} />
          {/* My Order Start */}
          <Route path="my-orders" element={<MyOrderViewPage />} />
          {/* My Order End */}
          <Route
            path="notifications"
            element={
              <RoleBasedRoute allowedRoles={["farmer","worker", "driver", "general"]}>
                <NotificationPage />
              </RoleBasedRoute>
            }
          />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={["farmer"]} />}>
          <Route path="/dashboard" element={<BackpageLayouts />}>
            {/* <Route
              path="agricultural-land"
              element={<AgriculturalLandPage />}
            />
            <Route
              path="agricultural-land/create"
              element={<AgriculturalLandForm />}
            />
            <Route
              path="agricultural-land/edit/:id"
              element={<AgriculturalLandForm />}
            />
            <Route
              path="agricultural-land/view/:id"
              element={<DetailAgriculturalLand />}
            /> */}
            <Route path="projects" element={<ProjectListPage />} />
            <Route
              path="projects/create"
              element={<InputProject />}
            />
            <Route
              path="projects/view/:projectId"
              element={<ProjectDetailPage />}
            />
            <Route
              path="projects/view/:projectId/applications"
              element={<ApplicationPage />}
            />
            {/* <Route
              path="projects/edit/:projectId"
              element={<InputProject />}
            /> */}

            <Route path="projects/payments" element={<PaymentListPage />} />

            <Route path="delivery-list" element={<DeliveryListPage />} />
            <Route path="delivery-list/create" element={<InputDelivery />} />

            <Route path="worker-list" element={<WorkerListPage />} />


            {/* Product Start */}

            <Route path="products" element={<ProductListPage/>} />
            <Route
              path="products/create"
              element={<InputProduct />}
            />
            <Route
              path="products/view/:productId"
              element={<BackpageDetailProduct/>}
            />
            <Route
              path="products/edit/:productId"
              element={<InputProduct/>}
            />

            {/* Product End */}
          </Route>
        </Route>

        <Route element={<ProtectedRoute allowedRoles={["worker"]} />}>
          <Route path="/dashboard" element={<BackpageLayouts />}>
            <Route path="my-jobs" element={<MyJobListPage />} />
            <Route path="my-jobs/contracts" element={<ContractsPage />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute allowedRoles={["driver"]} />}>
          <Route path="/dashboard" element={<BackpageLayouts />}>
            <Route path="my-delivery" element={<MyDeliveryListPage />} />
          </Route>
        </Route>

        <Route path="/unauthorized" element={<UnauthorizedPage />} />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;