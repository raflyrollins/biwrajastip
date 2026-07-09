<?php

namespace App\Http\Controllers;

use Inertia\Inertia;

class BatchController extends Controller
{
    public function index()
    {
        return Inertia::render('dashboard/batches/Index');
    }
}
