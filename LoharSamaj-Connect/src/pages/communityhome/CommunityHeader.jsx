import { useEffect, useState } from "react";
import ResponsiveHeader from "../../component/ResponsiveHeader";
import {
  Bars3Icon,
  XMarkIcon,
  UserIcon,
  HomeIcon,
  InformationCircleIcon,
  PhoneIcon,
  HeartIcon,
  PhotoIcon,
} from "@heroicons/react/24/outline";

const MENU = [
  { id: "home", label: "सुरुवात", icon: HomeIcon },
  { id: "about", label: "संस्थेबद्दल", icon: InformationCircleIcon },
  { id: "yogdan", label: "सामाजिक योगदान", icon: HeartIcon },
  { id: "gallery", label: "सामाजिक उपक्रम", icon: PhotoIcon },
  { id: "contact", label: "संपर्क करा", icon: PhoneIcon },
];


const HEADER_HEIGHT = 72; // px (important for scroll offset)

export default function CommunityHeader() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("about");

  /* ===== Scroll spy ===== */
  useEffect(() => {
  const handleScroll = () => {
    let current = "home";

    MENU.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return;

      const top = el.getBoundingClientRect().top;
      if (top <= HEADER_HEIGHT + 20) {
        current = id;
      }
    });

    setActive(current);
  };

  handleScroll(); // run on load
  window.addEventListener("scroll", handleScroll);
  return () => window.removeEventListener("scroll", handleScroll);
}, []);


  /* ===== Smooth scroll with offset ===== */
  const scrollTo = (id) => {
  const el = document.getElementById(id);
  if (!el) return;

  const y =
    el.getBoundingClientRect().top +
    window.pageYOffset -
    HEADER_HEIGHT;

  window.scrollTo({ top: y, behavior: "smooth" });
  setOpen(false);
};


  return (
    <>
    
    <header className="sticky top-0 z-50 bg-white shadow">
        <ResponsiveHeader />
      <div className="max-w-7xl mx-auto px-4">
        <div className="h-[72px] flex items-center justify-between">

          {/* Desktop Menu */}
          <nav className="hidden md:flex items-center gap-6">
            {MENU.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => scrollTo(id)}
                className={`flex items-center gap-1 font-medium transition
                  ${
                    active === id
                      ? "text-blue-600 border-b-2 border-blue-600"
                      : "text-gray-700 hover:text-blue-600"
                  }`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </button>
            ))}
          </nav>

          {/* Login */}
          <a
            href="/login"
            className="hidden md:flex items-center gap-2
                       bg-blue-400 text-white px-4 py-2 rounded-lg
                       hover:bg-blue-700 transition"
          >
            <UserIcon className="h-5 w-5" />
            Profile Login
          </a>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden"
          >
            {open ? (
              <XMarkIcon className="h-7 w-7" />
            ) : (
              <Bars3Icon className="h-7 w-7" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden bg-white border-t">
          {MENU.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => scrollTo(id)}
              className={`block w-full text-left px-4 py-3
                ${
                  active === id
                    ? "bg-blue-50 text-blue-600 font-semibold"
                    : "text-gray-700"
                }`}
            >
              {label}
            </button>
          ))}

          <a
            href="/login"
            className="block px-4 py-3 text-blue-600 font-semibold"
          >
            Profile Login
          </a>
        </div>
      )}
    </header>
    </>
  );
}
