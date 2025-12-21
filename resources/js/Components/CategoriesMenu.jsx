import { Link, usePage } from '@inertiajs/react';

export default function CategoriesMenu({ categories }) {
    const { url } = usePage();
    const currentCategory = new URLSearchParams(url.split('?')[1] || '').get('category');
    const isHome = url === '/';
    const isAllProducts = url === '/products' && !currentCategory;
    return (
        <nav className="bg-gray-800 shadow-lg">
            <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
                {/* Desktop Menu */}
                <div className="hidden md:block">
                    <div className="flex items-center space-x-1 py-3 overflow-x-auto scrollbar-hide">
                        <Link
                            href="/"
                            className={`px-6 py-3 text-sm font-semibold rounded-lg transition-all duration-300 shadow-md ${
                                isHome 
                                    ? 'text-white bg-pink-600 hover:bg-pink-700' 
                                    : 'text-gray-300 hover:text-white hover:bg-gray-700'
                            }`}
                        >
                            হোম
                        </Link>
                        
                        {categories.map((category) => (
                            <Link
                                key={category.id}
                                href={`/products?category=${category.slug}`}
                                className={`px-6 py-3 text-sm font-semibold rounded-lg transition-all duration-300 ${
                                    currentCategory === category.slug
                                        ? 'text-white bg-pink-600 hover:bg-pink-700 shadow-md'
                                        : 'text-gray-300 hover:text-white hover:bg-gray-700'
                                }`}
                            >
                                {category.name}
                            </Link>
                        ))}
                        
                        <Link
                            href="/products"
                            className={`px-6 py-3 text-sm font-semibold rounded-lg transition-all duration-300 ${
                                isAllProducts
                                    ? 'text-white bg-pink-600 hover:bg-pink-700 shadow-md'
                                    : 'text-gray-300 hover:text-white hover:bg-gray-700'
                            }`}
                        >
                            সব পণ্য
                        </Link>
                    </div>
                </div>

                {/* Mobile Menu */}
                <div className="md:hidden">
                    <div className="flex items-center space-x-3 overflow-x-auto scrollbar-hide pb-1 py-3">
                        <Link
                            href="/"
                            className={`flex-shrink-0 px-4 py-2 text-sm font-semibold rounded-lg whitespace-nowrap ${
                                isHome 
                                    ? 'text-white bg-pink-600 shadow-md' 
                                    : 'text-gray-300 hover:text-white hover:bg-gray-700'
                            }`}
                        >
                            হোম
                        </Link>
                        
                        {categories.map((category) => (
                            <Link
                                key={category.id}
                                href={`/products?category=${category.slug}`}
                                className={`flex-shrink-0 px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-300 whitespace-nowrap ${
                                    currentCategory === category.slug
                                        ? 'text-white bg-pink-600 shadow-md'
                                        : 'text-gray-300 hover:text-white hover:bg-gray-700'
                                }`}
                            >
                                {category.name}
                            </Link>
                        ))}
                        
                        <Link
                            href="/products"
                            className={`flex-shrink-0 px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-300 whitespace-nowrap ${
                                isAllProducts
                                    ? 'text-white bg-pink-600 shadow-md'
                                    : 'text-gray-300 hover:text-white hover:bg-gray-700'
                            }`}
                        >
                            সব পণ্য
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
}
