"use client";
import { useSession } from 'next-auth/react';
import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItemsFromDb, setCartItemsFromDb] = useState([]);
    const { data: session } = useSession();
    const [cartLoading, setCartLoading] = useState(true);

    const user = session?.user.email;

    const fetchItems = async (creator) => {
        try {
            // Ensure creator is provided
            if (!creator) {
                throw new Error('Creator is required to fetch items');
            }
    
            // Construct the URL with query parameters
            const url = new URL('/api/cart', window.location.origin);
            url.searchParams.append('creator', creator);
    
            // Fetch data from the API
            const response = await fetch(url.toString());
    
            // Check for successful response
            if (!response.ok) {
                throw new Error('Failed to fetch items');
            }
    
            // Parse the JSON data
            const itemsData = await response.json();
            setCartItemsFromDb(itemsData.items);
            return itemsData; // Optionally return the data for further use
        } catch (error) {
            console.error('Error fetching items:', error);
        }
    };

    useEffect(() => {
        if (user) {
            const loadCart = async () => {
                try {
                    await fetchItems(user);
                } catch (error) {
                    console.log('Error fetching cart items from DB:', error);
                } finally {
                    setCartLoading(false);
                }
            };
            loadCart();
        }
    }, [user]);
    

    const addItemToDb = async (userEmail, item) => {
        try {
            const response = await fetch('/api/cart', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    creator: userEmail,
                    items: [item],
                }),
            });
            if (response.ok) {
                console.log('Item added to cart DB');
                fetchItems(userEmail);
                return { ok: true };  // Return a result indicating success
            } else {
                const errorText = await response.text();
                console.log('Failed adding item to cart DB:', errorText);
                return { ok: false };  // Return a result indicating failure
            }
        } catch (error) {
            console.log('An error occurred when adding item to cart DB:', error);
            return { ok: false };  // Return a result indicating failure
        }
    };

    const deleteItemFromDb = async (userEmail, itemId) => {
        try {
            const response = await fetch('/api/cart', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    creator: userEmail,
                    itemId,
                }),
            });
            if (response.ok) {
                console.log('Cart item deleted from DB');
            } else {
                const errorText = await response.text();
                console.log('Failed to delete cart item from DB:', errorText);
            }
        } catch (error) {
            console.log('An error occurred when deleting cart item from DB:', error);
        }
    };

    const handleClearCart = async (userEmail) => {
        if (userEmail) {
            try {
                const response = await fetch('/api/cart', {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ creator: userEmail }),
                });
                if (!response.ok) {
                    console.error('Failed to clear cart items in DB');
                } else {
                    console.log('Cleared cart items from DB');
                    fetchItems(userEmail);
                }
            } catch (error) {
                console.error('Failed to clear cart items:', error);
            }
        }
    };
    
    

    const updateQuantityInDb = async (userEmail, itemId, newQuantity) => {
        try {
            const response = await fetch('/api/cart', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    creator: userEmail,
                    itemId: Number(itemId),
                    quantity: newQuantity
                }),
            });
            if (response.ok) {
                console.log('Cart item updated in DB');
                fetchItems(userEmail);
            } else {
                const errorText = await response.text();
                console.log('Failed to update cart item in DB:', errorText);
            }
        } catch (error) {
            console.log('An error occurred when updating cart item in DB:', error);
        }
    };
    

    const getTotalQuantity = () => cartItemsFromDb.reduce((total, item) => total + item.quantity, 0);

    const totalAmount = cartItemsFromDb.reduce((total, item) => item.price * item.quantity + total, 0);
    const vat = totalAmount * 0.12;
    const grandTotal = Number((totalAmount + vat)).toFixed(2);

    const value = useMemo(() => ({getTotalQuantity, handleClearCart, addItemToDb, updateQuantityInDb, totalAmount, grandTotal, vat, fetchItems, cartItemsFromDb, cartLoading}), [cartItemsFromDb]);

    return (
        <CartContext.Provider value={value}>
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
