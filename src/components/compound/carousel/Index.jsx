import { useState, useEffect, useRef } from "react";
import ImgFarmer1 from "../../../assets/Carousel/img_farmer1.png";
import ImgFarmer2 from "../../../assets/Carousel/img_farmer2.png";
import ImgFarmer3 from "../../../assets/Carousel/img_farmer3.png";
import ImgFarmer4 from "../../../assets/Carousel/img_farmer4.png";
import ImgBg from "../../../assets/Carousel/farmer_bg.png";

const slides = [
  {
    id: 1,
    title: "Agro Link: Connect The Worker",
    subtitle: "Solusi Digital untuk Tenaga Kerja & Logistik Pertanian",
    type: "hero",
    image: ImgFarmer1,
  },
  {
    id: 2,
    title: "Masalah Utama Petani Hari Ini",
    points: [
      "Sulit cari tenaga kerja terampil",
      "Distribusi hasil panen terhambat",
      "Minim informasi ekspedisi pertanian",
      "Regenerasi petani muda rendah",
    ],
    type: "problems",
    image: ImgFarmer2,
  },
  {
    id: 3,
    title: "Hadir Agro Link: Solusi Digital Pertanian",
    points: [
      "Menghubungkan petani dengan tenaga kerja terampil",
      "Mencari jasa ekspedisi hasil panen cepat & mudah",
      "Kontrak digital dengan pembayaran aman & transparan",
      "AI-powered Matching untuk rekomendasi terbaik",
    ],
    type: "solutions",
    image: ImgFarmer3,
  },
  {
    id: 4,
    title: "Kenapa Harus Agro Link?",
    points: [
      "Fokus pada sektor pertanian, bukan aplikasi umum",
      "Cepat, mudah, dan efisien berbasis AI",
      "Transaksi aman dengan kontrak digital",
      "Jaringan logistik pertanian terpercaya",
    ],
    type: "benefits",
    image: ImgFarmer4,
  },
];

