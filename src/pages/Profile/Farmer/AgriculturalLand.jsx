import { Link } from "react-router-dom";

const AgriculturalLandPage = () => {
  return (
    <>
      <title>Lahan Pertanian - Agro Link</title>
      <meta name="description" content="Lahan Pertanian di Agro Link" />
    
      <div className="max-w-xl flex justify-between items-center w-full">
        <h2 className="text-2xl font-bold text-main mb-6">Lahan Pertanian</h2>
        <Link
          to="/profile/agricultural-land/create"
          className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-lg font-medium transition-colors duration-200"
        >
          Tambah Lahan
        </Link>
        <div className="space-y-6"></div>
      </div>
    </>
  );
};

export default AgriculturalLandPage;
