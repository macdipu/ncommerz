<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            ['name' => 'Men\'s Fashion', 'slug' => 'mens-fashion', 'description' => 'Trendy clothing for men'],
            ['name' => 'Women\'s Fashion', 'slug' => 'womens-fashion', 'description' => 'Stylish clothing for women'],
            ['name' => 'Accessories', 'slug' => 'accessories', 'description' => 'Fashion accessories'],
            ['name' => 'Shoes', 'slug' => 'shoes', 'description' => 'Footwear for all occasions'],
        ];

        foreach ($categories as $category) {
            Category::create($category);
        }
    }
}
