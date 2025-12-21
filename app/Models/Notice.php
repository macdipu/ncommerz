<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Notice extends Model
{
    protected $fillable = ['text', 'is_active'];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public static function active()
    {
        return static::where('is_active', true)->get();
    }
}
