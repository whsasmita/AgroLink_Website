import { useState, useEffect, useRef } from "react";

const slides = [
  {
    id: 1,
    title: "Agro Link: Connect The Worker",
    subtitle: "Solusi Digital untuk Tenaga Kerja & Logistik Pertanian",
    type: "hero"
  },
  {
    id: 2,
    title: "Masalah Utama Petani Hari Ini",
    points: [
      "Sulit cari tenaga kerja terampil",
      "Distribusi hasil panen terhambat", 
      "Minim informasi ekspedisi pertanian",
      "Regenerasi petani muda rendah"
    ],
    type: "problems"
  },
  {
    id: 3,
    title: "Hadir Agro Link: Solusi Digital Pertanian",
    points: [
      "Menghubungkan petani dengan tenaga kerja terampil",
      "Mencari jasa ekspedisi hasil panen secara cepat & mudah",
      "Kontrak digital + pembayaran aman & transparan", 
      "AI-powered Matching: rekomendasi pekerja & ekspedisi terbaik"
    ],
    type: "solutions"
  },
  {
    id: 4,
    title: "Kenapa Harus Agro Link?",
    points: [
      "Fokus khusus sektor pertanian (bukan aplikasi umum)",
      "Cepat, mudah, dan efisien berbasis AI",
      "Transaksi aman dengan kontrak digital",
      "Jaringan logistik khusus hasil pertanian"
    ],
    type: "benefits"
  }
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
  const slideContainerRef = useRef(null);

  // Auto-scroll functionality
  useEffect(() => {
    const autoScroll = setInterval(() => {
      if (!isDragging && !isTransitioning) {
        goToSlide((current + 1) % slides.length);
      }
    }, 4000);

    return () => clearInterval(autoScroll);
  }, [current, isDragging, isTransitioning]);

  const goToSlide = (index) => {
    if (isTransitioning || index === current) return;
    
    setIsTransitioning(true);
    const direction = index > current ? 'next' : 'prev';
    
    // Animate slide transition
    if (slideContainerRef.current) {
      slideContainerRef.current.style.transform = `translateX(${direction === 'next' ? '-100%' : '100%'})`;
      slideContainerRef.current.style.opacity = '0';
    }
    
    setTimeout(() => {
      setCurrent(index);
      if (slideContainerRef.current) {
        slideContainerRef.current.style.transform = `translateX(${direction === 'next' ? '100%' : '-100%'})`;
        slideContainerRef.current.style.opacity = '0';
      }
      
      setTimeout(() => {
        if (slideContainerRef.current) {
          slideContainerRef.current.style.transform = 'translateX(0)';
          slideContainerRef.current.style.opacity = '1';
        }
        setTimeout(() => setIsTransitioning(false), 300);
      }, 50);
    }, 300);
  };

  // Touch/Mouse event handlers
  const getPositionX = (event) => {
    return event.type.includes('mouse') ? event.clientX : event.touches[0].clientX;
  };

  const animation = () => {
    setCurrentTranslate(currentTranslate);
    if (carouselRef.current) {
      carouselRef.current.style.transform = `translateX(${currentTranslate}px)`;
    }
    if (isDragging) {
      const id = requestAnimationFrame(animation);
      setAnimationId(id);
    }
  };

  const touchStart = (index) => (event) => {
    if (isTransitioning) return;
    setIsDragging(true);
    setStartPos(getPositionX(event));
    setAnimationId(requestAnimationFrame(animation));
    if (carouselRef.current) {
      carouselRef.current.style.cursor = 'grabbing';
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
      carouselRef.current.style.cursor = 'grab';
      carouselRef.current.style.transform = `translateX(0px)`;
    }
  };

  // Prevent context menu on long press
  const contextMenu = (event) => {
    event.preventDefault();
    event.stopPropagation();
    return false;
  };

  const renderSlideContent = (slide) => {
    switch (slide.type) {
      case "hero":
        return (
          <div className="text-center space-y-4 sm:space-y-6">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight px-4 animate-fade-in">
              {slide.title}
            </h1>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/90 max-w-3xl mx-auto px-4 animate-fade-in-delay">
              {slide.subtitle}
            </p>
          </div>
        );
      
      case "problems":
        return (
          <div className="text-center space-y-6 sm:space-y-8">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 sm:mb-8 lg:mb-12 px-4 animate-fade-in">
              {slide.title}
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 lg:gap-6 max-w-5xl mx-auto px-4">
              {slide.points.map((point, idx) => (
                <div key={idx} 
                     className="flex items-center space-x-3 sm:space-x-4 bg-white/10 backdrop-blur-sm rounded-lg p-4 sm:p-5 lg:p-6 animate-slide-up"
                     style={{ animationDelay: `${idx * 150}ms` }}>
                  <span className="text-2xl sm:text-3xl flex-shrink-0">❌</span>
                  <p className="text-sm sm:text-base lg:text-lg text-white font-medium text-left">{point}</p>
                </div>
              ))}
            </div>
          </div>
        );
      
      case "solutions":
        return (
          <div className="text-center space-y-6 sm:space-y-8">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 sm:mb-8 lg:mb-12 px-4 animate-fade-in">
              {slide.title}
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 lg:gap-6 max-w-5xl mx-auto px-4">
              {slide.points.map((point, idx) => (
                <div key={idx} 
                     className="flex items-center space-x-3 sm:space-x-4 bg-white/10 backdrop-blur-sm rounded-lg p-4 sm:p-5 lg:p-6 animate-slide-up"
                     style={{ animationDelay: `${idx * 150}ms` }}>
                  <span className="text-2xl sm:text-3xl flex-shrink-0">✅</span>
                  <p className="text-sm sm:text-base lg:text-lg text-white font-medium text-left">{point}</p>
                </div>
              ))}
            </div>
          </div>
        );
      
      case "benefits":
        return (
          <div className="text-center space-y-6 sm:space-y-8">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 sm:mb-8 lg:mb-12 px-4 animate-fade-in">
              {slide.title}
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 lg:gap-6 max-w-5xl mx-auto px-4">
              {slide.points.map((point, idx) => (
                <div key={idx} 
                     className="flex items-start space-x-3 sm:space-x-4 bg-white/10 backdrop-blur-sm rounded-lg p-4 sm:p-5 lg:p-6 animate-slide-up"
                     style={{ animationDelay: `${idx * 150}ms` }}>
                  <span className="text-lg sm:text-xl lg:text-2xl font-bold text-[#7ED957] bg-white rounded-full w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 flex items-center justify-center text-xs sm:text-sm mt-1 flex-shrink-0">
                    {idx + 1}
                  </span>
                  <p className="text-sm sm:text-base lg:text-lg text-white font-medium text-left">{point}</p>
                </div>
              ))}
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  const getSlideBackground = (type) => {
    switch (type) {
      case "hero":
        return "bg-gradient-to-br from-[#39B54A] via-[#7ED957] to-[#39B54A]";
      case "problems":
        return "bg-gradient-to-br from-[#B53939] via-red-600 to-[#B53939]";
      case "solutions":
        return "bg-gradient-to-br from-[#39B54A] via-[#7ED957] to-[#39B54A]";
      case "benefits":
        return "bg-gradient-to-br from-[#7ED957] via-[#39B54A] to-[#7ED957]";
      default:
        return "bg-gradient-to-br from-[#39B54A] to-[#7ED957]";
    }
  };

  return (
    <div className="relative w-full max-w-6xl mx-auto px-2 sm:px-4">
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fade-in {
          animation: fadeIn 0.6s ease-out forwards;
        }
        
        .animate-fade-in-delay {
          animation: fadeIn 0.6s ease-out 0.2s both;
        }
        
        .animate-slide-up {
          animation: slideUp 0.5s ease-out forwards;
          opacity: 0;
        }
      `}</style>
      
      <div className="relative h-[300px] sm:h-[350px] md:h-[350px] lg:h-[350px] flex items-center justify-center overflow-hidden rounded-xl sm:rounded-2xl shadow-2xl">
        <div 
          ref={carouselRef}
          className={`relative h-full w-full flex items-center justify-center p-4 sm:p-6 lg:p-8 cursor-grab select-none ${getSlideBackground(slides[current].type)}`}
          onMouseDown={touchStart(current)}
          onMouseMove={touchMove}
          onMouseUp={touchEnd}
          onMouseLeave={touchEnd}
          onTouchStart={touchStart(current)}
          onTouchMove={touchMove}
          onTouchEnd={touchEnd}
          onContextMenu={contextMenu}
          style={{
            userSelect: 'none',
            WebkitUserSelect: 'none',
            MozUserSelect: 'none',
            msUserSelect: 'none'
          }}
        >
          <div 
            ref={slideContainerRef}
            className="w-full h-full flex items-center justify-center transition-all duration-300 ease-out"
          >
            {renderSlideContent(slides[current])}
          </div>
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none"></div>
        </div>

        {/* Navigation arrows */}
        <button
          onClick={() => goToSlide(current === 0 ? slides.length - 1 : current - 1)}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-2 sm:p-3 transition-all duration-200 z-10"
          disabled={isTransitioning}
        >
          <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <button
          onClick={() => goToSlide(current === slides.length - 1 ? 0 : current + 1)}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-2 sm:p-3 transition-all duration-200 z-10"
          disabled={isTransitioning}
        >
          <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Slide indicators */}
        <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 flex gap-2 sm:gap-3 z-10">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => goToSlide(idx)}
              disabled={isTransitioning}
              className={`transition-all duration-300 rounded-full ${
                current === idx 
                  ? "w-6 sm:w-8 h-2 sm:h-3 bg-white" 
                  : "w-2 sm:w-3 h-2 sm:h-3 bg-white/60 hover:bg-white/80"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};