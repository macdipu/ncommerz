<?php

/*
|--------------------------------------------------------------------------
| NCommerz E-commerce Platform
|--------------------------------------------------------------------------
| Original Author: Abdul Alim
| Developer: Abdul Alim
| Github: https://github.com/alimworkzone/ncommerz
| 
| This file is part of NCommerz platform. Unauthorized reselling 
| or redistribution of this code is strictly prohibited.
|--------------------------------------------------------------------------
*/

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Category;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Str;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::with('category')->where('is_active', true);

        if ($request->category) {
            $query->whereHas('category', function ($q) use ($request) {
                $q->where('slug', $request->category);
            });
        }

        if ($request->search) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        $products = $query->paginate(12);
        $categories = Category::where('is_active', true)->get();

        return Inertia::render('Products/Index', [
            'products' => $products,
            'categories' => $categories,
            'filters' => $request->only(['category', 'search']),
        ]);
    }

    public function show(Product $product)
    {
        $product->load(['category', 'variations']);
        
        $relatedProducts = Product::where('category_id', $product->category_id)
            ->where('id', '!=', $product->id)
            ->where('is_active', true)
            ->take(4)
            ->get();

        $categories = \App\Models\Category::where('is_active', true)->get();
        $settings = \App\Models\Setting::pluck('value', 'key')->toArray();

        return Inertia::render('Products/Show', [
            'product' => $product,
            'relatedProducts' => $relatedProducts,
            'categories' => $categories,
            'settings' => $settings,
        ]);
    }

    public function order(Request $request, Product $product)
    {
        $request->validate([
            'customer_name' => 'required|string|max:255',
            'customer_phone' => 'required|string|max:20',
            'thana' => 'required|string|max:100',
            'district' => 'required|string|max:100',
            'delivery_location' => 'required|string|max:255',
            'quantity' => 'required|integer|min:1',
            'variations' => 'nullable|array',
            'payment_method' => 'required|in:cod,bkash,nagad',
            'transaction_id' => 'required_if:payment_method,bkash,nagad|nullable|string',
        ]);

        // Combine address fields
        $fullAddress = $request->delivery_location . ', ' . $request->thana . ', ' . $request->district;

        // Calculate total price
        $price = $product->sale_price ?? $product->price;
        
        // Add price adjustments from selected variations
        if ($request->variations) {
            foreach ($request->variations as $variationData) {
                if (isset($variationData['id'])) {
                    $variation = $product->variations()->find($variationData['id']);
                    if ($variation) {
                        $price += $variation->price_adjustment ?? 0;
                    }
                }
            }
        }
        
        $total = $price * $request->quantity;

        // Create order
        $order = Order::create([
            'order_number' => 'ORD-' . time() . '-' . rand(1000, 9999),
            'user_id' => auth()->id(),
            'product_id' => $product->id,
            'customer_name' => $request->customer_name,
            'customer_phone' => $request->customer_phone,
            'customer_address' => $fullAddress,
            'quantity' => $request->quantity,
            'variations' => $request->variations,
            'total' => $total,
            'payment_method' => $request->payment_method,
            'transaction_id' => $request->transaction_id,
            'status' => 'pending',
        ]);

        // Create invoice
        \App\Models\Invoice::create([
            'invoice_number' => \App\Models\Invoice::generateInvoiceNumber(),
            'order_id' => $order->id,
            'customer_name' => $request->customer_name,
            'customer_phone' => $request->customer_phone,
            'delivery_address' => $fullAddress,
            'payment_method' => $request->payment_method,
            'transaction_id' => $request->transaction_id,
            'subtotal' => $total,
            'delivery_charge' => 0,
            'total_amount' => $total,
            'status' => 'pending',
            'invoice_date' => now(),
        ]);
        OrderItem::create([
            'order_id' => $order->id,
            'product_id' => $product->id,
            'quantity' => $request->quantity,
            'price' => $price,
        ]);

        // Update customer info if logged in
        if (auth()->check()) {
            auth()->user()->update([
                'name' => $request->customer_name,
                'phone' => $request->customer_phone,
                'address' => $fullAddress,
            ]);
        }

        return redirect()->route('orders.track', $order->order_number)->with('success', 'অর্ডার সফলভাবে সম্পন্ন হয়েছে! অর্ডার নম্বর: #' . $order->order_number);
    }

    public function saveIncompleteOrder(Request $request)
    {
        try {
            if ($request->customer_name || $request->customer_phone) {
                // Combine address fields
                $customerAddress = trim(implode(', ', array_filter([
                    $request->delivery_location,
                    $request->thana,
                    $request->district
                ])));

                Order::create([
                    'order_number' => 'INC-' . time() . '-' . rand(1000, 9999),
                    'user_id' => null,
                    'session_id' => session()->getId(),
                    'product_id' => $request->product_id,
                    'customer_name' => $request->customer_name,
                    'customer_phone' => $request->customer_phone,
                    'customer_address' => $customerAddress ?: null,
                    'quantity' => $request->quantity ?? 1,
                    'total' => ($request->product_price ?? 0) * ($request->quantity ?? 1),
                    'variations' => $request->variations,
                    'status' => 'incomplete',
                ]);
            }
        } catch (\Exception $e) {
            \Log::error('Incomplete order error: ' . $e->getMessage());
        }
        
        return response('OK', 200);
    }

    public function searchOrder()
    {
        $categories = \App\Models\Category::where('is_active', true)->get();
        
        return Inertia::render('Orders/Search', compact('categories'));
    }

    public function trackOrder($order_number)
    {
        $order = Order::where('order_number', $order_number)->first();
        
        if (!$order) {
            return redirect()->route('orders.search')->with('error', 'অর্ডার পাওয়া যায়নি। দয়া করে সঠিক অর্ডার নম্বর দিন।');
        }
        
        $order->load(['user', 'orderItems.product']);
        $categories = \App\Models\Category::where('is_active', true)->get();
        $settings = \App\Models\Setting::pluck('value', 'key')->toArray();
        
        return Inertia::render('Orders/Track', compact('order', 'categories', 'settings'));
    }
}
