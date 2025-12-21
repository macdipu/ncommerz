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

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OrderController extends Controller
{
    public function index(Request $request)
    {
        $query = Order::with(['user', 'orderItems.product'])
            ->where('status', '!=', 'incomplete');

        // Apply status filter if provided
        if ($request->has('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        $orders = $query->orderBy('created_at', 'desc')
            ->paginate(20)
            ->through(function ($order) {
                return [
                    'id' => $order->id,
                    'order_number' => $order->order_number,
                    'customer_name' => $order->user?->name ?? $order->customer_name ?? 'N/A',
                    'customer_phone' => $order->user?->phone ?? $order->customer_phone ?? 'N/A',
                    'customer_address' => $order->user?->address ?? $order->customer_address ?? 'N/A',
                    'total' => $order->total,
                    'status' => $order->status,
                    'status_color' => $order->status_color,
                    'products' => $order->orderItems->count() > 0 ? $order->orderItems->map(function ($item) {
                        $productName = $item->product->name ?? 'Product not found';
                        
                        // Add variations to product name if they exist
                        if ($item->variations) {
                            $variations = json_decode($item->variations, true);
                            if ($variations && is_array($variations)) {
                                $variationText = [];
                                foreach ($variations as $key => $value) {
                                    if ($value) {
                                        $variationText[] = ucfirst($key) . ': ' . $value;
                                    }
                                }
                                if (!empty($variationText)) {
                                    $productName .= ' (' . implode(', ', $variationText) . ')';
                                }
                            }
                        }
                        
                        return [
                            'name' => $productName,
                            'quantity' => $item->quantity,
                            'price' => $item->price
                        ];
                    }) : [
                        [
                            'name' => $this->getIncompleteOrderProductName($order),
                            'quantity' => $order->quantity ?? 1,
                            'price' => $order->total ?? 0
                        ]
                    ],
                    'products_count' => $order->orderItems->count() > 0 ? $order->orderItems->count() : 1,
                    'created_at' => $order->created_at->format('M d, Y H:i'),
                    'created_at_relative' => $order->created_at->diffForHumans(),
                ];
            });

        return Inertia::render('Admin/Orders/Index', compact('orders'));
    }

    public function create()
    {
        $products = \App\Models\Product::with('variations')->select('id', 'name', 'price')->get();
        
        return Inertia::render('Admin/Orders/Create', compact('products'));
    }

    public function store(Request $request)
    {
        $request->validate([
            'customer_name' => 'required|string|max:255',
            'customer_phone' => 'required|string|max:20',
            'customer_address' => 'required|string|max:500',
            'status' => 'required|in:pending,processing,shipped,delivered,cancelled',
            'total' => 'required|numeric|min:0',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.price' => 'required|numeric|min:0',
        ]);

        $order = Order::create([
            'order_number' => 'ORD-' . time() . '-' . rand(1000, 9999),
            'customer_name' => $request->customer_name,
            'customer_phone' => $request->customer_phone,
            'customer_address' => $request->customer_address,
            'status' => $request->status,
            'total' => $request->total,
        ]);

        foreach ($request->items as $item) {
            $order->orderItems()->create([
                'product_id' => $item['product_id'],
                'quantity' => $item['quantity'],
                'price' => $item['price'],
                'variations' => isset($item['variations']) ? json_encode($item['variations']) : null,
            ]);
        }

        return redirect()->route('admin.orders.index')->with('success', 'Order created successfully');
    }

    private function getIncompleteOrderProductName($order)
    {
        try {
            $productName = 'Unknown Product';
            
            if ($order->product_id) {
                $product = \App\Models\Product::find($order->product_id);
                $productName = $product ? $product->name : 'Product not found';
            }
            
            // Add variations if they exist
            if ($order->variations) {
                $variations = is_string($order->variations) ? json_decode($order->variations, true) : $order->variations;
                if ($variations && is_array($variations)) {
                    $variationText = [];
                    foreach ($variations as $key => $variation) {
                        if (is_array($variation) && isset($variation['value'])) {
                            $variationText[] = ucfirst($key) . ': ' . $variation['value'];
                        }
                    }
                    if (!empty($variationText)) {
                        $productName .= ' (' . implode(', ', $variationText) . ')';
                    }
                }
            }
            
            return $productName;
        } catch (\Exception $e) {
            \Log::error('Error getting incomplete order product name: ' . $e->getMessage());
            return 'Incomplete Order';
        }
    }

    public function incompleteOrders(Request $request)
    {
        $orders = Order::with(['user', 'orderItems.product'])
            ->where('status', 'incomplete')
            ->orderBy('created_at', 'desc')
            ->paginate(20)
            ->through(function ($order) {
                return [
                    'id' => $order->id,
                    'order_number' => $order->order_number,
                    'customer_name' => $order->user?->name ?? $order->customer_name ?? 'N/A',
                    'customer_phone' => $order->user?->phone ?? $order->customer_phone ?? 'N/A',
                    'customer_address' => $order->user?->address ?? $order->customer_address ?? 'N/A',
                    'total' => $order->total,
                    'status' => $order->status,
                    'status_color' => $order->status_color,
                    'products' => $order->orderItems->count() > 0 ? $order->orderItems->map(function ($item) {
                        return [
                            'name' => $item->product->name ?? 'Product not found',
                            'quantity' => $item->quantity,
                            'price' => $item->price
                        ];
                    }) : [
                        [
                            'name' => $this->getIncompleteOrderProductName($order),
                            'quantity' => $order->quantity ?? 1,
                            'price' => $order->total ?? 0
                        ]
                    ],
                    'products_count' => $order->orderItems->count() > 0 ? $order->orderItems->count() : 1,
                    'created_at' => $order->created_at->format('M d, Y H:i'),
                    'created_at_relative' => $order->created_at->diffForHumans(),
                ];
            });

        return Inertia::render('Admin/Orders/Incomplete', compact('orders'));
    }

    public function exportCsv()
    {
        $orders = Order::with(['user', 'orderItems.product'])->get();
        
        $filename = 'orders_' . date('Y-m-d_H-i-s') . '.csv';
        
        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="' . $filename . '"',
        ];

        $callback = function() use ($orders) {
            $file = fopen('php://output', 'w');
            fputcsv($file, ['Order Number', 'Customer', 'Phone', 'Address', 'Products', 'Total', 'Status', 'Date']);

            foreach ($orders as $order) {
                $products = $order->orderItems->map(function($item) {
                    return $item->product->name . ' (x' . $item->quantity . ')';
                })->implode(', ');

                fputcsv($file, [
                    $order->order_number,
                    $order->user->name,
                    $order->user->phone ?? 'N/A',
                    $order->user->address ?? 'N/A',
                    $products,
                    '৳' . $order->total,
                    $order->status,
                    $order->created_at->format('Y-m-d H:i:s')
                ]);
            }
            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }

    public function bulkUpdateStatus(Request $request)
    {
        $request->validate([
            'order_ids' => 'required|array',
            'status' => 'required|in:pending,processing,shipped,delivered,cancelled'
        ]);

        Order::whereIn('id', $request->order_ids)
            ->update(['status' => $request->status]);

        return redirect()->back()->with('success', 'Orders status updated successfully');
    }

    public function bulkDelete(Request $request)
    {
        $request->validate([
            'order_ids' => 'required|array'
        ]);

        Order::whereIn('id', $request->order_ids)->delete();

        return redirect()->back()->with('success', 'Orders deleted successfully');
    }

    public function show(Order $order)
    {
        $order->load(['user', 'orderItems.product']);
        $products = \App\Models\Product::with('variations')->select('id', 'name', 'price')->get();
        
        // Transform order data same as Index page
        $orderData = [
            'id' => $order->id,
            'order_number' => $order->order_number,
            'customer_name' => $order->user?->name ?? $order->customer_name ?? 'N/A',
            'customer_phone' => $order->user?->phone ?? $order->customer_phone ?? 'N/A',
            'customer_address' => $order->user?->address ?? $order->customer_address ?? 'N/A',
            'total' => $order->total,
            'status' => $order->status,
            'status_color' => $order->status_color,
            'created_at' => $order->created_at,
            'order_items' => $order->orderItems->count() > 0 ? $order->orderItems->map(function ($item) {
                return [
                    'id' => $item->id,
                    'product_id' => $item->product_id,
                    'product' => [
                        'id' => $item->product->id ?? null,
                        'name' => $item->product->name ?? 'Product not found'
                    ],
                    'quantity' => $item->quantity,
                    'price' => $item->price
                ];
            })->toArray() : ($order->product_id ? [[
                'id' => 'incomplete',
                'product_id' => $order->product_id,
                'product' => [
                    'id' => $order->product_id,
                    'name' => $this->getIncompleteOrderProductName($order)
                ],
                'quantity' => $order->quantity ?? 1,
                'price' => $order->total ?? 0
            ]] : [])
        ];
        
        return Inertia::render('Admin/Orders/Show', [
            'order' => $orderData,
            'products' => $products
        ]);
    }

    public function update(Request $request, Order $order)
    {
        $request->validate([
            'status' => 'required|in:pending,processing,shipped,delivered,cancelled,incomplete',
            'customer_name' => 'nullable|string|max:255',
            'customer_phone' => 'nullable|string|max:20',
            'customer_address' => 'nullable|string|max:500',
            'total' => 'nullable|numeric|min:0',
        ]);

        $order->update([
            'status' => $request->status,
            'customer_name' => $request->customer_name,
            'customer_phone' => $request->customer_phone,
            'customer_address' => $request->customer_address,
            'total' => $request->total,
        ]);

        return redirect()->back()->with('success', 'Order updated successfully');
    }

    public function destroy(Order $order)
    {
        $order->orderItems()->delete();
        $order->delete();

        return redirect()->back()->with('success', 'Order deleted successfully');
    }
}
