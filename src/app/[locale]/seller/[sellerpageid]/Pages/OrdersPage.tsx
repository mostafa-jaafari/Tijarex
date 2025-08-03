"use client";
import { FilterOrders } from '@/components/FilterOrders';
import { OrderType } from '@/types/orders';
import { MoreHorizontal } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';

export default function OrdersPage() {
  const t = useTranslations("orderspage");
  const [searchTerm, setSearchTerm] = useState('');
  const [orders, setOrders] = useState<OrderType[] | []>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    async function fetchProducts() {
        try {
            const res = await fetch("/api/currentuserorders");
            if (!res.ok) throw new Error("Failed to fetch products");

            const data = await res.json();
            setOrders(data.orders);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }
    fetchProducts();
}, []);
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

  const filteredOrders = orders?.filter(order =>
    order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.seller.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.product_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const locale = useLocale();
  return (
    <section className="w-full overflow-x-scroll bg-gray-50 min-h-screen">

      <FilterOrders 
        onChange={(e) => setSearchTerm(e.target.value)}
        searchTerm={searchTerm}
      />

      {/* Orders Table */}
      <div className="p-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Table Header Info */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">{t("orderstable.title")}</h3>
                <p className="text-sm text-gray-500 mt-1">
                  {filteredOrders.length} {locale === "ar" ? t("orderstable.ordersFound") : "order"}{filteredOrders.length !== 1 && locale !== "ar" ? 's' : ''} {locale !== "ar" && "found"}
                </p>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t("orderTableHeaders.order")}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t("orderTableHeaders.customer")}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t("orderTableHeaders.status")}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t("orderTableHeaders.product")}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t("orderTableHeaders.total")}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t("orderTableHeaders.date")}
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t("orderTableHeaders.actions")}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr className="animate-pulse">
                    {/* Order ID + Date */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-4 bg-gray-300 rounded w-24 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-16"></div>
                    </td>

                    {/* Seller (Image + Name + Email) */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                        <div>
                          <div className="h-4 bg-gray-300 rounded w-24 mb-1"></div>
                          <div className="h-3 bg-gray-200 rounded w-32"></div>
                        </div>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-5 w-16 bg-gray-300 rounded-full"></div>
                    </td>

                    {/* Product (Image + Name + Quantity) */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-300 rounded-md"></div>
                        <div>
                          <div className="h-4 bg-gray-300 rounded w-36 mb-1"></div>
                          <div className="h-3 bg-gray-200 rounded w-20"></div>
                        </div>
                      </div>
                    </td>

                    {/* Total */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-4 bg-gray-300 rounded w-16"></div>
                    </td>

                    {/* Date */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-4 bg-gray-300 rounded w-20"></div>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center gap-2">
                        {[...Array(4)].map((_, i) => (
                          <div key={i} className="w-8 h-8 bg-gray-200 rounded-lg"></div>
                        ))}
                      </div>
                    </td>
                  </tr>
                )
                :
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{order.id}</div>
                      <div className="text-xs text-gray-500">12/20/2025</div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div
                            className='relative w-8 h-8 overflow-hidden rounded-full'
                        >
                        <Image
                          className="object-cover"
                          src={order.seller.profile_image}
                          alt={order.seller.name}
                          fill
                          onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = `data:image/svg+xml,${encodeURIComponent(`
                                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
                                <rect width="32" height="32" fill="#e5e7eb"/>
                                <text x="16" y="20" text-anchor="middle" fill="#9ca3af" font-size="12" font-family="Arial">
                                ${order.seller.name.charAt(0)}
                                </text>
                                </svg>
                                `)}`;
                            }}
                            />
                            </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{order.seller.name}</div>
                          <div className="text-xs text-gray-500">{order.seller.email}</div>
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div
                            className='relative w-10 h-10 overflow-hidden rounded-lg border border-gray-200'
                        >
                            <Image
                            className="object-cover"
                            src={order.product_image}
                            alt={order.product_name}
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
                            {order.product_name}
                          </div>
                          <div className="text-xs text-gray-500">Qty: {order.quantity}</div>
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-gray-900">
                        ${order.total_mount.toFixed(2)}
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">order.date</div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center gap-2">
                        {/* <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                          <Eye size={16} />
                        </button> */}
                        {/* <button className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                          <Edit size={16} />
                        </button>
                        <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                          <Trash2 size={16} />
                        </button> */}
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
        </div>
      </div>
    </section>
  );
}