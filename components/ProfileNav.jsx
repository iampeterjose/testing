import { signOut, useSession } from "next-auth/react";
import Link from "next/link";

const ProfileNav = ({ toggleNav, isOpen }) => {
    const { data: session } = useSession();

    const handleNavigation = () => {
        toggleNav(); // Close the nav when a link is clicked
    };

    return (
        <>
        <div
            className={`fixed top-0 left-0 h-full z-100 bg-slate-50 text-slate-900 duration-500 ease-in-out transition-transform transform ${
            isOpen ? 'translate-x-0' : '-translate-x-full'
            } w-64 z-50 shadow-xl`}
        >
            <button
            onClick={toggleNav}
            className="absolute top-4 right-4 p-2 w-10 h-10"
            >
            <img src="/assets/icons/close.png" alt="Close" />
            </button>
            <nav className="mt-16">
            <ul className="text-slate-900">
                <Link href='/profile'>
                    <li className="p-4 hover:text-slate-50 hover:bg-coconut text-md border-b-2" onClick={handleNavigation}>
                        <img src={!session.user.image ? '/assets/icons/profile.svg' : session.user.image} alt="Profile Picture" height={50} width={50} className="border-2 border-coconut rounded-full my-2" />
                        <p>{session.user.email}</p>
                    </li>
                </Link>
                <Link href='/history'>
                    <li className="p-4 hover:text-slate-50 hover:bg-coconut" onClick={handleNavigation}><p>Order History</p></li>
                </Link>
                <Link href='/'>
                    <li className="p-4 hover:text-slate-50 hover:bg-coconut" onClick={signOut}><p>Sign Out</p></li>
                </Link>
            </ul>
            </nav>
        </div>

        {/* Overlay to close side nav when clicking outside */}
        <div
            className={`fixed inset-0 bg-black opacity-50 transition-opacity ${
            isOpen ? 'block' : 'hidden'
            } z-40`}
            onClick={toggleNav}
        >
        </div>
        </>
    )
}

export default ProfileNav