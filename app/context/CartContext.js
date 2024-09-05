"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';
import { io } from 'socket.io-client';

const CartContext = createContext();
const socket = io('http://localhost:3001');

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const [checkOut, setCheckOut] = useState(false);

    useEffect(() => {
        // Fetch initial cart items
        const fetchCartItems = async () => {
            try {
                const response = await fetch('http://localhost:3001/cart');
                const data = await response.json();
                setCartItems(data);
            } catch (error) {
                console.error('Error fetching cart items:', error);
            }
        };

        fetchCartItems();

        // Listen for cart updates
        socket.on('update cart', (data) => {
            setCartItems(data);
        });

        // New listener for checkout event
        socket.on('checkout initiated', () => {
            setCheckOut(true); // Update state to show PayPal button
        });

        // Listener for cancel checkout event
        socket.on('cancel checkout initiated', () => {
            setCheckOut(false);
        });

        // Cleanup on unmount
        return () => {
            socket.off('update cart');
            socket.off('checkout initiated');
        };
    }, []);

    useEffect(() => {
        // Listen for cart items updates from the server
        socket.on('cart items', (items) => {
            setCartItems(items);
        });

        // Cleanup on unmount
        return () => {
            socket.off('cart items');
        };
    }, []);

    // Add item
    const addItem = (item) => {
        socket.emit('add item', item); // Emit to server
        setCartItems(prevItems => {
            const existingItemIndex = prevItems.findIndex(i => i.id === item.id);
            if (existingItemIndex >= 0) {
                const updatedItems = [...prevItems];
                updatedItems[existingItemIndex] = {
                    ...updatedItems[existingItemIndex],
                    quantity: updatedItems[existingItemIndex].quantity + item.quantity
                };
                return updatedItems;
            } else {
                return [...prevItems, item];
            }
        });
    };


    // Remove item by id
    const handleRemoveItem = (id) => {
        setCartItems(prevItems => prevItems.filter(item => item.id !== id));
    };

    const handleClearCart = () => {
        setCartItems([]);
        socket.emit('clear cart'); // Notify the server to clear the cart
    };    

    const updateQuantity = (id, newQuantity) => {
        // Emit update to the server
        socket.emit('update quantity', { id, quantity: newQuantity });
    };

    // Initiate checkout
    const handleCheckout = () => {
        socket.emit('checkout');
        setCheckOut(true);
    };

    // Cancel checkout
    const cancelCheckout = () => {
        socket.emit('cancel checkout');
        setCheckOut(false);
    };

    // Total quantity
    const getTotalQuantity = () => cartItems.reduce((total, item) => total + item.quantity, 0);

    return (
        <CartContext.Provider value={{ cartItems, getTotalQuantity, handleClearCart, addItem, updateQuantity, handleCheckout, cancelCheckout, checkOut }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};
