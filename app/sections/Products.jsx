"use client";
import CoffeeCard from "../../components/CoffeeCard";
import { useEffect, useState } from "react";
import { FiSearch } from "react-icons/fi";

const Products = () => {
  const [coffeeData, setCoffeeData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSetSearchQuery] = useState('');
  const [filteredCoffeeData, setFilteredCoffeeData] = useState([]);    
  const [activeId, setActiveId] = useState(null);

  const handleClick = (clickedId) => {
      setActiveId(prevId => prevId === clickedId ? null : clickedId);
  };

  useEffect(() => {
    const fetchCoffeeData = async () => {
      try {
        const response = await fetch('https://gist.githubusercontent.com/iampeterjose/18341e83a86e3dcd33b148c9e090e0a9/raw/b9d7d27ff2b91588ee47a508fe527f5e34386b0a/coffeedata.json');
        if(!response.ok){
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setCoffeeData(data);
        setFilteredCoffeeData(data);
      } catch (error) {
          setError(error.message);
      } finally {
          setIsLoading(false);
      }
    };
    fetchCoffeeData();
  },[]);

  useEffect(() => {
    const lowercasedQuery = searchQuery.toLowerCase();
    const filteredData = coffeeData.filter(coffee =>
      coffee.name.toLowerCase().includes(lowercasedQuery)
    );
    setFilteredCoffeeData(filteredData);
  }, [searchQuery, coffeeData]);

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-orange-50 to-white py-10 px-4 md:px-20">
      {/* Header */}
      <div className="flex flex-col gap-3 max-w-3xl mx-auto mb-10 text-center">
        <h2 className="text-3xl md:text-4xl font-extrabold font-palanquin text-gray-900 tracking-tight">
          Our <span className="text-orange-600">Coffee</span> Products
        </h2>
        <p className="text-lg text-slate-700 font-montserrat">Experience high-quality coffees</p>
      </div>
      {/* Search Bar */}
      <div className="flex justify-center mb-8">
        <div className="relative w-full max-w-md">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <FiSearch size={20} />
          </span>
          <input
            type="search"
            className="h-14 w-full pl-10 pr-4 py-2 text-base text-gray-900 border border-gray-300 rounded-xl bg-gray-50 focus:ring-2 focus:ring-orange-200 focus:border-orange-400 transition"
            placeholder="Search coffee..."
            value={searchQuery}
            onChange={(e) => setSetSearchQuery(e.target.value)}
            autoComplete="off"
          />
        </div>
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
      <div className="mt-4 grid gap-8 md:gap-10 lg:gap-12 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {filteredCoffeeData.map((coffee) => (
          <CoffeeCard
            key={coffee.id}
            title={coffee.name}
            image={coffee.image}
            description="coffee"
            price={Number(coffee.price).toFixed(2)}
            id={coffee.id}
            isActive={activeId === coffee.id}
            handleClick={() => handleClick(coffee.id)}
          />
        ))}
        {!isLoading && filteredCoffeeData.length === 0 && (
          <div className="col-span-full text-center text-slate-500 py-10 text-lg">No coffee products found.</div>
        )}
      </div>
    </section>
  );
};

export default Products;