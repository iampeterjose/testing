'use client';
import { useSession } from "next-auth/react"
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const page = () => {
    const { data:session } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (!session) {
            router.push('/');
        }
    }, [session, router]);




    return (
        <div className='flex flex-col min-h-screen'>
            <main className='flex-grow'>
                <div className='flex flex-col md:flex-row p-5 md:p-20 mt-32 md:mt-20 '>
                    <div className="w-full">
                        <h1 className="text-2xl text-slate-700">My Profile</h1>
                        <img 
                            src={!session?.user.image ? '/assets/icons/profile.svg' : session.user.image} 
                            alt="Profile Picture" 
                            width={100} 
                            height={100} 
                            className="mt-6 rounded-full"
                        />
                        <p className="mt-4 text-md text-slate-700">Email: {session?.user.email}</p>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default page