export const Carousel = () => {
  const [current, setCurrent] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startPos, setStartPos] = useState(0);
  const [currentTranslate, setCurrentTranslate] = useState(0);
  const [prevTranslate, setPrevTranslate] = useState(0);
  const [animationId, setAnimationId] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const carouselRef = useRef(null);
  const slideContentRef = useRef(null);

  // Auto-scroll
  useEffect(() => {
    const autoScroll = setInterval(() => {
      if (!isDragging && !isTransitioning) {
        goToSlide((current + 1) % slides.length);
      }
    }, 7000);
    return () => clearInterval(autoScroll);
  }, [current, isDragging, isTransitioning]);

  const goToSlide = (index) => {
    if (isTransitioning || index === current) return;
    setIsTransitioning(true);
    const direction = index > current ? "next" : "prev";

    if (slideContentRef.current) {
      slideContentRef.current.style.transform = `translateX(${
        direction === "next" ? "-50%" : "50%"
      })`;
      slideContentRef.current.style.opacity = "0";
    }

    setTimeout(() => {
      setCurrent(index);
      if (slideContentRef.current) {
        slideContentRef.current.style.transform = `translateX(${
          direction === "next" ? "50%" : "-50%"
        })`;
        slideContentRef.current.style.opacity = "0";
      }

      setTimeout(() => {
        if (slideContentRef.current) {
          slideContentRef.current.style.transform = "translateX(0)";
          slideContentRef.current.style.opacity = "1";
        }
        setTimeout(() => setIsTransitioning(false), 300);
      }, 50);
    }, 300);
  };

  // Swipe gesture
  const getPositionX = (event) =>
    event.type.includes("mouse") ? event.clientX : event.touches[0].clientX;

  const touchStart = (index) => (event) => {
    if (isTransitioning) return;
    setIsDragging(true);
    setStartPos(getPositionX(event));
    if (carouselRef.current) {
      carouselRef.current.style.cursor = "grabbing";
    }
  };

  const touchMove = (event) => {
    if (isDragging && !isTransitioning) {
      const currentPosition = getPositionX(event);
      const diff = currentPosition - startPos;
      setCurrentTranslate(prevTranslate + diff);
    }
  };

  const touchEnd = () => {
    if (isTransitioning) return;
    setIsDragging(false);
    if (animationId) cancelAnimationFrame(animationId);
    const movedBy = currentTranslate - prevTranslate;
    const threshold = 50;
    if (movedBy < -threshold && current < slides.length - 1) goToSlide(current + 1);
    else if (movedBy > threshold && current > 0) goToSlide(current - 1);
    else if (movedBy < -threshold && current === slides.length - 1) goToSlide(0);
    else if (movedBy > threshold && current === 0) goToSlide(slides.length - 1);
    setCurrentTranslate(0);
    setPrevTranslate(0);
    if (carouselRef.current) carouselRef.current.style.cursor = "grab";
  };

  const contextMenu = (event) => {
    event.preventDefault();
    event.stopPropagation();
    return false;
  };

  const renderSlideContent = (slide) => {
    let boxColor =
      slide.type === "problems"
        ? "border-2 border-[#c83b5d] bg-[#a32d00]/[0.80]"
        : slide.type === "solutions"
        ? "border-2 border-[#418343] bg-[#3f8e00]/[0.80]"
        : slide.type === "benefits"
        ? "border-2 border-[#418343] bg-[#3f8e00]/[0.80]"
        : "bg-transparent";

    let titleColor =
    slide.type === "problems"
      ? "text-[#a32d00]"
      : slide.type === "solutions"
      ? "text-[#3f8e00]"
      : slide.type === "benefits"
      ? "text-[#3f8e00]"
      : "text-[#2E7D32]";

    if (!slide.points) {
      return (
        <div className="flex flex-col items-center justify-center w-full gap-8 px-4 animate-fade-in sm:px-6 md:px-8">
          <h2 className={`text-center text-3xl sm:text-4xl md:text-5xl font-bold ${titleColor} mb-4`}>
            {slide.title}
          </h2>
          <p className="text-xl sm:text-2xl my-4 text-white font-medium border-2 border-[#418343] bg-[#3f8e00]/[0.74] px-6 py-8 rounded-xl shadow-md">
            {slide.subtitle}
          </p>
        </div>
      );
    }

    return (
    <div className="flex flex-col items-center justify-center w-full gap-4 sm:gap-6 px-4 sm:px-6 md:px-8 animate-fade-in 
    max-h-[360px] sm:max-h-none overflow-hidden scale-[0.9] sm:scale-100 origin-top">
      {/* Judul di tengah */}
      <h2
        className={`font-bold ${titleColor} text-[clamp(1.25rem,5vw,2rem)] sm:text-[clamp(1.5rem,3vw,2.5rem)] mb-4 text-center w-full leading-tight`}
      >
        {slide.title}
      </h2>

      {/* Layout dua kolom (gambar + points) */}
      <div className="flex flex-col items-center justify-center w-full gap-6 lg:flex-row lg:gap-10">
        {/* Gambar */}
        <div className="flex justify-center w-full lg:w-1/3">
          <img
            src={slide.image}
            alt={slide.title}
            className="w-[240px] sm:w-[320px] md:w-[400px] lg:w-[480px] h-auto object-contain transform lg:scale-110 hidden lg:block" 
          />
        </div>

        {/* Card Points */}
        <div className="flex flex-col items-center w-full text-center lg:items-start lg:w-1/2 lg:text-center">
          <div className="grid grid-cols-1 gap-3 sm:gap-4 sm:grid-cols-2 lg:max-w-lg lg:ml-[-100px]">
            {slide.points.map((point, idx) => (
              <div
                key={idx}
                className={`${boxColor} text-white font-semibold text-[clamp(0.75rem,2vw,1rem)] sm:text-lg px-3 sm:px-4 py-2 sm:py-3 rounded-xl shadow-md`}
              >
                <p className="leading-snug">{point}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
    );
  };

  return (
    <div className="relative w-full px-4 py-8 mx-auto max-w-7xl">
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fadeIn 0.6s ease-out forwards;
        }
      `}</style>

      <div
        ref={carouselRef}
        className="relative flex flex-col items-center justify-center bg-cover bg-center rounded-3xl shadow-xl overflow-hidden px-6 sm:px-10 md:px-20 py-12 min-h-[450px]"
        style={{
          backgroundImage: `url(${ImgBg})`,
          userSelect: "none",
        }}
        onMouseDown={touchStart(current)}
        onMouseMove={touchMove}
        onMouseUp={touchEnd}
        onMouseLeave={touchEnd}
        onTouchStart={touchStart(current)}
        onTouchMove={touchMove}
        onTouchEnd={touchEnd}
        onContextMenu={contextMenu}
      >

        {/* Konten slide */}
        <div
          ref={slideContentRef}
          className="relative z-20 flex flex-col items-center justify-center w-full"
        >
          {renderSlideContent(slides[current])}
        </div>

        {/* Navigasi kiri/kanan */}
        <button
          onClick={() =>
            goToSlide(current === 0 ? slides.length - 1 : current - 1)
          }
          className="absolute z-30 p-2 -translate-y-1/2 rounded-full left-4 top-1/2 bg-white/40 hover:bg-white/60"
          disabled={isTransitioning}
        >
          ‹
        </button>

        <button
          onClick={() => goToSlide((current + 1) % slides.length)}
          className="absolute z-30 p-2 -translate-y-1/2 rounded-full right-4 top-1/2 bg-white/40 hover:bg-white/60"
          disabled={isTransitioning}
        >
          ›
        </button>

        {/* Dots indikator */}
        <div className="absolute z-30 flex justify-center w-full gap-2 bottom-4">
          {slides.map((_, idx) => (
            <div
              key={idx}
              className={`w-3 h-3 rounded-full transition-all ${
                current === idx
                  ? "bg-[#2E7D32]"
                  : "bg-[#2E7D32]/40 hover:bg-[#2E7D32]/60"
              }`}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
};
