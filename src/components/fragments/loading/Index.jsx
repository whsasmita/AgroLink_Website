import loadingGif from "../../../assets/videos/loading.gif";

const Loading = ({ className = "w-8 h-8 mx-auto", alt = "Loading..." }) => (
  <div className="flex items-center justify-center">
    <img src={loadingGif} alt={alt} className={className} />
  </div>
);

export default Loading;
