import { useState, useEffect, useRef } from "react";

import Bg1 from "../../../assets/Carousel/bg-1.png";
import Bg2 from "../../../assets/Carousel/bg-2.png";
import Bg3 from "../../../assets/Carousel/bg-3.png";
import Bg4 from "../../../assets/Carousel/bg-4.png";
import Bg5 from "../../../assets/Carousel/bg-5.png";
import Bg6 from "../../../assets/Carousel/bg-6.png";

const slides = [
  {
    id: 1,
    title: "Agro Link: Connect The Worker",
    subtitle: "Solusi Digital untuk Tenaga Kerja & Logistik Pertanian",
    type: "hero",
    background: Bg1,
  },
  {
    id: 2,
    title: "Tantangan Utama Agribisnis",
    points: [
      "Minimnya informasi lowongan menyebabkan banyaknya pekerja harian desa yang menganggur.",
      "Ancaman gagal panen akibat sulitnya mencari buruh tani pada waktu yang krusial.",
      "Panjangnya rantai pasok yang didominasi tengkulak merugikan kesejahteraan petani.",
      "Kurangnya akses permodalan yang aman bagi petani dan peternak lokal.",
    ],
    type: "content",
    background: Bg2,
  },
  {
    id: 3,
    title: "Ekosistem Terintegrasi (B2B2C)",
    points: [
      "All-in-One Platform: Bursa Kerja, Marketplace, Logistik, dan Investasi Kemitraan.",
      "Transaksi 100% Aman: Seluruh aliran dana dilindungi oleh sistem Rekening Bersama (Escrow).",
      "Diversifikasi Layanan: Menjangkau lintas sektor melalui Tani Link, Ternak Link, dan Tukang Link.",
      "Digitalisasi Desa: Memberdayakan Kelompok Tani lokal melalui kerja sama operasional (B2B).",
    ],
    type: "content",
    background: Bg3,
  },
  {
    id: 4,
    title: "Pertumbuhan & Validasi Pasar",
    points: [
      "Pertumbuhan Eksponensial: Meroket pesat hingga mencapai 1.100+ pengguna aktif terdaftar.",
      "Transaksi Solid: Sukses memfasilitasi lebih dari 590+ transaksi harian dengan aman.",
      "Traction Kuat: Mencatat perputaran Gross Merchandise Value (GMV) hingga Rp171 Juta+.",
      "Dominasi Lokal: Berhasil memonopoli akuisisi pengguna dari 4 Mitra Kelompok Tani besar.",
    ],
    type: "content",
    background: Bg4,
  },
  {
    id: 5,
    title: "Inovasi & Rencana Ekspansi",
    points: [
      "Kecerdasan Buatan: Implementasi Chatbot AI Premium untuk layanan pendampingan cerdas.",
      "Ekspansi Legalitas: Mengantongi NIB KBLI Periklanan untuk memperkuat monetisasi platform.",
      "Skalabilitas Server: Upgrade infrastruktur sistem berskala besar untuk menampung lonjakan traffic.",
      "Visi 3 Tahun: Mereplikasi kesuksesan ekosistem B2B2C ke wilayah NTB dan Jawa Timur.",
    ],
    type: "content",
    background: Bg5,
  },
  {
    id: 6,
    type: "background-only",
    background: Bg6,
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

  // Ganti slide
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

        setTimeout(() => {
          setIsTransitioning(false);
        }, 300);
      }, 50);
    }, 300);
  };

  // Swipe gesture
  const getPositionX = (event) =>
    event.type.includes("mouse") ? event.clientX : event.touches[0].clientX;

  const touchStart = () => (event) => {
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

    if (animationId) {
      cancelAnimationFrame(animationId);
    }

    const movedBy = currentTranslate - prevTranslate;
    const threshold = 50;

    if (movedBy < -threshold && current < slides.length - 1) {
      goToSlide(current + 1);
    } else if (movedBy > threshold && current > 0) {
      goToSlide(current - 1);
    } else if (movedBy < -threshold && current === slides.length - 1) {
      goToSlide(0);
    } else if (movedBy > threshold && current === 0) {
      goToSlide(slides.length - 1);
    }

    setCurrentTranslate(0);
    setPrevTranslate(0);

    if (carouselRef.current) {
      carouselRef.current.style.cursor = "grab";
    }
  };

  const contextMenu = (event) => {
    event.preventDefault();
    event.stopPropagation();
    return false;
  };

  // Render isi setiap slide
  const renderSlideContent = (slide) => {
    // Slide 6 benar-benar kosong
    if (slide.type === "background-only") {
      return null;
    }

    // Slide 1
    if (slide.type === "hero") {
      return (
        <div className="flex flex-col items-center justify-center w-full gap-8 px-4 sm:px-6 md:px-8 animate-fade-in">
          <h2 className="text-center text-3xl sm:text-4xl md:text-5xl font-bold text-[#2E7D32] mb-4">
            {slide.title}
          </h2>

          <p className="text-xl sm:text-2xl my-4 text-white font-medium border-2 border-[#418343] bg-[#3f8e00]/[0.74] px-6 py-8 rounded-xl shadow-md">
            {slide.subtitle}
          </p>
        </div>
      );
    }

    // Slide 2 - 5
    return (
      <div
        className="
          flex flex-col items-center justify-center
          w-full gap-4 sm:gap-6
          px-4 sm:px-6 md:px-8
          animate-fade-in
          max-h-[360px] sm:max-h-none
          overflow-hidden
          scale-[0.9] sm:scale-100
          origin-top
        "
      >
        {/* Judul */}
        <h2
          className="
            font-bold
            text-white
            text-[clamp(1.25rem,5vw,2rem)]
            sm:text-[clamp(1.5rem,3vw,2.5rem)]
            mb-4
            text-center
            w-full
            leading-tight
          "
        >
          {slide.title}
        </h2>

        {/* Lorem Ipsum Cards */}
        <div className="flex flex-col items-center justify-center w-full">
          <div
            className="
              grid
              grid-cols-1
              gap-3
              sm:gap-4
              sm:grid-cols-2
              max-w-3xl
              w-full
            "
          >
            {slide.points.map((point, idx) => (
              <div
                key={idx}
                className="
                  border-2
                  border-white/60
                  bg-black/40
                  backdrop-blur-sm
                  text-white
                  font-semibold
                  text-[clamp(0.75rem,2vw,1rem)]
                  sm:text-lg
                  px-3
                  sm:px-4
                  py-3
                  sm:py-4
                  rounded-xl
                  shadow-md
                "
              >
                <p className="leading-snug text-center">{point}</p>
              </div>
            ))}
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
        className="
          relative
          flex
          flex-col
          items-center
          justify-center
          bg-cover
          bg-center
          rounded-3xl
          shadow-xl
          overflow-hidden
          px-6
          sm:px-10
          md:px-20
          py-12
          min-h-[450px]
          transition-all
          duration-500
          cursor-grab
        "
        style={{
          backgroundImage: `url(${slides[current].background})`,
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
        {/* Overlay tipis agar teks lebih mudah dibaca */}
        {slides[current].type !== "background-only" && (
          <div className="absolute inset-0 bg-black/10 pointer-events-none" />
        )}

        {/* Konten slide */}
        <div
          ref={slideContentRef}
          className="
            relative
            z-20
            flex
            flex-col
            items-center
            justify-center
            w-full
          "
          style={{
            transition: "transform 300ms ease-out, opacity 300ms ease-out",
          }}
        >
          {renderSlideContent(slides[current])}
        </div>

        {/* Navigasi kiri */}
        <button
          onClick={() =>
            goToSlide(current === 0 ? slides.length - 1 : current - 1)
          }
          className="
            absolute
            z-30
            p-2
            -translate-y-1/2
            rounded-full
            left-4
            top-1/2
            bg-white/40
            hover:bg-white/60
            transition
          "
          disabled={isTransitioning}
        >
          ‹
        </button>

        {/* Navigasi kanan */}
        <button
          onClick={() => goToSlide((current + 1) % slides.length)}
          className="
            absolute
            z-30
            p-2
            -translate-y-1/2
            rounded-full
            right-4
            top-1/2
            bg-white/40
            hover:bg-white/60
            transition
          "
          disabled={isTransitioning}
        >
          ›
        </button>

        {/* Dots indikator */}
        <div className="absolute z-30 flex justify-center w-full gap-2 bottom-4">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => goToSlide(idx)}
              disabled={isTransitioning}
              aria-label={`Go to slide ${idx + 1}`}
              className={`
                w-3
                h-3
                rounded-full
                transition-all
                ${
                  current === idx
                    ? "bg-white scale-125"
                    : "bg-white/40 hover:bg-white/70"
                }
              `}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
