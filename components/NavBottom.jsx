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
        document.body.style.overflow = isOpen ? "hidden" : "";
        return () => {
            document.body.style.overflow = "";
        };
    }, [isOpen]);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollBottom = window.pageYOffset;
            if (!isOpen) {
                setIsNavBottomVisible(currentScrollBottom < lastScrollBottom || currentScrollBottom < 10);
            } else {
                setIsNavBottomVisible(true);
            }
            setLastScrollBottom(currentScrollBottom);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [lastScrollBottom]);

    // Do not render anything if not signed in
    if (!session?.user) return null;

    return (
        <>
            <ProfileNav toggleNav={toggleNav} isOpen={isOpen} />

            <div className="fixed md:hidden bottom-0 left-0 z-40 w-full h-20 border-t border-orange-200 bg-white/90 shadow-2xl rounded-t-2xl transition-transform duration-300"
                style={{ transform: isNavBottomVisible ? "translateY(0)" : "translateY(100%)" }}
            >
                <div className="grid h-full max-w-full grid-cols-3 mx-auto text-sm">
                    <Link href='/' className="inline-flex flex-col items-center justify-center gap-1 hover:bg-orange-50 transition font-semibold text-orange-700">
                        <span className="flex items-center"><GoHome size={26} /></span>
                        <span className="text-xs">Home</span>
                    </Link>
                    <Link href='/cart' className="inline-flex flex-col items-center justify-center gap-1 hover:bg-orange-50 transition font-semibold text-orange-700 relative">
                        <span className="flex items-center relative">
                            <FiShoppingBag size={24} />
                            {getTotalQuantity() > 0 && (
                                <span className="absolute -top-2 -right-4 bg-orange-600 text-white text-xs font-bold px-1.5 py-0.5 rounded-full shadow border-2 border-white animate-bounce">
                                    {getTotalQuantity()}
                                </span>
                            )}
                        </span>
                        <span className="text-xs">Orders</span>
                    </Link>
                    <button className="inline-flex flex-col items-center justify-center gap-1 hover:bg-orange-50 transition font-semibold text-orange-700 focus:outline-none" onClick={toggleNav}>
                        <span className="flex items-center">
                            {!session.user.image ? (
                                <IoPersonOutline size={25} />
                            ) : (
                                <img src={session.user.image} alt="Profile" width={25} height={25} className="rounded-full border-2 border-orange-200" />
                            )}
                        </span>
                        <span className="text-xs">Profile</span>
                    </button>
                </div>
            </div>
        </>
    );
};

export default NavBottom;
