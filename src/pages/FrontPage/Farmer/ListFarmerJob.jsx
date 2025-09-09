import { MdFilterList } from "react-icons/md";
import { Search } from "../../../components/compound/search/Index";

const ListFarmerJobPage = () => {
  return (
    <>
      <title>Daftar Lowongan Pekerjaan - Agro Link</title>
      <meta name="description" content="Daftar lowongan pekerjaan di Agro Link" />

      <div className="w-full max-w-6xl mx-auto flex flex-col items-center justify-center gap-8 py-2">
        <div className="w-full flex justify-between items-center gap-4 mb-4">
          <button className="bg-main py-2 px-4 rounded-lg">
            <MdFilterList size={24} className="text-white" />
          </button>
          <Search />
        </div>
      </div>
    </>
  );
};

export default ListFarmerJobPage;
