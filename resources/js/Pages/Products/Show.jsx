import { useState, useEffect } from 'react';
import { Head, useForm, usePage, router } from '@inertiajs/react';
import AppLayout from '../../Layouts/AppLayout';
import CategoriesMenu from '../../Components/CategoriesMenu';
import { 
    StarIcon, 
    HeartIcon, 
    ShareIcon,
    ShoppingBagIcon,
    TruckIcon,
    ShieldCheckIcon,
    ArrowPathIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    XMarkIcon,
    MagnifyingGlassIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import toast, { Toaster } from 'react-hot-toast';

export default function Show({ product, relatedProducts, categories = [], settings = {} }) {
    const { flash, auth } = usePage().props;
    const [selectedImage, setSelectedImage] = useState(0);
    const [selectedVariations, setSelectedVariations] = useState({});
    const [showModal, setShowModal] = useState(false);
    const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
    const [isZooming, setIsZooming] = useState(false);
    
    // Generate random rating and review count
    const [randomRating] = useState(() => (Math.random() * (5.0 - 4.0) + 4.0).toFixed(1));
    const [randomReviews] = useState(() => Math.floor(Math.random() * (500 - 50) + 50));
    
    // Form validation
    const isFormValid = () => {
        const basicFieldsValid = data.customer_name.trim() && 
               data.customer_phone.trim() && 
               data.thana.trim() && 
               data.district.trim() && 
               data.delivery_location.trim() &&
               data.payment_method;
        
        // For digital payments, transaction ID is required
        if (data.payment_method === 'bkash' || data.payment_method === 'nagad') {
            return basicFieldsValid && data.transaction_id.trim();
        }
        
        return basicFieldsValid;
    };
    
    const { data, setData, post, processing, errors, reset } = useForm({
        customer_name: auth.user?.name || '',
        customer_phone: auth.user?.phone || '',
        thana: '',
        district: '',
        delivery_location: '',
        quantity: 1,
        variations: {},
        payment_method: 'cod',
        transaction_id: '',
    });

    // Group variations by attribute name
    const groupedVariations = product.variations?.reduce((acc, variation) => {
        if (!acc[variation.name]) {
            acc[variation.name] = [];
        }
        acc[variation.name].push(variation);
        return acc;
    }, {}) || {};

    // Auto-save incomplete order data to database
    useEffect(() => {
        const saveIncompleteOrder = () => {
            if (data.customer_name || data.customer_phone || data.thana || data.district || data.delivery_location) {
                const incompleteOrder = {
                    product_id: product.id,
                    product_name: product.name,
                    product_price: currentPrice(),
                    ...data,
                    variations: selectedVariations
                };
                
                const params = new URLSearchParams();
                Object.keys(incompleteOrder).forEach(key => {
                    if (incompleteOrder[key] !== null && incompleteOrder[key] !== undefined) {
                        params.append(key, typeof incompleteOrder[key] === 'object' ? JSON.stringify(incompleteOrder[key]) : incompleteOrder[key]);
                    }
                });
                
                fetch(`/incomplete-orders?${params.toString()}`, {
                    method: 'GET',
                    headers: {
                        'X-Requested-With': 'XMLHttpRequest'
                    }
                }).catch(() => {});
            }
        };

        const timeoutId = setTimeout(saveIncompleteOrder, 2000);
        return () => clearTimeout(timeoutId);
    }, [data, selectedVariations]);



    const currentPrice = () => {
        let price = parseFloat(product.sale_price || product.price);
        
        // Add price adjustments from selected variations
        Object.values(selectedVariations).forEach(variation => {
            if (variation && variation.price_adjustment) {
                price += parseFloat(variation.price_adjustment);
            }
        });
        
        return price.toFixed(2);
    };

    const handleVariationChange = (attributeName, variation) => {
        const newSelectedVariations = {
            ...selectedVariations,
            [attributeName]: variation
        };
        setSelectedVariations(newSelectedVariations);
        setData('variations', newSelectedVariations);
    };

    const nextImage = () => {
        setSelectedImage((prev) => (prev + 1) % product.images.length);
    };

    const prevImage = () => {
        setSelectedImage((prev) => (prev - 1 + product.images.length) % product.images.length);
    };

    const handleMouseMove = (e) => {
        if (!isZooming) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        setZoomPosition({ x, y });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Validate phone number
        if (data.customer_phone.length !== 11 || !data.customer_phone.startsWith('0')) {
            toast.error('ফোন নম্বর অবশ্যই ১১ সংখ্যার হতে হবে এবং ০ দিয়ে শুরু হতে হবে');
            return;
        }
        
        // Combine address fields
        const fullAddress = `${data.delivery_location}, ${data.thana}, ${data.district}`;
        
        post(route('products.order', product.slug), {
            data: {
                ...data,
                customer_address: fullAddress
            },
            onError: () => {
                toast.error('দয়া করে আপনার তথ্য চেক করে আবার চেষ্টা করুন।');
            }
        });
    };

    return (
        <AppLayout>
            <Head title={product.name} />
            <Toaster position="top-right" />
            
            {/* Categories Menu */}
            <CategoriesMenu categories={categories} />
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12">
                    {/* Product Images */}
                    <div className="space-y-4">
                        {/* Main Image */}
                        <div className="relative aspect-square bg-gray-100 rounded-2xl overflow-hidden group">
                            {product.images && product.images[selectedImage] ? (
                                <div
                                    className="relative w-full h-full cursor-zoom-in"
                                    onMouseMove={handleMouseMove}
                                    onMouseEnter={() => setIsZooming(true)}
                                    onMouseLeave={() => setIsZooming(false)}
                                    onClick={() => setShowModal(true)}
                                >
                                    <img
                                        src={product.images[selectedImage].startsWith('http') 
                                            ? product.images[selectedImage] 
                                            : `/storage/${product.images[selectedImage]}`}
                                        alt={product.name}
                                        className="w-full h-full object-contain transition-transform duration-300"
                                        style={{
                                            transform: isZooming ? 'scale(2)' : 'scale(1)',
                                            transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`
                                        }}
                                    />
                                    
                                    {/* Mobile zoom indicator */}
                                    <div className="md:hidden absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full">
                                        <MagnifyingGlassIcon className="w-5 h-5" />
                                    </div>
                                </div>
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <div className="text-gray-400">No image available</div>
                                </div>
                            )}

                            {/* Navigation Arrows */}
                            {product.images && product.images.length > 1 && (
                                <>
                                    <button
                                        onClick={prevImage}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-white"
                                    >
                                        <ChevronLeftIcon className="w-5 h-5 text-gray-700" />
                                    </button>
                                    <button
                                        onClick={nextImage}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-white"
                                    >
                                        <ChevronRightIcon className="w-5 h-5 text-gray-700" />
                                    </button>
                                </>
                            )}
                        </div>
                        
                        {/* Thumbnail Gallery */}
                        {product.images && product.images.length > 1 && (
                            <div className="grid grid-cols-5 gap-3">
                                {product.images.map((image, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedImage(index)}
                                        className={`aspect-square bg-gray-100 rounded-lg overflow-hidden border-2 transition-colors ${
                                            selectedImage === index ? 'border-pink-500' : 'border-transparent hover:border-gray-300'
                                        }`}
                                    >
                                        <img
                                            src={image.startsWith('http') ? image : `/storage/${image}`}
                                            alt={`${product.name} ${index + 1}`}
                                            className="w-full h-full object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Mobile Product Info - shown only on mobile before description */}
                        <div className="lg:hidden space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-pink-600 font-medium">{product.category?.name}</span>
                                <button 
                                    onClick={() => navigator.share ? navigator.share({title: product.name, url: window.location.href}) : navigator.clipboard.writeText(window.location.href)}
                                    className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                                >
                                    <ShareIcon className="w-5 h-5 text-gray-600" />
                                </button>
                            </div>
                            
                            <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>
                            
                            {/* Rating */}
                            <div className="flex items-center">
                                <div className="flex items-center">
                                    {[...Array(5)].map((_, i) => (
                                        <StarIconSolid key={i} className="w-4 h-4 text-yellow-400" />
                                    ))}
                                </div>
                                <span className="ml-2 text-sm text-gray-600">({randomRating}) • {randomReviews} reviews</span>
                            </div>

                            {/* Price */}
                            <div className="space-y-1">
                                <span className="text-2xl font-bold text-pink-600">৳{currentPrice()}</span>
                                {product.sale_price && (
                                    <div className="flex items-center space-x-3">
                                        <span className="text-lg text-gray-500 line-through">৳{product.price}</span>
                                        <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">
                                            Save ৳{(product.price - product.sale_price).toFixed(2)}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Description under images */}
                        <div>
                            <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
                            <p className="text-gray-600 leading-relaxed text-sm lg:text-base">{product.description}</p>
                        </div>
                    </div>

                    {/* Product Info & Order Form */}
                    <div className="space-y-4 lg:space-y-6">
                        {/* Product Header */}
                        <div className="hidden lg:block">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm text-pink-600 font-medium">{product.category?.name}</span>
                                <button 
                                    onClick={() => navigator.share ? navigator.share({title: product.name, url: window.location.href}) : navigator.clipboard.writeText(window.location.href)}
                                    className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                                >
                                    <ShareIcon className="w-5 h-5 text-gray-600" />
                                </button>
                            </div>
                            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
                            
                            {/* Rating */}
                            <div className="flex items-center mb-4">
                                <div className="flex items-center">
                                    {[...Array(5)].map((_, i) => (
                                        <StarIconSolid key={i} className="w-5 h-5 text-yellow-400" />
                                    ))}
                                </div>
                                <span className="ml-2 text-sm text-gray-600">({randomRating}) • {randomReviews} reviews</span>
                            </div>

                            {/* Price */}
                            <div className="space-y-1 mb-4 lg:mb-6">
                                <span className="text-2xl lg:text-3xl font-bold text-pink-600">৳{currentPrice()}</span>
                                {product.sale_price && (
                                    <div className="flex items-center space-x-3">
                                        <span className="text-lg lg:text-xl text-gray-500 line-through">৳{product.price}</span>
                                        <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs lg:text-sm font-medium">
                                            Save ৳{(product.price - product.sale_price).toFixed(2)}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Product Variations */}
                        {Object.keys(groupedVariations).length > 0 && (
                            <div className="space-y-4">
                                {Object.entries(groupedVariations).map(([attributeName, variations]) => (
                                    <div key={attributeName} className="space-y-3">
                                        <h3 className="font-semibold text-gray-900">{attributeName}:</h3>
                                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                                            {variations.map((variation) => (
                                                <button
                                                    key={variation.id}
                                                    onClick={() => handleVariationChange(attributeName, variation)}
                                                    className={`p-3 border rounded-lg text-center transition-colors ${
                                                        selectedVariations[attributeName]?.id === variation.id
                                                            ? 'border-pink-500 bg-pink-50'
                                                            : 'border-gray-200 hover:border-gray-300'
                                                    }`}
                                                >
                                                    <div className="font-medium text-sm">{variation.value}</div>
                                                    {variation.price_adjustment != 0 && (
                                                        <div className="text-xs text-gray-600">
                                                            {variation.price_adjustment > 0 ? '+' : ''}৳{variation.price_adjustment}
                                                        </div>
                                                    )}
                                                    <div className="text-xs text-gray-500">Stock: {variation.stock}</div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Order Form */}
                        <div className="bg-gray-50 rounded-2xl p-4 lg:p-6">
                            <h3 className="text-lg lg:text-xl font-bold text-gray-900 mb-4">অডার করতে নিচের ফর্মটি পূরণ করুন</h3>
                            
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-1 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">নাম</label>
                                        <input
                                            type="text"
                                            value={data.customer_name}
                                            onChange={(e) => setData('customer_name', e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                                            required
                                        />
                                        {errors.customer_name && <div className="text-red-600 text-sm mt-1">{errors.customer_name}</div>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">মোবাইল নাম্বার</label>
                                        <input
                                            type="tel"
                                            value={data.customer_phone}
                                            onChange={(e) => {
                                                const value = e.target.value.replace(/\D/g, ''); // Only digits
                                                if (value.length <= 11) {
                                                    setData('customer_phone', value);
                                                }
                                            }}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                                            placeholder="01XXXXXXXXX"
                                            required
                                        />
                                        {errors.customer_phone && <div className="text-red-600 text-sm mt-1">{errors.customer_phone}</div>}
                                        {data.customer_phone && (data.customer_phone.length !== 11 || !data.customer_phone.startsWith('0')) && (
                                            <div className="text-red-600 text-sm mt-1">
                                                ফোন নম্বর অবশ্যই ১১ সংখ্যার হতে হবে এবং ০ দিয়ে শুরু হতে হবে
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Address Fields */}
                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">থানা</label>
                                            <input
                                                type="text"
                                                value={data.thana}
                                                onChange={(e) => setData('thana', e.target.value)}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                                                required
                                            />
                                            {errors.thana && <div className="text-red-600 text-sm mt-1">{errors.thana}</div>}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">জেলা</label>
                                            <input
                                                type="text"
                                                value={data.district}
                                                onChange={(e) => setData('district', e.target.value)}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                                                required
                                            />
                                            {errors.district && <div className="text-red-600 text-sm mt-1">{errors.district}</div>}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">পণ্য ডেলিভারির স্থান</label>
                                        <textarea
                                            value={data.delivery_location}
                                            onChange={(e) => setData('delivery_location', e.target.value)}
                                            rows={3}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                                            placeholder="বাড়ি/রোড/এলাকা"
                                            required
                                        />
                                        {errors.delivery_location && <div className="text-red-600 text-sm mt-1">{errors.delivery_location}</div>}
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-4 sm:space-y-0">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                                        <div className="flex items-center border border-gray-300 rounded-lg">
                                            <button
                                                type="button"
                                                onClick={() => setData('quantity', Math.max(1, data.quantity - 1))}
                                                className="px-3 py-2 text-gray-600 hover:text-gray-800"
                                            >
                                                -
                                            </button>
                                            <input
                                                type="number"
                                                value={data.quantity}
                                                onChange={(e) => setData('quantity', Math.max(1, parseInt(e.target.value) || 1))}
                                                className="w-16 text-center border-0 focus:ring-0"
                                                min="1"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setData('quantity', data.quantity + 1)}
                                                className="px-3 py-2 text-gray-600 hover:text-gray-800"
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>

                                    <div className="flex-1">
                                        <div className="text-sm text-gray-600">Total Price</div>
                                        <div className="text-xl lg:text-2xl font-bold text-pink-600">
                                            ৳{(parseFloat(currentPrice()) * data.quantity).toFixed(2)}
                                        </div>
                                    </div>
                                </div>

                                {/* Payment Method */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-3">পেমেন্ট মেথড</label>
                                    <div className="space-y-3">
                                        {settings.cod_enabled === '1' && (
                                            <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                                                <input
                                                    type="radio"
                                                    name="payment_method"
                                                    value="cod"
                                                    checked={data.payment_method === 'cod'}
                                                    onChange={(e) => {
                                                        setData('payment_method', e.target.value);
                                                        setData('transaction_id', '');
                                                    }}
                                                    className="text-pink-600 focus:ring-pink-500"
                                                />
                                                <span className="ml-3 text-sm font-medium text-gray-900">ক্যাশ অন ডেলিভারি (COD)</span>
                                            </label>
                                        )}
                                        
                                        {settings.bkash_enabled === '1' && (
                                            <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                                                <input
                                                    type="radio"
                                                    name="payment_method"
                                                    value="bkash"
                                                    checked={data.payment_method === 'bkash'}
                                                    onChange={(e) => setData('payment_method', e.target.value)}
                                                    className="text-pink-600 focus:ring-pink-500"
                                                />
                                                <span className="ml-3 text-sm font-medium text-gray-900">বিকাশ</span>
                                            </label>
                                        )}
                                        
                                        {settings.nagad_enabled === '1' && (
                                            <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                                                <input
                                                    type="radio"
                                                    name="payment_method"
                                                    value="nagad"
                                                    checked={data.payment_method === 'nagad'}
                                                    onChange={(e) => setData('payment_method', e.target.value)}
                                                    className="text-pink-600 focus:ring-pink-500"
                                                />
                                                <span className="ml-3 text-sm font-medium text-gray-900">নগদ</span>
                                            </label>
                                        )}
                                    </div>
                                    
                                    {/* Payment Instructions */}
                                    {data.payment_method === 'bkash' && settings.bkash_enabled === '1' && (
                                        <div className="mt-3 p-3 bg-pink-50 border border-pink-200 rounded-lg">
                                            <h4 className="font-medium text-pink-800 mb-2">বিকাশ পেমেন্ট নির্দেশনা:</h4>
                                            <p className="text-sm text-pink-700 mb-1">নম্বর: {settings.bkash_number}</p>
                                            <p className="text-sm text-pink-700 mb-3">{settings.bkash_instructions}</p>
                                            <div>
                                                <label className="block text-sm font-medium text-pink-800 mb-1">ট্রানজেকশন আইডি *</label>
                                                <input
                                                    type="text"
                                                    value={data.transaction_id}
                                                    onChange={(e) => setData('transaction_id', e.target.value)}
                                                    placeholder="ট্রানজেকশন আইডি লিখুন"
                                                    className="w-full px-3 py-2 border border-pink-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                                                    required
                                                />
                                            </div>
                                        </div>
                                    )}
                                    
                                    {data.payment_method === 'nagad' && settings.nagad_enabled === '1' && (
                                        <div className="mt-3 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                                            <h4 className="font-medium text-orange-800 mb-2">নগদ পেমেন্ট নির্দেশনা:</h4>
                                            <p className="text-sm text-orange-700 mb-1">নম্বর: {settings.nagad_number}</p>
                                            <p className="text-sm text-orange-700 mb-3">{settings.nagad_instructions}</p>
                                            <div>
                                                <label className="block text-sm font-medium text-orange-800 mb-1">ট্রানজেকশন আইডি *</label>
                                                <input
                                                    type="text"
                                                    value={data.transaction_id}
                                                    onChange={(e) => setData('transaction_id', e.target.value)}
                                                    placeholder="ট্রানজেকশন আইডি লিখুন"
                                                    className="w-full px-3 py-2 border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                                                    required
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <button
                                    type="submit"
                                    disabled={processing || !isFormValid()}
                                    className="w-full bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:transform-none disabled:cursor-not-allowed"
                                >
                                    {processing ? (
                                        <div className="flex items-center justify-center">
                                            <ArrowPathIcon className="w-5 h-5 animate-spin mr-2" />
                                            Processing...
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-center">
                                            <ShoppingBagIcon className="w-5 h-5 mr-2" />
                                            এখনই অডার করুন
                                        </div>
                                    )}
                                </button>
                            </form>
                        </div>

                        {/* Features */}
                        <div className="grid grid-cols-3 gap-4 pt-6 border-t">
                            <div className="text-center">
                                <TruckIcon className="w-8 h-8 text-pink-500 mx-auto mb-2" />
                                <div className="text-sm font-medium">সারা বাংলাদেশে ফ্রি ডেলিভারি</div>
                            </div>
                            <div className="text-center">
                                <ShieldCheckIcon className="w-8 h-8 text-pink-500 mx-auto mb-2" />
                                <div className="text-sm font-medium">ক্যাশ অন ডেলিভারি সুবিধা</div>
                                <div className="text-xs text-gray-500">পণ্য চেক করে রিসিভ করবেন</div>
                            </div>
                            <div className="text-center">
                                <ArrowPathIcon className="w-8 h-8 text-pink-500 mx-auto mb-2" />
                                <div className="text-sm font-medium">সহজ রিটার্ন পলিসি</div>
                                <div className="text-xs text-gray-500">শর্ত প্রযোজ্য</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Related Products */}
                {relatedProducts.length > 0 && (
                    <div className="mt-16">
                        <h2 className="text-2xl font-bold text-gray-900 mb-8">Related Products</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {relatedProducts.map((relatedProduct) => (
                                <div key={relatedProduct.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                                    <div className="aspect-square bg-gray-100">
                                        {relatedProduct.images && relatedProduct.images[0] && (
                                            <img
                                                src={relatedProduct.images[0].startsWith('http') 
                                                    ? relatedProduct.images[0] 
                                                    : `/storage/${relatedProduct.images[0]}`}
                                                alt={relatedProduct.name}
                                                className="w-full h-full object-cover"
                                            />
                                        )}
                                    </div>
                                    <div className="p-4">
                                        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{relatedProduct.name}</h3>
                                        <div className="flex items-center justify-between">
                                            <span className="text-lg font-bold text-pink-600">
                                                ৳{relatedProduct.sale_price || relatedProduct.price}
                                            </span>
                                            <a
                                                href={`/products/${relatedProduct.slug}`}
                                                className="text-pink-600 hover:text-pink-700 text-sm font-medium"
                                            >
                                                View Details
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Image Zoom Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
                    <div className="relative max-w-4xl max-h-full">
                        <button
                            onClick={() => setShowModal(false)}
                            className="absolute -top-12 right-0 text-white hover:text-gray-300 z-10"
                        >
                            <XMarkIcon className="w-8 h-8" />
                        </button>
                        
                        <img
                            src={product.images[selectedImage].startsWith('http') 
                                ? product.images[selectedImage] 
                                : `/storage/${product.images[selectedImage]}`}
                            alt={product.name}
                            className="max-w-full max-h-full object-contain"
                        />
                        
                        {product.images.length > 1 && (
                            <>
                                <button
                                    onClick={prevImage}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
                                >
                                    <ChevronLeftIcon className="w-6 h-6" />
                                </button>
                                <button
                                    onClick={nextImage}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
                                >
                                    <ChevronRightIcon className="w-6 h-6" />
                                </button>
                            </>
                        )}
                    </div>
                </div>
            )}

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
        </AppLayout>
    );
}
