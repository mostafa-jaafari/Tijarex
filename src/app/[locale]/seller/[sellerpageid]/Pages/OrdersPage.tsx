"use client";
import { FilterOrders } from '@/components/FilterOrders';
import { MoreHorizontal, Eye, Edit, Trash2, Download, Search, Plus, Package } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';

export default function OrdersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Sample orders data
  const orders = [
    {
      id: '#ORD-1001',
      customer: {
        name: 'John Doe',
        email: 'john.doe@example.com',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face'
      },
      status: 'completed',
      product: {
        name: 'Wireless Headphones Pro',
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=40&h=40&fit=crop&crop=center',
        quantity: 2
      },
      total: 240.00,
      date: '2024-06-15',
      time: '14:30'
    },
    {
      id: '#ORD-1002',
      customer: {
        name: 'Sarah Wilson',
        email: 'sarah.w@example.com',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face'
      },
      status: 'pending',
      product: {
        name: 'Smart Watch Series X',
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=40&h=40&fit=crop&crop=center',
        quantity: 1
      },
      total: 399.99,
      date: '2024-06-14',
      time: '09:15'
    },
    {
      id: '#ORD-1003',
      customer: {
        name: 'Mike Johnson',
        email: 'mike.j@example.com',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face'
      },
      status: 'shipped',
      product: {
        name: 'Gaming Keyboard RGB',
        image: 'https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=40&h=40&fit=crop&crop=center',
        quantity: 1
      },
      total: 159.99,
      date: '2024-06-13',
      time: '16:45'
    },
    {
      id: '#ORD-1004',
      customer: {
        name: 'Emily Davis',
        email: 'emily.d@example.com',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face'
      },
      status: 'cancelled',
      product: {
        name: 'Bluetooth Speaker',
        image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=40&h=40&fit=crop&crop=center',
        quantity: 1
      },
      total: 89.99,
      date: '2024-06-12',
      time: '11:20'
    },
    {
      id: '#ORD-1005',
      customer: {
        name: 'David Brown',
        email: 'david.b@example.com',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face'
      },
      status: 'processing',
      product: {
        name: '4K Webcam Ultra',
        image: 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=40&h=40&fit=crop&crop=center',
        quantity: 1
      },
      total: 199.99,
      date: '2024-06-11',
      time: '13:10'
    }
  ];

  const getStatusColor = (status: string) => {
    const colors = {
      completed: 'bg-green-100 text-green-800 border-green-200',
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      shipped: 'bg-blue-100 text-blue-800 border-blue-200',
      processing: 'bg-purple-100 text-purple-800 border-purple-200',
      cancelled: 'bg-red-100 text-red-800 border-red-200',
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const filteredOrders = orders.filter(order =>
    order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <section className="w-full overflow-x-scroll bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-50 rounded-xl">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Orders Management</h1>
              <p className="text-sm text-gray-500 mt-1">
                Manage and track all your orders in one place
              </p>
            </div>
          </div>
          
          <Link
            href="/seller/products"
          >
              <button className="cursor-pointer flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors shadow-sm">
                <Plus size={18} />
                <span className="text-sm font-medium">Create Order</span>
              </button>
          </Link>
        </div>
      </div>

      <FilterOrders 
        onChange={(e) => setSearchTerm(e.target.value)}
        searchTerm={searchTerm}
      />

      {/* Orders Table */}
      <div className="p-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Table Header Info */}
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
                <p className="text-sm text-gray-500 mt-1">
                  {filteredOrders.length} order{filteredOrders.length !== 1 ? 's' : ''} found
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">Show:</span>
                <select className="border border-gray-200 rounded-md px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option>10</option>
                  <option>25</option>
                  <option>50</option>
                </select>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{order.id}</div>
                      <div className="text-xs text-gray-500">{order.time}</div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <div
                            className='relative w-8 h-8 overflow-hidden rounded-full'
                        >
                        <Image
                          className="object-cover"
                          src={order.customer.avatar}
                          alt={order.customer.name}
                          fill
                          onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = `data:image/svg+xml,${encodeURIComponent(`
                                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
                                <rect width="32" height="32" fill="#e5e7eb"/>
                                <text x="16" y="20" text-anchor="middle" fill="#9ca3af" font-size="12" font-family="Arial">
                                ${order.customer.name.charAt(0)}
                                </text>
                                </svg>
                                `)}`;
                            }}
                            />
                            </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{order.customer.name}</div>
                          <div className="text-xs text-gray-500">{order.customer.email}</div>
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <div
                            className='relative w-10 h-10 overflow-hidden rounded-lg border border-gray-200'
                        >
                            <Image
                            className="object-cover"
                            src={order.product.image}
                            alt={order.product.name}
                            fill
                            onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = `data:image/svg+xml,${encodeURIComponent(`
                                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40">
                                    <rect width="40" height="40" fill="#f3f4f6" rx="4"/>
                                    <path d="M20 14l-6 8h12l-6-8z" fill="#d1d5db"/>
                                    </svg>
                                    `)}`;
                                }}
                            />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900 max-w-[200px] truncate">
                            {order.product.name}
                          </div>
                          <div className="text-xs text-gray-500">Qty: {order.product.quantity}</div>
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-gray-900">
                        ${order.total.toFixed(2)}
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{order.date}</div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                          <Eye size={16} />
                        </button>
                        <button className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                          <Edit size={16} />
                        </button>
                        <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                          <Trash2 size={16} />
                        </button>
                        <button className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                          <MoreHorizontal size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500">
                Showing 1 to {filteredOrders.length} of {filteredOrders.length} results
              </div>
              <div className="flex items-center space-x-2">
                <button className="px-3 py-1 text-sm border border-gray-200 rounded-md hover:bg-gray-50 transition-colors">
                  Previous
                </button>
                <button className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md">
                  1
                </button>
                <button className="px-3 py-1 text-sm border border-gray-200 rounded-md hover:bg-gray-50 transition-colors">
                  2
                </button>
                <button className="px-3 py-1 text-sm border border-gray-200 rounded-md hover:bg-gray-50 transition-colors">
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}