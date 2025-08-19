import { MdSearch } from "react-icons/md";
import { Input } from "../../element/input/Index";

export const Search = () => {
  return (
    <div className="relative w-full flex items-center">
      <Input 
        type="text" 
        placeholder="Cari disini..." 
        variant="w-full h-12 pl-4 pr-10 border border-main_text rounded-full focus:border-main" 
      />

      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
        <MdSearch className="w-6 h-6 text-main_text" />
      </div>
    </div>
  );
};