<?php

use Illuminate\Support\Facades\Route;

Route::post('/v1/login', function () {
    return response()->json(['message' => 'API login placeholder']);
});
