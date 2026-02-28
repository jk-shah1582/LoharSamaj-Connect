// src/components/ResponsiveHeader.jsx
export default function ResponsiveHeader() {
  return (
    <header className="w-full bg-yellow-300">
      <div
        className="
          max-w-6xl mx-auto
          flex items-center
          gap-0
          h-20 md:h-24
        "
      >
        {/* Logo – same size as banner */}
        <img
          src="/images/loharSamajLogo.jpeg"
          alt="Lohar Samaj Logo"
          className="
            h-16 w-16
            md:h-20 md:w-20
            object-contain
            flex-shrink-0
          "
        />

        {/* Banner */}
        <div className="flex-1 flex items-center">
          <img
            src="/images/loharSamajBanner.jpeg"
            alt="Lohar Samaj Banner"
            className="
              h-16 md:h-20
              max-w-full
              object-contain
            "
          />
        </div>
      </div>
    </header>
  );
}
