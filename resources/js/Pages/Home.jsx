import { Link } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { Head, usePage } from '@inertiajs/react';
import AppLayout from '../Layouts/AppLayout';
import CategoriesMenu from '../Components/CategoriesMenu';
import WhatsAppButton from '../Components/WhatsAppButton';
import InfoCard from '../Components/InfoCard';
import { 
    ShoppingBagIcon, 
    SparklesIcon, 
    FireIcon, 
    HeartIcon,
    StarIcon,
    TruckIcon,
    ShieldCheckIcon,
    CreditCardIcon,
    ChevronLeftIcon,
    ChevronRightIcon
} from '@heroicons/react/24/outline';

export default function Home({ 
    sliders = [], 
    banners = [], 
    featuredProducts = [], 
    latestProducts = [], 
    categories = [], 
    homeSettings = {},
    infoCards = []
}) {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });
    const [productStartIndex, setProductStartIndex] = useState(0);
    const [displayedProducts, setDisplayedProducts] = useState(10);
    
    // Use dynamic sliders or fallback to default
    const slides = sliders.length > 0 ? sliders : [
        {
            title: "Fashion That Speaks You",
            description: "Discover trending styles and exclusive deals",
            image_url: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=800&fit=crop",
            link_url: "/products"
        }
    ];

    // Infinite scroll effect
    useEffect(() => {
        const handleScroll = () => {
            if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 1000) {
                const allProducts = [...featuredProducts, ...latestProducts];
                if (displayedProducts < allProducts.length) {
                    setDisplayedProducts(prev => Math.min(prev + 10, allProducts.length));
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [displayedProducts, featuredProducts, latestProducts]);

    // Countdown timer logic
    useEffect(() => {
        const calculateTimeLeft = () => {
            const now = new Date();
            const endOfDay = new Date();
            endOfDay.setHours(23, 59, 59, 999);
            
            const difference = endOfDay - now;
            
            if (difference > 0) {
                const hours = Math.floor(difference / (1000 * 60 * 60));
                const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((difference % (1000 * 60)) / 1000);
                
                setTimeLeft({ hours, minutes, seconds });
            } else {
                setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
            }
        };

        calculateTimeLeft();
        const timer = setInterval(calculateTimeLeft, 1000);

        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        if (slides.length > 1) {
            const timer = setInterval(() => {
                setCurrentSlide((prev) => (prev + 1) % slides.length);
            }, 5000);
            return () => clearInterval(timer);
        }
    }, [slides.length]);

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'ArrowLeft') {
                prevSlide();
            } else if (event.key === 'ArrowRight') {
                nextSlide();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    };

    const handleSlideClick = (slide) => {
        if (slide.link_url) {
            window.location.href = slide.link_url;
        }
    };

    const nextProducts = () => {
        if (productStartIndex + 5 < featuredProducts.length) {
            setProductStartIndex(productStartIndex + 5);
        }
    };

    const prevProducts = () => {
        if (productStartIndex > 0) {
            setProductStartIndex(productStartIndex - 5);
        }
    };

    const { settings } = usePage().props;

    return (
        <AppLayout>
            <Head title={settings?.store_name || 'Happy Shopping'}>
                <meta name="description" content={settings?.store_description || 'Your fashion destination'} />
            </Head>
            
            {/* Categories Menu */}
            <CategoriesMenu categories={categories} />

            {/* Hero Section - Dynamic Layout */}
            <section className="bg-gray-50 pt-2">
                <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
                    {/* Check if banners exist */}
                    {(banners.find(b => b.position === 1) || banners.find(b => b.position === 2)) ? (
                        /* 2 Column Layout with Banners */
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                            {/* Left Column - Slider */}
                            <div className="lg:col-span-2">
                                <div className="relative w-full aspect-[2/1] rounded-xl overflow-hidden shadow-2xl bg-white">
                                    {slides.map((slide, index) => (
                                        <div
                                            key={index}
                                            className={`absolute inset-0 transition-transform duration-500 ease-in-out cursor-pointer ${
                                                index === currentSlide ? 'translate-x-0' : 
                                                index < currentSlide ? '-translate-x-full' : 'translate-x-full'
                                            }`}
                                            onClick={() => handleSlideClick(slide)}
                                        >
                                            <img
                                                src={slide.image_url}
                                                alt={slide.title}
                                                className="w-full h-full object-cover bg-gray-100"
                                            />
                                        </div>
                                    ))}

                                    {/* Navigation Arrows */}
                                    {slides.length > 1 && (
                                        <>
                                            <button
                                                onClick={prevSlide}
                                                className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-black/60 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/80 transition-colors"
                                            >
                                                <ChevronLeftIcon className="w-5 h-5" />
                                            </button>
                                            <button
                                                onClick={nextSlide}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-black/60 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/80 transition-colors"
                                            >
                                                <ChevronRightIcon className="w-5 h-5" />
                                            </button>

                                            {/* Slide Indicators */}
                                            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex space-x-2">
                                                {slides.map((_, index) => (
                                                    <button
                                                        key={index}
                                                        onClick={() => setCurrentSlide(index)}
                                                        className={`w-3 h-3 rounded-full transition-colors ${
                                                            index === currentSlide ? 'bg-white' : 'bg-white/50'
                                                        }`}
                                                    />
                                                ))}
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Right Column - Banners */}
                            <div className="space-y-4">
                                {/* Banner 1 */}
                                {banners.find(b => b.position === 1) && (
                                    <div 
                                        className="relative aspect-[2/1] rounded-xl overflow-hidden shadow-lg cursor-pointer"
                                        onClick={() => handleSlideClick(banners.find(b => b.position === 1))}
                                    >
                                        <img
                                            src={banners.find(b => b.position === 1).image_url}
                                            alt={banners.find(b => b.position === 1).title}
                                            className="w-full h-full object-contain bg-gray-100"
                                        />
                                    </div>
                                )}
                                
                                {/* Banner 2 */}
                                {banners.find(b => b.position === 2) && (
                                    <div 
                                        className="relative aspect-[2/1] rounded-xl overflow-hidden shadow-lg cursor-pointer"
                                        onClick={() => handleSlideClick(banners.find(b => b.position === 2))}
                                    >
                                        <img
                                            src={banners.find(b => b.position === 2).image_url}
                                            alt={banners.find(b => b.position === 2).title}
                                            className="w-full h-full object-contain bg-gray-100"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        /* Full Width Slider when no banners */
                        <div className="relative w-full aspect-[3/1] rounded-xl overflow-hidden shadow-2xl bg-white">
                            {slides.map((slide, index) => (
                                <div
                                    key={index}
                                    className={`absolute inset-0 transition-transform duration-500 ease-in-out cursor-pointer ${
                                        index === currentSlide ? 'translate-x-0' : 
                                        index < currentSlide ? '-translate-x-full' : 'translate-x-full'
                                    }`}
                                    onClick={() => handleSlideClick(slide)}
                                >
                                    <img
                                        src={slide.image_url}
                                        alt={slide.title}
                                        className="w-full h-full object-cover bg-gray-100"
                                    />
                                </div>
                            ))}

                            {/* Navigation Arrows */}
                            {slides.length > 1 && (
                                <>
                                    <button
                                        onClick={prevSlide}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-black/60 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/80 transition-colors"
                                    >
                                        <ChevronLeftIcon className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={nextSlide}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-black/60 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/80 transition-colors"
                                    >
                                        <ChevronRightIcon className="w-5 h-5" />
                                    </button>

                                    {/* Slide Indicators */}
                                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex space-x-2">
                                        {slides.map((_, index) => (
                                            <button
                                                key={index}
                                                onClick={() => setCurrentSlide(index)}
                                                className={`w-3 h-3 rounded-full transition-colors ${
                                                    index === currentSlide ? 'bg-white' : 'bg-white/50'
                                                }`}
                                            />
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </section>

            {/* Promotional Features */}
            <section className="bg-white py-4">
                <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
                        {infoCards.map((card) => (
                            <InfoCard key={card.id} card={card} />
                        ))}
                    </div>
                </div>
            </section>

            {/* Notices Marquee - Hidden */}
            {false && notices.length > 0 && (
                <section className="bg-gray-50 py-1">
                    <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
                        <div className="relative overflow-hidden bg-gradient-to-r from-purple-900 via-blue-900 to-purple-900 rounded-lg py-3 shadow-2xl border border-purple-500">
                            <div className="flex items-center">
                                <div className="flex-1 overflow-hidden">
                                    <div className="animate-marquee whitespace-nowrap text-white font-bold text-xl" style={{textShadow: '0 0 10px #ffffff, 0 0 20px #ffffff, 0 0 30px #ffffff'}}>
                                        {notices.map((notice, index) => (
                                            <span key={notice.id} className="inline-flex items-center mx-6">
                                                <span className="w-1 h-1 bg-white rounded-full mr-2 shadow-lg" style={{boxShadow: '0 0 10px #ffffff'}}></span>
                                                {notice.text}
                                                {index < notices.length - 1 && (
                                                    <span className="mx-4 text-white/60">•</span>
                                                )}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* Today's Special Offer - Featured Products */}
            {featuredProducts.length > 0 && (
                <section className="bg-gradient-to-r from-red-600 to-pink-600 py-6">
                    <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
                        {/* Header with Countdown */}
                        <div className="text-center mb-6">
                            <h2 className="text-white text-2xl font-bold mb-2">
                                {homeSettings.offer_title || 'শুধু আজকের জন্য অফার চলছে! অফার মিস করবেন না!'}
                            </h2>
                            <div className="text-white text-lg mb-4">{homeSettings.offer_countdown_text || 'Ends In'}</div>
                            <div className="flex justify-center gap-4">
                                <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2 text-white text-center">
                                    <div className="text-2xl font-bold">{String(timeLeft.hours).padStart(2, '0')}</div>
                                    <div className="text-xs">Hours</div>
                                </div>
                                <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2 text-white text-center">
                                    <div className="text-2xl font-bold">{String(timeLeft.minutes).padStart(2, '0')}</div>
                                    <div className="text-xs">Minutes</div>
                                </div>
                                <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2 text-white text-center">
                                    <div className="text-2xl font-bold">{String(timeLeft.seconds).padStart(2, '0')}</div>
                                    <div className="text-xs">Seconds</div>
                                </div>
                            </div>
                        </div>

                        {/* Featured Products Grid */}
                        <div className="relative">
                            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                                {featuredProducts.slice(productStartIndex, productStartIndex + 5).map((product) => (
                                    <div key={product.id} className="group h-full">
                                        <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 h-full flex flex-col">
                                            <Link href={`/products/${product.slug}`}>
                                                <div className="relative aspect-square overflow-hidden">
                                                    {product.sale_price && (
                                                        <div className="absolute top-2 left-2 z-10 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                                                            {Math.round(((product.price - product.sale_price) / product.price) * 100)}% OFF
                                                        </div>
                                                    )}
                                                    {product.images && product.images.length > 0 && (
                                                        <img
                                                            src={product.images[0].startsWith('http') ? product.images[0] : `/storage/${product.images[0]}`}
                                                            alt={product.name}
                                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                                        />
                                                    )}
                                                </div>
                                            </Link>
                                            <div className="p-3 flex-1 flex flex-col">
                                                <Link href={`/products/${product.slug}`}>
                                                    <h3 className="font-semibold text-sm text-gray-900 mb-2 line-clamp-2 hover:text-pink-600 flex-1">
                                                        {product.name}
                                                    </h3>
                                                </Link>
                                                <div className="flex items-center justify-between mb-3">
                                                    <div className="flex flex-col">
                                                        {product.sale_price ? (
                                                            <>
                                                                <span className="text-lg font-bold text-red-600">৳{product.sale_price}</span>
                                                                <span className="text-sm text-gray-500 line-through">৳{product.price}</span>
                                                            </>
                                                        ) : (
                                                            <span className="text-lg font-bold text-gray-900">৳{product.price}</span>
                                                        )}
                                                    </div>
                                                </div>
                                                <Link 
                                                    href={`/products/${product.slug}`}
                                                    className="w-full bg-pink-600 hover:bg-pink-700 text-white text-sm font-semibold py-2 px-3 rounded-lg transition-colors text-center block mt-auto"
                                                >
                                                    অর্ডার করুন
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Navigation Arrows */}
                            {featuredProducts.length > 5 && (
                                <>
                                    <button
                                        onClick={prevProducts}
                                        disabled={productStartIndex === 0}
                                        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-800 hover:bg-white shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                    >
                                        <ChevronLeftIcon className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={nextProducts}
                                        disabled={productStartIndex + 5 >= featuredProducts.length}
                                        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-800 hover:bg-white shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                    >
                                        <ChevronRightIcon className="w-5 h-5" />
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </section>
            )}

            {/* Categories Section */}
            {categories.length > 0 && (
                <section className="bg-white py-6">
                    <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
                        <div className="text-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">ক্যাটেগরি অনুযায়ী শপিং করুন</h2>
                            <p className="text-gray-600">আমাদের বিস্তৃত ক্যাটেগরি সমূহ দেখুন</p>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                            {categories.map((category) => (
                                <Link key={category.id} href={`/products?category=${category.slug}`} className="text-center group cursor-pointer">
                                    <div className="relative mb-6">
                                        {category.image && (
                                            <div className="w-48 h-48 mx-auto rounded-full overflow-hidden bg-gray-100 border-2 border-gray-200 group-hover:border-blue-500 transition-colors duration-200">
                                                <img
                                                    src={`/storage/${category.image}`}
                                                    alt={category.name}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                                />
                                            </div>
                                        )}
                                    </div>
                                    <h3 className="text-base font-medium text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
                                        {category.name}
                                    </h3>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* 3 Banners Section */}
            {(banners.find(b => b.position === 3) || banners.find(b => b.position === 4) || banners.find(b => b.position === 5)) && (
                <section className="bg-gray-50 pt-2">
                    <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* Banner 3 */}
                            {banners.find(b => b.position === 3) && (
                                <div 
                                    className="relative aspect-[3/2] rounded-xl overflow-hidden shadow-lg cursor-pointer"
                                    onClick={() => handleSlideClick(banners.find(b => b.position === 3))}
                                >
                                    <img
                                        src={banners.find(b => b.position === 3).image_url}
                                        alt={banners.find(b => b.position === 3).title}
                                        className="w-full h-full object-contain bg-gray-100"
                                    />
                                </div>
                            )}
                            
                            {/* Banner 4 */}
                            {banners.find(b => b.position === 4) && (
                                <div 
                                    className="relative aspect-[3/2] rounded-xl overflow-hidden shadow-lg cursor-pointer"
                                    onClick={() => handleSlideClick(banners.find(b => b.position === 4))}
                                >
                                    <img
                                        src={banners.find(b => b.position === 4).image_url}
                                        alt={banners.find(b => b.position === 4).title}
                                        className="w-full h-full object-contain bg-gray-100"
                                    />
                                </div>
                            )}
                            
                            {/* Banner 5 */}
                            {banners.find(b => b.position === 5) && (
                                <div 
                                    className="relative aspect-[3/2] rounded-xl overflow-hidden shadow-lg cursor-pointer"
                                    onClick={() => handleSlideClick(banners.find(b => b.position === 5))}
                                >
                                    <img
                                        src={banners.find(b => b.position === 5).image_url}
                                        alt={banners.find(b => b.position === 5).title}
                                        className="w-full h-full object-contain bg-gray-100"
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </section>
            )}

            {/* All Products Section */}
            <section className="py-8">
                <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">সকল পণ্যসমূহ</h2>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        {[...featuredProducts, ...latestProducts].slice(0, displayedProducts).map((product, index) => (
                            <div key={`product-${product.id}-${index}`} className="group h-full">
                                <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 h-full flex flex-col">
                                    <Link href={`/products/${product.slug}`}>
                                        <div className="relative aspect-square overflow-hidden">
                                            {product.sale_price && (
                                                <div className="absolute top-2 left-2 z-10 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                                                    {Math.round(((product.price - product.sale_price) / product.price) * 100)}% OFF
                                                </div>
                                            )}
                                            {product.images && product.images.length > 0 && (
                                                <img
                                                    src={product.images[0].startsWith('http') ? product.images[0] : `/storage/${product.images[0]}`}
                                                    alt={product.name}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                                />
                                            )}
                                        </div>
                                    </Link>
                                    <div className="p-3 flex-1 flex flex-col">
                                        <Link href={`/products/${product.slug}`}>
                                            <h3 className="font-semibold text-sm text-gray-900 mb-2 line-clamp-2 hover:text-pink-600 flex-1">
                                                {product.name}
                                            </h3>
                                        </Link>
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex flex-col">
                                                {product.sale_price ? (
                                                    <>
                                                        <span className="text-lg font-bold text-red-600">৳{product.sale_price}</span>
                                                        <span className="text-sm text-gray-500 line-through">৳{product.price}</span>
                                                    </>
                                                ) : (
                                                    <span className="text-lg font-bold text-gray-900">৳{product.price}</span>
                                                )}
                                            </div>
                                        </div>
                                        <Link 
                                            href={`/products/${product.slug}`}
                                            className="w-full bg-pink-600 hover:bg-pink-700 text-white text-sm font-semibold py-2 px-3 rounded-lg transition-colors text-center block mt-auto"
                                        >
                                            অর্ডার করুন
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {displayedProducts < [...featuredProducts, ...latestProducts].length && (
                        <div className="text-center mt-8">
                            <div className="text-gray-500 text-sm">Loading more products...</div>
                        </div>
                    )}
                </div>
            </section>

            {/* WhatsApp Button */}
            <WhatsAppButton />
        </AppLayout>
    );
}
