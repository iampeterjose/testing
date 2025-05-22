import React from 'react';

const HistoryCard = ({ data, index }) => {
    return (
        <div className="flex flex-col w-full mt-2 mb-4 rounded-3xl shadow-xl border border-orange-100 bg-gradient-to-br from-orange-50 to-white hover:shadow-2xl transition-shadow duration-300">
            {/* Date Header */}
            <div className="w-full px-6 py-3 bg-gradient-to-r from-orange-200 to-orange-100 rounded-t-3xl font-bold text-orange-800 flex items-center gap-2 text-lg tracking-wide border-b border-orange-100">
                <span className="inline-block w-2 h-2 bg-orange-400 rounded-full mr-2" />
                {new Date(data.date).toLocaleDateString('en-US', {
                    year: 'numeric', 
                    month: 'short', 
                    day: 'numeric', 
                    hour: '2-digit', 
                    minute: '2-digit'
                })}
            </div>
            <div className="p-6">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                    <ul className="flex-1 flex flex-col gap-2">
                        {data.orders.map((item, idx) => (
                            <li key={item.id || idx} className="flex items-center gap-3 bg-orange-50 rounded-xl px-3 py-2 shadow-sm border border-orange-100 mb-1">
                                <img src={item.image} alt={item.title} className="w-10 h-10 rounded-lg object-cover border border-orange-200 shadow" />
                                <span className="text-base text-slate-800 font-semibold truncate max-w-[120px]">{item.title}</span>
                                <span className="text-xs text-orange-700 font-bold bg-orange-100 rounded-full px-2 py-1 ml-2">x{item.quantity}</span>
                            </li>
                        ))}
                    </ul>
                    <div className="flex flex-col items-end min-w-[120px] mt-4 md:mt-0">
                        <span className="text-2xl font-extrabold text-orange-700 drop-shadow">${data.price}</span>
                        <span className="text-xs text-slate-400 mt-2">Order Id: <span className="font-mono">{data.orderId}</span></span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HistoryCard;