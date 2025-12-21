<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\CategoryController;
use App\Models\Product;

Route::get('/search-suggestions', function (Request $request) {
    $query = $request->get('q');
    if (!$query || strlen($query) < 2) {
        return response()->json([]);
    }
    
    $products = Product::where('is_active', true)
        ->where('name', 'like', '%' . $query . '%')
        ->select('name', 'slug', 'price', 'sale_price', 'images')
        ->take(5)
        ->get();
    
    return response()->json($products);
});

// API Routes with API Key authentication
Route::middleware('api.key')->group(function () {
    Route::apiResource('products', ProductController::class);
    Route::apiResource('orders', OrderController::class);
    Route::apiResource('categories', CategoryController::class);
});
