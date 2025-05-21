"use client";
import { useSession, getProviders } from "next-auth/react";
import { useState, useEffect } from "react";
import { useCart } from "../app/context/CartContext";
import SignInModal from "./SignInModal";
import { FiShoppingBag } from "react-icons/fi";
import { FaMinus, FaPlus } from "react-icons/fa6";

const CoffeeCard = ({ title, image, description, id, price, isActive, handleClick }) => {
    const [quantity, setQuantity] = useState("");
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
            const newVal = prev === '' ? val : prev + val;
            if (newVal < 0) return 0;
            return newVal;
        });
    };

    return (
        <>
        {/* Card Container */}
        <div
            className={`w-full max-w-xs mx-auto bg-gradient-to-br from-orange-50 via-yellow-50 to-orange-100 rounded-3xl shadow-xl overflow-hidden flex flex-col transition-shadow duration-300 hover:shadow-2xl border-2 border-orange-200 ${isLoading ? 'opacity-60 pointer-events-none' : ''}`}
        >
            {/* Image Section */}
            <div className="relative w-full h-72 flex items-center justify-center bg-gradient-to-br from-orange-100 to-orange-200">
                <img
                    src={image}
                    alt={title}
                    className="object-cover w-56 h-56 rounded-2xl shadow-lg border-4 border-white z-10"
                />
                {/* Price Badge - Overlapping the image */}
                <span className="absolute top-8 right-8 z-20 bg-orange-600/90 text-white px-4 py-1 rounded-full text-lg font-extrabold shadow-xl border-2 border-white drop-shadow-lg flex items-center gap-1">
                    ${price}
                </span>
            </div>
            {/* Content Section */}
            <div className="flex-1 flex flex-col justify-between px-7 py-2 md:py-4 bg-gradient-to-b from-white via-orange-50 to-orange-100">
                <h3 className="text-2xl font-extrabold text-orange-900 mb-1 truncate drop-shadow-sm">{title}</h3>
                {description && <p className="text-gray-500 text-base mb-4 line-clamp-2 font-medium">{description}</p>}
                <div className="flex items-center justify-between gap-3 mt-4 w-full">
                    {/* Quantity Selector and Add Button - Together */}
                    <div className="flex items-center bg-white/90 border border-orange-200 rounded-full px-2 py-1 shadow-inner min-w-0 max-w-[260px] mx-auto">
                        <button
                            className="flex items-center justify-center w-8 h-8 rounded-full bg-orange-100 text-orange-600 hover:bg-orange-200 transition disabled:opacity-40 disabled:cursor-not-allowed shadow"
                            onClick={() => handleQuantityChange(-1)}
                            disabled={quantity === '' || quantity <= 0 || isLoading}
                            aria-label="Decrease quantity"
                        >
                            <FaMinus size={18} />
                        </button>
                        <input
                            type="number"
                            min="0"
                            className="w-12 mx-2 text-center font-bold text-lg bg-transparent outline-none text-orange-900 placeholder:text-orange-300 border-none focus:ring-0 appearance-none"
                            value={quantity}
                            onChange={e => setQuantity(e.target.value === '' ? '' : Math.max(0, parseInt(e.target.value, 10))) }
                            placeholder="0"
                            disabled={isLoading}
                        />
                        <button
                            className="flex items-center justify-center w-8 h-8 rounded-full bg-orange-100 text-orange-600 hover:bg-orange-200 transition disabled:opacity-40 disabled:cursor-not-allowed shadow"
                            onClick={() => handleQuantityChange(1)}
                            disabled={isLoading}
                            aria-label="Increase quantity"
                        >
                            <FaPlus size={18} />
                        </button>
                        <button
                            className={`ml-3 flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white font-extrabold px-5 py-2 rounded-full transition-all duration-200 shadow-xl ring-2 ring-orange-300 hover:ring-orange-500 focus:ring-4 focus:ring-orange-400 disabled:opacity-60 ${isLoading ? 'cursor-wait' : ''}`}
                            onClick={handleAdd}
                            disabled={isLoading || quantity === '' || quantity === 0}
                            aria-label="Add to cart"
                        >
                            {isLoading ? (
                                <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg>
                            ) : (
                                <FiShoppingBag size={20} />
                            )}
                            <span className="tracking-wide">Add</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
        {/* Sign In Modal */}
        {isSignInModalOpen && <SignInModal isOpen={isSignInModalOpen} onClose={handleSignInModalClose} providers={providers} />}
        </>
    );
};

export default CoffeeCard;