<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            ['name' => 'Makanan', 'description' => 'Produk makanan ringan dan berat'],
            ['name' => 'Minuman', 'description' => 'Produk minuman kemasan dan segar'],
            ['name' => 'Sembako', 'description' => 'Kebutuhan pokok sehari-hari'],
            ['name' => 'Snack', 'description' => 'Camilan dan keripik'],
            ['name' => 'Peralatan', 'description' => 'Peralatan rumah tangga'],
        ];

        foreach ($categories as $cat) {
            Category::create($cat);
        }
    }
}
