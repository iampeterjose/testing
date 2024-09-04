const Hero = () => {
  return (
    <section
      id='home'
      className="w-full flex xl:flex-row flex-col justify-center min-h-screen gap-10 p-5 md:p-20"
    >
      <div className="xl:w-2/5 flex flex-col justify-center items-start w-full pt-28 md:pt-2 max-xl:px-10">
        <p className="text-xl text-coffee font-montserrat">Our Coffee Collections</p>
        <h1 className="mt-3 font-palanquin text-4xl max-sm:text-[30px] max-sm:leading-[2] font-bold ">Enjoy Our 
          <span className="text-coffee"> Coffees</span>
        </h1>
        <p className="font-montserrat text-slate-600 text-lg leading-8 mt-3 mb-4 sm:max-w-sm">Discover the rich and aromatic world of coffee with TestApp, your ultimate destination for premium blends and expertly crafted brews.
        </p>
        <a href='#products' className="font-satoshi text-lg leading-none bg-orange-600 rounded-full text-white border-orange-600 px-7 py-4">
          Order now
        </a>
      </div>
      <div>
        <img 
          src="assets/images/coffeeimage.png" 
          alt="Cofee Image" 
          width='700'
          height='700'
          />
      </div>
    </section>
  )
}

export default Hero