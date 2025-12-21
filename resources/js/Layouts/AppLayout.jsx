import { Link, usePage, router } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';
import { 
    MagnifyingGlassIcon
} from '@heroicons/react/24/outline';

export default function AppLayout({ children }) {
    const { auth, settings = {} } = usePage().props;
    const [searchQuery, setSearchQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const searchRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        if (searchQuery.length > 1) {
            const fetchSuggestions = async () => {
                try {
                    const response = await fetch(`/api/search-suggestions?q=${encodeURIComponent(searchQuery)}`);
                    const data = await response.json();
                    setSuggestions(data.slice(0, 5));
                    setShowSuggestions(true);
                } catch (error) {
                    console.error('Error fetching suggestions:', error);
                }
            };

            const timeoutId = setTimeout(fetchSuggestions, 300);
            return () => clearTimeout(timeoutId);
        } else {
            setSuggestions([]);
            setShowSuggestions(false);
        }
    }, [searchQuery]);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.get('/products', { search: searchQuery.trim() });
            setShowSuggestions(false);
        }
    };

    const handleSuggestionClick = (product) => {
        router.get(`/products/${product.slug}`);
        setShowSuggestions(false);
        setSearchQuery('');
    };

    return (
        <div className="min-h-screen bg-white flex flex-col">
            {/* Header */}
            <header className="bg-white/95 backdrop-blur-lg shadow-lg border-b border-gray-100 sticky top-0 z-50">
                <nav className="mx-auto max-w-7xl px-2 sm:px-4 lg:px-6">
                    <div className="flex h-16 justify-between items-center">
                        <div className="flex items-center">
                            <Link href="/" className="flex items-center">
                                {settings.logo ? (
                                    <img 
                                        src={`/storage/${settings.logo}`} 
                                        alt={settings.store_name || 'Happy Shopping'} 
                                        className="h-16 w-auto"
                                    />
                                ) : (
                                    <span className="text-2xl font-black text-gradient">
                                        {settings.store_name || 'Happy Shopping'}
                                    </span>
                                )}
                            </Link>
                        </div>

                        {/* Search Bar - Desktop */}
                        <div className="hidden md:flex flex-1 max-w-lg mx-8" ref={searchRef}>
                            <div className="relative w-full">
                                <form onSubmit={handleSearch}>
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="Search for products..."
                                        className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 rounded-full focus:border-pink-500 focus:outline-none transition-colors"
                                    />
                                    <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                                </form>
                                
                                {/* Search Suggestions */}
                                {showSuggestions && suggestions.length > 0 && (
                                    <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg mt-1 z-50">
                                        {suggestions.map((product, index) => (
                                            <button
                                                key={index}
                                                onClick={() => handleSuggestionClick(product)}
                                                className="w-full text-left px-4 py-2 hover:bg-gray-100 border-b border-gray-100 last:border-b-0 flex items-center space-x-3"
                                            >
                                                {product.images && product.images[0] && (
                                                    <img
                                                        src={product.images[0].startsWith('http') ? product.images[0] : `/storage/${product.images[0]}`}
                                                        alt={product.name}
                                                        className="w-8 h-8 object-cover rounded"
                                                    />
                                                )}
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900">{product.name}</div>
                                                    <div className="text-xs text-gray-500">৳{product.sale_price || product.price}</div>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Right side */}
                        <div className="flex items-center space-x-4">
                            {/* Track Order - Mobile (next to call button) */}
                            <Link 
                                href="/orders/track" 
                                className="md:hidden bg-pink-500 hover:bg-pink-600 text-white px-2 py-2 rounded-lg transition-colors flex items-center space-x-1"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span className="text-xs">ট্র্যাক করুন</span>
                            </Link>

                            {/* Call Icon - Mobile only */}
                            <a 
                                href={`tel:${settings.support_phone}`} 
                                className="md:hidden bg-green-500 hover:bg-green-600 text-white px-2 py-2 rounded-lg transition-colors flex items-center space-x-1"
                            >
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"/>
                                </svg>
                                <span className="text-xs">কল করুন</span>
                            </a>

                            {/* Phone Number - Desktop only */}
                            <a 
                                href={`tel:${settings.support_phone}`} 
                                className="hidden md:flex bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium items-center space-x-2 transition-colors"
                            >
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"/>
                                </svg>
                                <span>{settings.support_phone}</span>
                            </a>

                            {/* Track Order - Desktop only */}
                            <Link 
                                href="/orders/track" 
                                className="hidden md:flex bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-lg font-medium items-center space-x-2 transition-colors"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>অর্ডার ট্র্যাক করুন</span>
                            </Link>
                        </div>
                    </div>
                </nav>
            </header>

            {/* Main Content */}
            <main className="flex-grow">{children}</main>

            {/* Footer */}
            <footer className="bg-gray-900 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <p className="text-gray-400 text-sm mb-4 md:mb-0">
                            &copy; 2025 {settings.store_name || 'Happy Shopping'}. All rights reserved.
                        </p>
                        <div className="flex space-x-6">
                            <Link href="/privacy" className="text-gray-400 hover:text-white text-sm transition-colors">
                                Privacy Policy
                            </Link>
                            <Link href="/terms" className="text-gray-400 hover:text-white text-sm transition-colors">
                                Terms of Service
                            </Link>
                            <Link href="/refund" className="text-gray-400 hover:text-white text-sm transition-colors">
                                Refund Policy
                            </Link>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
