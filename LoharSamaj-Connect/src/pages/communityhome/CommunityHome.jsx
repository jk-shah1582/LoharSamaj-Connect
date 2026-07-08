import { useState, useEffect } from "react";
import CommunityHeader from "./CommunityHeader";
import HeroBanner from "./HeroBanner";
import { getPhotosForAllEvents } from "../../services/eventservices/event.manage.service";
import { supabase } from "../../services/superbase";
import AdvertisementSlider from "./AdvertisementSlider";

export default function CommunityHome() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadEvents = async () => {
      const events = await getPhotosForAllEvents();
      setEvents(events || []);
      setLoading(false);
    };
    loadEvents();
  }, []);
  return (
    <>
      <CommunityHeader />
      {/* <HeroBanner /> */}
      {/* Advertisement Slider with sample ads
      <AdvertisementSlider
        ads={[
          {
            image: "https://lohar-samaj-connect.vercel.app/images/JSTechmentorSolutions.png",
            alt: "Advertisement 1",
            link: "#",
          },
        ]}
      /> */}
      <main className="px-1">
        {/* About Section */}
        <section
          id="about"
          className="py-5 bg-gradient-to-b from-gray-50 to-white"
        >
          <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-10 items-center">
            {/* Image Column */}
            <div className="relative group">
              <img
                src="../../../images/homeImg.png"
                alt="Lohar Samaj"
                className="w-full h-[400px] object-contain rounded-2xl shadow-2xl transform group-hover:scale-105 transition duration-500"
              />
              
            </div>

            {/* Content Column */}
            <div className="bg-white/70 backdrop-blur-lg p-8 rounded-2xl shadow-xl border border-gray-100">
              <h2 className="text-4xl font-bold text-gray-800 mb-6 relative inline-block">
                संस्थेचा परिचय
                <span className="block w-16 h-1 bg-blue-600 mt-2 rounded-full"></span>
              </h2>

              <p className="text-gray-600 mb-6 leading-relaxed text-base">
                लोहार समाज हा परंपरा, कौशल्य आणि एकात्मतेसाठी ओळखला जाणारा समाज
                आहे.<span className="font-semibold text-blue-600">कोकण विभागीय लोहार समाज संघ मुंबई </span> ही कोकण पट्ट्यातील ५ जिल्ह्यातील जवळपास १८ तालुक्यातील लोहार समाज बांधवांची एक सामाजिक संस्था आहे.
                नोव्हेंबर २०२३ रोजी स्थापन झालेल्या या संस्थेने अल्पावधीतच सर्व लोहार समाज बांधवांचा विश्वास संपादन केला. संस्थेने समाजाच्या सर्वांगीण
                विकासासाठी विविध सामाजिक आणि शैक्षणिक उपक्रमांचे आयोजन केलेले
                आहे:
              </p>

              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700">
                <li className="flex items-center gap-2">
                  <span className="text-green-500 text-xl">✔</span>
                  गुणवंत परंतु आर्थिक दुर्बल विद्यार्थ्यांना शैक्षिणक साहित्य वाटप
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500 text-xl">✔</span>
                  गरजू कुटुंबांना व्यवसाय वृद्धी साठी मदत
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500 text-xl">✔</span>
                  समाजातील गुणवंत विद्यार्थी आणि गुणवंत कलावंत यांचा सत्कार
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500 text-xl">✔</span>
                  सांस्कृतिक परंपरांचे जतन.
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Samajik Yogdan */}
        <section
          id="yogdan"
          className="py-10 bg-gradient-to-b from-white to-gray-100"
        >
          <div className="max-w-7xl mx-auto px-6">
            {/* Heading */}
            <div className="text-center mb-14">
              <h2 className="text-4xl font-bold text-gray-800 relative inline-block">
                सामाजिक योगदान
                <span className="block w-20 h-1 bg-blue-600 mt-2 mx-auto rounded-full"></span>
              </h2>
              <p className="text-gray-600 mt-4 max-w-3xl mx-auto text-lg">
                सामाजिक कार्य, शैक्षणिक मदत आणि समाजाच्या उन्नतीसाठी काही
                प्रतिष्ठित व्यक्तींचे योगदान मोलाचे ठरत आहे.
              </p>
            </div>

            {/* Contributors Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
              {/* Contributor Card */}
              <div className="bg-white rounded-2xl shadow-lg p-8 text-center hover:shadow-2xl hover:-translate-y-2 transition duration-500">
                <img
                  src="/images/GaneshRaut-LSConnect.jpeg"
                  alt="Contributor"
                  className="w-26 h-26 mx-auto rounded-full object-cover shadow-md mb-4 border-4 border-blue-100"
                />
                <h3 className="text-lg font-semibold text-gray-800">
                  माननीय लोहश्री श्री.गणेशजी पांडुरंग राऊत
                </h3>
                <p className="text-blue-600 text-base mb-3 font-bold">अध्यक्ष</p>
                <p className="text-gray-600 text-sm leading-relaxed text-justify">
                  लोहार समाजाचे कोकण विभागीय पट्ट्यातील एक नामवंत उद्योजक.
                  शहापूर तालुक्यात एक प्रभावी सामाजिक व्यक्तिमत्व म्हणून ओळख. 
                  लोहार समाजाविषयी कळकळ त्याचबरोबर ते नेहमी देत असलेले आपले परखड मत यामुळे ते कोकण विभागीय लोहार समाज संघ यांचे अध्यक्ष म्हणून योग्य निवड आहेत. त्यांची आणि त्यांचे बंधू श्री निवृती राऊत आणि निलेश राऊत आणि कुटुंबीय यांची लोहार समाजावर नेहमीच कृपादृष्टी राहिली आहे.
                </p>
              </div>

              {/* Contributor Card */}
              <div className="bg-white rounded-2xl shadow-lg p-8 text-center hover:shadow-2xl hover:-translate-y-2 transition duration-500">
                <img
                  src="/images/RajeshSomvanshi-LSConnect.jpeg"
                  alt="Contributor"
                  className="w-24 h-24 mx-auto rounded-full object-cover shadow-md mb-4 border-4 border-blue-100"
                />
                <h3 className="text-lg font-semibold text-gray-800">
                  माननीय लोहश्री श्री.राजेशजी सुनंदा रामचंद्र सोमवंशी
                </h3>
                <p className="text-blue-600 text-base mb-3 font-bold">
                  कार्याध्यक्ष
                </p>
                <p className="text-gray-600 text-sm leading-relaxed text-justify">
                  १९८२ पासून समाजकार्यात कार्यरत..
 सरकरी सेवेत असतानाही विविध सामाजिक संस्थेमार्फत समाज सेवेसाठी योगदान..
