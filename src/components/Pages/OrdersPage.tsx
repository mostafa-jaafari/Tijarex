"use client";



// const getStatusColor = (status: string) => {
//     const colors = {
//       completed: 'bg-green-100 text-green-800 border-green-200',
//       pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
//       shipped: 'bg-blue-100 text-blue-800 border-blue-200',
//       processing: 'bg-purple-100 text-purple-800 border-purple-200',
//       cancelled: 'bg-red-100 text-red-800 border-red-200',
//     };
//     return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-200';
// };

// // Skeleton component for the table's loading state
// const TableSkeleton = () => (
//     [...Array(5)].map((_, i) => (
//       <tr key={i} className="animate-pulse">
//         <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-24 mx-auto"></div></td>
//         <td className="px-6 py-4"><div className="flex items-center gap-3"><div className="w-8 h-8 bg-gray-200 rounded-full"></div><div><div className="h-4 bg-gray-200 rounded w-24"></div></div></div></td>
//         <td className="px-6 py-4"><div className="h-6 w-20 bg-gray-200 rounded-full mx-auto"></div></td>
//         <td className="px-6 py-4"><div className="flex items-center gap-3"><div className="w-10 h-10 bg-gray-200 rounded-md"></div><div><div className="h-4 bg-gray-200 rounded w-32"></div></div></div></td>
//         <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-16 mx-auto"></div></td>
//         <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-20 mx-auto"></div></td>
//         <td className="px-6 py-4 text-center"><div className="w-8 h-8 bg-gray-200 rounded-lg mx-auto"></div></td>
//       </tr>
//     ))
// );

export default function OrdersPage() {

    return (
        <div className="w-full p-3 space-y-4">
            Orders Page
        </div>
    );
}