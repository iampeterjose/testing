"use client";
import React from 'react';
import HistoryCard from '../../components/HistoryCard';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

const History = () => {
    const [allOrders, setAllOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { data: session } = useSession();
    

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
        <div className="flex flex-col min-h-screen">
            <main className="flex-grow">
                <div className='flex flex-col p-5 md:p-20 mt-32 md:mt-20'>
                    {allOrders.length > 0 ? (
                        <>
                        <h1 className='text-xl'>Order History</h1>
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
                    {loading && <p>Loading....</p>}
                    {error && <p>Loading....</p>}
                </div>
            </main>
        </div>
    )
}

export default History