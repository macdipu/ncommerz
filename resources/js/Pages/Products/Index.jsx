import { Link, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import AppLayout from '../../Layouts/AppLayout';
import CategoriesMenu from '../../Components/CategoriesMenu';
import WhatsAppButton from '../../Components/WhatsAppButton';

export default function ProductsIndex({ products, categories, filters }) {
    const [allProducts, setAllProducts] = useState(products.data);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(products.next_page_url !== null);

    useEffect(() => {
        const handleScroll = () => {
            if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 1000 && hasMore && !loading) {
                loadMore();
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [hasMore, loading]);

    const loadMore = async () => {
        if (loading || !hasMore) return;
        
        setLoading(true);
        const nextPage = currentPage + 1;
        
        try {
            const response = await fetch(`/products?page=${nextPage}&category=${filters.category || ''}&search=${filters.search || ''}`, {
                headers: {
                    'Accept': 'application/json',
                }
            });
            
            const data = await response.json();
            
            if (data.props && data.props.products) {
                setAllProducts(prev => [...prev, ...data.props.products.data]);
                setCurrentPage(nextPage);
                setHasMore(data.props.products.next_page_url !== null);
            }
        } catch (error) {
            console.error('Error loading more products:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCategoryFilter = (categorySlug) => {
        router.get('/products', { category: categorySlug, search: filters.search });
    };

    return (
        <AppLayout>
            {/* Categories Menu */}
            <CategoriesMenu categories={categories} />
            <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-4">
                <div className="flex flex-col lg:flex-row gap-4">
                    {/* Sidebar */}
                    <div className="lg:w-1/5">
                        <div className="bg-white p-4 rounded-lg shadow-md">
                            <h3 className="font-semibold mb-4">Categories</h3>
                            <div className="space-y-2">
                                <button
                                    onClick={() => handleCategoryFilter('')}
                                    className={`block w-full text-left py-2 px-3 rounded text-sm ${
                                        !filters.category ? 'bg-pink-600 text-white' : 'hover:bg-gray-100'
                                    }`}
                                >
                                    All Categories
                                </button>
                                {categories.map((category) => (
                                    <button
                                        key={category.id}
                                        onClick={() => handleCategoryFilter(category.slug)}
                                        className={`block w-full text-left py-2 px-3 rounded text-sm ${
                                            filters.category === category.slug 
                                                ? 'bg-pink-600 text-white' 
                                                : 'hover:bg-gray-100'
                                        }`}
                                    >
                                        {category.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="lg:w-4/5">
                        {/* Products Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                            {allProducts.map((product, index) => (
                                <Link key={`${product.id}-${index}`} href={`/products/${product.slug}`} className="block">
                                    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-105 h-full flex flex-col">
                                        <div className="aspect-square bg-gray-200">
                                            {product.images && product.images[0] && (
                                                <img
                                                    src={product.images[0].startsWith('http') ? product.images[0] : `/storage/${product.images[0]}`}
                                                    alt={product.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            )}
                                        </div>
                                        <div className="p-3 flex-1 flex flex-col">
                                            <h3 className="font-semibold text-sm text-gray-900 mb-2 line-clamp-2 flex-1">
                                                {product.name}
                                            </h3>
                                            <div className="flex items-center justify-between mb-3">
                                                <div className="flex flex-col">
                                                    {product.sale_price ? (
                                                        <>
                                                            <span className="text-red-600 font-bold text-sm">৳{product.sale_price}</span>
                                                            <span className="text-gray-500 line-through text-xs">৳{product.price}</span>
                                                        </>
                                                    ) : (
                                                        <span className="text-gray-900 font-bold text-sm">৳{product.price}</span>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="w-full bg-pink-600 hover:bg-pink-700 text-white text-xs font-semibold py-2 px-3 rounded-lg transition-colors text-center">
                                                অর্ডার করুন
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>

                        {/* Loading indicator */}
                        {loading && (
                            <div className="text-center mt-8">
                                <div className="text-gray-500 text-sm">Loading more products...</div>
                            </div>
                        )}

                        {/* End of results */}
                        {!hasMore && allProducts.length > 0 && (
                            <div className="text-center mt-8">
                                <div className="text-gray-500 text-sm">No more products to load</div>
                            </div>
                        )}

                        {/* No products found */}
                        {allProducts.length === 0 && (
                            <div className="text-center mt-8">
                                <div className="text-gray-500">No products found</div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* WhatsApp Button */}
            <WhatsAppButton />
        </AppLayout>
    );
}
