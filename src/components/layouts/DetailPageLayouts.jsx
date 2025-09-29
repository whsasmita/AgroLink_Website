import { Outlet } from "react-router-dom";
import NavBar from "../fragments/navbar/Index";
import Footer from "../fragments/footer/Index";

const DetailPageLayouts = () => {
  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-50">
        <NavBar />
      </div>

      <main className="mt-16"> {/* Sesuaikan dengan tinggi navbar */}
        <Outlet />
      </main>
    </>
  );
};

export default DetailPageLayouts;