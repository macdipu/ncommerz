import { Head, useForm, Link } from '@inertiajs/react';
import { useState } from 'react';
import AdminLayout from '../../../Layouts/AdminLayout';
import { 
    PlusIcon,
    TrashIcon,
    ArrowLeftIcon
} from '@heroicons/react/24/outline';

export default function Create({ products = [] }) {
    const [orderItems, setOrderItems] = useState([{
        id: Date.now(),
        product_id: '',
        product: { name: '' },
        variations: {},
        quantity: 1,
        price: 0
    }]);
    
    const { data, setData, post, processing, errors } = useForm({
        customer_name: '',
        customer_phone: '',
        customer_address: '',
        status: 'pending',
        total: 0,
        items: []
    });

    const addOrderItem = () => {
        setOrderItems([...orderItems, {
            id: Date.now(),
            product_id: '',
            product: { name: '' },
            variations: {},
            quantity: 1,
            price: 0
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
            updated[index].variations[variationKey] = value;
        } else {
            updated[index][field] = value;
        }
        setOrderItems(updated);
        
        // Update total and items in form data
        const newTotal = updated.reduce((sum, item) => sum + (item.quantity * item.price), 0);
        setData('total', parseFloat(newTotal.toFixed(2)));
        setData('items', updated.filter(item => item.product_id).map(item => ({
            product_id: item.product_id,
            quantity: item.quantity,
            price: item.price,
            variations: item.variations
        })));
    };

    const removeOrderItem = (index) => {
        const updated = orderItems.filter((_, i) => i !== index);
        setOrderItems(updated);
        
        const newTotal = updated.reduce((sum, item) => sum + (item.quantity * item.price), 0);
        setData('total', parseFloat(newTotal.toFixed(2)));
        setData('items', updated.filter(item => item.product_id).map(item => ({
            product_id: item.product_id,
            quantity: item.quantity,
            price: item.price
        })));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/admin/orders');
    };

    return (
        <AdminLayout>
            <Head title="Create Order" />
            
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <h2 className="text-2xl font-semibold text-gray-900">Create New Order</h2>
                                    <p className="text-gray-600">Add a new customer order</p>
                                </div>
                                <Link
                                    href="/admin/orders"
                                    className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                                >
                                    <ArrowLeftIcon className="h-4 w-4" />
                                    <span>Back to Orders</span>
                                </Link>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Customer Name *</label>
                                        <input
                                            type="text"
                                            value={data.customer_name}
                                            onChange={(e) => setData('customer_name', e.target.value)}
                                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                        {errors.customer_name && <p className="text-red-500 text-sm mt-1">{errors.customer_name}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Phone *</label>
                                        <input
                                            type="text"
                                            value={data.customer_phone}
                                            onChange={(e) => setData('customer_phone', e.target.value)}
                                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                        {errors.customer_phone && <p className="text-red-500 text-sm mt-1">{errors.customer_phone}</p>}
                                    </div>

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
                                        </select>
                                        {errors.status && <p className="text-red-500 text-sm mt-1">{errors.status}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Total Amount</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={data.total}
                                            readOnly
                                            className="w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-100"
                                        />
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Address *</label>
                                        <textarea
                                            value={data.customer_address}
                                            onChange={(e) => setData('customer_address', e.target.value)}
                                            rows="3"
                                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                        {errors.customer_address && <p className="text-red-500 text-sm mt-1">{errors.customer_address}</p>}
                                    </div>
                                </div>

                                {/* Order Items */}
                                <div className="mt-8">
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="text-lg font-medium text-gray-900">Order Items</h3>
                                        <button
                                            type="button"
                                            onClick={addOrderItem}
                                            className="flex items-center space-x-2 px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                                        >
                                            <PlusIcon className="h-4 w-4" />
                                            <span>Add Item</span>
                                        </button>
                                    </div>

                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Variations</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {orderItems.map((item, index) => (
                                                    <tr key={item.id}>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <select
                                                                value={item.product_id || ''}
                                                                onChange={(e) => updateOrderItem(index, 'product_id', e.target.value)}
                                                                className="w-full border border-gray-300 rounded px-2 py-1"
                                                                required
                                                            >
                                                                <option value="">Select Product</option>
                                                                {products.map(product => (
                                                                    <option key={product.id} value={product.id}>
                                                                        {product.name}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            {(() => {
                                                                const selectedProduct = products.find(p => p.id == item.product_id);
                                                                if (!selectedProduct?.variations?.length) return null;
                                                                
                                                                // Group variations by name and collect their values
                                                                const groupedVariations = selectedProduct.variations.reduce((acc, variation) => {
                                                                    if (!acc[variation.name]) {
                                                                        acc[variation.name] = [];
                                                                    }
                                                                    acc[variation.name].push(variation.value);
                                                                    return acc;
                                                                }, {});
                                                                
                                                                return (
                                                                    <div className="space-y-2">
                                                                        {Object.entries(groupedVariations).map(([variationName, values]) => (
                                                                            <div key={`${item.id}-${variationName}`}>
                                                                                <label className="block text-xs font-medium text-gray-700">{variationName}</label>
                                                                                <select
                                                                                    value={item.variations?.[variationName] || ''}
                                                                                    onChange={(e) => updateOrderItem(index, `variation_${variationName}`, e.target.value)}
                                                                                    className="w-32 border border-gray-300 rounded px-2 py-1 text-sm"
                                                                                >
                                                                                    <option value="">Select {variationName}</option>
                                                                                    {values.map((value, idx) => (
                                                                                        <option key={`${variationName}-${idx}`} value={value}>
                                                                                            {value}
                                                                                        </option>
                                                                                    ))}
                                                                                </select>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                );
                                                            })()}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <input
                                                                type="number"
                                                                min="1"
                                                                value={item.quantity}
                                                                onChange={(e) => updateOrderItem(index, 'quantity', parseInt(e.target.value))}
                                                                className="w-20 border border-gray-300 rounded px-2 py-1"
                                                                required
                                                            />
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <input
                                                                type="number"
                                                                step="0.01"
                                                                value={item.price}
                                                                onChange={(e) => updateOrderItem(index, 'price', parseFloat(e.target.value))}
                                                                className="w-24 border border-gray-300 rounded px-2 py-1"
                                                                required
                                                            />
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                            ৳{(item.quantity * item.price).toFixed(2)}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <button
                                                                type="button"
                                                                onClick={() => removeOrderItem(index)}
                                                                className="text-red-600 hover:text-red-900"
                                                                disabled={orderItems.length === 1}
                                                            >
                                                                <TrashIcon className="h-4 w-4" />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                                <tr className="bg-gray-50 font-medium">
                                                    <td colSpan="3" className="px-6 py-4 text-right text-sm text-gray-900">
                                                        Total:
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        ৳{orderItems.reduce((sum, item) => sum + (item.quantity * item.price), 0).toFixed(2)}
                                                    </td>
                                                    <td></td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    {errors.items && <p className="text-red-500 text-sm mt-1">{errors.items}</p>}
                                </div>

                                <div className="flex justify-end space-x-3 pt-6">
                                    <Link
                                        href="/admin/orders"
                                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                                    >
                                        Cancel
                                    </Link>
                                    <button
                                        type="submit"
                                        disabled={processing || orderItems.filter(item => item.product_id).length === 0}
                                        className="btn-primary disabled:opacity-50"
                                    >
                                        {processing ? 'Creating...' : 'Create Order'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
