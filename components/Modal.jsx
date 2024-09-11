"use client";
import { useState, useEffect } from "react";
import { useCart } from "../app/context/CartContext";
import { useSession, getProviders } from "next-auth/react";
import SignInModal from "./SignInModal";
//import { io } from 'socket.io-client';

// Initialize Socket.IO client
//const socket = io('http://localhost:3001');

const Modal = ({ isOpen, onClose, title, image, description, id, price }) => {
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

            onClose();
        } else {
            setIsSignInModalOpen(true);
        }
    };

    const handleSignInModalClose = () => {
        setIsSignInModalOpen(false);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <>
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="relative bg-white p-6 rounded-md shadow-lg w-4/5 lg:w-2/5 h-150">
                <button
                onClick={onClose}
                className="absolute top-0 right-2 text-gray-500 hover:text-gray-700 text-2xl"
                >
                &times;
                </button>
                <div className="flex md:h-50">
                    <div className="flex flex-col w-full">
                        <h2 className="mt-2 text-md leading-normal">{title}</h2>
                        <p className="mt-2 text-md text-orange-700 leading-normal">${price}</p>
                        <img src={image} alt={title} className="w-[80px] h-[80px] md:w-48 md:h-48 rounded-md" />
                    </div>
                    <div className="flex flex-col justify-end items-start pl-2 w-full">
                        <label>
                            Quantity:
                            <input 
                                type="number"
                                value={quantity}
                                onChange={(e) => setQuantity(e.target.value)}
                                className="h-14 w-full px-3 py-2 sm:text-base pl-2 border-2 text-base border-gray-700 rounded-md"
                            />
                        </label>
                        <button 
                            className="py-2 mt-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 w-full"
                            onClick={handleAdd}
                        >
                            Add
                        </button>
                    </div>
                </div>
            </div>
        </div>
        {isSignInModalOpen && <SignInModal isOpen={isSignInModalOpen} onClose={handleSignInModalClose} providers={providers} />}
        </>
    );
};

export default Modal;
