<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Banner;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class BannerController extends Controller
{
    public function index()
    {
        $banners = Banner::orderBy('sort_order')->get();
        return Inertia::render('Admin/Banners/Index', compact('banners'));
    }

    public function create()
    {
        return Inertia::render('Admin/Banners/Create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'image' => 'required|file|mimes:jpeg,png,jpg,gif|max:5120',
            'link_url' => 'nullable|url',
            'sort_order' => 'integer',
            'position' => 'required|integer|in:1,2,3,4,5',
            'is_active' => 'boolean'
        ]);

        $imageUrl = $this->uploadImage($request->file('image'));

        Banner::create([
            'title' => $request->title,
            'description' => $request->description,
            'image_url' => $imageUrl,
            'link_url' => $request->link_url,
            'sort_order' => $request->sort_order ?? 0,
            'position' => $request->position,
            'is_active' => $request->is_active ?? true
        ]);

        return redirect()->route('admin.banners.index')->with('success', 'Banner created successfully');
    }

    public function edit(Banner $banner)
    {
        return Inertia::render('Admin/Banners/Edit', compact('banner'));
    }

    public function update(Request $request, Banner $banner)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'image' => 'nullable|file|mimes:jpeg,png,jpg,gif|max:5120',
            'link_url' => 'nullable|url',
            'sort_order' => 'integer',
            'position' => 'required|integer|in:1,2,3,4,5',
            'is_active' => 'boolean'
        ]);

        $data = $request->only(['title', 'description', 'link_url', 'sort_order', 'position', 'is_active']);

        if ($request->hasFile('image')) {
            if ($banner->image_url) {
                Storage::disk('public')->delete($banner->image_url);
            }
            $data['image_url'] = $this->uploadImage($request->file('image'));
        }

        $banner->update($data);

        return redirect()->route('admin.banners.index')->with('success', 'Banner updated successfully');
    }

    public function destroy(Banner $banner)
    {
        if ($banner->image_url) {
            // Use local storage for deletion
            Storage::disk('public')->delete($banner->image_url);
        }
        
        $banner->delete();

        return redirect()->route('admin.banners.index')->with('success', 'Banner deleted successfully');
    }

    private function uploadImage($file)
    {
        try {
            $filename = time() . '_' . $file->getClientOriginalName();
            
            // Store relative path only - model will generate full URL
            $uploaded = Storage::disk('public')->putFileAs('banners', $file, $filename);
            
            \Log::info('File uploaded successfully: ' . $uploaded);
            
            return $uploaded; // Return relative path only
        } catch (\Exception $e) {
            \Log::error('Upload Error: ' . $e->getMessage());
            throw $e;
        }
    }
}
