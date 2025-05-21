"use client";
import { useSession, getProviders } from "next-auth/react";
import { useState, useEffect } from "react";
import { useCart } from "../app/context/CartContext";
import SignInModal from "./SignInModal";
import { FiShoppingBag } from "react-icons/fi";
import { FaMinus, FaPlus } from "react-icons/fa6";

const CoffeeCard = ({ title, image, description, id, price, isActive, handleClick }) => {
    const [quantity, setQuantity] = useState(1);
    const { addItem, addItemToDb } = useCart();
    const { data: session } = useSession();
    const [providers, setProviders] = useState(null);
    const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const setUpProviders = async () => {
            const response = await getProviders();
            setProviders(response);
        };
        setUpProviders();
    }, []);

    const handleAdd = async () => {
        if (session) {
            setIsLoading(true);
            const userEmail = session?.user.email;
            const item = { id: parseInt(id, 10), title, price, quantity: parseInt(quantity, 10), image };
            try {
                const result = await addItemToDb(userEmail, item);
                if (!result.ok) {
                    alert('Failed to add item');
                } else {
                    alert('Item added to cart');
                    handleClick();
                }
            } catch (error) {
                console.log('An error occured during the process');
            } finally {
                setIsLoading(false);
            }
        } else {
            setIsSignInModalOpen(true);
        }
    };

    const handleSignInModalClose = () => {
        setIsSignInModalOpen(false);
    };

    const handleQuantityChange = (val) => {
        setQuantity((prev) => {
            const newVal = prev + val;
            if (newVal < 1) return 1;
            return newVal;
        });
    };

    return (
        <>
        {/* Card Container */}
        <div
            className={`w-full max-w-xs mx-auto bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col transition-shadow duration-300 hover:shadow-2xl ${isLoading ? 'opacity-60 pointer-events-none' : ''}`}
        >
            {/* Image Section */}
            <div className="relative w-full h-56 flex items-center justify-center bg-gradient-to-br from-orange-100 to-orange-200">
                <img
                    src={image}
                    alt={title}
                    className="object-cover w-40 h-40 rounded-xl shadow-md border-4 border-white -mb-8 z-10"
                />
                <span className="absolute top-3 right-3 bg-orange-600 text-white px-3 py-1 rounded-full text-sm font-semibold shadow">${price}</span>
            </div>
            {/* Content Section */}
            <div className="flex-1 flex flex-col justify-between px-6 pt-10 pb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-1 truncate">{title}</h3>
                {description && <p className="text-gray-500 text-sm mb-3 line-clamp-2">{description}</p>}
                <div className="flex items-center justify-between mt-4">
                    {/* Quantity Selector */}
                    <div className="flex items-center gap-2 bg-gray-100 rounded-full px-3 py-1">
                        <button
                            className="p-1 text-orange-600 hover:bg-orange-200 rounded-full disabled:opacity-40"
                            onClick={() => handleQuantityChange(-1)}
                            disabled={quantity <= 1 || isLoading}
                            aria-label="Decrease quantity"
                        >
                            <FaMinus size={14} />
                        </button>
                        <span className="w-6 text-center font-semibold">{quantity}</span>
                        <button
                            className="p-1 text-orange-600 hover:bg-orange-200 rounded-full disabled:opacity-40"
                            onClick={() => handleQuantityChange(1)}
                            disabled={isLoading}
                            aria-label="Increase quantity"
                        >
                            <FaPlus size={14} />
                        </button>
                    </div>
                    {/* Add to Cart Button */}
                    <button
                        className={`flex items-center gap-2 bg-orange-200 hover:bg-orange-300 text-orange-900 font-semibold px-4 py-2 rounded-full transition disabled:opacity-60 ${isLoading ? 'cursor-wait' : ''}`}
                        onClick={handleAdd}
                        disabled={isLoading}
                        aria-label="Add to cart"
                    >
                        {isLoading ? (
                            <svg className="animate-spin h-5 w-5 mr-2 text-orange-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg>
                        ) : (
                            <FiShoppingBag size={18} />
                        )}
                        <span>Add</span>
                    </button>
                </div>
            </div>
        </div>
        {/* Sign In Modal */}
        {isSignInModalOpen && <SignInModal isOpen={isSignInModalOpen} onClose={handleSignInModalClose} providers={providers} />}
        </>
    );
};

export default CoffeeCard;