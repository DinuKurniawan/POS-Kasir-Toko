<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ReportController extends Controller
{
    public function index(Request $request)
    {
        $query = Transaction::with(['user', 'items'])
            ->where('payment_status', 'paid');

        if ($request->filled('start_date')) {
            $query->whereDate('created_at', '>=', $request->start_date);
        }
        if ($request->filled('end_date')) {
            $query->whereDate('created_at', '<=', $request->end_date);
        }
        if ($request->filled('user_id')) {
            $query->where('user_id', $request->user_id);
        }
        if ($request->filled('payment_method')) {
            $query->where('payment_method', $request->payment_method);
        }

        $transactions = $query->latest()->get();

        $totalRevenue = $transactions->sum('total');
        $totalProfit = $transactions->sum(function ($t) {
            return $t->items->sum(fn ($item) => ($item->price - $item->purchase_price) * $item->quantity);
        });

        return Inertia::render('Admin/Reports', [
            'transactions' => $transactions,
            'summary' => [
                'total_transactions' => $transactions->count(),
                'total_revenue' => $totalRevenue,
                'total_profit' => $totalProfit,
            ],
            'cashiers' => User::where('role', 'kasir')->get(),
            'filters' => $request->only(['start_date', 'end_date', 'user_id', 'payment_method']),
        ]);
    }
}
