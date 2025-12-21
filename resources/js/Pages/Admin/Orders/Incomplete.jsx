import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import AdminLayout from '../../../Layouts/AdminLayout';
import { 
    EyeIcon,
    ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

export default function Incomplete({ orders }) {
    const [selectedOrders, setSelectedOrders] = useState([]);

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedOrders(orders.data.map(order => order.id));
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

    const handleBulkStatusUpdate = (status) => {
        if (selectedOrders.length === 0) {
            alert('Please select orders first');
            return;
        }

        router.post('/admin/orders/bulk-status', {
            order_ids: selectedOrders,
            status: status
        });
    };

    const handleBulkDelete = () => {
        if (selectedOrders.length === 0) {
            alert('Please select orders to delete');
            return;
        }

        if (confirm(`Are you sure you want to delete ${selectedOrders.length} orders?`)) {
            router.post('/admin/orders/bulk-delete', {
                order_ids: selectedOrders
            });
            setSelectedOrders([]);
        }
    };

    return (
        <AdminLayout>
            <Head title="Incomplete Orders" />
            
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <div className="flex justify-between items-center mb-6">
                                <div className="flex items-center">
                                    <ExclamationTriangleIcon className="h-8 w-8 text-orange-500 mr-3" />
                                    <h2 className="text-2xl font-semibold text-gray-900">Incomplete Orders</h2>
                                </div>
                            </div>

                            {selectedOrders.length > 0 && (
                                <div className="mb-4 p-4 bg-blue-50 rounded-lg">
                                    <p className="text-sm text-blue-700 mb-2">{selectedOrders.length} orders selected</p>
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => handleBulkStatusUpdate('pending')}
                                            className="px-3 py-1 bg-yellow-500 text-white text-sm rounded hover:bg-yellow-600"
                                        >
                                            Mark as Pending
                                        </button>
                                        <button
                                            onClick={() => handleBulkStatusUpdate('processing')}
                                            className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
                                        >
                                            Mark as Processing
                                        </button>
                                        <button
                                            onClick={handleBulkDelete}
                                            className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
                                        >
                                            Delete All
                                        </button>
                                    </div>
                                </div>
                            )}

                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                <input
                                                    type="checkbox"
                                                    onChange={handleSelectAll}
                                                    checked={selectedOrders.length === orders.data.length}
                                                />
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Order
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Customer
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Products
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Total
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Date
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {orders.data.map((order) => (
                                            <tr key={order.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedOrders.includes(order.id)}
                                                        onChange={() => handleSelectOrder(order.id)}
                                                    />
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {order.order_number}
                                                    </div>
                                                    <div className="text-sm text-orange-600 font-medium">
                                                        Incomplete
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900">{order.customer_name}</div>
                                                    <div className="text-sm text-gray-500">{order.customer_phone}</div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-sm text-gray-900">
                                                        {order.products.map((product, index) => (
                                                            <div key={index}>
                                                                {product.name} (x{product.quantity})
                                                            </div>
                                                        ))}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    ৳{order.total}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {order.created_at_relative}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <Link
                                                        href={`/admin/orders/${order.id}`}
                                                        className="text-blue-600 hover:text-blue-900"
                                                    >
                                                        <EyeIcon className="h-5 w-5" />
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {orders.data.length === 0 && (
                                <div className="text-center py-8">
                                    <ExclamationTriangleIcon className="mx-auto h-12 w-12 text-gray-400" />
                                    <h3 className="mt-2 text-sm font-medium text-gray-900">No incomplete orders</h3>
                                    <p className="mt-1 text-sm text-gray-500">All orders have been completed or processed.</p>
                                </div>
                            )}

                            {/* Pagination */}
                            {orders.links && orders.links.length > 0 && (
                                <div className="mt-6 flex justify-between items-center">
                                    <div className="text-sm text-gray-700">
                                        Showing {orders.from || 0} to {orders.to || 0} of {orders.total || 0} results
                                    </div>
                                    <div className="flex space-x-1">
                                        {orders.links.map((link, index) => (
                                            link.url ? (
                                                <Link
                                                    key={index}
                                                    href={link.url}
                                                    className={`px-3 py-2 text-sm rounded ${
                                                        link.active
                                                            ? 'bg-blue-500 text-white'
                                                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                                    }`}
                                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                                />
                                            ) : (
                                                <span
                                                    key={index}
                                                    className="px-3 py-2 text-sm rounded bg-gray-100 text-gray-400"
                                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                                />
                                            )
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
