import { TiLocationArrowOutline } from "react-icons/ti";

const Hero = () => {
  return (
    <section
      id="home"
      className="relative w-full flex xl:flex-row flex-col justify-center items-center min-h-screen gap-10 px-4 md:px-20 py-10 bg-gradient-to-br from-orange-50 to-white overflow-hidden"
    >
      {/* Decorative background accent */}
      <div className="absolute left-0 top-0 w-96 h-96 bg-orange-100 rounded-full blur-3xl opacity-40 -z-10" />
      <div className="xl:w-2/5 flex flex-col justify-center items-start w-full pt-24 md:pt-2 max-xl:px-10">
        <p className="text-lg md:text-xl text-orange-600 font-montserrat mb-2 tracking-wide">Our Coffee Collections</p>
        <h1 className="mt-1 font-palanquin text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight relative">
          Enjoy Our
          <span className="text-orange-600 drop-shadow-md"> Coffees</span>
          <span className="block w-20 h-2 bg-orange-300 rounded-full mt-2 mb-1" />
        </h1>
        <p className="font-montserrat text-slate-600 text-lg md:text-xl leading-8 mt-4 mb-6 sm:max-w-sm">
          Discover the rich and aromatic world of coffee with <span className="font-bold text-orange-700">TestApp</span>, your ultimate destination for premium blends and expertly crafted brews.
        </p>
        <a
          href="#products"
          className="flex items-center gap-2 font-satoshi text-lg leading-none bg-orange-600 rounded-full text-white border-orange-600 px-8 py-4 shadow-lg hover:bg-orange-700 hover:scale-105 transition-transform duration-200 focus:ring-2 focus:ring-orange-300"
        >
          Order now
          <TiLocationArrowOutline size={22} />
        </a>
      </div>
      <div className="flex-1 flex justify-center items-center relative">
        {/* Blurred spotlight behind image */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 md:w-[420px] md:h-[420px] bg-orange-200 rounded-full blur-2xl opacity-60 z-0" />
        <img
          src="assets/images/coffeeimage.png"
          alt="Coffee Image"
          width="420"
          height="420"
          className="relative z-10 rounded-3xl shadow-2xl object-cover border-4 border-white"
        />
      </div>
    </section>
  );
};

export default Hero;