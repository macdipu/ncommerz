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

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Product extends Model
{
    protected $fillable = [
        'name', 'slug', 'description', 'price', 'sale_price', 
        'stock', 'images', 'category_id', 'is_active', 'is_featured'
    ];

    protected $casts = [
        'images' => 'array',
        'is_active' => 'boolean',
        'is_featured' => 'boolean',
        'price' => 'decimal:2',
        'sale_price' => 'decimal:2',
    ];

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function variations()
    {
        return $this->hasMany(ProductVariation::class);
    }

    public function orderItems()
    {
        return $this->hasMany(OrderItem::class);
    }

    public function getCurrentPrice()
    {
        return $this->sale_price ?? $this->price;
    }
}
