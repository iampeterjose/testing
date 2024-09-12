import React from 'react';

const HistoryCard = ({ data, index }) => {

    return (
        <div className='flex flex-col w-full mt-1 border-2 rounded-xl mb-2'>
            <p className='w-full p-2 bg-slate-50 rounded-t-xl font-semibold text-slate-700'>
                {new Date(data.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'})}
            </p>
            <div className='p-2'>
                <div className='flex justify-between'>
                    <ul className='gap-2 md:gap-4'>
                        {data.orders.map((item) => (
                            <li key={index}>
                                <p key={item.id} className='text-md text-slate-700 font-semibold'>{item.title} x {item.quantity}</p>
                            </li>
                        ))}
                    </ul>
                    <p className='text-orange-700'>${data.price}</p>
                </div>
                <p className='text-sm text-slate-500 mt-2'>Order Id: {data.orderId}</p>
            </div>
        </div>
    )
}

export default HistoryCard