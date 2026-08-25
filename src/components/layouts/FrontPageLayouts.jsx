import { Outlet, useMatch, useNavigate } from "react-router-dom";
import NavBar from "../fragments/navbar/Index";
import Footer from "../fragments/footer/Index";
import { useEffect } from "react";

import ElikaIMG from "../../assets/images/elika.png";

const FrontPageLayouts = () => {
  const productIdMatch = useMatch("/product/:id");
  const CartMatch = useMatch("/cart");

  const navigate = useNavigate();

  useEffect(() => {
    console.log(productIdMatch !== null);
  }, [productIdMatch]);

  return (
    <>
      {/* Navbar */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <NavBar />
      </div>

      {/* Main Content */}
      <main className="mt-16">
        <Outlet />
      </main>

      {/* Footer */}
      {productIdMatch == null && <Footer />}

      {/* Floating Elika Button */}
      <button
        type="button"
        onClick={() => navigate("/agro-chat")}
        aria-label="Buka AgroChat"
        className="
          fixed
          right-5
          bottom-5
          z-[60]
          flex
          h-16
          w-16
          items-center
          justify-center
          overflow-hidden
          rounded-full
          bg-white
          shadow-lg
          ring-2
          ring-main/20
          transition-all
          duration-300
          hover:scale-110
          hover:shadow-xl
          active:scale-95
          sm:right-6
          sm:bottom-6
          sm:h-20
          sm:w-20
        "
      >
        <img
          src={ElikaIMG}
          alt="Elika - AgroChat"
          className="
            h-full
            w-full
            object-cover
          "
        />

        {/* Notification Dot */}
        {/* <span
          className="
            absolute
            right-1
            top-1
            h-3
            w-3
            rounded-full
            border-2
            border-white
            bg-main
            sm:h-4
            sm:w-4
          "
        /> */}
      </button>
    </>
  );
};

export default FrontPageLayouts;
