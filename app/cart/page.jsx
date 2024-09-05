"use client";
import { useSession } from 'next-auth/react';
import { useCart } from '../context/CartContext';
import { useRouter } from 'next/navigation';
import Paypal from '../../components/Paypal';
import { useEffect } from 'react';

const Cart = () => {
    const { cartItems, handleClearCart, updateQuantity, handleCheckout, cancelCheckout, checkOut } = useCart();
    const { data: session } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (!session) {
            router.push('/');
        }
    }, [session, router]);

    const handlePaymentSuccess = async (orderId) => {
        try {
            const response = await fetch('/api/order/new', {
                method: 'POST',
                body: JSON.stringify({
                    creator: session.user.email,
                    orders: cartItems,
                    orderId: orderId,
                }),
            });

            if (response.ok) {
                handleClearCart();
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

    // Calculate total amount
    const totalAmount = cartItems.reduce((total, item) => item.price * item.quantity + total, 0);
    const vat = totalAmount * 0.12;
    const grandTotal = (totalAmount + vat).toFixed(2);

    const handleQuantityChange = (id, e) => {
        const newQuantity = Number(e.target.value);
        updateQuantity(id, newQuantity);
    };

    const handleIncrementQuantity = (id) => {
        const item = cartItems.find(item => item.id === id);
        if (item) {
            updateQuantity(id, item.quantity + 1);
        }
    };

    const handleDecrementQuantity = (id) => {
        const item = cartItems.find(item => item.id === id);
        if (item) {
            updateQuantity(id, Math.max(0, item.quantity - 1));
        }
    };

    return (
        <div className='flex flex-col min-h-screen'>
            <main className='flex-grow'>
                <div className='flex flex-col md:flex-row p-5 md:p-20 mt-32 md:mt-20 '>
                    <div className='w-full'>
                        <h1 className='text-2xl'>Cart</h1>
                        {cartItems.length > 0 ? (
                            <form action="">
                                <ul className='flex flex-col mt-2'>
                                    {cartItems.map((item) => (
                                        <li key={item.id} className='my-2 border-b-2 border-b-slate-200 flex justify-between items-center p-2'>
                                            <div className='flex'>
                                                <button hidden={checkOut} type="button" className="p-2 w-8 h-14 my-6 text-lg" onClick={() => handleDecrementQuantity(item.id)}>-</button>
                                                <input type="text" 
                                                    disabled={checkOut}
                                                    value={item.quantity}
                                                    className='w-12 h-14 border-b-2 px-3 py-2 sm:text-base border-gray-300 my-6 pl-4'
                                                    onChange={(e) => handleQuantityChange(item.id, e)}
                                                />
                                                <button hidden={checkOut} type="button" className="p-2 w-8 h-14 my-6 mr-4  text-lg" onClick={() => handleIncrementQuantity(item.id)}>+</button>
                                                
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
                            <p>No items in the cart</p>
                        )}
                        {cartItems.length > 0 && !checkOut && 
                            <button
                                onClick={handleClearCart}
                                className="mt-4 px-6 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                            >
                                Clear Cart
                            </button>
                        }
                    </div>
                    {cartItems.length > 0 && 
                        <div className='w-full mt-10 md:mt-0 md:p-20'>
                            <h2 className='text-lg'>Order Summary</h2>
                            <table className='table-auto w-full my-10 md:mt-2'>
                                <thead className='text-left text-md'>
                                    <tr>
                                        <th>Item</th>
                                        <th>Price</th>
                                        <th>Quantity</th>
                                        <th>Amount</th>
                                    </tr>
                                </thead>
                                <tbody className='text-md'>
                                    {cartItems.map((cart) => (
                                        <tr key={cart.id}>
                                            <td>{cart.title}</td>
                                            <td>${cart.price}</td>
                                            <td>{cart.quantity}</td>
                                            <td>${(cart.price * cart.quantity).toFixed(2)}</td>
                                        </tr>
                                    ))}
                                    <tr className='border-t-2 border-solid'>
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
                                    <tr className='font-bold border-double border-t-8'>
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
                                    className="px-6 py-2 bg-orange-500 text-white rounded-md hover:bg-blue-600 w-full mt-6"
                                    onClick={cancelCheckout}
                                >Cancel Checkout</button>
                                </>
                            ) : (
                                <button 
                                    className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 w-full"
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
