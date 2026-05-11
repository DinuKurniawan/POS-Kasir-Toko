<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\StockMovement;
use App\Services\StockService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StockController extends Controller
{
    public function __construct(protected StockService $stockService) {}

    public function index()
    {
        return Inertia::render('Admin/Stock', [
            'products' => Product::orderBy('name')->get(),
            'movements' => StockMovement::with(['product', 'user'])
                ->latest()
                ->limit(50)
                ->get(),
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'product_id' => 'required|exists:products,id',
            'type' => 'required|in:in,out',
            'quantity' => 'required|integer|min:1',
            'note' => 'nullable|string',
        ]);

        if ($data['type'] === 'in') {
            $this->stockService->increaseStock(
                $data['product_id'], $data['quantity'], auth()->id(), $data['note']
            );
        } else {
            $this->stockService->decreaseStock(
                $data['product_id'], $data['quantity'], auth()->id(), $data['note']
            );
        }

        return back()->with('success', 'Stok berhasil diupdate.');
    }
}
