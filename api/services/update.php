<?php
// ================================================================
//  OPTICANA — api/services/update.php
//  POST { id, name, description, duration, status, icon } — admin only.
//  Only the fields present in the request body are updated.
// ================================================================

require_once '../../config/db.php';
require_once '../helpers.php';

requireMethod('POST');
startSession();

if (!isset($_SESSION['user_id'])) {
    jsonResponse(['success' => false, 'message' => 'Not authenticated.'], 401);
}
if (($_SESSION['role'] ?? '') !== 'admin') {
    jsonResponse(['success' => false, 'message' => 'Only admins may edit services.'], 403);
}

$b  = getBody();
$id = (int)($b['id'] ?? 0);
if (!$id) {
    jsonResponse(['success' => false, 'message' => 'id is required.']);
}

$cols = ['name', 'description', 'duration', 'status', 'icon'];
$sets   = [];
$values = [];

foreach ($cols as $c) {
    if (!array_key_exists($c, $b)) continue;
    if ($c === 'duration') {
        $sets[]   = '`duration` = ?';
        $values[] = max(5, min(240, (int)$b['duration']));
    } elseif ($c === 'status') {
        $sets[]   = '`status` = ?';
        $values[] = in_array($b['status'], ['active', 'inactive'], true) ? $b['status'] : 'active';
    } else {
        $sets[]   = "`$c` = ?";
        $values[] = trim((string)$b[$c]);
    }
}

if (!$sets) {
    jsonResponse(['success' => false, 'message' => 'No fields to update.']);
}

try {
    $pdo = getDB();
    $values[] = $id;
    $pdo->prepare('UPDATE clinic_services SET ' . implode(', ', $sets) . ' WHERE id = ?')
        ->execute($values);

    $row = $pdo->prepare('SELECT * FROM clinic_services WHERE id = ?');
    $row->execute([$id]);
    $r = $row->fetch();
    if (!$r) {
        jsonResponse(['success' => false, 'message' => 'Service not found.'], 404);
    }

    jsonResponse(['success' => true, 'service' => [
        'id' => (int)$r['id'], 'name' => $r['name'], 'description' => $r['description'],
        'duration' => (int)$r['duration'], 'status' => $r['status'], 'icon' => $r['icon'],
    ]]);

} catch (PDOException $e) {
    jsonResponse(['success' => false, 'message' => 'Database error.'], 500);
}
