<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\InfoCard;

class InfoCardSeeder extends Seeder
{
    public function run()
    {
        $cards = [
            [
                'title' => 'ফ্রি ডেলিভারি',
                'subtitle' => 'মাত্র ২০০০৳+ অর্ডার করলেই',
                'icon_type' => 'heroicon',
                'icon_data' => 'TruckIcon',
                'bg_color' => 'bg-green-50',
                'text_color' => 'text-green-600',
                'border_color' => 'border-green-200',
                'sort_order' => 1,
            ],
            [
                'title' => '৭ দিনের রিটার্ন সুবিধা!',
                'subtitle' => 'শর্ত প্রযোজ্য।',
                'icon_type' => 'svg',
                'icon_data' => '<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />',
                'bg_color' => 'bg-blue-50',
                'text_color' => 'text-blue-600',
                'border_color' => 'border-blue-200',
                'sort_order' => 2,
            ],
            [
                'title' => 'নিরাপদ পেমেন্ট ব্যবস্থা',
                'subtitle' => 'আপনার তথ্য ১০০% নিরাপদ!',
                'icon_type' => 'heroicon',
                'icon_data' => 'ShieldCheckIcon',
                'bg_color' => 'bg-purple-50',
                'text_color' => 'text-purple-600',
                'border_color' => 'border-purple-200',
                'sort_order' => 3,
            ],
            [
                'title' => '২৪/৭ কাস্টমার সাপোর্ট',
                'subtitle' => 'দিন-রাত সব সময় আপনার পাশে!',
                'icon_type' => 'svg',
                'icon_data' => '<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />',
                'bg_color' => 'bg-orange-50',
                'text_color' => 'text-orange-600',
                'border_color' => 'border-orange-200',
                'sort_order' => 4,
            ],
            [
                'title' => 'স্পেশাল গিফট অফার!',
                'subtitle' => 'অর্ডার করলেই জুস ফ্রি!',
                'icon_type' => 'svg',
                'icon_data' => '<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />',
                'bg_color' => 'bg-pink-50',
                'text_color' => 'text-pink-600',
                'border_color' => 'border-pink-200',
                'sort_order' => 5,
            ],
        ];

        foreach ($cards as $card) {
            InfoCard::create($card);
        }
    }
}
