    "use client";
import { useSession, getProviders } from "next-auth/react";
import { useState, useEffect } from "react";
import { useCart } from "../app/context/CartContext";
import SignInModal from "./SignInModal";
import { GrAdd } from "react-icons/gr";
import { FiShoppingBag } from "react-icons/fi";

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

    const handleAdd = async() => {
        if (session) {
            setIsLoading(true);
            console.log("Loading started...");
            const userEmail = session?.user.email;
            const item = { id: parseInt(id, 10), title, price, quantity: parseInt(quantity, 10), image };
            try {
                const result = await addItemToDb(userEmail, item);
                console.log('Result: ', result);
                if(!result.ok){
                    alert('Failed to add item');
                }
                else{
                    alert('Item added to cart');
                    handleClick();
                }
            } catch (error) {
                console.log('An error occured during the process');
            } finally {
                setIsLoading(false);
                console.log("Loading ended.");
            }

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
            className={`hidden md:flex justify-center items-center flex-col w-full hover:cursor-pointer group hover:shadow-xl transition-shadow hover:bg-slate-100 duration-500 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={isLoading}
        >
            <div className="relative group flex-shrink-0">
                <img 
                    src={image} 
                    alt={title} 
                    className="w-[280px] lg:h-[280px] md:h-[200px] rounded-md"
                />
                <div className="flex justify-between bg-slate-100 lg:text-sm md:text-xs rounded-t-md w-full absolute bottom-0 p-2 transform translate-y-10 opacity-0 group-hover:translate-y-0 group-hover:opacity-90 transition-transform duration-500 ease-out">
                    <button 
                        className={`border-2 border-blue-700 text-slate-900 hover:bg-blue-700 hover:text-white py-1 px-2 w-30 rounded-md flex justify-center items-center`}
                        onClick={handleAdd}
                    >
                        Add &nbsp;
                        <FiShoppingBag size={10} />
                    </button>
                    <span className="flex justify-center items-center">
                        Qty: &nbsp;
                        <input 
                            type="number"  
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                            className="border-2 rounded-md py-1 px-2 w-12 h-14"
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
            className={`flex md:hidden flex-col border-b-2 hover:cursor-pointer group hover:bg-slate-100 duration-500 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={isLoading}
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
                className={`flex justify-between text-sm px-2 mb-2 overflow-hidden ${isActive ? 'max-h-[200px]' : 'max-h-0'}`}
                style={{ maxHeight: isActive ? '200px' : '0' }}
            >
                <button 
                    className={`border-2 border-blue-500 text-slate-900 hover:bg-blue-500 hover:text-white py-2 px-4 w-30 rounded-md flex justify-center items-center`}
                    onClick={handleAdd}
                >
                    Add &nbsp;
                    <FiShoppingBag />
                </button>
                <span className="flex justify-center items-center">
                    Qty: &nbsp;
                    <input 
                        type="number"  
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        className="border-2 rounded-md p-2 w-16 h-14"
                    />
                </span>
            </div>
        </div>
        {isSignInModalOpen && <SignInModal isOpen={isSignInModalOpen} onClose={handleSignInModalClose} providers={providers} />}
        </>
    )
}

export default CoffeeCard