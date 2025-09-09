import loadingGif from "../../../assets/videos/loading.gif";

const Loading = ({ className = "w-3xs h-32", alt = "Loading..." }) => (
  <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-70 z-50">
    <div className="flex items-center justify-center">
      <img src={loadingGif} alt={alt} className={className} />
    </div>
  </div>
);

export default Loading;
