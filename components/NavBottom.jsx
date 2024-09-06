"use client";
import { useCart } from "../app/context/CartContext";
import Link from "next/link";
import { useState, useEffect } from "react";
import ProfileNav from "./ProfileNav";
import { useSession } from "next-auth/react";

const NavBottom = () => {
    const { getTotalQuantity, isUserLoggedIn } = useCart();
    const [isOpen, setIsOpen] = useState(false);
    const { data: session } = useSession();

    const toggleNav = () => {
      setIsOpen(!isOpen);
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

    return (
        <div>
        {session?.user && 
        // Mobile screen
        <div className="md:hidden fixed -bottom-3 left-0 z-50 w-full h-20 b-slate-50 border-t-2 rounded-t-xl border-gray-200 bg-slate-50 shadow-inner">
            <div className="grid h-full max-w-full grid-cols-3 mx-auto text-sm">
                <Link href='/' className="inline-flex flex-col items-center justify-center border-gray-200 border-x hover:bg-gray-200">
                    <span className="flex items-center">
                        <img src="/assets/icons/home.svg" alt="Home" width={20} height={20} />
                    </span>
                    <span>Home</span>
                </Link>
                <Link href='/cart'className="inline-flex flex-col items-center justify-center border-gray-200 border-x hover:bg-gray-200">
                    <span className="flex items-center">
                        {getTotalQuantity() > 0 ? (
                            <span className="bg-red-600 text-white pl-2 rounded-full">{getTotalQuantity()} &nbsp;</span>
                        ) : (
                            ''
                        )}  
                        <img src="/assets/icons/bag.svg" alt="Bag" width={20} height={20} />
                    </span>
                    <span>Orders</span>
                </Link>
                <p className="inline-flex flex-col items-center justify-center border-gray-200 border-x hover:bg-gray-200" onClick={toggleNav}>
                    <span className="flex items-center">
                        <img src={!session.user.image ? '/assets/icons/profile.svg' : session.user.image} alt="Profile" width={20} height={20} className="rounded-full" />
                    </span>
                    <span>Profile</span>
                </p>
                <ProfileNav toggleNav={toggleNav} isOpen={isOpen} />
            </div>
        </div>
        }
        </div>
    )
}

export default NavBottom