"use client";
import { useRef, useState, useEffect } from "react";

const Paypal = ({grandTotal, onPaymentSuccess}) => {
    const paypal = useRef();
    const [isPayPalReady, setIsPayPalReady] = useState(false);

    useEffect(() => {
        // Check if the PayPal script is already loaded
        if (window.paypal) {
            setIsPayPalReady(true);
            return;
        } 
        else {
            // Listen for the PayPal script load event
            const handleScriptLoad = () => {
                setIsPayPalReady(true);
        };

        // Create and append the PayPal script
        const script = document.createElement("script");
        script.src = "https://sandbox.paypal.com/sdk/js?client-id=Aaem4_MW1kd-SNbooCSeGAJr19fnBNP8Cvh9WDg49GhEL9wjx8cFr-QPQfB4REZFhSVQmzXQ7i4mVbs7&currency=USD";
        script.async = true;
        script.onload = handleScriptLoad;
        script.onerror = () => console.error("Failed to load PayPal script");
        document.body.appendChild(script);

        // Cleanup on component unmount
        // return () => {
        //     document.body.removeChild(script);
        // };
        }
    }, []);


    useEffect(() => {
        if (isPayPalReady && window.paypal) {
            window.paypal.Buttons({
                createOrder: (data, actions) => {
                    return actions.order.create({
                        intent: "CAPTURE",
                        purchase_units: [
                            {
                                amount: {
                                    currency_code: "USD",
                                    value: parseFloat(grandTotal).toFixed(2)
                                }
                            }
                        ]
                    });
                },
                onApprove: async (data, actions) => {
                    try {
                        const details = await actions.order.capture();
                        const orderId = data.orderID;

                        if (onPaymentSuccess) {
                            onPaymentSuccess(orderId);
                        }

                        // Optionally update any other component or state
                    } catch (error) {
                        console.error("PayPal error:", error);
                        alert('An error occurred with PayPal payment');
                    }
                },
                onError: (error) => {
                    console.error("PayPal error:", error);
                    alert('An error occured with PayPal payment');
                }
            }).render(paypal.current);
        }
    }, [isPayPalReady, grandTotal, onPaymentSuccess]);

    return (
        <div>
            <div ref={paypal}></div>
        </div>
    )
}

export default Paypal