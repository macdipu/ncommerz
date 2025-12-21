<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Invoice;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    public function index()
    {
        return Order::with('user')->latest()->paginate(20);
    }

    public function store(Request $request)
    {
        $request->validate([
            'customer_name' => 'required|string|max:255',
            'customer_phone' => 'required|string|max:20',
            'customer_address' => 'required|string',
            'total' => 'required|numeric|min:0',
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:1',
            'payment_method' => 'required|in:cod,bkash,nagad',
            'transaction_id' => 'required_if:payment_method,bkash,nagad|nullable|string'
        ]);

        $data = $request->all();
        $data['order_number'] = 'ORD-' . time() . '-' . rand(1000, 9999);
        $data['status'] = $data['status'] ?? 'pending';

        $order = Order::create($data);

        // Create invoice
        $invoice = Invoice::create([
            'invoice_number' => Invoice::generateInvoiceNumber(),
            'order_id' => $order->id,
            'customer_name' => $order->customer_name,
            'customer_phone' => $order->customer_phone,
            'delivery_address' => $order->customer_address,
            'payment_method' => $order->payment_method,
            'transaction_id' => $order->transaction_id,
            'subtotal' => $order->total,
            'delivery_charge' => 0,
            'total_amount' => $order->total,
            'status' => 'pending',
            'invoice_date' => now(),
        ]);

        return response()->json($order->load('user', 'invoice'), 201);
    }

    public function show(Order $order)
    {
        return $order->load('user');
    }

    public function update(Request $request, Order $order)
    {
        $request->validate([
            'status' => 'in:incomplete,pending,processing,shipped,delivered,cancelled',
            'customer_name' => 'string|max:255',
            'customer_phone' => 'string|max:20',
            'customer_address' => 'string'
        ]);

        $order->update($request->all());
        return $order->load('user');
    }

    public function destroy(Order $order)
    {
        $order->delete();
        return response()->json(['message' => 'Order deleted successfully']);
    }
}
