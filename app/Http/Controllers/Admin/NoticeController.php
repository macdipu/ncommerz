<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Notice;
use Illuminate\Http\Request;
use Inertia\Inertia;

class NoticeController extends Controller
{
    public function index()
    {
        $notices = Notice::latest()->get();
        return Inertia::render('Admin/Notices/Index', compact('notices'));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'text' => 'required|string|max:500',
            'is_active' => 'boolean',
        ]);

        Notice::create($validated);

        return redirect()->back()->with('success', 'Notice created successfully!');
    }

    public function destroy(Notice $notice)
    {
        $notice->delete();
        return redirect()->back()->with('success', 'Notice deleted successfully!');
    }
}
