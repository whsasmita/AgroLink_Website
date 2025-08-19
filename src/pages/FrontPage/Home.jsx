import { Carousel } from "../../components/compound/carousel/Index";
import { Search } from "../../components/compound/search/Index";

const Home = () => {
  return (
    <>
      <div className="w-full max-w-6xl mx-auto flex flex-col items-center justify-center gap-8 pb-2">
        <div className="relative w-full max-w-6xl mx-auto px-4 pt-8 pb-2">
          <Carousel />
        </div>
        <Search />
      </div>
    </>
  );
};

export default Home;