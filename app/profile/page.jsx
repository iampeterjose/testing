'use client';
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { IoPersonOutline } from "react-icons/io5";
import { GoHome } from "react-icons/go";

const page = () => {
    const { data: session } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (!session) {
            router.push('/');
        }
    }, [session, router]);

    return (
        <div className="flex flex-col min-h-screen bg-gradient-to-br from-orange-50 to-white">
            <main className="flex-grow flex items-center justify-center">
                <div className="w-full max-w-2xl mx-auto bg-white rounded-3xl shadow-2xl p-4 md:p-8 mt-14 flex flex-col items-center border border-orange-100">
                    <Link href='/' className="self-start mb-8 px-5 py-3 rounded-full bg-orange-100 hover:bg-orange-200 text-orange-700 font-bold shadow-md transition-all duration-200 flex items-center gap-2 group text-lg">
                        <GoHome size={26} className="group-hover:scale-110 transition-transform" />
                        <span className="tracking-tight">Back to Home</span>
                    </Link>
                    <h1 className="text-4xl font-extrabold text-orange-700 mb-4 tracking-tight drop-shadow">My Profile</h1>
                    <div className="flex flex-col items-center mt-6 w-full">
                        <div className="relative w-32 h-32 mb-4">
                            {!session?.user.image ? (
                                <div className="w-32 h-32 flex items-center justify-center rounded-full bg-gradient-to-br from-orange-100 to-orange-200 shadow-inner">
                                    <IoPersonOutline size={80} className="text-orange-400" />
                                </div>
                            ) : (
                                <img
                                    src={session.user.image}
                                    alt="Profile Picture"
                                    width={128}
                                    height={128}
                                    className="rounded-full shadow-lg border-4 border-orange-200 object-cover w-32 h-32"
                                />
                            )}
                            <span className="absolute bottom-2 right-2 bg-orange-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow">User</span>
                        </div>
                        <div className="flex flex-col items-center w-full">
                            <p className="text-2xl font-bold text-gray-800 mb-1">{session?.user?.name || 'User'}</p>
                            <p className="text-md text-gray-500 mb-4">{session?.user?.email}</p>
                        </div>
                        <div className="w-full flex flex-col md:flex-row gap-6 mt-6 justify-center">
                            <Link href="/history" className="flex-1 px-6 py-4 bg-orange-50 hover:bg-orange-100 text-orange-700 font-semibold rounded-2xl shadow text-center transition-all text-lg border border-orange-100">Order History</Link>
                            <Link href="/cart" className="flex-1 px-6 py-4 bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold rounded-2xl shadow text-center transition-all text-lg border border-blue-100">My Cart</Link>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default page;