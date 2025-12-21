import { useState, useEffect } from 'react';
import React from 'react';
import { router, usePage, Link } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';
import toast, { Toaster } from 'react-hot-toast';

export default function AdminOrdersIndex({ orders: initialOrders }) {
    const { flash } = usePage().props;
    const [orders, setOrders] = useState(initialOrders.data);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(initialOrders.next_page_url !== null);
    const [expandedOrder, setExpandedOrder] = useState(null);
    const [selectedOrders, setSelectedOrders] = useState([]);
    const [bulkStatus, setBulkStatus] = useState('');
    const [statusFilter, setStatusFilter] = useState(() => {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('status') || 'all';
    });

    // Infinite scroll
    useEffect(() => {
        const handleScroll = () => {
            if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 1000) {
                loadMore();
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [hasMore, loading]);

    const loadMore = () => {
        if (loading || !hasMore) return;

        setLoading(true);
        
        fetch(`/admin/orders?page=${initialOrders.current_page + Math.floor(orders.length / 20) + 1}`, {
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'Accept': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            setOrders(prev => [...prev, ...data.orders.data]);
            setHasMore(data.orders.next_page_url !== null);
            setLoading(false);
        })
        .catch(() => {
            setLoading(false);
        });
    };

    const handleStatusFilter = (status) => {
        setStatusFilter(status);
        setLoading(true);
        
        const params = new URLSearchParams();
        if (status !== 'all') {
            params.append('status', status);
        }
        
        router.get(`/admin/orders?${params.toString()}`, {}, {
            preserveState: false,
            onSuccess: () => setLoading(false),
            onError: () => setLoading(false)
        });
    };

    const toggleOrderDetails = (orderId) => {
        setExpandedOrder(expandedOrder === orderId ? null : orderId);
    };

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedOrders(orders.map(order => order.id));
        } else {
            setSelectedOrders([]);
        }
    };

    const handleSelectOrder = (orderId) => {
        if (selectedOrders.includes(orderId)) {
            setSelectedOrders(selectedOrders.filter(id => id !== orderId));
        } else {
            setSelectedOrders([...selectedOrders, orderId]);
        }
    };

    const handleBulkStatusUpdate = () => {
        if (selectedOrders.length === 0 || !bulkStatus) {
            toast.error('Please select orders and status');
            return;
        }

        router.post(route('admin.orders.bulk-status'), {
            order_ids: selectedOrders,
            status: bulkStatus
        });
        setSelectedOrders([]);
        setBulkStatus('');
    };

    const handleBulkDelete = () => {
        if (selectedOrders.length === 0) {
            toast.error('Please select orders to delete');
            return;
        }

        if (confirm(`Are you sure you want to delete ${selectedOrders.length} orders?`)) {
            router.post(route('admin.orders.bulk-delete'), {
                order_ids: selectedOrders
            });
            setSelectedOrders([]);
        }
    };

    const handleExportCsv = () => {
        window.open(route('admin.orders.export-csv'), '_blank');
    };

    const handlePrint = (orderId) => {
        window.open(route('admin.orders.show', orderId), '_blank');
    };

    return (
        <AdminLayout>
            <Toaster position="top-right" />
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
                        <p className="text-gray-600">Manage customer orders</p>
                    </div>
                    <div className="flex space-x-3">
                        <Link
                            href="/admin/orders/create"
                            className="btn-primary flex items-center space-x-2"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            <span>Create Order</span>
                        </Link>
                        <button
                            onClick={handleExportCsv}
                            className="btn-primary flex items-center space-x-2"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <span>Export CSV</span>
                        </button>
                    </div>
                </div>

                {/* Status Filter Buttons */}
                <div className="flex flex-wrap gap-2">
                    {['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'].map((status) => (
                        <button
                            key={status}
                            onClick={() => handleStatusFilter(status)}
                            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                                statusFilter === status
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                        >
                            {status === 'all' ? 'All Orders' : status.charAt(0).toUpperCase() + status.slice(1)}
                        </button>
                    ))}
                </div>

                {selectedOrders.length > 0 && (
                    <div className="bg-blue-50 p-4 rounded-lg flex items-center gap-4">
                        <span className="text-sm text-blue-700">
                            {selectedOrders.length} orders selected
                        </span>
                        <select
                            value={bulkStatus}
                            onChange={(e) => setBulkStatus(e.target.value)}
                            className="text-sm border border-blue-300 rounded px-2 py-1"
                        >
                            <option value="">Change Status</option>
                            <option value="pending">Pending</option>
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                        <button
                            onClick={handleBulkStatusUpdate}
                            className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                        >
                            Update Status
                        </button>
                        <button
                            onClick={handleBulkDelete}
                            className="text-sm bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                        >
                            Delete All
                        </button>
                    </div>
                )}

                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left">
                                        <input
                                            type="checkbox"
                                            checked={selectedOrders.length === orders.length && orders.length > 0}
                                            onChange={handleSelectAll}
                                            className="rounded border-gray-300"
                                        />
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Order
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Customer
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Address
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Products
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Total
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {orders.map((order) => (
                                    <React.Fragment key={order.id}>
                                        <tr key={order.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedOrders.includes(order.id)}
                                                    onChange={() => handleSelectOrder(order.id)}
                                                    className="rounded border-gray-300"
                                                />
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">
                                                    #{order.order_number}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    {order.created_at}
                                                </div>
                                                <div className="text-xs text-gray-400">
                                                    {order.created_at_relative}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {order.customer_name}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-gray-900">{order.customer_phone}</div>
                                                <div className="text-sm text-gray-500 max-w-xs truncate">
                                                    {order.customer_address}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <button
                                                    onClick={() => toggleOrderDetails(order.id)}
                                                    className="text-sm text-blue-600 hover:text-blue-900"
                                                >
                                                    {order.products.map(product => product.name).join(', ')}
                                                </button>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">
                                                    ৳{order.total}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${order.status_color}`}>
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <div className="flex space-x-3">
                                                    <Link
                                                        href={`/admin/orders/${order.id}`}
                                                        className="flex items-center space-x-1 text-green-600 hover:text-green-900"
                                                        title="View"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                        </svg>
                                                        <span>View</span>
                                                    </Link>
                                                    <button
                                                        onClick={() => handlePrint(order.id)}
                                                        className="flex items-center space-x-1 text-blue-600 hover:text-blue-900"
                                                        title="Print"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-1a2 2 0 00-2-2H9a2 2 0 00-2 2v1a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                                                        </svg>
                                                        <span>Print</span>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                        {expandedOrder === order.id && (
                                            <tr>
                                                <td colSpan="8" className="px-6 py-4 bg-gray-50">
                                                    <div className="space-y-2">
                                                        <h4 className="font-medium text-gray-900">Order Items:</h4>
                                                        {order.products.map((product, index) => (
                                                            <div key={index} className="flex justify-between items-center text-sm">
                                                                <span>{product.name}</span>
                                                                <span>Qty: {product.quantity} × ৳{product.price} = ৳{(product.quantity * product.price).toFixed(2)}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </React.Fragment>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {orders.length === 0 && (
                        <div className="p-12 text-center text-gray-500">
                            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-medium mb-2">No Orders Yet</h3>
                            <p>Orders will appear here when customers make purchases</p>
                        </div>
                    )}

                    {loading && (
                        <div className="p-8 text-center">
                            <div className="inline-flex items-center space-x-2">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                                <span className="text-gray-600">Loading more orders...</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
