import { Head } from '@inertiajs/react';
import AppLayout from '../../Layouts/AppLayout';
import CategoriesMenu from '../../Components/CategoriesMenu';
import WhatsAppButton from '../../Components/WhatsAppButton';
import { 
    CheckCircleIcon,
    TruckIcon,
    MapPinIcon
} from '@heroicons/react/24/outline';

export default function Track({ order, categories = [], settings = {} }) {
    const getStatusIcon = (status) => {
        switch(status) {
            case 'pending': return <CheckCircleIcon className="w-6 h-6 text-green-500" />;
            case 'processing': return <CheckCircleIcon className="w-6 h-6 text-green-500" />;
            case 'shipped': return <TruckIcon className="w-6 h-6 text-purple-500" />;
            case 'delivered': return <CheckCircleIcon className="w-6 h-6 text-green-500" />;
            default: return <CheckCircleIcon className="w-6 h-6 text-green-500" />;
        }
    };

    const getStatusText = (status) => {
        switch(status) {
            case 'pending': return 'অর্ডার গ্রহণ করা হয়েছে';
            case 'processing': return 'অর্ডার প্রস্তুত করা হচ্ছে';
            case 'shipped': return 'পণ্য পাঠানো হয়েছে';
            case 'delivered': return 'পণ্য ডেলিভার হয়েছে';
            default: return 'অজানা স্ট্যাটাস';
        }
    };

    return (
        <AppLayout>
            <Head title={`Order Tracking - ${order.order_number}`} />
            
            {/* Categories Menu */}
            <CategoriesMenu categories={categories} />
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-pink-500 to-red-500 px-6 py-8 text-white text-center">
                        <h1 className="text-2xl font-bold mb-2">অর্ডার ট্র্যাকিং</h1>
                        <p className="text-lg">অর্ডার নম্বর: #{order.order_number}</p>
                    </div>

                    <div className="p-6 space-y-6">
                        {/* Order Status */}
                        <div className="flex items-center justify-center space-x-4 p-6 bg-gray-50 rounded-xl">
                            {getStatusIcon(order.status)}
                            <div className="text-center">
                                <div className="text-lg font-semibold text-gray-900">{getStatusText(order.status)}</div>
                                <div className="text-sm text-gray-600">অর্ডারের তারিখ: {new Date(order.created_at).toLocaleDateString('bn-BD')}</div>
                            </div>
                        </div>

                        {/* Customer Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-gray-50 rounded-xl p-4">
                                <h3 className="font-semibold text-gray-900 mb-3">গ্রাহকের তথ্য</h3>
                                <div className="space-y-2 text-sm">
                                    <p><span className="font-medium">নাম:</span> {order.user.name}</p>
                                    <p><span className="font-medium">মোবাইল:</span> 
                                        <a href={`tel:${order.user.phone}`} className="text-blue-600 hover:text-blue-800 ml-1">
                                            {order.user.phone}
                                        </a>
                                    </p>
                                    <p><span className="font-medium">ঠিকানা:</span> {order.user.address}</p>
                                </div>
                            </div>

                            <div className="bg-gray-50 rounded-xl p-4">
                                <h3 className="font-semibold text-gray-900 mb-3">পেমেন্ট তথ্য</h3>
                                <div className="space-y-2 text-sm">
                                    <p><span className="font-medium">পেমেন্ট মেথড:</span> 
                                        <span className="capitalize ml-1">
                                            {order.payment_method === 'cod' ? 'ক্যাশ অন ডেলিভারি' : 
                                             order.payment_method === 'bkash' ? 'বিকাশ' : 
                                             order.payment_method === 'nagad' ? 'নগদ' : order.payment_method}
                                        </span>
                                    </p>
                                    {order.transaction_id && (
                                        <p><span className="font-medium">ট্রানজেকশন আইডি:</span> {order.transaction_id}</p>
                                    )}
                                    <p><span className="font-medium">মোট মূল্য:</span> ৳{order.total}</p>
                                </div>
                            </div>
                        </div>

                        {/* Order Items */}
                        <div>
                            <h3 className="font-semibold text-gray-900 mb-4">অর্ডারকৃত পণ্যসমূহ</h3>
                            <div className="space-y-4">
                                {order.order_items.map((item, index) => (
                                    <div key={index} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                                        {item.product?.images && item.product.images[0] && (
                                            <img
                                                src={item.product.images[0].startsWith('http') 
                                                    ? item.product.images[0] 
                                                    : `/storage/${item.product.images[0]}`}
                                                alt={item.product?.name}
                                                className="w-16 h-16 object-cover rounded-lg"
                                            />
                                        )}
                                        <div className="flex-1">
                                            <h4 className="font-medium text-gray-900">{item.product?.name || 'পণ্য পাওয়া যায়নি'}</h4>
                                            <p className="text-sm text-gray-600">পরিমাণ: {item.quantity}</p>
                                            <p className="text-sm text-gray-600">মূল্য: ৳{item.price} × {item.quantity} = ৳{(item.price * item.quantity).toFixed(2)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Contact Info */}
                        <div className="bg-blue-50 rounded-xl p-6 text-center">
                            <h3 className="font-semibold text-gray-900 mb-2">সহায়তা প্রয়োজন?</h3>
                            <p className="text-sm text-gray-600 mb-4">
                                আপনার অর্ডার সম্পর্কে কোন প্রশ্ন থাকলে আমাদের সাথে যোগাযোগ করুন
                            </p>
                            <div className="flex justify-center space-x-4 text-sm">
                                <span className="font-medium">ফোন: 
                                    <a href={`tel:${settings?.support_phone}`} className="text-blue-600 hover:text-blue-800 ml-1">
                                        {settings?.support_phone}
                                    </a>
                                </span>
                                <span className="font-medium">ইমেইল: 
                                    <a href={`mailto:${settings.support_email || 'support@example.com'}`} className="text-blue-600 hover:text-blue-800 ml-1">
                                        {settings.support_email || 'support@example.com'}
                                    </a>
                                </span>
                            </div>
                        </div>

                        {/* Thank You Message */}
                        <div className="bg-gradient-to-r from-pink-50 to-red-50 rounded-xl p-6 text-center border border-pink-200">
                            <p className="text-lg font-semibold text-gray-800">
                                ফ্যাশন বিডির সাথে থাকার জন্য আপনাকে অসংখ্য ধন্যবাদ ফ্যাশন বিডি আপনার আস্থা প্রতীক।
                            </p>
                        </div>

                        {/* Support Contact */}
                        {settings.support_email && (
                            <div className="text-center py-4">
                                <p className="text-sm text-gray-600">
                                    সহায়তার জন্য যোগাযোগ করুন: 
                                    <a 
                                        href={`mailto:${settings.support_email}`} 
                                        className="text-blue-600 hover:text-blue-800 ml-1 font-medium"
                                    >
                                        {settings.support_email}
                                    </a>
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Floating WhatsApp Button */}
            <div className="fixed bottom-6 right-6 z-50">
                <div className="absolute inset-0 bg-green-400 rounded-full animate-ping opacity-75"></div>
                <a
                    href={`https://wa.me/${settings?.support_phone ? settings.support_phone.replace(/[^0-9]/g, '') : ''}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg transition-all duration-300 block"
                >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                    </svg>
                </a>
            </div>

            {/* WhatsApp Button */}
            <WhatsAppButton />
        </AppLayout>
    );
}
