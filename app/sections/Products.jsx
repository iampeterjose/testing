"use client";
import CoffeeCard from "../../components/CoffeeCard";
import { useEffect, useState } from "react";

const Products = () => {
  const [coffeeData, setCoffeeData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSetSearchQuery] = useState('');
  const [filteredCoffeeData, setFilteredCoffeeData] = useState([]);

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
    // Filter coffee data based on the search query
    const lowercasedQuery = searchQuery.toLowerCase();
    const filteredData = coffeeData.filter(coffee =>
      coffee.name.toLowerCase().includes(lowercasedQuery)
    );
    setFilteredCoffeeData(filteredData);
  }, [searchQuery, coffeeData]);

  return (
    <section className='max-sm:mt-5 p-5 md:p-20'>
      <div className="flex flex-col justify-start gap-5">
        <h2 className="text-2xl font-palanquin font-bold">Our <span className="text-coffee">Coffee </span>Products</h2>
        <p className="lg:max-w-lg mt-2 font-montserrat text-slate-800">Experience high-quality coffees</p>
        <div>
          <input 
            type="search" 
            className="block h-14 w-full md:w-[400px] px-3 py-2 sm:text-base text-gray-900 border border-gray-300 rounded-lg bg-gray-50" 
            placeholder="Search coffee..."
            value={searchQuery}
            onChange={(e) => setSetSearchQuery(e.target.value)}
            />
        </div>
        {isLoading &&
          <img src="/assets/icons/loading.svg" alt="Loading" width={40} height={40}/>
        }

        {error && 
          <div>Error: {error}</div>
        }
      </div>
      <div className="mt-4 md:my-10 grid lg:grid-cols-4 md:grid-cols-3 grid-cols-1 gap-1 md:gap-4">
        {filteredCoffeeData.map((coffee) => (
          <CoffeeCard 
            key={coffee.id} 
            title={coffee.name}
            image={coffee.image}
            description="coffee"
            price={(coffee.price).toFixed(2)}
            id={coffee.id}
          />
        ))}
      </div>
    </section>
  )
}

export default Products