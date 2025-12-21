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
use App\Models\Slider;
use App\Models\Banner;
use App\Models\Setting;
use Inertia\Inertia;

class HomeController extends Controller
{
    public function index()
    {
        // Get active sliders for hero section
        $sliders = Slider::where('is_active', true)
            ->orderBy('sort_order')
            ->get()
            ->map(function ($slider) {
                return [
                    'id' => $slider->id,
                    'title' => $slider->title,
                    'description' => $slider->description,
                    'image_url' => $slider->full_image_url,
                    'link_url' => $slider->link_url,
                ];
            });

        // Get active banners
        $banners = Banner::where('is_active', true)
            ->orderBy('sort_order')
            ->get()
            ->map(function ($banner) {
                return [
                    'id' => $banner->id,
                    'title' => $banner->title,
                    'description' => $banner->description,
                    'image_url' => $banner->full_image_url,
                    'link_url' => $banner->link_url,
                    'position' => $banner->position,
                ];
            });

        // Get featured products (latest first)
        $featuredProducts = Product::with('category')
            ->where('is_featured', true)
            ->where('is_active', true)
            ->orderBy('created_at', 'desc')
            ->take(12)
            ->get()
            ->map(function ($product) {
                return [
                    'id' => $product->id,
                    'name' => $product->name,
                    'slug' => $product->slug,
                    'price' => $product->price,
                    'sale_price' => $product->sale_price,
                    'images' => $product->images,
                    'category' => $product->category->name ?? 'No Category',
                ];
            });

        // Get latest products
        $latestProducts = Product::with('category')
            ->where('is_active', true)
            ->orderBy('created_at', 'desc')
            ->take(8)
            ->get()
            ->map(function ($product) {
                return [
                    'id' => $product->id,
                    'name' => $product->name,
                    'slug' => $product->slug,
                    'price' => $product->price,
                    'sale_price' => $product->sale_price,
                    'images' => $product->images,
                    'category' => $product->category->name ?? 'No Category',
                ];
            });

        // Get categories
        $categories = Category::where('is_active', true)
            ->withCount('products')
            ->take(6)
            ->get()
            ->map(function ($category) {
                return [
                    'id' => $category->id,
                    'name' => $category->name,
                    'slug' => $category->slug,
                    'image' => $category->image,
                    'products_count' => $category->products_count,
                ];
            });

        // Get additional settings for home page
        $homeSettings = [
            'offer_title' => Setting::get('offer_title', 'শুধু আজকের জন্য অফার চলছে! অফার মিস করবেন না!'),
            'offer_countdown_text' => Setting::get('offer_countdown_text', 'Ends In'),
        ];

        // Get info cards
        $infoCards = \App\Models\InfoCard::active()->orderBy('sort_order')->get();

        return Inertia::render('Home', [
            'sliders' => $sliders,
            'banners' => $banners,
            'featuredProducts' => $featuredProducts,
            'latestProducts' => $latestProducts,
            'categories' => $categories,
            'homeSettings' => $homeSettings,
            'infoCards' => $infoCards,
        ]);
    }
}
