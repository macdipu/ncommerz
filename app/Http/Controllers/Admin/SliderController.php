<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Slider;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class SliderController extends Controller
{
    public function index()
    {
        $sliders = Slider::orderBy('sort_order')->get();
        return Inertia::render('Admin/Sliders/Index', compact('sliders'));
    }

    public function create()
    {
        return Inertia::render('Admin/Sliders/Create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'image' => 'required|file|mimes:jpeg,png,jpg,gif|max:5120',
            'link_url' => 'nullable|url',
            'sort_order' => 'integer',
            'is_active' => 'boolean'
        ]);

        $imageUrl = $this->uploadImage($request->file('image'));

        Slider::create([
            'title' => $request->title,
            'description' => $request->description,
            'image_url' => $imageUrl,
            'link_url' => $request->link_url,
            'sort_order' => $request->sort_order ?? 0,
            'is_active' => $request->is_active ?? true
        ]);

        return redirect()->route('admin.sliders.index')->with('success', 'Slider created successfully');
    }

    public function edit(Slider $slider)
    {
        return Inertia::render('Admin/Sliders/Edit', compact('slider'));
    }

    public function update(Request $request, Slider $slider)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'image' => 'nullable|file|mimes:jpeg,png,jpg,gif|max:5120',
            'link_url' => 'nullable|url',
            'sort_order' => 'integer',
            'is_active' => 'boolean'
        ]);

        $data = $request->only(['title', 'description', 'link_url', 'sort_order', 'is_active']);

        if ($request->hasFile('image')) {
            if ($slider->image_url) {
                Storage::disk('public')->delete($slider->image_url);
            }
            $data['image_url'] = $this->uploadImage($request->file('image'));
        }

        $slider->update($data);

        return redirect()->route('admin.sliders.index')->with('success', 'Slider updated successfully');
    }

    public function destroy(Slider $slider)
    {
        if ($slider->image_url) {
            Storage::disk('public')->delete($slider->image_url);
        }
        
        $slider->delete();

        return redirect()->route('admin.sliders.index')->with('success', 'Slider deleted successfully');
    }

    private function uploadImage($file)
    {
        try {
            $filename = time() . '_' . $file->getClientOriginalName();
            $uploaded = Storage::disk('public')->putFileAs('sliders', $file, $filename);
            \Log::info('File uploaded successfully: ' . $uploaded);
            return $uploaded;
        } catch (\Exception $e) {
            \Log::error('Upload Error: ' . $e->getMessage());
            throw $e;
        }
    }
}
