"use client";
import { useState, useEffect } from "react";
import Paypal from "../../components/Paypal";

const Test = () => {
    const [checkOut, setCheckOut] = useState(false);
    const [orderId, setOrderId] = useState(null); //Store order ID

    const handleCheckOut = () => {
        setCheckOut(true);
    };

    const handlePaymentSuccess = (id) => {
        setOrderId(id);
        console.log(id);
    };

    return (
        <div className="flex flex-col min-h-screen">
            <main className="flex-grow">
                <div className="mt-40">
                    <button onClick={handleCheckOut}>
                        Check Out
                    </button>
                    {checkOut && <Paypal grandTotal={2.99} onPaymentSuccess={handlePaymentSuccess} />}
                </div>
            </main>
        </div>
    )
}

export default Test