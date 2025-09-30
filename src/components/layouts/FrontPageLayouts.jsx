import { Outlet } from "react-router-dom";
import NavBar from "../fragments/navbar/Index";
import Footer from "../fragments/footer/Index";
import { useMatch } from "react-router-dom";
import { useEffect } from "react";

const FrontPageLayouts = () => {
  const productIdMatch = useMatch("/product/:id");
  const CartMatch = useMatch("/cart");

  useEffect(() => {
    console.log( productIdMatch !== null)
  })

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-50">
        <NavBar />
      </div>

      <main className="mt-16"> {/* Sesuaikan dengan tinggi navbar */}
        <Outlet />
      </main>

      {(productIdMatch == null) && <Footer /> }
    </>
  );
};

export default FrontPageLayouts;