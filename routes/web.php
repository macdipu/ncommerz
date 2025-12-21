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

use App\Http\Controllers\HomeController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\Admin\ProductController as AdminProductController;
use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware([\App\Http\Middleware\ShareOrderCounts::class])->group(function () {
    Route::get('/', [HomeController::class, 'index'])->name('home');

    Route::get('/products', [ProductController::class, 'index'])->name('products.index');
    Route::get('/products/{product:slug}', [ProductController::class, 'show'])->name('products.show');
    Route::post('/products/{product:slug}/order', [ProductController::class, 'order'])->name('products.order');
    Route::get('/incomplete-orders', [ProductController::class, 'saveIncompleteOrder']);
    Route::get('/orders/track', [ProductController::class, 'searchOrder'])->name('orders.search');
    Route::get('/orders/track/{order_number}', [ProductController::class, 'trackOrder'])->name('orders.track');
});

Route::get('/dashboard', function () {
    if (auth()->user()->is_admin) {
        return redirect()->route('admin.dashboard');
    }
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// Admin routes
Route::middleware(['auth', 'admin', \App\Http\Middleware\ShareOrderCounts::class])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/', [\App\Http\Controllers\Admin\DashboardController::class, 'index'])->name('dashboard');
    
    Route::resource('products', AdminProductController::class);
    Route::resource('categories', \App\Http\Controllers\Admin\CategoryController::class);
    Route::resource('orders', \App\Http\Controllers\Admin\OrderController::class);
    Route::get('incomplete-orders', [\App\Http\Controllers\Admin\OrderController::class, 'incompleteOrders'])->name('incomplete-orders.index');
    Route::post('orders/bulk-status', [\App\Http\Controllers\Admin\OrderController::class, 'bulkUpdateStatus'])->name('orders.bulk-status');
    Route::post('orders/bulk-delete', [\App\Http\Controllers\Admin\OrderController::class, 'bulkDelete'])->name('orders.bulk-delete');
    Route::get('orders/export/csv', [\App\Http\Controllers\Admin\OrderController::class, 'exportCsv'])->name('orders.export-csv');
    Route::resource('invoices', \App\Http\Controllers\Admin\InvoiceController::class);
    Route::resource('customers', \App\Http\Controllers\Admin\CustomerController::class);
    Route::resource('sliders', \App\Http\Controllers\Admin\SliderController::class);
    Route::resource('banners', \App\Http\Controllers\Admin\BannerController::class);
    Route::get('api-docs', [\App\Http\Controllers\Admin\ApiDocsController::class, 'index'])->name('api-docs');
    Route::post('api-key/generate', [\App\Http\Controllers\Admin\ApiDocsController::class, 'generateApiKey'])->name('api-key.generate');
    Route::get('settings', [\App\Http\Controllers\Admin\SettingController::class, 'index'])->name('settings');
    Route::post('settings', [\App\Http\Controllers\Admin\SettingController::class, 'update'])->name('settings.update');
    Route::post('info-cards/{infoCard}', [\App\Http\Controllers\Admin\SettingController::class, 'updateInfoCard'])->name('info-cards.update');
});

require __DIR__.'/auth.php';
