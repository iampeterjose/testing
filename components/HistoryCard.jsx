import React from 'react';

const HistoryCard = ({ data, index }) => {
    return (
        <div className="flex flex-col w-full mt-2 mb-4 rounded-2xl shadow-lg border border-orange-100 bg-white hover:shadow-xl transition-shadow duration-300">
            {/* Date Header */}
            <div className="w-full px-4 py-2 bg-gradient-to-r from-orange-100 to-orange-200 rounded-t-2xl font-semibold text-orange-700 flex items-center gap-2">
                <span className="inline-block w-2 h-2 bg-orange-400 rounded-full mr-2" />
                {new Date(data.date).toLocaleDateString('en-US', {
                    year: 'numeric', 
                    month: 'short', 
                    day: 'numeric', 
                    hour: '2-digit', 
                    minute: '2-digit'
                })}
            </div>
            <div className="p-4">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2">
                    <ul className="flex-1 flex flex-col gap-1">
                        {data.orders.map((item, idx) => (
                            <li key={item.id || idx} className="flex items-center gap-2">
                                <span className="text-md text-slate-700 font-semibold">{item.title}</span>
                                <span className="text-xs text-slate-500">x{item.quantity}</span>
                            </li>
                        ))}
                    </ul>
                    <div className="flex flex-col items-end min-w-[100px] mt-2 md:mt-0">
                        <span className="text-lg font-bold text-orange-700">${data.price}</span>
                        <span className="text-xs text-slate-400 mt-1">Order Id: <span className="font-mono">{data.orderId}</span></span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HistoryCard;