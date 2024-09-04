"use client";
import Modal from "./Modal"

const PopularProductsCard = ({ title, image, description, id, price }) => {

  return (
    <>
    <div 
        className="flex flex-1 justify-center items-center flex-col w-full mb-6 max-sm:w-full hover:cursor-pointer group"
    >
        <img 
            src={image} 
            alt={title} 
            className="w-[80px] h-[80px] md:w-[180px] md:h-[180px] rounded-md"
        />
        <div className="">
            <h3 className="mt-2 text-sm md:text-xl leading-normal font-semibold font-palanquin">{title}</h3>
            <p className="mt-2 font-semibold font-montserrat text-orange-700 text-sm md:text-lg leading-normal">${price}</p>
        </div>
    </div>
    <Modal
      title={title}
      image={image}
      description={description}
      id={id}
      price={price}
    />
    </>
  )
}

export default PopularProductsCard