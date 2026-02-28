export default function HeroBanner() {
  return (
    <section
      id="home"
      className="relative bg-gradient-to-r
                 from-blue-600 to-indigo-700 text-white"
    >
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Welcome to Lohar Samaj
        </h1>

        <p className="text-lg md:text-xl opacity-90 max-w-3xl mx-auto">
          United for culture, contribution, and community development.
        </p>
      </div>
    </section>
  );
}
