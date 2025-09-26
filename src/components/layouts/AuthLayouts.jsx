import { Outlet } from "react-router-dom";

// Images
import Car from "../../assets/images/car.png";
import logoImage from "../../assets/images/Logo.png";

const AuthLayouts = () => {
  return (
    <>
      {/* Container for the entire layout. It will be a column on mobile and a row on larger screens. */}
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="flex w-full max-w-6xl overflow-hidden flex-col md:flex-row rounded-lg">
          
          {/* Left section: Image. Hidden on small screens to prioritize the form. */}
          {/* md:block makes it visible on medium screens and up. */}
          <div className="flex-1 flex items-center justify-center p-8 hidden md:block">
            <img
              src={Car}
              alt="Delivery Car"
              className="max-w-full h-auto object-contain"
            />
          </div>

          {/* Right section: Form Container */}
          {/* The rounded-lg and border-2 classes are moved here and will only be applied on mobile,
          because the parent div now handles the border for larger screens. */}
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