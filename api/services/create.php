<?php
// ================================================================
//  OPTICANA — api/services/create.php
//  POST { name, description, duration, status, icon } — admin only.
// ================================================================

require_once '../../config/db.php';
require_once '../helpers.php';

requireMethod('POST');
startSession();

if (!isset($_SESSION['user_id'])) {
    jsonResponse(['success' => false, 'message' => 'Not authenticated.'], 401);
}
if (($_SESSION['role'] ?? '') !== 'admin') {
    jsonResponse(['success' => false, 'message' => 'Only admins may add services.'], 403);
}

$b = getBody();

$name     = trim($b['name'] ?? '');
$desc     = trim($b['description'] ?? '');
$duration = (int)($b['duration'] ?? 30);
$status   = in_array($b['status'] ?? '', ['active', 'inactive'], true) ? $b['status'] : 'active';
$icon     = trim($b['icon'] ?? 'eye');

if (!$name) {
    jsonResponse(['success' => false, 'message' => 'Service name is required.']);
}
if ($duration < 5 || $duration > 240) $duration = 30;

try {
    $pdo = getDB();
    $pdo->prepare('INSERT INTO clinic_services (name, description, duration, status, icon) VALUES (?, ?, ?, ?, ?)')
        ->execute([$name, $desc, $duration, $status, $icon]);

    $id = (int)$pdo->lastInsertId();

    jsonResponse(['success' => true, 'service' => [
        'id' => $id, 'name' => $name, 'description' => $desc,
        'duration' => $duration, 'status' => $status, 'icon' => $icon,
    ]]);

} catch (PDOException $e) {
    jsonResponse(['success' => false, 'message' => 'Database error.'], 500);
}
