"use client";
import Modal from "./Modal";

const PopularProductsCard = ({ title, image, description, id, price, imageSize }) => {
  // Determine image size classes
  const imgWrapperClass = imageSize === "large"
    ? "relative flex items-center justify-center w-44 h-44 md:w-56 md:h-56 mb-4"
    : "relative flex items-center justify-center w-32 h-32 md:w-44 md:h-44 mb-4";
  const imgClass = imageSize === "large"
    ? "relative z-10 w-36 h-36 md:w-48 md:h-48 object-cover rounded-xl shadow-md border-4 border-white"
    : "relative z-10 w-24 h-24 md:w-36 md:h-36 object-cover rounded-xl shadow-md border-4 border-white";

  return (
    <>
      <div
        className="relative flex flex-col items-center justify-center w-full bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-transform duration-300 hover:-translate-y-2 group p-6 md:p-8 mb-6 cursor-pointer"
      >
        {/* Image with accent and price badge */}
        <div className={imgWrapperClass}>
          <div className="absolute inset-0 bg-orange-100 rounded-full blur-xl opacity-60 z-0" />
          <img
            src={image}
            alt={title}
            className={imgClass}
          />
          <span className="absolute top-2 right-2 bg-orange-600 text-white text-xs md:text-sm font-bold px-3 py-1 rounded-full shadow z-20">
            ${price}
          </span>
        </div>
        <div className="flex flex-col items-center text-center">
          <h3 className="mt-1 text-base md:text-lg font-bold font-palanquin text-gray-900 truncate max-w-[160px] md:max-w-[200px]">
            {title}
          </h3>
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
  );
};

export default PopularProductsCard;