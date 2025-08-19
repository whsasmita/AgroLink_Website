import { Outlet } from "react-router-dom";
import NavBar from "../fragments/navbar/Index";
import Footer from "../fragments/footer/Index";

const FrontPageLayouts = () => {
  return (
    <>
      <NavBar />

      <main>
        <Outlet />
      </main>

      <Footer />
    </>
  );
};

export default FrontPageLayouts;
