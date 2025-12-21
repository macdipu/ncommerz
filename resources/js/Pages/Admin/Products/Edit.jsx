import { useForm, usePage } from '@inertiajs/react';
import { useState, useRef, useEffect } from 'react';
import AdminLayout from '../../../Layouts/AdminLayout';
import toast, { Toaster } from 'react-hot-toast';

export default function Edit({ product, categories }) {
    const { flash } = usePage().props;
    const { data, setData, post, processing, errors } = useForm({
        name: product.name,
        description: product.description,
        price: product.price,
        sale_price: product.sale_price || '',
        stock: product.stock,
        category_id: product.category_id,
        new_images: [],
        existing_images: product.images || [],
        is_active: product.is_active,
        is_featured: product.is_featured,
        variations: product.variations || [],
        _method: 'PATCH'
    });

    const [dragActive, setDragActive] = useState(false);
    const [newPreviews, setNewPreviews] = useState([]);
    const fileInputRef = useRef(null);

    useEffect(() => {
        if (flash.success) {
            toast.success(flash.success);
        }
        if (flash.error) {
            toast.error(flash.error);
        }
    }, [flash]);

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        
        if (e.dataTransfer.files) {
            handleFiles(Array.from(e.dataTransfer.files));
        }
    };

    const handleFiles = (files) => {
        const imageFiles = files.filter(file => file.type.startsWith('image/'));
        setData('new_images', [...data.new_images, ...imageFiles]);
        
        imageFiles.forEach(file => {
            const reader = new FileReader();
            reader.onload = (e) => setNewPreviews(prev => [...prev, e.target.result]);
            reader.readAsDataURL(file);
        });
    };

    const removeExistingImage = (index) => {
        const newExisting = data.existing_images.filter((_, i) => i !== index);
        setData('existing_images', newExisting);
    };

    const addVariation = () => {
        setData('variations', [...data.variations, {
            name: '',
            value: '',
            price_adjustment: 0,
            stock: 0,
            sku: ''
        }]);
    };

    const updateVariation = (index, field, value) => {
        const newVariations = [...data.variations];
        newVariations[index][field] = value;
        setData('variations', newVariations);
    };

    const removeVariation = (index) => {
        const newVariations = data.variations.filter((_, i) => i !== index);
        setData('variations', newVariations);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.products.update', product.id));
    };

    return (
        <AdminLayout>
            <Toaster position="top-right" />
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Edit Product</h1>
                    <p className="text-gray-600">Update product information</p>
                </div>

                <div className="bg-white rounded-xl shadow-md">
                    <form onSubmit={handleSubmit} className="p-6 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Product Name</label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                />
                                {errors.name && <div className="text-red-600 text-sm mt-1">{errors.name}</div>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                                <select
                                    value={data.category_id}
                                    onChange={(e) => setData('category_id', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                >
                                    <option value="">Select Category</option>
                                    {categories.map(category => (
                                        <option key={category.id} value={category.id}>{category.name}</option>
                                    ))}
                                </select>
                                {errors.category_id && <div className="text-red-600 text-sm mt-1">{errors.category_id}</div>}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                            <textarea
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                rows={4}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                            />
                            {errors.description && <div className="text-red-600 text-sm mt-1">{errors.description}</div>}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Price</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={data.price}
                                    onChange={(e) => setData('price', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                />
                                {errors.price && <div className="text-red-600 text-sm mt-1">{errors.price}</div>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Sale Price</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={data.sale_price}
                                    onChange={(e) => setData('sale_price', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                                {errors.sale_price && <div className="text-red-600 text-sm mt-1">{errors.sale_price}</div>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Stock</label>
                                <input
                                    type="number"
                                    value={data.stock}
                                    onChange={(e) => setData('stock', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                />
                                {errors.stock && <div className="text-red-600 text-sm mt-1">{errors.stock}</div>}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Images</label>
                            
                            {/* Existing Images */}
                            {data.existing_images.length > 0 && (
                                <div className="mb-4">
                                    <p className="text-sm text-gray-600 mb-2">Current Images:</p>
                                    <div className="grid grid-cols-4 gap-4">
                                        {data.existing_images.map((image, index) => (
                                            <div key={index} className="relative">
                                                <img src={`/storage/${image}`} alt="Product" className="h-20 w-20 object-cover rounded" />
                                                <button
                                                    type="button"
                                                    onClick={() => removeExistingImage(index)}
                                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* New Images Upload */}
                            <div
                                className={`relative border-2 border-dashed rounded-lg p-6 ${
                                    dragActive ? 'border-blue-400 bg-blue-50' : 'border-gray-300'
                                }`}
                                onDragEnter={handleDrag}
                                onDragLeave={handleDrag}
                                onDragOver={handleDrag}
                                onDrop={handleDrop}
                            >
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={(e) => handleFiles(Array.from(e.target.files))}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                />
                                
                                {newPreviews.length > 0 ? (
                                    <div className="grid grid-cols-4 gap-4">
                                        {newPreviews.map((preview, index) => (
                                            <img key={index} src={preview} alt="Preview" className="h-20 w-20 object-cover rounded" />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center">
                                        <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                                            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                        <p className="mt-2 text-sm text-gray-600">Add new images</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-4">
                                <label className="block text-sm font-medium text-gray-700">Product Variations</label>
                                <button
                                    type="button"
                                    onClick={addVariation}
                                    className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                                >
                                    Add Variation
                                </button>
                            </div>
                            
                            {data.variations.map((variation, index) => (
                                <div key={index} className="grid grid-cols-5 gap-4 mb-4 p-4 border rounded-lg">
                                    <div>
                                        <input
                                            type="text"
                                            placeholder="Name (e.g., Size)"
                                            value={variation.name}
                                            onChange={(e) => updateVariation(index, 'name', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                                        />
                                    </div>
                                    <div>
                                        <input
                                            type="text"
                                            placeholder="Value (e.g., Large)"
                                            value={variation.value}
                                            onChange={(e) => updateVariation(index, 'value', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                                        />
                                    </div>
                                    <div>
                                        <input
                                            type="number"
                                            step="0.01"
                                            placeholder="Price +/-"
                                            value={variation.price_adjustment}
                                            onChange={(e) => updateVariation(index, 'price_adjustment', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                                        />
                                    </div>
                                    <div>
                                        <input
                                            type="number"
                                            placeholder="Stock"
                                            value={variation.stock}
                                            onChange={(e) => updateVariation(index, 'stock', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                                        />
                                    </div>
                                    <div className="flex items-center">
                                        <button
                                            type="button"
                                            onClick={() => removeVariation(index)}
                                            className="text-red-600 hover:text-red-900"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={data.is_active}
                                    onChange={(e) => setData('is_active', e.target.checked)}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <label className="ml-2 block text-sm text-gray-900">Active</label>
                            </div>

                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={data.is_featured}
                                    onChange={(e) => setData('is_featured', e.target.checked)}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <label className="ml-2 block text-sm text-gray-900">Featured</label>
                            </div>
                        </div>

                        <div className="flex justify-end space-x-3 pt-6 border-t">
                            <button
                                type="button"
                                onClick={() => window.history.back()}
                                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={processing}
                                className="btn-primary disabled:opacity-50"
                            >
                                {processing ? 'Updating...' : 'Update Product'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}
