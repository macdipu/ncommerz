<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class Banner extends Model
{
    protected $fillable = [
        'title', 'description', 'image_url', 'link_url', 'sort_order', 'position', 'is_active'
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    protected $appends = ['full_image_url'];

    protected static function boot()
    {
        parent::boot();

        static::saving(function ($banner) {
            if ($banner->sort_order == 0) {
                // Move all other banners down by 1
                static::where('id', '!=', $banner->id ?? 0)
                    ->increment('sort_order');
                
                // Set this banner to position 1
                $banner->sort_order = 1;
            }
        });
    }

    public function getFullImageUrlAttribute()
    {
        if (!$this->image_url) return null;
        
        // If already a full URL, return as is
        if (str_starts_with($this->image_url, 'http')) {
            return $this->image_url;
        }
        
        // Generate full URL based on storage disk
        return asset('storage/' . $this->image_url);
    }

    public static function active()
    {
        return static::where('is_active', true)->orderBy('sort_order')->get();
    }
}
