"use client";
import { useCart } from "../app/context/CartContext";
import Link from "next/link";
import { useState, useEffect } from "react";
import ProfileNav from "./ProfileNav";
import { useSession } from "next-auth/react";
import { GoHome } from "react-icons/go";
import { FiShoppingBag } from "react-icons/fi";
import { IoPersonOutline } from "react-icons/io5";


const NavBottom = () => {
    const { getTotalQuantity } = useCart();
    const { data: session } = useSession();
    const [isOpen, setIsOpen] = useState(false);
    const [lastScrollBottom, setLastScrollBottom] = useState(0);
    const [isNavBottomVisible, setIsNavBottomVisible] = useState(true);

    const toggleNav = () => {
        setIsOpen(prev => !prev);
    };

    useEffect(() => {
        if (isOpen) {
          document.body.style.overflow = 'hidden'; // Disable scrolling
        } else {
          document.body.style.overflow = ''; // Enable scrolling
        }
    
        // Cleanup function to ensure overflow is reset when the component unmounts
        return () => {
          document.body.style.overflow = '';
        };
    }, [isOpen]);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollBottom = window.pageYOffset;
            if(!isOpen){
                // Show nav when scrolling up or near the top of the page
                if (currentScrollBottom < lastScrollBottom || currentScrollBottom < 10) {
                    setIsNavBottomVisible(true);
                } else {
                    // Hide nav when scrolling down
                    setIsNavBottomVisible(false);
                }
            }
            else{
                setIsNavBottomVisible(true);
            }
            
            setLastScrollBottom(currentScrollBottom);
            
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [lastScrollBottom]);

    return (
        <div className="border-2 border-red-500">
        {session?.user && 
        <>
        <ProfileNav toggleNav={toggleNav} isOpen={isOpen} />
        // Mobile screen
        <div className={`md:hidden fixed -bottom-24 left-0 z-50 w-full h-20 b-slate-50 border-t-2 rounded-t-xl border-gray-200 bg-slate-50 shadow-inner transition-transform duration-300 ${isNavBottomVisible ? 'translate-y-0' : '-translate-y-full'}`}>
            <div className="grid h-full max-w-full grid-cols-3 mx-auto text-sm">
                <Link href='/' className="inline-flex flex-col items-center justify-center border-gray-200 border-x hover:bg-gray-200">
                    <span className="flex items-center">
                        <GoHome size={20} />
                    </span>
                    <span>Home</span>
                </Link>
                <Link href='/cart'className="inline-flex flex-col items-center justify-center border-gray-200 border-x hover:bg-gray-200">
                    <span className="flex items-center"> 
                        <FiShoppingBag size={20} />
                        {getTotalQuantity() > 0 ? (
                            <span className="text-sm">({getTotalQuantity()})</span>
                        ) : (
                            ''
                        )} 
                    </span>
                    <span>Orders</span>
                </Link>
                <p className="inline-flex flex-col items-center justify-center border-gray-200 border-x hover:bg-gray-200" onClick={toggleNav}>
                    <span className="flex items-center">
                        {!session.user.image ? (
                            <IoPersonOutline size={20} />
                        ) : (
                            <img src={session.user.image} alt="Profile" width={20} height={20} className="rounded-full" />
                        )}
                    </span>
                    <span>Profile</span>
                </p>
            </div>
        </div>
        </>
        }
        </div>
    )
}

export default NavBottom