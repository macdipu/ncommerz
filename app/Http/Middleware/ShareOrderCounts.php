<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Order;

class ShareOrderCounts
{
    public function handle(Request $request, Closure $next)
    {
        // Check if this is an admin route
        if ($request->is('admin*')) {
            Inertia::share([
                'orderCounts' => [
                    'pending' => Order::where('status', 'pending')->count(),
                    'incomplete' => Order::where('status', 'incomplete')->count(),
                ],
                'settings' => [
                    'store_name' => \App\Models\Setting::get('store_name', 'Happy Shopping'),
                    'logo' => \App\Models\Setting::get('logo', ''),
                    'support_email' => \App\Models\Setting::get('support_email', ''),
                    'support_phone' => \App\Models\Setting::get('support_phone', ''),
                ]
            ]);
        } else {
            // Share settings for public pages
            Inertia::share([
                'settings' => [
                    'store_name' => \App\Models\Setting::get('store_name', 'Happy Shopping'),
                    'logo' => \App\Models\Setting::get('logo', ''),
                    'support_email' => \App\Models\Setting::get('support_email', ''),
                    'support_phone' => \App\Models\Setting::get('support_phone', ''),
                ]
            ]);
        }

        return $next($request);
    }
}
