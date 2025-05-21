import { aboutUs } from "../constants";

const AboutUs = () => {
  return (
    <section id="about-us" className="w-full py-16 px-4 md:px-20 bg-gradient-to-br from-orange-600 to-orange-400 rounded-3xl shadow-xl my-16">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-12 md:gap-20 flex-wrap justify-between items-start">
        {aboutUs.map((items) => (
          <div key={items.title} className="flex-1 min-w-[250px] bg-white/10 rounded-2xl p-8 shadow-md mb-6 md:mb-0">
            <h3 className="text-white text-2xl font-bold font-satoshi mb-3 flex items-center gap-2">
              <span className="inline-block w-2 h-6 bg-white rounded-full mr-2" />
              {items.title}
            </h3>
            {items.description && (
              <p className="text-orange-50 font-satoshi mb-4 text-base leading-relaxed">{items.description}</p>
            )}
            <ul className="space-y-3">
              {items.moreDetail && items.moreDetail.length > 0 ? (
                items.moreDetail.map((item) => (
                  <li key={item.id} className="pl-3 border-l-4 border-white/40">
                    <p className="text-white font-satoshi text-md font-semibold">
                      {item.info}
                      <span className="font-normal text-orange-100"> - {item.detail}</span>
                    </p>
                  </li>
                ))
              ) : null}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
};

export default AboutUs;