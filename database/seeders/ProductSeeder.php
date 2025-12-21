<?php

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $products = [
            [
                'name' => 'Classic T-Shirt',
                'slug' => 'classic-t-shirt',
                'description' => 'Comfortable cotton t-shirt perfect for everyday wear.',
                'price' => 29.99,
                'sale_price' => 24.99,
                'stock' => 100,
                'category_id' => 1,
                'images' => ['https://via.placeholder.com/400x400/ff0050/ffffff?text=T-Shirt'],
                'is_featured' => true,
            ],
            [
                'name' => 'Elegant Dress',
                'slug' => 'elegant-dress',
                'description' => 'Beautiful dress for special occasions.',
                'price' => 89.99,
                'stock' => 50,
                'category_id' => 2,
                'images' => ['https://via.placeholder.com/400x400/00f2ea/ffffff?text=Dress'],
                'is_featured' => true,
            ],
            [
                'name' => 'Leather Wallet',
                'slug' => 'leather-wallet',
                'description' => 'Premium leather wallet with multiple compartments.',
                'price' => 49.99,
                'stock' => 75,
                'category_id' => 3,
                'images' => ['https://via.placeholder.com/400x400/333333/ffffff?text=Wallet'],
                'is_featured' => true,
            ],
            [
                'name' => 'Running Shoes',
                'slug' => 'running-shoes',
                'description' => 'Comfortable running shoes for active lifestyle.',
                'price' => 129.99,
                'sale_price' => 99.99,
                'stock' => 30,
                'category_id' => 4,
                'images' => ['https://via.placeholder.com/400x400/ff6b35/ffffff?text=Shoes'],
                'is_featured' => true,
            ],
        ];

        foreach ($products as $product) {
            Product::create($product);
        }
    }
}
