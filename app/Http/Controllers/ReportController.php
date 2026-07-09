<?php

namespace App\Http\Controllers;

use Inertia\Inertia;

class ReportController extends Controller
{
    public function index()
    {
        return Inertia::render('dashboard/reports/Index');
    }
}
