"use client";
import { useEffect, useState } from "react";
import { coffees } from ".";

const Coffee = () => {
  const [coffeeData, setCoffeeData] = useState([]);

  useEffect(() => {
    const fetchCoffees = async () => {
      try {
        const response = await fetch('https://gist.githubusercontent.com/iampeterjose/18341e83a86e3dcd33b148c9e090e0a9/raw/72462486e9fb3972c3b553bd2cb4e6cc8f38997c/coffeedata.json');

        if(!response.ok) {
          throw new Error(`Network response is not OK!`);
        }
        const data = await response.json();
        setCoffeeData(data);

      } catch (error) {
          console.log(error.message);
      }
    };

    fetchCoffees();
  },[]);

  console.log(`Coffees: `, coffeeData);


  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        <div className="mt-40">
        <h1 className="text-2xl">Coffee Products</h1>
        <ul>
          {coffees.map((coffee) => (
            <li key={coffee.id} className="my-2">
              <p>{coffee.id}</p>
              <p>{coffee.name}</p>
              <p>$ {(coffee.price).toFixed(2)}</p>
              <span>
                <img src={coffee.image} alt="Coffee Image" className="h-[50px] w-[50px]" />
              </span>
            </li>
          ))}
        </ul>
        </div>
      </main>
    </div>
  )
}

export default Coffee