<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        User::create([
            'name' => 'Admin',
            'username' => 'admin',
            'password' => 'password',
            'role' => 'admin',
        ]);

        User::create([
            'name' => 'Kasir',
            'username' => 'kasir',
            'password' => 'password',
            'role' => 'kasir',
        ]);
    }
}
