"use client";
import React from 'react';
import HistoryCard from '../../components/HistoryCard';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { GoHome } from 'react-icons/go';

const History = () => {
    const [allOrders, setAllOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { data: session } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (!session) {
            router.push('/');
        }
    }, [session, router]);

    useEffect(() => {
        if(session && session.user && session.user.email){
            const fetchOrders = async () => {
                try {
                    const response = await fetch(`/api/order/${session.user.email}`);
                    if(!response.ok){
                        throw new Error(`Failed to fetch orders!`);
                    }
                    const data = await response.json();
                    // Sort orders by date in descending order (most recent first)
                    const sortedOrders = data.sort((a, b) => new Date(b.date) - new Date(a.date));
                    setAllOrders(sortedOrders);
                } catch (err) {
                    setError(err.message);
                } finally {
                    setLoading(false);
                }
            };
            fetchOrders();
        }
    },[session]);

    return (
        <div className="flex flex-col min-h-screen bg-gradient-to-br from-orange-50 to-white">
            <main className="flex-grow flex items-center justify-center">
                <div className="w-full max-w-2xl mx-auto bg-white rounded-3xl shadow-2xl p-6 md:p-12 mt-32 md:mt-24">
                    <Link href='/' className='inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full bg-orange-50 hover:bg-orange-100 text-orange-700 font-semibold shadow transition-all duration-200 group'>
                        <GoHome size={22} className="group-hover:scale-110 transition-transform" />
                        <span className="tracking-tight">Back to Home</span>
                    </Link>
                    <h1 className='text-2xl md:text-3xl font-bold text-orange-700 mb-6'>Order History</h1>
                    {loading && (
                        <div className="flex justify-center items-center py-8">
                            <img src="/assets/icons/loading.svg" alt="Loading" width={40} height={40}/>
                        </div>
                    )}
                    {error && (
                        <div className="text-red-600 text-center py-4 font-semibold">{error}</div>
                    )}
                    {!loading && allOrders.length === 0 && !error && (
                        <div className="text-slate-500 text-center py-8">No orders found.</div>
                    )}
                    <div className="flex flex-col gap-6">
                        {allOrders.map((orders, index) => (
                            <HistoryCard 
                                key={index} 
                                data={orders} 
                                index={index} 
                            />
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
}

export default History;