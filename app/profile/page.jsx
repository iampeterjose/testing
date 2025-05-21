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
                <div className="w-full max-w-xl mx-auto bg-white rounded-3xl shadow-2xl p-8 md:p-12 mt-32 md:mt-24 flex flex-col items-center">
                    <Link href='/' className="self-start mb-6 px-4 py-2 rounded-full bg-orange-50 hover:bg-orange-100 text-orange-700 font-semibold shadow transition-all duration-200 flex items-center gap-2 group">
                        <GoHome size={22} className="group-hover:scale-110 transition-transform" />
                        <span className="tracking-tight">Back to Home</span>
                    </Link>
                    <h1 className="text-3xl font-bold text-orange-700 mb-2">My Profile</h1>
                    <div className="flex flex-col items-center mt-4">
                        {!session?.user.image ? (
                            <div className="w-28 h-28 flex items-center justify-center rounded-full bg-orange-100 shadow-inner mb-2">
                                <IoPersonOutline size={70} className="text-orange-400" />
                            </div>
                        ) : (
                            <img
                                src={session.user.image}
                                alt="Profile Picture"
                                width={112}
                                height={112}
                                className="rounded-full shadow-lg border-4 border-orange-200 mb-2 object-cover w-28 h-28"
                            />
                        )}
                        <p className="mt-2 text-lg text-gray-700 font-semibold">{session?.user?.name || 'User'}</p>
                        <p className="mt-1 text-md text-gray-500">{session?.user?.email}</p>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default page;