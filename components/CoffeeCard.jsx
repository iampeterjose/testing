"use client";
import { useSession, getProviders } from "next-auth/react";
import Modal from "./Modal";
import { useState, useEffect } from "react";
import { useCart } from "../app/context/CartContext";
import SignInModal from "./SignInModal";

const CoffeeCard = ({ title, image, description, id, price, isActive, handleClick }) => {
    const [quantity, setQuantity] = useState(1);
    const { addItem, addItemToDb } = useCart();
    const { data: session } = useSession();
    const [providers, setProviders] = useState(null);
    const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);

    useEffect(() => {
        const setUpProviders = async () => {
            const response = await getProviders();
            setProviders(response);
        };

        setUpProviders();
    }, []);

    const handleAdd = () => {
        if (session) {
            const userEmail = session?.user.email;
            const item = { id: parseInt(id, 10), title, price, quantity: parseInt(quantity, 10), image };
            addItemToDb(userEmail, item);

        } else {
            setIsSignInModalOpen(true);
        }
    };

    const handleSignInModalClose = () => {
        setIsSignInModalOpen(false);
    };

    return (
        <>
        {/* Desktop screen */}
        <div 
            className="hidden md:flex justify-center items-center flex-col w-full hover:cursor-pointer group hover:shadow-xl transition-shadow hover:bg-slate-100 duration-500">
            <div className="relative group flex-shrink-0">
                <img 
                    src={image} 
                    alt={title} 
                    className="w-[280px] h-[280px] rounded-md"
                />
                <div className="flex justify-between bg-slate-100 rounded-t-md w-full absolute bottom-0 p-2 opacity-0 group-hover:opacity-90 transition-opacity">
                    <button 
                        className="bg-blue-700 text-white py-2 px-4 w-[150px] md:w-[100px] rounded-md"
                        onClick={handleAdd}
                    >
                        Add
                    </button>
                    <span>
                        Qty: &nbsp;
                        <input 
                            type="number" 
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                            className="border-2 rounded-md p-2 w-20"
                        />
                    </span>
                </div>
            </div>
            <div className="w-full pl-0 lg:pl-6">
                <h3 className="mt-2 text-lg leading-normal">{title}</h3>
                <p className="text-md text-orange-700 leading-normal">${price}</p>
            </div>
        </div>

        {/* Mobile screen */}
        <div 
            className="flex md:hidden flex-col border-b-2 hover:cursor-pointer group hover:bg-slate-100 duration-500"
        >
            <div onClick={handleClick}>
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
            <div 
                className={`flex justify-between p-2 transition-opacity duration-500 ${isActive ? 'block' : 'hidden'}`}

            >
                    <button 
                        className="bg-blue-500 text-white py-2 px-4 w-[180px] rounded-md"
                        onClick={handleAdd}
                    >
                        Add
                    </button>
                    <span>
                        Qty: &nbsp;
                        <input 
                            type="number"  
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                            className="border-2 rounded-md p-2 w-20"
                        />
                    </span>
            </div>
        </div>
        {isSignInModalOpen && <SignInModal isOpen={isSignInModalOpen} onClose={handleSignInModalClose} providers={providers} />}
        </>
    )
}

export default CoffeeCard