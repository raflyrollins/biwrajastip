<?php

namespace App\Http\Controllers;

use Inertia\Inertia;

class BagController extends Controller
{
    public function index()
    {
        return Inertia::render('dashboard/bags/Index');
    }
}
