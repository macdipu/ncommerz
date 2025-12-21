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

class Order extends Model
{
    protected $fillable = [
        'order_number', 'user_id', 'session_id', 'product_id', 'customer_name', 
        'customer_phone', 'customer_address', 'quantity', 'variations', 'total', 'status',
        'payment_method', 'transaction_id'
    ];

    protected $casts = [
        'total' => 'decimal:2',
        'variations' => 'array'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function orderItems()
    {
        return $this->hasMany(OrderItem::class);
    }

    public function invoice()
    {
        return $this->hasOne(Invoice::class);
    }

    public function getStatusColorAttribute()
    {
        return match($this->status) {
            'incomplete' => 'bg-gray-100 text-gray-800',
            'pending' => 'bg-yellow-100 text-yellow-800',
            'processing' => 'bg-blue-100 text-blue-800',
            'shipped' => 'bg-purple-100 text-purple-800',
            'delivered' => 'bg-green-100 text-green-800',
            'cancelled' => 'bg-red-100 text-red-800',
            default => 'bg-gray-100 text-gray-800'
        };
    }
}
