import { useForm, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import AdminLayout from '../../../Layouts/AdminLayout';
import { SpeakerWaveIcon, TrashIcon, CheckCircleIcon, XMarkIcon } from '@heroicons/react/24/outline';

export default function AdminNoticesIndex({ notices }) {
    const { flash } = usePage().props;
    const [showToast, setShowToast] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        text: '',
        is_active: true,
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
        post(route('admin.notices.store'), {
            onSuccess: () => reset(),
        });
    };

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this notice?')) {
            post(route('admin.notices.destroy', id), {
                _method: 'DELETE',
            });
        }
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
                    <h1 className="text-3xl font-bold text-gray-900">Notices</h1>
                    <p className="text-gray-600">Manage site-wide notices and announcements</p>
                </div>

                {/* Add Notice Form */}
                <div className="bg-white rounded-xl shadow-md p-6">
                    <h2 className="text-xl font-semibold mb-4">Add New Notice</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Notice Text</label>
                            <textarea
                                rows="3"
                                value={data.text}
                                onChange={(e) => setData('text', e.target.value)}
                                className="input-modern"
                                placeholder="Enter your notice text here..."
                                required
                            />
                            {errors.text && <p className="text-red-500 text-sm mt-1">{errors.text}</p>}
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={data.is_active}
                                    onChange={(e) => setData('is_active', e.target.checked)}
                                    className="rounded mr-2"
                                />
                                <label className="text-sm font-medium text-gray-700">Active</label>
                            </div>
                            <button
                                type="submit"
                                disabled={processing}
                                className="btn-primary"
                            >
                                {processing ? 'Adding...' : 'Add Notice'}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Notices List */}
                <div className="bg-white rounded-xl shadow-md">
                    <div className="p-6 border-b">
                        <h2 className="text-xl font-semibold text-gray-900">All Notices</h2>
                    </div>
                    <div className="p-6">
                        {notices.length > 0 ? (
                            <div className="space-y-4">
                                {notices.map((notice) => (
                                    <div key={notice.id} className="flex items-start justify-between p-4 border rounded-lg">
                                        <div className="flex-1">
                                            <p className="text-gray-900">{notice.text}</p>
                                            <div className="flex items-center mt-2 space-x-4">
                                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                    notice.is_active 
                                                        ? 'bg-green-100 text-green-800' 
                                                        : 'bg-red-100 text-red-800'
                                                }`}>
                                                    {notice.is_active ? 'Active' : 'Inactive'}
                                                </span>
                                                <span className="text-sm text-gray-500">
                                                    Created: {new Date(notice.created_at).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleDelete(notice.id)}
                                            className="ml-4 text-red-600 hover:text-red-800 p-2"
                                        >
                                            <TrashIcon className="h-5 w-5" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12 text-gray-500">
                                <SpeakerWaveIcon className="h-16 w-16 mx-auto mb-4 opacity-50" />
                                <h3 className="text-lg font-medium mb-2">No Notices Yet</h3>
                                <p>Create your first notice to inform customers</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
