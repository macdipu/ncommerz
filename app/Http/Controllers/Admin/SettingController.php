<?php

/*
|--------------------------------------------------------------------------
| NCommerz E-commerce Platform
|--------------------------------------------------------------------------
| Original Author: Abdul Alim
| Developer: Abdul Alim
| Github: https://github.com/alimworkzone/ncommerz
| 
| This file is part of NCommerz platform. Unauthorized reselling 
| or redistribution of this code is strictly prohibited.
|--------------------------------------------------------------------------
*/

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SettingController extends Controller
{
    public function index()
    {
        $settings = [
            'store_name' => Setting::get('store_name', 'Happy Shopping'),
            'store_description' => Setting::get('store_description', 'Your fashion destination'),
            'support_email' => Setting::get('support_email', 'support@example.com'),
            'support_phone' => Setting::get('support_phone', '+880 1647-126244'),
            'logo' => Setting::get('logo', ''),
            'offer_title' => Setting::get('offer_title', 'শুধু আজকের জন্য অফার চলছে! অফার মিস করবেন না!'),
            'offer_countdown_text' => Setting::get('offer_countdown_text', 'Ends In'),
            'cod_enabled' => Setting::get('cod_enabled', true),
            'bkash_enabled' => Setting::get('bkash_enabled', false),
            'nagad_enabled' => Setting::get('nagad_enabled', false),
            'bkash_number' => Setting::get('bkash_number', ''),
            'bkash_instructions' => Setting::get('bkash_instructions', ''),
            'nagad_number' => Setting::get('nagad_number', ''),
            'nagad_instructions' => Setting::get('nagad_instructions', ''),
        ];

        $infoCards = \App\Models\InfoCard::orderBy('sort_order')->get();

        return Inertia::render('Admin/Settings', compact('settings', 'infoCards'));
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'store_name' => 'required|string|max:255',
            'store_description' => 'nullable|string',
            'support_email' => 'nullable|email|max:255',
            'support_phone' => 'nullable|string|max:20',
            'logo' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'offer_title' => 'nullable|string|max:500',
            'offer_countdown_text' => 'nullable|string|max:100',
            'cod_enabled' => 'boolean',
            'bkash_enabled' => 'boolean',
            'nagad_enabled' => 'boolean',
            'bkash_number' => 'nullable|string|max:20',
            'bkash_instructions' => 'nullable|string',
            'nagad_number' => 'nullable|string|max:20',
            'nagad_instructions' => 'nullable|string',
        ]);

        // Handle logo upload
        if ($request->hasFile('logo')) {
            // Delete old logo if exists
            $oldLogo = Setting::get('logo');
            if ($oldLogo && \Storage::disk('public')->exists($oldLogo)) {
                \Storage::disk('public')->delete($oldLogo);
            }
            
            $logoPath = $request->file('logo')->store('logos', 'public');
            $validated['logo'] = $logoPath;
        } else {
            unset($validated['logo']);
        }

        foreach ($validated as $key => $value) {
            Setting::set($key, $value);
        }

        return redirect()->back()->with('success', 'Settings updated successfully!');
    }

    public function updateInfoCard(Request $request, \App\Models\InfoCard $infoCard)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'subtitle' => 'required|string|max:255',
            'is_active' => 'boolean',
        ]);

        $infoCard->update($validated);

        return redirect()->back()->with('success', 'Info card updated successfully!');
    }
}
