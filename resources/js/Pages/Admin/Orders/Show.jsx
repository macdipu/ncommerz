import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';
import AdminLayout from '../../../Layouts/AdminLayout';
import { 
    PencilIcon,
    CheckIcon,
    XMarkIcon,
    EyeIcon,
    PlusIcon,
    TrashIcon
} from '@heroicons/react/24/outline';

export default function Show({ order, products = [] }) {
    console.log('Order data:', order); // Debug log
    const [isEditing, setIsEditing] = useState(false);
    const [editingProducts, setEditingProducts] = useState(false);
    const [orderItems, setOrderItems] = useState(() => {
        console.log('Order structure:', order);
        return order.order_items || order.orderItems || order.order_items || [];
    });
    
    const { data, setData, put, processing, errors } = useForm({
        status: order.status,
        customer_name: order.customer_name || order.user?.name || '',
        customer_phone: order.customer_phone || order.user?.phone || '',
        customer_address: order.customer_address || order.user?.address || '',
        total: order.total,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(`/admin/orders/${order.id}`, {
            onSuccess: () => setIsEditing(false)
        });
    };

    const addOrderItem = () => {
        setOrderItems([...orderItems, {
            id: Date.now(),
            product_id: '',
            product: { name: '' },
            variations: {},
            quantity: 1,
            price: 0,
            isNew: true
        }]);
    };

    const updateOrderItem = (index, field, value) => {
        const updated = [...orderItems];
        if (field === 'product_id') {
            const product = products.find(p => p.id == value);
            updated[index].product = product || { name: '' };
            updated[index].price = product?.price || 0;
            updated[index].variations = {};
        }
        if (field.startsWith('variation_')) {
            const variationKey = field.replace('variation_', '');
            if (!updated[index].variations) updated[index].variations = {};
            updated[index].variations[variationKey] = value;
        } else {
            updated[index][field] = value;
        }
        setOrderItems(updated);
        
        // Update total amount in form data
        const newTotal = updated.reduce((sum, item) => sum + (item.quantity * item.price), 0);
        setData('total', parseFloat(newTotal.toFixed(2)));
    };

    const removeOrderItem = (index) => {
        setOrderItems(orderItems.filter((_, i) => i !== index));
    };

    const calculateTotal = () => {
        return orderItems.reduce((sum, item) => sum + (item.quantity * item.price), 0);
    };

    const getStatusColor = (status) => {
        const colors = {
            pending: 'bg-yellow-100 text-yellow-800',
            processing: 'bg-blue-100 text-blue-800',
            shipped: 'bg-purple-100 text-purple-800',
            delivered: 'bg-green-100 text-green-800',
            cancelled: 'bg-red-100 text-red-800',
            incomplete: 'bg-orange-100 text-orange-800'
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    return (
        <AdminLayout>
            <Head title={`Order ${order.order_number}`} />
            
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <h2 className="text-2xl font-semibold text-gray-900">Order Details</h2>
                                    <p className="text-gray-600">Manage order #{order.order_number}</p>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                    </span>
                                    <button
                                        onClick={() => setIsEditing(!isEditing)}
                                        className="btn-primary flex items-center space-x-2"
                                    >
                                        {isEditing ? <XMarkIcon className="h-4 w-4" /> : <PencilIcon className="h-4 w-4" />}
                                        <span>{isEditing ? 'Cancel' : 'Edit Order'}</span>
                                    </button>
                                </div>
                            </div>

                            {isEditing ? (
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                                            <select
                                                value={data.status}
                                                onChange={(e) => setData('status', e.target.value)}
                                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            >
                                                <option value="pending">Pending</option>
                                                <option value="processing">Processing</option>
                                                <option value="shipped">Shipped</option>
                                                <option value="delivered">Delivered</option>
                                                <option value="cancelled">Cancelled</option>
                                                <option value="incomplete">Incomplete</option>
                                            </select>
                                            {errors.status && <p className="text-red-500 text-sm mt-1">{errors.status}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Customer Name</label>
                                            <input
                                                type="text"
                                                value={data.customer_name}
                                                onChange={(e) => setData('customer_name', e.target.value)}
                                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                            {errors.customer_name && <p className="text-red-500 text-sm mt-1">{errors.customer_name}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                                            <input
                                                type="text"
                                                value={data.customer_phone}
                                                onChange={(e) => setData('customer_phone', e.target.value)}
                                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                            {errors.customer_phone && <p className="text-red-500 text-sm mt-1">{errors.customer_phone}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                                            <textarea
                                                value={data.customer_address}
                                                onChange={(e) => setData('customer_address', e.target.value)}
                                                rows="3"
                                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                            {errors.customer_address && <p className="text-red-500 text-sm mt-1">{errors.customer_address}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Total Amount</label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                value={data.total}
                                                onChange={(e) => setData('total', e.target.value)}
                                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                            {errors.total && <p className="text-red-500 text-sm mt-1">{errors.total}</p>}
                                        </div>
                                    </div>

                                    <div className="flex justify-end space-x-3">
                                        <button
                                            type="button"
                                            onClick={() => setIsEditing(false)}
                                            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="btn-primary flex items-center space-x-2 disabled:opacity-50"
                                        >
                                            <CheckIcon className="h-4 w-4" />
                                            <span>{processing ? 'Saving...' : 'Save Changes'}</span>
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <div>
                                            <h3 className="text-lg font-medium text-gray-900 mb-3">Customer Information</h3>
                                            <div className="space-y-2">
                                                <p><span className="font-medium">Name:</span> {order.customer_name || order.user?.name || 'N/A'}</p>
                                                <p><span className="font-medium">Phone:</span> {order.customer_phone || order.user?.phone || 'N/A'}</p>
                                                <p><span className="font-medium">Address:</span> {order.customer_address || order.user?.address || 'N/A'}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <h3 className="text-lg font-medium text-gray-900 mb-3">Order Details</h3>
                                            <div className="space-y-2">
                                                <p><span className="font-medium">Order Number:</span> {order.order_number}</p>
                                                <p><span className="font-medium">Status:</span> 
                                                    <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                                                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                                    </span>
                                                </p>
                                                <p><span className="font-medium">Total:</span> ৳{order.total}</p>
                                                <p><span className="font-medium">Date:</span> {new Date(order.created_at).toLocaleString()}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Order Items */}
                            <div className="mt-8">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-lg font-medium text-gray-900">Order Items</h3>
                                    <button
                                        onClick={() => setEditingProducts(!editingProducts)}
                                        className="btn-primary flex items-center space-x-2"
                                    >
                                        <PencilIcon className="h-4 w-4" />
                                        <span>{editingProducts ? 'Done Editing' : 'Edit Items'}</span>
                                    </button>
                                </div>

                                {editingProducts && (
                                    <div className="mb-4">
                                        <button
                                            onClick={addOrderItem}
                                            className="flex items-center space-x-2 px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                                        >
                                            <PlusIcon className="h-4 w-4" />
                                            <span>Add Item</span>
                                        </button>
                                    </div>
                                )}

                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                                                {editingProducts && (
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                                )}
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {orderItems && orderItems.length > 0 ? (
                                                orderItems.map((item, index) => (
                                                    <tr key={item.id || index}>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                            {editingProducts ? (
                                                                <select
                                                                    value={item.product_id || ''}
                                                                    onChange={(e) => updateOrderItem(index, 'product_id', e.target.value)}
                                                                    className="w-full border border-gray-300 rounded px-2 py-1"
                                                                >
                                                                    <option value="">Select Product</option>
                                                                    {products.map(product => (
                                                                        <option key={product.id} value={product.id}>
                                                                            {product.name}
                                                                        </option>
                                                                    ))}
                                                                </select>
                                                            ) : (
                                                                item.product?.name || 'Product not found'
                                                            )}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                            {editingProducts ? (
                                                                <input
                                                                    type="number"
                                                                    min="1"
                                                                    value={item.quantity}
                                                                    onChange={(e) => updateOrderItem(index, 'quantity', parseInt(e.target.value))}
                                                                    className="w-20 border border-gray-300 rounded px-2 py-1"
                                                                />
                                                            ) : (
                                                                item.quantity
                                                            )}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                            {editingProducts ? (
                                                                <input
                                                                    type="number"
                                                                    step="0.01"
                                                                    value={item.price}
                                                                    onChange={(e) => updateOrderItem(index, 'price', parseFloat(e.target.value))}
                                                                    className="w-24 border border-gray-300 rounded px-2 py-1"
                                                                />
                                                            ) : (
                                                                `৳${item.price}`
                                                            )}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                            ৳{(item.quantity * item.price).toFixed(2)}
                                                        </td>
                                                        {editingProducts && (
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                                <button
                                                                    onClick={() => removeOrderItem(index)}
                                                                    className="text-red-600 hover:text-red-900"
                                                                >
                                                                    <TrashIcon className="h-4 w-4" />
                                                                </button>
                                                            </td>
                                                        )}
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan={editingProducts ? "5" : "4"} className="px-6 py-4 text-center text-sm text-gray-500">
                                                        No items found (Incomplete order)
                                                    </td>
                                                </tr>
                                            )}
                                            {orderItems.length > 0 && (
                                                <tr className="bg-gray-50 font-medium">
                                                    <td colSpan="3" className="px-6 py-4 text-right text-sm text-gray-900">
                                                        Total:
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        ৳{calculateTotal().toFixed(2)}
                                                    </td>
                                                    {editingProducts && <td></td>}
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
