import { Link, router, usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import AdminLayout from '../../../Layouts/AdminLayout';
import toast, { Toaster } from 'react-hot-toast';

export default function Index({ sliders }) {
    const { flash } = usePage().props;

    useEffect(() => {
        if (flash.success) {
            toast.success(flash.success);
        }
        if (flash.error) {
            toast.error(flash.error);
        }
    }, [flash]);

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this slider?')) {
            router.delete(route('admin.sliders.destroy', id));
        }
    };

    const toggleStatus = (slider) => {
        router.patch(route('admin.sliders.update', slider.id), {
            ...slider,
            is_active: !slider.is_active
        });
    };

    return (
        <AdminLayout>
            <Toaster position="top-right" />
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Sliders</h1>
                        <p className="text-gray-600">Manage homepage sliders</p>
                    </div>
                    <Link href="/admin/sliders/create" className="btn-primary">
                        Add New Slider
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sliders.map((slider) => (
                        <div key={slider.id} className="bg-white rounded-xl shadow-md overflow-hidden">
                            <div className="aspect-video relative bg-gray-100">
                                <img
                                    src={slider.full_image_url}
                                    alt={slider.title}
                                    className="w-full h-full object-contain"
                                />
                                <div className="absolute top-2 right-2">
                                    <button
                                        onClick={() => toggleStatus(slider)}
                                        className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                            slider.is_active
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-red-100 text-red-800'
                                        }`}
                                    >
                                        {slider.is_active ? 'Active' : 'Inactive'}
                                    </button>
                                </div>
                            </div>
                            <div className="p-4">
                                <h3 className="font-semibold text-gray-900 mb-2">{slider.title}</h3>
                                {slider.description && (
                                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{slider.description}</p>
                                )}
                                <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                                    <span>Order: {slider.sort_order}</span>
                                    {slider.link_url && (
                                        <span className="truncate ml-2">🔗 Link</span>
                                    )}
                                </div>
                                <div className="flex justify-end space-x-2">
                                    <Link
                                        href={`/admin/sliders/${slider.id}/edit`}
                                        className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
                                    >
                                        Edit
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(slider.id)}
                                        className="text-red-600 hover:text-red-900 text-sm font-medium"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {sliders.length === 0 && (
                    <div className="bg-white rounded-xl shadow-md">
                        <div className="p-12 text-center text-gray-500">
                            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-medium mb-2">No Sliders Yet</h3>
                            <p>Create your first slider to showcase on homepage</p>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