आता निवृत्ती नंतरही कोकण विभागीय लोहार समाज संघ व स्नेहराज प्रतिष्ठानामार्फत सामाजिक ॠणाची परतफेड करण्याठी आग्रही भुमिकेत रममाण..
समाजातील गोरगरीब गरजवंतासाठी मोफत शैक्षणिक,व्यावसायिक  व वैद्यकीय मदतीचा हात..
सामाजिक  संघटन व वैचारिक क्रांतीसाठी प्रबोधन करण्यात पुढाकार..
                </p>
              </div>

              {/* Contributor Card */}
              <div className="bg-white rounded-2xl shadow-lg p-8 text-center hover:shadow-2xl hover:-translate-y-2 transition duration-500">
                <img
                  src="/images/YashwantGaikar-LSConnect.jpeg"
                  alt="Contributor"
                  className="w-24 h-24 mx-auto rounded-full object-cover shadow-md mb-4 border-4 border-blue-100"
                />
                <h3 className="text-lg font-semibold text-gray-800">
                  माननीय लोहश्री श्री. यशवंत जी गायकर 
                </h3>
                <p className="text-blue-600 text-base mb-3 font-bold">महासचिव</p>
                <p className="text-gray-600 text-sm leading-relaxed">
                  मुरबाड तालुक्यातील एक व्यावसायिक तसेच समाज कार्याची आवड असलेले व्यक्तिमत्व.
                  गेले अनेक वर्षे लोहार समाज एकत्रित यावा म्हणून कार्य करीत आहेत.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Event Gallery */}
        <section
          id="gallery"
          className="py-20 bg-gradient-to-b from-gray-50 to-white"
        >
          <div className="max-w-7xl mx-auto px-6">
            {/* Heading */}
            <div className="text-center mb-14">
              <h2 className="text-4xl font-bold text-gray-800 relative inline-block">
                सामाजिक उपक्रम
                <span className="block w-20 h-1 bg-blue-600 mt-2 mx-auto rounded-full"></span>
              </h2>
              <p className="text-gray-600 text-lg mt-4">
                विविध कार्यक्रमांतील आठवणी आणि छायाचित्रे.
              </p>
            </div>

            {/* Loading */}
            {loading && (
              <div className="text-center text-gray-500">Loading events...</div>
            )}

            {/* Image Grid */}
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {events &&
                events.map((event, eventIndex) => {
                  const photos = event.event_image
                    ?.toString()
                    .split(",")
                    .map((p) => p.trim());

                  return photos?.map((photo, photoIndex) => {
                    const processedPhotoPath = photo
                      ? supabase.storage
                          .from("event_images")
                          .getPublicUrl(photo).data.publicUrl
                      : "/images/default-user.png";

                    return (
                      <div
                        key={`${eventIndex}-${photoIndex}`}
                        className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition duration-500"
                      >
                        <img
                          src={processedPhotoPath}
                          alt={event.event_title}
                          className="w-full h-64 object-cover transform group-hover:scale-110 transition duration-700"
                        />

                        {/* Dark overlay */}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition duration-500"></div>

                        {/* Title Overlay */}
                        <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/80 to-transparent p-4">
                          <h3 className="text-white text-lg font-semibold">
                            {event.event_title}
                          </h3>
                        </div>
                      </div>
                    );
                  });
                })}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section
          id="contact"
          className="py-20 bg-gradient-to-b from-gray-50 to-white"
        >
          <div className="max-w-7xl mx-auto px-6">
            {/* Heading */}
            <div className="text-center mb-14">
              <h2 className="text-4xl font-bold text-gray-800 relative inline-block">
                संपर्क करा
                <span className="block w-20 h-1 bg-blue-600 mt-2 mx-auto rounded-full"></span>
              </h2>
              <p className="text-gray-600 text-lg mt-4">
                फोन, ईमेल आणि पत्त्याची माहिती खाली दिली आहे.
              </p>
            </div>

            {/* Contact Info Grid */}
            <div className="grid md:grid-cols-3 gap-8 mb-16">
              {/* Phone Card */}
              <div className="bg-white rounded-2xl shadow-lg p-8 text-center hover:shadow-2xl transition duration-500">
                <div className="text-4xl mb-4">📞</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  फोन नंबर
                </h3>
                <p className="text-gray-600">११२२३३४४५५</p>
                <p className="text-gray-600">११५५६६७७८८</p>
              </div>

              {/* Email Card */}
              <div className="bg-white rounded-2xl shadow-lg p-8 text-center hover:shadow-2xl transition duration-500">
                <div className="text-4xl mb-4">✉️</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  ईमेल
                </h3>
                <p className="text-gray-600">admin@kvls.com</p>
              </div>

              {/* Address Card */}
              <div className="bg-white rounded-2xl shadow-lg p-8 text-center hover:shadow-2xl transition duration-500">
                <div className="text-4xl mb-4">📍</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  पत्ता
                </h3>
                <p className="text-gray-600 text-justify">
                  कोकण विभागीय लोहार समाज संघ
                  <br />
                  नोंदणीकृत पत्ता: कॉसमॉस हेरिटेज, आदित्य ए १०३, टिकूजी नी वाडी रोड, मानपाडा ठाणे ४००६१०
                </p>
              </div>
            </div>

            {/* Optional Contact Form 
            <div className="bg-white rounded-2xl shadow-xl p-10 max-w-4xl mx-auto">
              <h3 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
                संदेश पाठवा
              </h3>

              <form className="grid md:grid-cols-2 gap-6">
                <input
                  type="text"
                  placeholder="आपले नाव"
                  className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="email"
                  placeholder="आपला ईमेल"
                  className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <textarea
                  placeholder="आपला संदेश"
                  rows="4"
                  className="md:col-span-2 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                ></textarea>

                <button
                  type="submit"
                  className="md:col-span-2 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition duration-300 font-semibold"
                >
                  संदेश पाठवा
                </button>
              </form> 
            </div>*/}
          </div>
        </section>

        <footer className="bg-gray-600 text-gray-300 py-8 border-t border-gray-700">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <p className="text-sm tracking-wide">
              © {new Date().getFullYear()} कोकण विभागीय लोहार समाज संघ
            </p>

            <div className="w-16 h-0.5 bg-blue-500 mx-auto my-4 rounded-full"></div>

            <p className="text-sm">
              Designed & Developed by{" "}
              <span className="text-blue-400 font-semibold hover:text-blue-300 transition">
                JS TechMentor Solutions
              </span>
            </p>
          </div>
        </footer>
      </main>
    </>
  );
}
