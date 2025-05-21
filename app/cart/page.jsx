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
        <div className="flex flex-col min-h-screen bg-gradient-to-br from-orange-50 to-white">
            <main className="flex-grow flex items-center justify-center">
                <div className="w-full max-w-5xl mx-auto bg-white rounded-3xl shadow-2xl p-6 md:p-12 mt-32 md:mt-24 flex flex-col md:flex-row gap-10">
                    {/* Cart Items Section */}
                    <div className="w-full md:w-2/3">
                        <h1 className="text-3xl font-bold text-orange-700 mb-6">Cart</h1>
                        {cartItemsFromDb.length > 0 ? (
                            <form>
                                <ul className="flex flex-col gap-4">
                                    {cartItemsFromDb.map((item) => (
                                        <li key={item.id} className="flex flex-col md:flex-row justify-between items-center bg-orange-50 rounded-xl shadow p-4 border border-orange-100">
                                            <div className="flex items-center gap-4 w-full md:w-auto">
                                                <img src={item.image} alt={item.title} className="w-20 h-20 rounded-lg object-cover border-2 border-orange-100" />
                                                <div className="flex flex-col gap-1">
                                                    <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
                                                    <p className="text-orange-700 font-bold">${(item.price * item.quantity).toFixed(2)}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 mt-4 md:mt-0">
                                                <button hidden={checkOut} type="button" className="p-2 w-8 h-8 rounded-full bg-orange-200 text-orange-700 hover:bg-orange-300 flex items-center justify-center" onClick={() => handleDecrementQuantity(item.id)} disabled={checkOut}>
                                                    <FiMinus />
                                                </button>
                                                <input type="text"
                                                    disabled
                                                    value={item.quantity}
                                                    className="w-12 h-10 border-b-2 px-3 py-2 text-center text-lg border-orange-200 bg-white"
                                                    onChange={(e) => handleQuantityChange(item.id, e)}
                                                />
                                                <button hidden={checkOut} type="button" className="p-2 w-8 h-8 rounded-full bg-orange-200 text-orange-700 hover:bg-orange-300 flex items-center justify-center" onClick={() => handleIncrementQuantity(item.id)} disabled={checkOut}>
                                                    <FiPlus />
                                                </button>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </form>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-12">
                                <p className="text-lg text-slate-500">No items in the cart</p>
                                <Link href='/#products'><p className="text-orange-600 my-4 flex items-center gap-2 font-semibold hover:underline">Order now <FiShoppingBag size={22} /></p></Link>
                                {cartLoading && <img src="/assets/icons/loading.svg" alt="Loading" width={40} height={40} />}
                            </div>
                        )}
                        {cartItemsFromDb.length > 0 && !checkOut && (
                            <div className="flex flex-col md:flex-row gap-4 mt-6">
                                <Link href='/#products'><p className="text-blue-600 underline">Add more...</p></Link>
                                <button
                                    onClick={() => handleClearCart(session.user.email)}
                                    className="px-6 py-3 bg-red-500 text-white rounded-full font-semibold hover:bg-red-600 transition"
                                >
                                    Clear Cart
                                </button>
                            </div>
                        )}
                    </div>
                    {/* Order Summary Section */}
                    {cartItemsFromDb.length > 0 && (
                        <div className="w-full md:w-1/3 bg-orange-50 rounded-2xl shadow-md p-6 flex flex-col gap-4 mt-10 md:mt-0">
                            <h2 className="text-2xl font-bold text-orange-700 mb-2">Order Summary</h2>
                            <table className="table-auto w-full my-2 border-separate border-spacing-y-2">
                                <thead className="text-left text-md bg-orange-100">
                                    <tr>
                                        <th>Item</th>
                                        <th>Price</th>
                                        <th>Qty</th>
                                        <th>Amount</th>
                                    </tr>
                                </thead>
                                <tbody className="text-md">
                                    {cartItemsFromDb.map((cart) => (
                                        <tr key={cart.id} className="">
                                            <td>{cart.title}</td>
                                            <td>${cart.price}</td>
                                            <td>{cart.quantity}</td>
                                            <td>${(cart.price * cart.quantity).toFixed(2)}</td>
                                        </tr>
                                    ))}
                                    <tr className="bg-orange-100 font-semibold">
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
                                    <tr className="bg-orange-200 font-bold">
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
                                        className="px-6 py-3 bg-orange-500 text-white rounded-full font-semibold hover:bg-orange-600 w-full mt-4"
                                        onClick={cancelCheckout}
                                    >Cancel Checkout</button>
                                </>
                            ) : (
                                <button
                                    className="px-6 py-3 bg-blue-500 text-white rounded-full font-semibold hover:bg-blue-600 w-full"
                                    onClick={handleCheckout}
                                >Checkout</button>
                            )}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default Cart;
