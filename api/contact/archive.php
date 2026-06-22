<?php
// ================================================================
//  OPTICANA — api/contact/archive.php
//  POST { id: N, archived: true|false } → archive/unarchive a message.
//  admin/staff only.
// ================================================================

require_once '../../config/db.php';
require_once '../helpers.php';

requireMethod('POST');
startSession();

if (!isset($_SESSION['user_id'])) {
    jsonResponse(['success' => false, 'message' => 'Not authenticated.'], 401);
}

$role = $_SESSION['role'] ?? '';
if (!in_array($role, ['admin', 'staff'], true)) {
    jsonResponse(['success' => false, 'message' => 'Unauthorized.'], 403);
}

$b  = getBody();
$id = (int)($b['id'] ?? 0);

if (!$id) {
    jsonResponse(['success' => false, 'message' => 'id is required.']);
}

$archived = array_key_exists('archived', $b) ? (bool)$b['archived'] : true;

try {
    $pdo = getDB();

    $pdo->prepare('UPDATE contact_messages SET archived_at = ? WHERE id = ?')
        ->execute([$archived ? date('Y-m-d H:i:s') : null, $id]);

    jsonResponse(['success' => true]);

} catch (PDOException $e) {
    jsonResponse(['success' => false, 'message' => 'Database error.'], 500);
}
