<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Transaction;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $today = now()->toDateString();
        $monthStart = now()->startOfMonth()->toDateString();

        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'total_products' => Product::count(),
                'transactions_today' => Transaction::whereDate('created_at', $today)
                    ->where('payment_status', 'paid')->count(),
                'revenue_today' => Transaction::whereDate('created_at', $today)
                    ->where('payment_status', 'paid')->sum('total'),
                'revenue_month' => Transaction::whereDate('created_at', '>=', $monthStart)
                    ->where('payment_status', 'paid')->sum('total'),
                'low_stock' => Product::whereColumn('stock', '<=', 'min_stock')->count(),
            ],
            'chart' => Transaction::where('payment_status', 'paid')
                ->whereDate('created_at', '>=', now()->subDays(7))
                ->select(DB::raw('DATE(created_at) as date'), DB::raw('SUM(total) as total'))
                ->groupBy('date')
                ->orderBy('date')
                ->get(),
        ]);
    }
}
