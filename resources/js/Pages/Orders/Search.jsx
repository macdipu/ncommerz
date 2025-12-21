import { useState, useEffect } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import AppLayout from '../../Layouts/AppLayout';
import CategoriesMenu from '../../Components/CategoriesMenu';
import WhatsAppButton from '../../Components/WhatsAppButton';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import toast, { Toaster } from 'react-hot-toast';

export default function Search({ categories = [] }) {
    const { flash, settings = {} } = usePage().props;
    const [orderNumber, setOrderNumber] = useState('');
    const [isSearching, setIsSearching] = useState(false);

    useEffect(() => {
        if (flash.success) {
            toast.success(flash.success);
        }
        if (flash.error) {
            toast.error(flash.error);
        }
    }, [flash]);

    const handleSearch = (e) => {
        e.preventDefault();
        if (!orderNumber.trim()) return;
        
        setIsSearching(true);
        router.visit(`/orders/track/${orderNumber.trim()}`, {
            onFinish: () => setIsSearching(false)
        });
    };

    return (
        <AppLayout>
            <Head title="অর্ডার ট্র্যাকিং" />
            <Toaster position="top-right" />
            
            {/* Categories Menu */}
            <CategoriesMenu categories={categories} />
            
            <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16">
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-pink-500 to-red-500 px-4 sm:px-6 py-6 sm:py-8 text-white text-center">
                        <h1 className="text-2xl sm:text-3xl font-bold mb-2">অর্ডার ট্র্যাকিং</h1>
                        <p className="text-base sm:text-lg opacity-90">আপনার অর্ডার নম্বর দিয়ে খুঁজুন</p>
                    </div>

                    <div className="p-4 sm:p-8">
                        <form onSubmit={handleSearch} className="space-y-6">
                            <div>
                                <label htmlFor="orderNumber" className="block text-sm font-medium text-gray-700 mb-2">
                                    অর্ডার নম্বর
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        id="orderNumber"
                                        value={orderNumber}
                                        onChange={(e) => setOrderNumber(e.target.value)}
                                        placeholder="ORD-1765654147-2974"
                                        className="w-full px-4 py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                                        required
                                    />
                                    <MagnifyingGlassIcon className="absolute right-3 top-3 h-5 w-5 sm:h-6 sm:w-6 text-gray-400" />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isSearching}
                                className="w-full bg-gradient-to-r from-pink-500 to-red-500 text-white py-3 px-6 rounded-lg font-semibold hover:from-pink-600 hover:to-red-600 transition-all duration-300 disabled:opacity-50 text-sm sm:text-base"
                            >
                                {isSearching ? 'খুঁজছি...' : 'অর্ডার খুঁজুন'}
                            </button>
                        </form>

                        <div className="mt-6 sm:mt-8 p-4 bg-blue-50 rounded-lg">
                            <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">সাহায্য প্রয়োজন?</h3>
                            <p className="text-xs sm:text-sm text-gray-600 mb-3">
                                অর্ডার নম্বর খুঁজে পাচ্ছেন না? আমাদের সাথে যোগাযোগ করুন
                            </p>
                            <div className="text-xs sm:text-sm">
                                <p className="font-medium">ফোন: 
                                    <a href={`tel:${settings?.support_phone}`} className="text-blue-600 hover:text-blue-800 ml-1">
                                        {settings?.support_phone}
                                    </a>
                                </p>
                            </div>
                        </div>
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
