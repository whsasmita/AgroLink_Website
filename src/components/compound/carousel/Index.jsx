import { useState } from "react";
import { MdArrowBackIos } from "react-icons/md";

import img1 from "../../../assets/Carousel/carousel1.png";
import img2 from "../../../assets/Carousel/carousel2.png";
import img3 from "../../../assets/Carousel/carousel3.png";
import img4 from "../../../assets/Carousel/carousel4.png";
import img5 from "../../../assets/Carousel/carousel5.png";

const images = [img1, img2, img3, img4, img5];

export const Carousel = () => {
  const [current, setCurrent] = useState(0);

  const prevSlide = () => {
    setCurrent((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };
  const nextSlide = () => {
    setCurrent((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const goToSlide = (index) => {
    setCurrent(index);
  };

  return (
    <div className="relative w-full max-w-6xl mx-auto">
      <div className="relative h-80 flex items-center justify-between overflow-hidden rounded-2xl">
        
        <button
          onClick={prevSlide}
          className="absolute left-4 z-20 bg-black/40 hover:bg-black/60 text-white rounded-full p-3 transition-all duration-300 backdrop-blur-sm border border-white/20"
          aria-label="Previous"
        >
          <MdArrowBackIos className="w-5 h-5" />
        </button>
        
        <button
          onClick={nextSlide}
          className="absolute right-4 z-20 bg-black/40 hover:bg-black/60 text-white rounded-full p-3 transition-all duration-300 backdrop-blur-sm border border-white/20"
          aria-label="Next"
        >
          <MdArrowBackIos className="w-5 h-5 rotate-180" />
        </button>

        <div className="relative h-full w-full">
          <img
            src={images[current]}
            alt={`carousel-${current + 1}`}
            className="w-full h-full object-cover transition-all duration-500 ease-in-out"
          />
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
        </div>

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-10">
          {images.map((_, idx) => (
            <button
              key={idx}
              onClick={() => goToSlide(idx)}
              className={`transition-all duration-300 rounded-full ${
                current === idx 
                  ? "w-8 h-3 bg-main" 
                  : "w-3 h-3 bg-white/60 hover:bg-white/80"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>

      <div className="flex justify-center gap-4 mt-6">
        {images.map((img, idx) => (
          <button
            key={idx}
            onClick={() => goToSlide(idx)}
            className={`relative w-20 h-12 rounded-lg overflow-hidden transition-all duration-300 ${
              current === idx 
                ? "ring-3 ring-main ring-offset-2 scale-105" 
                : "opacity-60 hover:opacity-80"
            }`}
          >
            <img
              src={img}
              alt={`thumbnail-${idx + 1}`}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
};