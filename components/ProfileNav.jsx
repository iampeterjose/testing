import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { IoPersonOutline } from "react-icons/io5";

const ProfileNav = ({ toggleNav, isOpen }) => {
    const { data: session } = useSession();

    const handleNavigation = () => {
        toggleNav(); // Close the nav when a link is clicked
    };

    return (
        <>
        <div
            className={`fixed top-0 left-0 w-full h-full z-50 flex md:hidden pointer-events-none`}
            style={{ minHeight: '100dvh', maxHeight: '100dvh' }}
        >
            {/* Overlay to close side nav when clicking outside, covers entire screen */}
            <div
                className={`absolute inset-0 bg-black/40 transition-opacity ${isOpen ? 'block' : 'hidden'} z-40 md:hidden ${isOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}
                onClick={toggleNav}
            />
            {/* Side Drawer */}
            <div
                className={`relative h-full w-72 bg-gradient-to-br from-orange-100 to-orange-50 text-orange-900 duration-500 ease-in-out transition-transform transform shadow-2xl rounded-r-3xl border-r-2 border-orange-200 flex flex-col z-50 ${isOpen ? 'translate-x-0 pointer-events-auto' : '-translate-x-full pointer-events-none'}`}
            >
                <button
                    onClick={toggleNav}
                    className="absolute top-4 right-4 p-2 w-10 h-10 rounded-full bg-orange-50 hover:bg-orange-200 transition"
                    aria-label="Close"
                >
                    <img src="/assets/icons/close.png" alt="Close" />
                </button>
                <nav className="mt-16 flex flex-col items-center flex-1 overflow-y-auto">
                    <div className="flex flex-col items-center mb-6">
                        {!session?.user?.image ? (
                            <div className="w-16 h-16 flex items-center justify-center rounded-full bg-orange-200 shadow-inner mb-2">
                                <IoPersonOutline size={40} className="text-orange-400" />
                            </div>
                        ) : (
                            <img src={session.user.image} alt="Profile Picture" height={64} width={64} className="border-2 border-orange-300 rounded-full mb-2 object-cover w-16 h-16" />
                        )}
                        <p className="text-base font-semibold text-orange-800">{session?.user?.email}</p>
                    </div>
                    <ul className="w-full flex flex-col gap-2">
                        <li>
                            <Link href='/profile' onClick={handleNavigation} className="block w-full px-6 py-3 rounded-xl text-md font-semibold hover:bg-orange-200 hover:text-orange-900 transition">
                                My Profile
                            </Link>
                        </li>
                        <li>
                            <Link href='/history' onClick={handleNavigation} className="block w-full px-6 py-3 rounded-xl text-md font-semibold hover:bg-orange-200 hover:text-orange-900 transition">
                                Order History
                            </Link>
                        </li>
                        <li>
                            <button
                                className="block w-full text-left px-6 py-3 rounded-xl text-md font-semibold hover:bg-orange-200 hover:text-orange-900 transition"
                                onClick={() => { signOut(); toggleNav(); }}
                            >
                                Sign Out
                            </button>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
        </>
    );
};

export default ProfileNav;