<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class ApiDocsController extends Controller
{
    public function index()
    {
        $apiEndpoints = [
            'products' => [
                'GET /products' => 'Get all products',
                'GET /products/{id}' => 'Get single product',
                'POST /products' => 'Create product',
                'PUT /products/{id}' => 'Update product',
                'DELETE /products/{id}' => 'Delete product',
            ],
            'orders' => [
                'GET /orders' => 'Get all orders',
                'GET /orders/{id}' => 'Get single order',
                'POST /orders' => 'Create order',
                'PUT /orders/{id}' => 'Update order',
                'DELETE /orders/{id}' => 'Delete order',
            ],
            'categories' => [
                'GET /categories' => 'Get all categories',
                'GET /categories/{id}' => 'Get single category',
                'POST /categories' => 'Create category',
                'PUT /categories/{id}' => 'Update category',
                'DELETE /categories/{id}' => 'Delete category',
            ]
        ];

        return Inertia::render('Admin/ApiDocs/Index', [
            'apiEndpoints' => $apiEndpoints,
            'baseUrl' => url('/'),
            'apiKey' => auth()->user()->api_token,
        ]);
    }

    public function generateApiKey()
    {
        $user = auth()->user();
        $user->api_token = Str::random(60);
        $user->save();

        return redirect()->back()->with('success', 'API key generated successfully');
    }
}
