"use client";
import Link from "next/link";
import { navLinks } from "../app/constants";
import { useState, useEffect } from "react";
import { signIn, signOut, useSession, getProviders } from 'next-auth/react';
import SignInModal from "./SignInModal";
import { useCart } from "../app/context/CartContext";
import { FiShoppingBag } from "react-icons/fi";

const Nav = () => {
    const { getTotalQuantity } = useCart();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [lastScrollTop, setLastScrollTop] = useState(0);
    const [isNavVisible, setIsNavVisible] = useState(true);
    const [providers, setProviders] = useState(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { data: session } = useSession();

    const [dropdown, setDropdown] = useState(false);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    const toggleMenu = () => {
        setIsMenuOpen(prev => !prev);
    };

    const toggleDropdown = () => {
        setDropdown(prev => !prev);
    };

    useEffect(() => {
        const setUpProviders = async () => {
            const response = await getProviders();
            setProviders(response);
        }

        setUpProviders();
    }, []);

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


    return (
        <>
        <div className={`fixed z-30 top-0 left-0 w-full backdrop-blur-md bg-white/80 shadow-lg md:px-20 px-4 transition-transform duration-500 ${isNavVisible ? 'translate-y-0' : '-translate-y-24'}`}>
            <div className="md:flex items-center justify-between py-3 relative">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 text-2xl font-bold font-satoshi text-gray-800 hover:text-orange-600 transition">
                    <img src="/assets/images/coffeeimage.png" alt="Logo" width={44} height={44} className="rounded-full shadow-md border-2 border-orange-200 hover:scale-105 transition-transform" />
                    <span className="tracking-tight">TestApp</span>
                </Link>
                {/* Hamburger */}
                <button onClick={toggleMenu} className="text-3xl absolute right-6 top-3 cursor-pointer md:hidden p-2 rounded-full bg-orange-50 hover:bg-orange-100 transition border border-orange-100">
                    <img src="/assets/icons/hamburger.png" alt="Menu" width={28} height={28} />
                </button>
                {/* Mobile Sign In button (top right, like hamburger) */}
                {!session?.user && (
                    <div className="md:hidden absolute right-20 top-3 flex items-center justify-center">
                        <button
                            className="px-4 py-2 border-2 border-orange-600 text-orange-600 rounded-full text-base font-semibold hover:bg-orange-600 hover:text-white transition shadow bg-white"
                            onClick={openModal}
                            style={{ maxWidth: 120 }}
                        >
                            Sign In
                        </button>
                    </div>
                )}
                {/* Nav Links */}
                <ul className={`md:flex md:items-center md:space-x-8 md:z-auto z-[-1] left-0 w-full md:w-auto md:pl-0 pl-8 transition-all duration-500 ease-in ${isMenuOpen ? 'absolute top-16 shadow-xl rounded-b-3xl border-b-2 border-orange-100' : 'absolute top-[-490px]'} md:static md:shadow-none bg-white/90 md:bg-transparent`}>
                    {navLinks.map((link) => (
                        <li key={link.label} className="md:ml-6 text-base md:text-lg my-3 md:my-0">
                            <Link href={link.href} className="inline-block px-3 py-2 rounded-xl text-gray-800 hover:bg-orange-100 hover:text-orange-700 font-semibold transition-colors duration-200 focus:bg-orange-200 focus:text-orange-900 focus:outline-none">
                                {link.label}
                            </Link>
                        </li>
                    ))}
                </ul>
                {/* Cart Icon & Profile (side by side) */}
                <div className="hidden md:flex items-center ml-6 gap-4">
                    <Link href='/cart' className="relative flex items-center group px-4 py-2 rounded-full bg-orange-50 hover:bg-orange-100 transition shadow-sm border border-orange-100">
                        <div className="relative">
                            <FiShoppingBag size={24} className="text-orange-600 group-hover:scale-110 transition-transform" />
                            {getTotalQuantity() > 0 && (
                                <span className="absolute -top-2 -right-3 bg-orange-600 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow-lg border-2 border-white animate-bounce">
                                    {getTotalQuantity()}
                                </span>
                            )}
                        </div>
                        <span className="ml-3 text-gray-800 text-base font-semibold group-hover:text-orange-600 transition select-none">My Order</span>
                    </Link>
                    {session?.user && (
                        <>
                        <img
                            src={!session.user.image ? '/assets/icons/profile.svg' : session.user.image}
                            alt="NavProfile" width={38} height={38}
                            className="ml-2 p-1 border-2 border-orange-200 rounded-full hover:bg-orange-100 hover:scale-105 hover:cursor-pointer transition"
                            onClick={toggleDropdown}
                        />
                        {dropdown &&
                            <div className="absolute right-6 z-20 top-16 w-56 origin-top-right divide-y divide-gray-100 rounded-xl bg-white shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none animate-fade-in">
                                <div className="py-2" role="none" onClick={toggleDropdown}>
                                    <Link href='/profile'>
                                        <p className="block px-4 py-2 text-sm text-gray-700 font-semibold hover:bg-orange-50">{session.user.email}</p>
                                    </Link>
                                </div>
                                <div className="py-2" role="none" onClick={toggleDropdown}>
                                    <Link href='/history'>
                                        <p className="block px-4 py-2 text-sm text-gray-700 font-semibold hover:bg-orange-50">Order History</p>
                                    </Link>
                                </div>
                                <div className="py-2" role="none">
                                    <button
                                        type="button"
                                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 font-semibold hover:bg-orange-100"
                                        onClick={signOut}
                                    >
                                        Sign Out
                                    </button>
                                </div>
                            </div>
                        }
                        </>
                    )}
                </div>
                {/* Sign In button, placed after nav links and cart for proper alignment */}
                {!session?.user && (
                    <div className="hidden md:flex items-center ml-6">
                        <button
                            className="px-5 py-2 border-2 border-orange-600 text-orange-600 rounded-full text-base font-semibold hover:bg-orange-600 hover:text-white transition"
                            onClick={openModal}
                        >
                            Sign In
                        </button>
                    </div>
                )}
            </div>
        </div>
        <SignInModal isOpen={isModalOpen} onClose={closeModal} providers={providers} />
        </>
    );
};

export default Nav;
