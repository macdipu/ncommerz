import { useEffect } from 'react';

export default function Print({ order }) {
    useEffect(() => {
        window.print();
    }, []);

    return (
        <div className="max-w-4xl mx-auto p-8 bg-white">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Order Invoice</h1>
                <p className="text-gray-600">Order #{order.order_number}</p>
            </div>

            <div className="grid grid-cols-2 gap-8 mb-8">
                <div>
                    <h3 className="text-lg font-semibold mb-4">Customer Information</h3>
                    <div className="space-y-2">
                        <p><strong>Name:</strong> {order.user.name}</p>
                        <p><strong>Email:</strong> {order.user.email}</p>
                        <p><strong>Phone:</strong> {order.user.phone || 'N/A'}</p>
                        <p><strong>Address:</strong> {order.user.address || 'N/A'}</p>
                    </div>
                </div>

                <div>
                    <h3 className="text-lg font-semibold mb-4">Order Details</h3>
                    <div className="space-y-2">
                        <p><strong>Order Number:</strong> {order.order_number}</p>
                        <p><strong>Status:</strong> <span className="capitalize">{order.status}</span></p>
                        <p><strong>Order Date:</strong> {new Date(order.created_at).toLocaleDateString()}</p>
                        <p><strong>Total Amount:</strong> ৳{order.total}</p>
                    </div>
                </div>
            </div>

            <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4">Order Items</h3>
                <table className="w-full border-collapse border border-gray-300">
                    <thead>
                        <tr className="bg-gray-50">
                            <th className="border border-gray-300 px-4 py-2 text-left">Product</th>
                            <th className="border border-gray-300 px-4 py-2 text-center">Quantity</th>
                            <th className="border border-gray-300 px-4 py-2 text-right">Unit Price</th>
                            <th className="border border-gray-300 px-4 py-2 text-right">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {order.order_items.map((item, index) => (
                            <tr key={index}>
                                <td className="border border-gray-300 px-4 py-2">
                                    {item.product?.name || 'Product not found'}
                                </td>
                                <td className="border border-gray-300 px-4 py-2 text-center">
                                    {item.quantity}
                                </td>
                                <td className="border border-gray-300 px-4 py-2 text-right">
                                    ৳{item.price}
                                </td>
                                <td className="border border-gray-300 px-4 py-2 text-right">
                                    ৳{(item.quantity * item.price).toFixed(2)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot>
                        <tr className="bg-gray-50 font-semibold">
                            <td colSpan="3" className="border border-gray-300 px-4 py-2 text-right">
                                Total:
                            </td>
                            <td className="border border-gray-300 px-4 py-2 text-right">
                                ৳{order.total}
                            </td>
                        </tr>
                    </tfoot>
                </table>
            </div>

            <div className="text-center text-gray-500 text-sm">
                <p>Thank you for your business!</p>
                <p>Generated on {new Date().toLocaleDateString()}</p>
            </div>
        </div>
    );
}
