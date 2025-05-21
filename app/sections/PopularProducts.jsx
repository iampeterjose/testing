"use client";
import PopularProductsCard from "../../components/PopularProductsCard";
import { useEffect, useState } from "react";

const PopularProducts = () => {
  const [coffeeData, setCoffeeData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCoffeeData = async () => {
      try {
        const response = await fetch('https://gist.githubusercontent.com/iampeterjose/18341e83a86e3dcd33b148c9e090e0a9/raw/b9d7d27ff2b91588ee47a508fe527f5e34386b0a/coffeedata.json');
        if(!response.ok){
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setCoffeeData(data);
      } catch (error) {
          setError(error.message);
      } finally {
          setIsLoading(false);
      }
    };
    fetchCoffeeData();
  },[]);

  const limitedCoffeeData = coffeeData.slice(0,3);

  return (
    <section id="products" className="relative w-full min-h-[60vh] bg-gradient-to-br from-orange-50 to-white py-16 px-4 md:px-24">
      {/* Decorative accent */}
      <div className="absolute right-0 top-0 w-72 h-72 bg-orange-100 rounded-full blur-3xl opacity-40 -z-10" />
      {/* Header */}
      <div className="flex flex-col items-center gap-3 mb-14 text-center">
        <h2 className="text-4xl md:text-5xl font-extrabold font-palanquin text-gray-900 tracking-tight drop-shadow-sm">
          <span className="text-orange-600">Best Sellers</span>
        </h2>
        <span className="block w-20 h-1 bg-orange-400 rounded-full mt-1 mb-2" />
        <p className="text-lg md:text-xl text-slate-700 font-montserrat max-w-2xl mx-auto">Discover our most popular coffee picks, loved by our customers for their rich flavor and quality.</p>
      </div>
      {/* Loading & Error States */}
      {isLoading && (
        <div className="flex justify-center items-center py-10">
          <img src="/assets/icons/loading.svg" alt="Loading" width={40} height={40} />
        </div>
      )}
      {error && (
        <div className="flex justify-center items-center py-10 text-red-600 font-semibold">Error: {error}</div>
      )}
      {/* Products Grid */}
      <div className="mt-4 grid gap-10 md:gap-14 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {limitedCoffeeData.map((coffee) => (
          <PopularProductsCard
            key={coffee.id}
            title={coffee.name}
            image={coffee.image}
            description="coffee"
            price={Number(coffee.price).toFixed(2)}
            imageSize="large"
          />
        ))}
        {!isLoading && limitedCoffeeData.length === 0 && (
          <div className="col-span-full text-center text-slate-500 py-10 text-lg">No popular products found.</div>
        )}
      </div>
    </section>
  );
};

export default PopularProducts;