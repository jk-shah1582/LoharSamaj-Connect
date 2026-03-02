import { useState, useEffect, useRef } from "react";

export default function AdvertisementSlider({
  ads = [],
  autoSlide = true,
  slideInterval = 4000,
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const intervalRef = useRef(null);

  if (!ads.length) return null;

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % ads.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? ads.length - 1 : prev - 1
    );
  };

  useEffect(() => {
    if (!autoSlide) return;

    intervalRef.current = setInterval(nextSlide, slideInterval);

    return () => clearInterval(intervalRef.current);
  }, [currentIndex, autoSlide]);

  const pauseSlider = () => {
    clearInterval(intervalRef.current);
  };

  const resumeSlider = () => {
    if (autoSlide) {
      intervalRef.current = setInterval(nextSlide, slideInterval);
    }
  };

  return (
    <section className="py-6 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div
          className="relative overflow-hidden rounded-2xl shadow-lg"
          onMouseEnter={pauseSlider}
          onMouseLeave={resumeSlider}
        >
          {/* Sponsored Badge
          <span className="absolute top-3 left-3 bg-yellow-400 text-xs font-semibold text-gray-800 px-3 py-1 rounded-full z-10 shadow">
            Sponsored
          </span> */}

          {/* Slides */}
          <div
            className="flex transition-transform duration-700 ease-in-out"
            style={{
              transform: `translateX(-${currentIndex * 100}%)`,
            }}
          >
            {ads.map((ad, index) => ( 
              <a
                key={index}
                href={ad.link}
                target="_blank"
                rel="noopener noreferrer"
                className="min-w-full"
              >
                <img
                  src="https://lohar-samaj-connect.vercel.app/images/JSTechMentorSolutions.png"
                  alt={ad.alt || "Advertisement"}
                  className="w-full h-40 md:h-56 object-cover"
                />
              </a>
            ))}
          </div>

          {/* Navigation Buttons */}
          <button
            onClick={prevSlide}
            className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow"
          >
            ◀
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow"
          >
            ▶
          </button>

          {/* Dots */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
            {ads.map((_, index) => (
              <div
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full cursor-pointer ${
                  currentIndex === index
                    ? "bg-blue-600"
                    : "bg-gray-300"
                }`}
              ></div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}