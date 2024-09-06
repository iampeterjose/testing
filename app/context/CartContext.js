"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const [checkOut, setCheckOut] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    // States to manage scroll direction and visibility
    const [lastScrollTop, setLastScrollTop] = useState(0);
    const [isNavVisible, setIsNavVisible] = useState(true);

    const toggleMenu = () => {
        setIsMenuOpen(prev => !prev);
    };

    const toggleNav = () => {
        setIsOpen(prev => !prev);
    };

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollTop = window.pageYOffset;
            if(!isMenuOpen){
                // Show nav when scrolling up or near the top of the page
                if (currentScrollTop < lastScrollTop || currentScrollTop < 50) {
                    setIsNavVisible(true);
                } else {
                    // Hide nav when scrolling down
                    setIsNavVisible(false);
                }
            }
            else{
                setIsNavVisible(true);
            }
            
            setLastScrollTop(currentScrollTop);
            
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [lastScrollTop]);

    // Load cart items from local storage when component mounts
    useEffect(() => {
        const savedData = localStorage.getItem('cartItems');
        if (savedData) {
            setCartItems(JSON.parse(savedData));
        }
    }, []);
    // Save data to local storage whenever data changes
    useEffect(() => {
        if (cartItems.length > 0) {
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
        }
    }, [cartItems]); // Runs whenever `data` changes

    // Add item
    const addItem = (item) => {
        setCartItems(prevItems => {
            // Check if item already exists
            const existingItemIndex = prevItems.findIndex(i => i.id === item.id);
            if (existingItemIndex >= 0) {
                // Update quantity if item already exists
                const updatedItems = [...prevItems];
                updatedItems[existingItemIndex] = {
                    ...updatedItems[existingItemIndex],
                    quantity: updatedItems[existingItemIndex].quantity + item.quantity
                };
                return updatedItems;
            } else {
                // Add new item
                return [...prevItems, item];
            }
        });
    };

    // Remove item by id
    const handleRemoveItem = (id) => {
        setCartItems(prevItems => prevItems.filter(item => item.id !== id));
    };

    //Clear or remove all items in the cart
    const handleClearCart = () => {
        setCartItems([]);
        try {
            localStorage.removeItem('cartItems');
            console.log('Cleared cart items from localStorage');
        } catch (error) {
            console.error('Failed to clear cart items from localStorage:', error);
        }
    };

    const handleCheckout = () => {
        setCheckOut(true);
    }

    const cancelCheckout = () => {
        setCheckOut(false);
    }

    const updateQuantity = (id, newQuantity) => {
        setCartItems(prevItems => {
            const item = prevItems.find(item => item.id === id);
            if (item && newQuantity === 0) {
                // Confirm removal when quantity is set to 0
                const proceed = window.confirm("Are you sure you want to remove this item from the cart?");
                if (!proceed) {
                    // If user does not confirm, revert to the previous quantity
                    return prevItems;
                }
            }

            const updatedItems = prevItems
                .map(item => item.id === id ? { ...item, quantity: newQuantity } : item)
                .filter(item => item.quantity > 0); // Remove items with quantity 0 if confirmed
            return updatedItems;
        });
    };

    // Total quantity
    const getTotalQuantity = () => cartItems.reduce((total, item) => total + item.quantity, 0);

    // Debugging logs
    // useEffect(() => {
    //     console.log('Cart items updated:', cartItems);
    // }, [cartItems]);


    return (
        <CartContext.Provider value={{ cartItems, getTotalQuantity, handleClearCart, addItem, updateQuantity, handleCheckout, cancelCheckout, checkOut, toggleMenu, isMenuOpen, toggleNav, isOpen, isNavVisible }}>
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
