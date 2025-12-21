<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Slider extends Model
{
    protected $fillable = [
        'title', 'description', 'image_url', 'link_url', 'sort_order', 'is_active'
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    protected $appends = ['full_image_url'];

    protected static function boot()
    {
        parent::boot();

        static::saving(function ($slider) {
            if ($slider->sort_order == 0) {
                static::where('id', '!=', $slider->id ?? 0)
                    ->increment('sort_order');
                $slider->sort_order = 1;
            }
        });
    }

    public function getFullImageUrlAttribute()
    {
        if (!$this->image_url) return null;
        
        if (str_starts_with($this->image_url, 'http')) {
            return $this->image_url;
        }
        
        return asset('storage/' . $this->image_url);
    }

    public static function active()
    {
        return static::where('is_active', true)->orderBy('sort_order')->get();
    }
}
