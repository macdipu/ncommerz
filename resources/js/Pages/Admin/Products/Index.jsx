import { Link, router, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import AdminLayout from '../../../Layouts/AdminLayout';
import toast, { Toaster } from 'react-hot-toast';

export default function AdminProductsIndex({ products: initialProducts }) {
    const { flash } = usePage().props;
    const [products, setProducts] = useState(initialProducts);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(initialProducts.length === 12);
    const [page, setPage] = useState(1);

    useEffect(() => {
        if (flash.success) {
            toast.success(flash.success);
        }
        if (flash.error) {
            toast.error(flash.error);
        }
    }, [flash]);

    useEffect(() => {
        const handleScroll = () => {
            if (window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight || loading || !hasMore) {
                return;
            }
            loadMore();
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [loading, hasMore]);

    const loadMore = async () => {
        setLoading(true);
        try {
            const response = await fetch(`/admin/products?page=${page + 1}`, {
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                }
            });
            const data = await response.json();
            
            if (data.products && data.products.length > 0) {
                setProducts(prev => [...prev, ...data.products]);
                setPage(prev => prev + 1);
                setHasMore(data.products.length === 12);
            } else {
                setHasMore(false);
            }
        } catch (error) {
            console.error('Error loading more products:', error);
        }
        setLoading(false);
    };

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this product?')) {
            router.delete(route('admin.products.destroy', id), {
                onSuccess: () => {
                    // Remove the deleted product from the current state
                    setProducts(products.filter(product => product.id !== id));
                    toast.success('Product deleted successfully');
                }
            });
        }
    };

    const toggleStatus = (product) => {
        router.patch(route('admin.products.update', product.id), {
            ...product,
            is_active: !product.is_active
        }, {
            onSuccess: () => {
                // Update the product status in current state
                setProducts(products.map(p => 
                    p.id === product.id 
                        ? { ...p, is_active: !p.is_active }
                        : p
                ));
                toast.success('Product status updated');
            }
        });
    };

    return (
        <AdminLayout>
            <Toaster position="top-right" />
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Products</h1>
                        <p className="text-gray-600">Manage your product catalog</p>
                    </div>
                    <Link href="/admin/products/create" className="btn-primary">
                        Add New Product
                    </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {products.map((product) => (
                        <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                            <div className="aspect-square relative bg-gray-100">
                                {product.images && product.images[0] ? (
                                    <img
                                        src={`/storage/${product.images[0]}`}
                                        alt={product.name}
                                        className="w-full h-full object-contain"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                )}
                                <div className="absolute top-2 right-2 flex flex-col space-y-1">
                                    <button
                                        onClick={() => toggleStatus(product)}
                                        className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                            product.is_active
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-red-100 text-red-800'
                                        }`}
                                    >
                                        {product.is_active ? 'Active' : 'Inactive'}
                                    </button>
                                    {product.is_featured && (
                                        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                                            Featured
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div className="p-3">
                                <h3 className="font-semibold text-gray-900 text-sm mb-1 truncate">{product.name}</h3>
                                <p className="text-xs text-gray-600 mb-2">{product.category}</p>
                                
                                <div className="flex items-center justify-between mb-2">
                                    <div>
                                        {product.sale_price ? (
                                            <div className="flex items-center space-x-1">
                                                <span className="font-bold text-green-600 text-sm">৳{product.sale_price}</span>
                                                <span className="text-xs text-gray-500 line-through">৳{product.price}</span>
                                            </div>
                                        ) : (
                                            <span className="font-bold text-gray-900 text-sm">৳{product.price}</span>
                                        )}
                                    </div>
                                    <span className="text-xs text-gray-500">Stock: {product.stock}</span>
                                </div>

                                {product.variations_count > 0 && (
                                    <div className="mb-2">
                                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                                            {product.variations_count} variations
                                        </span>
                                    </div>
                                )}

                                <div className="flex justify-end space-x-2">
                                    <Link
                                        href={`/admin/products/${product.id}/edit`}
                                        className="text-indigo-600 hover:text-indigo-900 text-xs font-medium"
                                    >
                                        Edit
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(product.id)}
                                        className="text-red-600 hover:text-red-900 text-xs font-medium"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {loading && (
                    <div className="flex justify-center py-4">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                )}

                {!hasMore && products.length > 0 && (
                    <div className="text-center py-4 text-gray-500">
                        <p>No more products to load</p>
                    </div>
                )}

                {products.length === 0 && (
                    <div className="bg-white rounded-xl shadow-md">
                        <div className="p-12 text-center text-gray-500">
                            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-medium mb-2">No Products Yet</h3>
                            <p>Create your first product to start selling</p>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
