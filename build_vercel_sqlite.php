<?php

/*
 * Script utilitas lokal untuk mem-build template SQLite untuk deploy Vercel.
 * Jalankan dengan: php build_vercel_sqlite.php
 *
 * Hasilnya: database/vercel.sqlite sudah di-migrate & seed, siap di-copy ke
 * /tmp/pos-kasir-toko.sqlite saat cold-start di Vercel (lihat public/index.php).
 */

// Paksa Laravel memakai SQLite lokal (bukan mysql dari .env).
putenv('DB_CONNECTION=sqlite');
putenv('DB_DATABASE='.__DIR__.'/database/vercel.sqlite');
putenv('SESSION_DRIVER=file');
putenv('CACHE_STORE=array');
putenv('QUEUE_CONNECTION=sync');
putenv('APP_URL=http://localhost');

$_ENV['DB_CONNECTION'] = 'sqlite';
$_ENV['DB_DATABASE'] = __DIR__.'/database/vercel.sqlite';
$_ENV['SESSION_DRIVER'] = 'file';
$_ENV['CACHE_STORE'] = 'array';
$_ENV['QUEUE_CONNECTION'] = 'sync';
$_ENV['APP_URL'] = 'http://localhost';

$_SERVER = array_merge($_SERVER, $_ENV);

$sqlitePath = __DIR__.'/database/vercel.sqlite';
if (file_exists($sqlitePath)) {
    unlink($sqlitePath);
}
touch($sqlitePath);

require __DIR__.'/vendor/autoload.php';

$app = require __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);

$status = $kernel->call('migrate:fresh', [
    '--seed' => true,
    '--force' => true,
    '--no-interaction' => true,
]);

echo $kernel->output();

exit($status);
