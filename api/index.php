<?php

/*
|--------------------------------------------------------------------------
| Vercel Serverless Entrypoint
|--------------------------------------------------------------------------
|
| File ini dipakai oleh runtime `vercel-php` sebagai front-controller
| dari Laravel. Semua request non-static diarahkan ke sini melalui
| routing pada `vercel.json`.
|
| Di environment Vercel, filesystem bersifat read-only kecuali `/tmp`.
| Sebelum Laravel boot, kita siapkan direktori `/tmp/storage/...` agar
| compiled views, config cache, dan route cache bisa ditulis dengan aman.
|
*/

$runtimeStorageDirs = [
    '/tmp/storage',
    '/tmp/storage/framework',
    '/tmp/storage/framework/views',
    '/tmp/storage/framework/cache',
    '/tmp/storage/framework/cache/data',
    '/tmp/storage/framework/sessions',
    '/tmp/storage/logs',
];

foreach ($runtimeStorageDirs as $dir) {
    if (!is_dir($dir)) {
        @mkdir($dir, 0777, true);
    }
}

require __DIR__.'/../public/index.php';
