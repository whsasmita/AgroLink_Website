import { Outlet } from "react-router-dom";

// Images
import Car from "../../assets/images/Car.png";
import logoImage from "../../assets/images/logo.png";

const AuthLayouts = () => {
  return (
    <>
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="flex w-full max-w-6xl overflow-hidden">
          <div className="flex-1 flex items-center justify-center p-8">
            <img
              src={Car}
              alt="Delivery Car"
              className="max-w-full h-auto object-contain"
            />
          </div>

          <div className="flex-1 p-12 flex flex-col justify-center border-2 border-main rounded-lg">
            <div className="flex flex-col items-center justify-center mb-8">
              <img src={logoImage} alt="AgroLink Logo" className="w-20 h-20" />
              {/* <p className="text-main_text">Selamat datang di AGRO LINK</p> */}
            </div>

            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
};

export default AuthLayouts;