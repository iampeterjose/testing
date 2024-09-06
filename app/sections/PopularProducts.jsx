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
    <section id='products' className='max-sm:mt-5 p-5 md:p-20'>
      <div className="flex flex-col justify-start gap-5">
        <h2 className="text-2xl font-palanquin font-bold">Best Seller</h2>
      </div>
      {isLoading &&
        <img src="/assets/icons/loading.svg" alt="Loading" width={40} height={40}/>
      }

      {error && 
        <div>Error: {error}</div>
      }
      <div className="mt-8 grid lg:grid-cols-3 grid-cols-3 gap-10">
        {limitedCoffeeData.map((coffee) => (
          <PopularProductsCard 
            key={coffee.id} 
            title={coffee.name}
            image={coffee.image}
            description="coffee"
            price={(coffee.price).toFixed(2)}
          />
        ))}
      </div>
    </section>
  )
}

export default PopularProducts