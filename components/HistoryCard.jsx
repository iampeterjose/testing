import React from 'react';

const HistoryCard = ({ data, index }) => {

    return (
        <div className='flex flex-col w-full mt-1'>
            <ul className='gap-2 md:gap-4 p-2 border-b-2 hover:cursor-pointer group hover:shadow-xl transition-shadow hover:bg-slate-100 duration-500'>
                {data.orders.map((item) => (
                    <>
                    <li key={index}>
                        <p key={item.id} className='text-md'>{item.title} x {item.quantity}</p>
                    </li>
                    </>
                ))}
                <p className='text-sm text-slate-500'>Order Id: {data.orderId}</p>
                <p className='text-sm text-slate-500'>
                    {new Date(data.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </p>
            </ul>
        </div>
    )
}

export default HistoryCard