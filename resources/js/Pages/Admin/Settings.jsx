import { useForm, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import AdminLayout from '../../Layouts/AdminLayout';
import { CheckCircleIcon, XMarkIcon } from '@heroicons/react/24/outline';

function InfoCardEditor({ card }) {
    const { data, setData, post, processing } = useForm({
        title: card.title,
        subtitle: card.subtitle,
        is_active: card.is_active,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(`/admin/info-cards/${card.id}`);
    };

    return (
        <form onSubmit={handleSubmit} className="border rounded-lg p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    <input
                        type="text"
                        value={data.title}
                        onChange={(e) => setData('title', e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
                    <input
                        type="text"
                        value={data.subtitle}
                        onChange={(e) => setData('subtitle', e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                        required
                    />
                </div>
                <div className="flex items-end">
                    <label className="flex items-center">
                        <input
                            type="checkbox"
                            checked={data.is_active}
                            onChange={(e) => setData('is_active', e.target.checked)}
                            className="mr-2"
                        />
                        Active
                    </label>
                    <button
                        type="submit"
                        disabled={processing}
                        className="ml-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                    >
                        {processing ? 'Saving...' : 'Update'}
                    </button>
                </div>
            </div>
        </form>
    );
}

export default function AdminSettings({ settings, infoCards }) {
    const { flash } = usePage().props;
    const [showToast, setShowToast] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        store_name: settings.store_name || '',
        store_description: settings.store_description || '',
        support_email: settings.support_email || '',
        support_phone: settings.support_phone || '',
        offer_title: settings.offer_title || '',
        offer_countdown_text: settings.offer_countdown_text || '',
        logo: null,
        cod_enabled: settings.cod_enabled || false,
        bkash_enabled: settings.bkash_enabled || false,
        nagad_enabled: settings.nagad_enabled || false,
        bkash_number: settings.bkash_number || '',
        bkash_instructions: settings.bkash_instructions || '',
        nagad_number: settings.nagad_number || '',
        nagad_instructions: settings.nagad_instructions || '',
    });

    useEffect(() => {
        if (flash?.success) {
            setShowToast(true);
            const timer = setTimeout(() => {
                setShowToast(false);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [flash?.success]);

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.settings.update'), {
            forceFormData: true,
        });
    };

    return (
        <AdminLayout>
            {/* Toast Notification */}
            {showToast && (
                <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg flex items-center space-x-3 animate-fade-in">
                    <CheckCircleIcon className="h-5 w-5" />
                    <span>{flash?.success}</span>
                    <button onClick={() => setShowToast(false)}>
                        <XMarkIcon className="h-4 w-4" />
                    </button>
                </div>
            )}

            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
                    <p className="text-gray-600">Manage your store settings</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Store Settings */}
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <h2 className="text-xl font-semibold mb-4">Store Information</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Store Name</label>
                                    <input 
                                        type="text" 
                                        value={data.store_name}
                                        onChange={(e) => setData('store_name', e.target.value)}
                                        className="input-modern" 
                                        required
                                    />
                                    {errors.store_name && <p className="text-red-500 text-sm mt-1">{errors.store_name}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Store Logo</label>
                                    <div className="flex items-center space-x-4">
                                        {settings.logo && (
                                            <img 
                                                src={`/storage/${settings.logo}`} 
                                                alt="Current Logo" 
                                                className="h-16 w-auto object-contain"
                                            />
                                        )}
                                        <div className="flex-1">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => setData('logo', e.target.files[0])}
                                                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Store Description</label>
                                    <textarea 
                                        rows="3" 
                                        value={data.store_description}
                                        onChange={(e) => setData('store_description', e.target.value)}
                                        className="input-modern" 
                                        placeholder="Your fashion destination..."
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Support Email
                                    </label>
                                    <input 
                                        type="email" 
                                        value={data.support_email}
                                        onChange={(e) => setData('support_email', e.target.value)}
                                        className="input-modern" 
                                        placeholder="support@example.com"
                                    />
                                    {errors.support_email && <p className="text-red-500 text-sm mt-1">{errors.support_email}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Support Phone
                                    </label>
                                    <input 
                                        type="text" 
                                        value={data.support_phone}
                                        onChange={(e) => setData('support_phone', e.target.value)}
                                        className="input-modern" 
                                        placeholder="+880 1647-126244"
                                    />
                                    {errors.support_phone && <p className="text-red-500 text-sm mt-1">{errors.support_phone}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Offer Title
                                    </label>
                                    <input 
                                        type="text" 
                                        value={data.offer_title}
                                        onChange={(e) => setData('offer_title', e.target.value)}
                                        className="input-modern" 
                                        placeholder="শুধু আজকের জন্য অফার চলছে! অফার মিস করবেন না!"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Offer Countdown Text
                                    </label>
                                    <input 
                                        type="text" 
                                        value={data.offer_countdown_text}
                                        onChange={(e) => setData('offer_countdown_text', e.target.value)}
                                        className="input-modern" 
                                        placeholder="Ends In"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Payment Settings */}
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <h2 className="text-xl font-semibold mb-4">Payment Methods</h2>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-gray-700">Cash on Delivery</span>
                                    <input 
                                        type="checkbox" 
                                        checked={data.cod_enabled}
                                        onChange={(e) => setData('cod_enabled', e.target.checked)}
                                        className="rounded" 
                                    />
                                </div>
                                
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-gray-700">bKash Personal</span>
                                    <input 
                                        type="checkbox" 
                                        checked={data.bkash_enabled}
                                        onChange={(e) => setData('bkash_enabled', e.target.checked)}
                                        className="rounded" 
                                    />
                                </div>
                                {data.bkash_enabled && (
                                    <div className="space-y-3 pl-4 border-l-2 border-pink-200">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">bKash Number</label>
                                            <input 
                                                type="text" 
                                                value={data.bkash_number}
                                                onChange={(e) => setData('bkash_number', e.target.value)}
                                                className="input-modern" 
                                                placeholder="01XXXXXXXXX"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">bKash Instructions</label>
                                            <textarea 
                                                rows="3"
                                                value={data.bkash_instructions}
                                                onChange={(e) => setData('bkash_instructions', e.target.value)}
                                                className="input-modern" 
                                                placeholder="Send money to this number and provide transaction ID..."
                                            />
                                        </div>
                                    </div>
                                )}
                                
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-gray-700">Nagad Personal</span>
                                    <input 
                                        type="checkbox" 
                                        checked={data.nagad_enabled}
                                        onChange={(e) => setData('nagad_enabled', e.target.checked)}
                                        className="rounded" 
                                    />
                                </div>
                                {data.nagad_enabled && (
                                    <div className="space-y-3 pl-4 border-l-2 border-orange-200">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Nagad Number</label>
                                            <input 
                                                type="text" 
                                                value={data.nagad_number}
                                                onChange={(e) => setData('nagad_number', e.target.value)}
                                                className="input-modern" 
                                                placeholder="01XXXXXXXXX"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Nagad Instructions</label>
                                            <textarea 
                                                rows="3"
                                                value={data.nagad_instructions}
                                                onChange={(e) => setData('nagad_instructions', e.target.value)}
                                                className="input-modern" 
                                                placeholder="Send money to this number and provide transaction ID..."
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Save Button */}
                    <div className="flex justify-end">
                        <button 
                            type="submit" 
                            disabled={processing}
                            className="btn-primary"
                        >
                            {processing ? 'Saving...' : 'Save Settings'}
                        </button>
                    </div>
                </form>

                {/* Info Cards Management */}
                <div className="mt-8 bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-semibold mb-4">Promotional Info Cards</h3>
                    <div className="space-y-4">
                        {infoCards.map((card) => (
                            <InfoCardEditor key={card.id} card={card} />
                        ))}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
