<?php
// ================================================================
//  OPTICANA — api/clinic/public.php
//  GET — public endpoint, no auth required.
//  Returns the clinic info shown on the public marketing pages
//  (name, address, phone, email, hours, logo) — never the internal
//  consultation/scheduling rules, which are admin-only via settings.php.
// ================================================================

require_once '../../config/db.php';
require_once '../helpers.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    jsonResponse(['success' => false, 'message' => 'Method not allowed.'], 405);
}

try {
    $pdo = getDB();
    $r = $pdo->query('SELECT name, tagline, address, phone, email, hours, logo_url FROM clinic_settings WHERE id = 1 LIMIT 1')->fetch();

    if (!$r) {
        jsonResponse(['success' => false, 'message' => 'Clinic settings not found.'], 404);
    }

    jsonResponse(['success' => true, 'clinic' => [
        'name'    => $r['name'],
        'tagline' => $r['tagline'],
        'address' => $r['address'],
        'phone'   => $r['phone'],
        'email'   => $r['email'],
        'hours'   => $r['hours'],
        'logoUrl' => $r['logo_url'],
    ]]);

} catch (PDOException $e) {
    jsonResponse(['success' => false, 'message' => 'Database error.'], 500);
}
