"use client";
import { useSession } from 'next-auth/react';
import { useCart } from '../context/CartContext'; 
import { useRouter } from 'next/navigation';
import Paypal from '../../components/Paypal';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FiMinus, FiPlus, FiShoppingBag } from "react-icons/fi";

const Cart = () => {
    const { handleClearCart, updateQuantityInDb, totalAmount, grandTotal, vat, cartItemsFromDb, cartLoading } = useCart();
    const { data: session } = useSession();
    const router = useRouter();
    const [checkOut, setCheckOut] = useState(false);

    useEffect(() => {
        if (!session) {
            router.push('/');
        }
    }, []);

    const handleCheckout = () => {
        setCheckOut(true);
    }

    const cancelCheckout = () => {
        setCheckOut(false);
    }

    const handlePaymentSuccess = async (orderId) => {
        try {
            const response = await fetch('/api/order/new', {
                method: 'POST',
                body: JSON.stringify({
                    creator: session.user.email,
                    orders: cartItemsFromDb,
                    price: grandTotal,
                    orderId: orderId,
                }),
            });

            if (response.ok) {
                handleClearCart(session.user.email);
                alert('Order successfully processed!');
                router.push('/');
            } else {
                alert('Failed to process orders!');
                cancelCheckout();
            }
        } catch (error) {
            console.error('Error creating order in the database:', error);
            alert('An error occurred while creating your order.');
            cancelCheckout();
        }
    };


    const handleQuantityChange = (id, e) => {
        const newQuantity = Number(e.target.value);
        updateQuantityInDb(session.user.email ,id, newQuantity);
    };
    
    const handleIncrementQuantity = (id) => {
        const item = cartItemsFromDb.find(item => item.id === id);
        if (item) {
            updateQuantityInDb(session.user.email ,id, item.quantity + 1);
        }
    };
    
    const handleDecrementQuantity = async(id) => {
        const item = cartItemsFromDb.find(item => item.id === id);
        if (item) {
            try {
                await updateQuantityInDb(session.user.email ,id, Math.max(0, item.quantity - 1));
                console.log('Item quantity updated');
            } catch (error) {
                console.error('Error removing item from cart: ', error);
            }
        }
    };
    
    const handleRemoveItem = (id) => {
        handleRemoveItem(id);
    };

    return (
        <div className='flex flex-col min-h-screen'>
            <main className='flex-grow'>
                <div className='flex flex-col md:flex-row p-5 md:p-20 mt-28 md:mt-20 '>
                    <div className='w-full'>
                        <h1 className='text-2xl'>Cart</h1>
                        {cartItemsFromDb.length > 0 ? (
                            <form action="">
                                <ul className='flex flex-col mt-2'>
                                    {cartItemsFromDb.map((item) => (
                                        <li key={item.id} className='my-2 border-b-2 border-b-slate-200 flex justify-between items-center p-2'>
                                            <div className='flex'>
                                                <button hidden={checkOut} type="button" className="p-2 w-8 h-14 my-6 text-lg" onClick={() => handleDecrementQuantity(item.id)}>
                                                    <FiMinus />
                                                </button>
                                                <input type="text" 
                                                    disabled={checkOut}
                                                    value={item.quantity}
                                                    className='w-12 h-14 border-b-2 px-3 py-2 sm:text-base border-gray-300 my-6 pl-4'
                                                    onChange={(e) => handleQuantityChange(item.id, e)}
                                                />
                                                <button hidden={checkOut} type="button" className="p-2 w-8 h-14 my-6 mr-4  text-lg" onClick={() => handleIncrementQuantity(item.id)}>
                                                    <FiPlus />
                                                </button>
                                                
                                                <img 
                                                    src={item.image} 
                                                    alt={item.title} 
                                                    className="w-[80px] h-[80px] rounded-md"
                                                />
                                            </div>
                                            <div>
                                                <h3 className="text-right mt-2 text-md leading-normal">{item.title}</h3>
                                                <p className="text-right text-sm text-orange-700 leading-normal">${(item.price * item.quantity).toFixed(2)}</p>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </form>
                        ) : (
                            <>
                            <p>No items in the cart</p>
                            <Link href='/#products'><p className='text-blue-600 my-4 flex items-end'>Order now &nbsp; <FiShoppingBag size={25} /> </p></Link>
                            
                            {cartLoading && <img src="/assets/icons/loading.svg" alt="Loading" width={40} height={40}/>}
                            </>
                        )}
                        {cartItemsFromDb.length > 0 && !checkOut && 
                        <>
                            <Link href='/#products'><p className='text-blue-600 underline my-4'>Add more...</p></Link>
                            <button
                                onClick={()=> handleClearCart(session.user.email)}
                                className="mt-4 px-6 py-4 bg-red-500 text-white rounded-md hover:bg-red-600"
                            >
                                Clear Cart
                            </button>
                        </>
                        }
                    </div>
                    {cartItemsFromDb.length > 0 && 
                        <div className='w-full mt-10 md:mt-0 md:p-20'>
                            <h2 className='text-xl'>Order Summary</h2>
                            <table className='table-auto w-full my-4 md:mt-2 border-separate border-spacing-y-4'>
                                <thead className='text-left text-lg bg-gray-100 border-t-2 border-solid border-gray-800'>
                                    <tr>
                                        <th>Item</th>
                                        <th>Price</th>
                                        <th>Qty</th>
                                        <th>Amount</th>
                                    </tr>
                                </thead>
                                <tbody className='text-md'>
                                    {cartItemsFromDb.map((cart) => (
                                        <tr key={cart.id}>
                                            <td>{cart.title}</td>
                                            <td>${cart.price}</td>
                                            <td>{cart.quantity}</td>
                                            <td>${(cart.price * cart.quantity).toFixed(2)}</td>
                                        </tr>
                                    ))}
                                    <tr className='bg-gray-100 border-t-2 border-solid border-gray-800'>
                                        <td>Total</td>
                                        <td></td>
                                        <td></td>
                                        <td>${totalAmount.toFixed(2)}</td>
                                    </tr>
                                    <tr>
                                        <td>Vat 12%</td>
                                        <td></td>
                                        <td></td>
                                        <td>${vat.toFixed(2)}</td>
                                    </tr>
                                    <tr className='bg-gray-100 font-bold border-t-8 border-double border-gray-800'>
                                        <td>Grand Total</td>
                                        <td></td>
                                        <td></td>
                                        <td>${grandTotal}</td>
                                    </tr>
                                </tbody>
                            </table>
                                    
                            {checkOut ? (
                                <>
                                <Paypal grandTotal={grandTotal} onPaymentSuccess={handlePaymentSuccess} />
                                <button 
                                    className="px-6 py-4 bg-orange-500 text-white rounded-md hover:bg-blue-600 w-full mt-6"
                                    onClick={cancelCheckout}
                                >Cancel Checkout</button>
                                </>
                            ) : (
                                <button 
                                    className="px-6 py-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 w-full"
                                    onClick={handleCheckout}
                                >Checkout
                                </button>
                            )}
                        </div>
                    }
                </div>
            </main>
        </div>
    );
};

export default Cart;
