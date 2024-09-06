"use client";
import Link from "next/link";
import { navLinks } from "../app/constants";
import { useState, useEffect } from "react";
import { signIn, signOut, useSession, getProviders } from 'next-auth/react';
import SignInModal from "./SignInModal";
import { useCart } from "../app/context/CartContext";

const Nav = () => {
    const { getTotalQuantity, toggleMenu, isMenuOpen, isNavVisible } = useCart();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [providers, setProviders] = useState(null);
    const { data: session } = useSession();

    const [dropdown, setDropdown] = useState(false);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

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


    return (
        <>
        <div className={`fixed top-0 left-0 w-full shadow-md bg-slate-50 md:px-20 px-7 transition-transform duration-500 ${isNavVisible ? 'translate-y-0' : '-translate-y-full'}`}>
            <div className="md:flex items-center justify-between py-4 bg-slate-50">
                <div className="font-bold text-2xl cursor-pointer flex items-center font-satoshi text-gray-800 w-[150px]">
                    <a href="/" className="flex justify-center items-center text-xl font-semibold pr-80">
                        <img src="/assets/icons/coffeecup.png" alt="Logo" width={50} height={50} /> 
                        <p className="text-2xl">TestApp</p>
                    </a>
                </div>

                <div onClick={() => toggleMenu()} className="text-3xl absolute right-8 top-7 cursor-pointer md:hidden">
                    <img src="/assets/icons/hamburger.png" alt="Hamburger" width={25} height={25} />
                </div>
                <ul className={`md:flex md:items-center md:space-x-8 absolute md:static bg-slate-50 md:z-auto z-[-1] left-0 w-full md:w-auto md:pl-0 pl-9 transition-all duration-500 ease-in ${isMenuOpen ? 'top-20 shadow-lg' : 'top-[-490px]'} md:shadow-none`}>
                    {navLinks.map((link) => (
                        <li key={link.label} className="flex flex-row md:ml-8 text-md md:text-lg md:my-0 my-4">
                            <a href={link.href} className="text-gray-800 duration-200 hover:text-coconut">{link.label}</a>
                        </li>
                    ))}
                    {session?.user ? (
                        <>
                        <img 
                            src={!session.user.image ? '/assets/icons/profile.svg' : session.user.image} 
                            alt="NavProfile" width={40} height={40} 
                            className="hidden md:flex ml-2 p-1 border-2 border-coconut rounded-full hover:cursor-pointer"
                            onClick={toggleDropdown}
                        />
                        {dropdown && 
                            <div className="absolute right-16 z-10 top-16 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                <div className="py-1" role="none" onClick={toggleDropdown}>
                                <Link href='/profile'>
                                    <p className="block px-4 py-2 text-sm text-gray-700">{session.user.email}</p>
                                </Link>
                                </div>
                                <div className="py-1" role="none" onClick={toggleDropdown}>
                                    <Link href='/history'>
                                        <p className="block px-4 py-2 text-sm text-gray-700">Order History</p>
                                    </Link>
                                </div>
                                <div className="py-1" role="none">
                                    <button 
                                        type="button" 
                                        className="block px-4 py-2 text-sm text-gray-700" 
                                        onClick={signOut}
                                    >
                                        Sign Out
                                    </button>
                                </div>
                            </div>
                        }
                        </>
                    ) : (
                        <>
                            <button
                                className="pb-1 px-2 border-2 border-orange-600 text-orange-600 h-10 w-[96px] rounded-full md:ml-8 text-lg md:my-0 mb-4 hover:bg-orange-600 hover:text-orange-50" 
                                onClick={openModal}
                            >
                                Sign In
                            </button>
                        </>
                    )}
                </ul>
            </div>
            {session?.user &&
                <div className="hidden md:flex justify-end mb-2">
                    <Link href='/cart' className="flex">
                        <span className="text-slate-700 text-sm">My Order &nbsp;</span>
                        <img src="/assets/icons/bag.svg" alt="Bag" width={20} height={20} />
                        {getTotalQuantity() > 0 &&
                            <span className="text-sm">({getTotalQuantity()})</span>
                        }
                    </Link>
                </div>
            }
        </div>
        
        <SignInModal isOpen={isModalOpen} onClose={closeModal} providers={providers} />
        </>
    );
};

export default Nav;
