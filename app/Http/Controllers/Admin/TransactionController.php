<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Transaction;
use Inertia\Inertia;

class TransactionController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Transactions', [
            'transactions' => Transaction::with(['user', 'items'])
                ->latest()
                ->paginate(20),
        ]);
    }
}
