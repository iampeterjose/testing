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

  // Use useEffect to handle navigation after render
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

    // if(loading) return <p>Loading...</p>
    // if(error) return <p>Error: {error}</p>

    console.log(allOrders);


    return (
        <div className="flex flex-col min-h-screen md:items-center">
            <main className="flex-grow">
                <div className='flex flex-col p-5 md:p-20 mt-28 md:mt-20 w-full md:w-[800px]'>
                    <Link href='/'><p className='text-blue-600 mb-4 flex'><GoHome size={25} /> Home</p></Link>
                    {allOrders.length > 0 ? (
                        <>
                        <h1 className='text-xl mb-4'>Order History</h1>
                        {allOrders.map((orders, index) => (
                            <HistoryCard 
                            key={index} 
                            data={orders} 
                            index={index} />
                        ))}
                        </>
                    ) : (
                        <p>No orders found.</p>
                    )}
                    {loading && 
                        <img src="/assets/icons/loading.svg" alt="Loading" width={40} height={40}/>
                    }
                    {error && <p>Loading...</p>}
                </div>
            </main>
        </div>
    )
}

export default History