<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Illuminate\Support\Str;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $products = Product::with(['category', 'variations'])
            ->orderBy('created_at', 'desc')
            ->paginate(12)
            ->through(function ($product) {
                return [
                    'id' => $product->id,
                    'name' => $product->name,
                    'slug' => $product->slug,
                    'price' => $product->price,
                    'sale_price' => $product->sale_price,
                    'stock' => $product->stock,
                    'category' => $product->category->name ?? 'No Category',
                    'images' => $product->images,
                    'variations_count' => $product->variations->count(),
                    'is_active' => $product->is_active,
                    'is_featured' => $product->is_featured,
                    'created_at' => $product->created_at->format('M d, Y'),
                ];
            });

        if ($request->wantsJson()) {
            return response()->json([
                'products' => $products->items(),
                'has_more' => $products->hasMorePages()
            ]);
        }
        
        return Inertia::render('Admin/Products/Index', [
            'products' => $products->items()
        ]);
    }

    public function create()
    {
        $categories = Category::where('is_active', true)->get();
        return Inertia::render('Admin/Products/Create', compact('categories'));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'price' => 'required|numeric|min:0',
            'sale_price' => 'nullable|numeric|min:0',
            'stock' => 'required|integer|min:0',
            'category_id' => 'required|exists:categories,id',
            'images' => 'required|array|min:1',
            'images.*' => 'image|max:2048',
            'is_active' => 'boolean',
            'is_featured' => 'boolean',
            'variations' => 'nullable|array',
            'variations.*.name' => 'required|string',
            'variations.*.value' => 'required|string',
            'variations.*.price_adjustment' => 'nullable|numeric',
            'variations.*.stock' => 'required|integer|min:0',
            'variations.*.sku' => 'nullable|string',
        ]);

        $validated['slug'] = Str::slug($validated['name']);
        
        // Handle image uploads
        $imageUrls = [];
        foreach ($validated['images'] as $image) {
            $filename = time() . '_' . $image->getClientOriginalName();
            $uploaded = Storage::disk('public')->putFileAs('products', $image, $filename);
            $imageUrls[] = $uploaded;
        }
        $validated['images'] = $imageUrls;

        $product = Product::create($validated);

        // Create variations if provided
        if (!empty($validated['variations'])) {
            foreach ($validated['variations'] as $variation) {
                $product->variations()->create([
                    'name' => $variation['name'],
                    'value' => $variation['value'],
                    'price_adjustment' => $variation['price_adjustment'] ?? 0,
                    'stock' => $variation['stock'],
                    'sku' => $variation['sku'] ?? null,
                ]);
            }
        }

        return redirect()->route('admin.products.index')->with('success', 'Product created successfully');
    }

    public function edit(Product $product)
    {
        $categories = Category::where('is_active', true)->get();
        $product->load('variations');
        
        return Inertia::render('Admin/Products/Edit', [
            'product' => $product,
            'categories' => $categories
        ]);
    }

    public function update(Request $request, Product $product)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'price' => 'required|numeric|min:0',
            'sale_price' => 'nullable|numeric|min:0',
            'stock' => 'required|integer|min:0',
            'category_id' => 'required|exists:categories,id',
            'new_images' => 'nullable|array',
            'new_images.*' => 'image|max:2048',
            'existing_images' => 'nullable|array',
            'is_active' => 'boolean',
            'is_featured' => 'boolean',
            'variations' => 'nullable|array',
        ]);

        if ($validated['name'] !== $product->name) {
            $validated['slug'] = Str::slug($validated['name']);
        }

        // Handle images
        $imageUrls = $validated['existing_images'] ?? [];
        if (!empty($validated['new_images'])) {
            foreach ($validated['new_images'] as $image) {
                $filename = time() . '_' . $image->getClientOriginalName();
                $uploaded = Storage::disk('public')->putFileAs('products', $image, $filename);
                $imageUrls[] = $uploaded;
            }
        }
        $validated['images'] = $imageUrls;

        $product->update($validated);

        // Update variations
        if (isset($validated['variations'])) {
            $product->variations()->delete();
            foreach ($validated['variations'] as $variation) {
                $product->variations()->create([
                    'name' => $variation['name'],
                    'value' => $variation['value'],
                    'price_adjustment' => $variation['price_adjustment'] ?? 0,
                    'stock' => $variation['stock'],
                    'sku' => $variation['sku'] ?? null,
                ]);
            }
        }

        return redirect()->route('admin.products.index')->with('success', 'Product updated successfully');
    }

    public function destroy(Product $product)
    {
        // Delete images
        if ($product->images) {
            foreach ($product->images as $image) {
                Storage::disk('public')->delete($image);
            }
        }
        
        $product->delete();
        return redirect()->route('admin.products.index')->with('success', 'Product deleted successfully');
    }
}
