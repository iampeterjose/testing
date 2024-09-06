"use client";
import Modal from "./Modal";
import { useState, useEffect } from "react";

const CoffeeCard = ({ title, image, description, id, price }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    useEffect(() => {
        if (isModalOpen) {
          document.body.style.overflow = 'hidden'; // Disable scrolling
        } else {
          document.body.style.overflow = ''; // Enable scrolling
        }
    
        // Cleanup function to ensure overflow is reset when the component unmounts
        return () => {
          document.body.style.overflow = '';
        };
      }, [isModalOpen]);

    return (
        <>
        {/* Desktop screen */}
        <div 
            className="hidden md:flex justify-center items-center flex-col w-full hover:cursor-pointer group hover:shadow-xl transition-shadow hover:bg-slate-100 duration-500"
            onClick={openModal}
        >
            <div className="flex-shrink-0">
                <img 
                    src={image} 
                    alt={title} 
                    className="w-[280px] h-[280px] rounded-md"
                />
            </div>
            <div className="w-full pl-0 lg:pl-6">
                <h3 className="mt-2 text-lg leading-normal">{title}</h3>
                <p className="text-md text-orange-700 leading-normal">${price}</p>
            </div>
        </div>

        {/* Mobile screen */}
        <div className="flex md:hidden flex-col border-b-2 hover:cursor-pointer group hover:shadow-xl transition-shadow hover:bg-slate-100 duration-500" onClick={openModal}>
            <div className="flex justify-between items-center p-2">
                <div>
                    <h3 className="mt-2 text-md leading-normal">{title}</h3>
                    <p className="text-sm text-orange-700 leading-normal">${price}</p>
                </div>
                <div>
                    <img 
                        src={image} 
                        alt={title} 
                        className="w-[80px] h-[80px] rounded-md"
                    />
                </div>
            </div>
        </div>
        <Modal
            isOpen={isModalOpen}
            onClose={closeModal}
            title={title}
            image={image}
            description={description}
            id={id}
            price={price}
        />
        </>
    )
}

export default CoffeeCard