<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\Cashier\POSController;
use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\ProductController;
use App\Http\Controllers\Admin\ReportController;
use App\Http\Controllers\Admin\StockController;
use App\Http\Controllers\Admin\TransactionController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\MidtransController;
use Illuminate\Support\Facades\Route;

// Guest routes
Route::middleware('guest')->group(function () {
    Route::get('/login', [AuthController::class, 'showLogin'])->name('login');
    Route::post('/login', [AuthController::class, 'login']);
});

// Redirect root to login
Route::get('/', fn () => redirect('/login'));

// Authenticated routes
Route::middleware('auth')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

    // Admin routes
    Route::middleware('role:admin')->prefix('admin')->group(function () {
        Route::get('/dashboard', [DashboardController::class, 'index'])->name('admin.dashboard');

        Route::get('/users', [UserController::class, 'index'])->name('admin.users');
        Route::post('/users', [UserController::class, 'store']);
        Route::put('/users/{user}', [UserController::class, 'update']);
        Route::delete('/users/{user}', [UserController::class, 'destroy']);
        Route::put('/users/{user}/reset-password', [UserController::class, 'resetPassword']);

        Route::get('/categories', [CategoryController::class, 'index'])->name('admin.categories');
        Route::post('/categories', [CategoryController::class, 'store']);
        Route::put('/categories/{category}', [CategoryController::class, 'update']);
        Route::delete('/categories/{category}', [CategoryController::class, 'destroy']);

        Route::get('/products', [ProductController::class, 'index'])->name('admin.products');
        Route::post('/products', [ProductController::class, 'store']);
        Route::put('/products/{product}', [ProductController::class, 'update']);
        Route::delete('/products/{product}', [ProductController::class, 'destroy']);

        Route::get('/stock', [StockController::class, 'index'])->name('admin.stock');
        Route::post('/stock', [StockController::class, 'store']);

        Route::get('/transactions', [TransactionController::class, 'index'])->name('admin.transactions');

        Route::get('/reports', [ReportController::class, 'index'])->name('admin.reports');
    });

    // Cashier routes
    Route::middleware('role:admin,kasir')->prefix('cashier')->group(function () {
        Route::get('/pos', [POSController::class, 'index'])->name('cashier.pos');
        Route::post('/checkout', [POSController::class, 'checkout'])->name('cashier.checkout');
        Route::get('/transactions', [POSController::class, 'transactions'])->name('cashier.transactions');
        Route::get('/transactions/{transaction}/receipt', [POSController::class, 'receipt'])->name('cashier.receipt');
    });
});

// Midtrans notification (no auth, no CSRF)
Route::post('/midtrans/notification', [MidtransController::class, 'notification'])
    ->withoutMiddleware([\Illuminate\Foundation\Http\Middleware\VerifyCsrfToken::class]);
