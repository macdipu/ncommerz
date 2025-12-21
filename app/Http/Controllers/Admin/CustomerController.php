<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Inertia\Inertia;

class CustomerController extends Controller
{
    public function index()
    {
        $customers = User::where('is_admin', false)
            ->withCount('orders')
            ->orderBy('created_at', 'desc')
            ->paginate(20)
            ->through(function ($customer) {
                return [
                    'id' => $customer->id,
                    'name' => $customer->name,
                    'email' => $customer->email,
                    'phone' => $customer->phone,
                    'address' => $customer->address,
                    'total_orders' => $customer->orders_count,
                    'joined' => $customer->created_at->format('M d, Y'),
                ];
            });

        return Inertia::render('Admin/Customers/Index', compact('customers'));
    }
}
