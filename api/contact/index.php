<?php
// ================================================================
//  OPTICANA — api/contact/index.php
//  GET — admin/staff only. Returns all contact-form submissions.
// ================================================================

require_once '../../config/db.php';
require_once '../helpers.php';

startSession();

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    jsonResponse(['success' => false, 'message' => 'Method not allowed.'], 405);
}

if (!isset($_SESSION['user_id'])) {
    jsonResponse(['success' => false, 'message' => 'Not authenticated.'], 401);
}

$role = $_SESSION['role'] ?? '';
if (!in_array($role, ['admin', 'staff'], true)) {
    jsonResponse(['success' => false, 'message' => 'Unauthorized.'], 403);
}

try {
    $pdo = getDB();

    $rows = $pdo->query(
        'SELECT * FROM contact_messages ORDER BY created_at DESC'
    )->fetchAll();

    $messages = array_map(function (array $r): array {
        return [
            'id'         => (int)$r['id'],
            'name'       => $r['name'],
            'email'      => $r['email'],
            'service'    => $r['service'],
            'message'    => $r['message'],
            'isRead'     => (bool)$r['is_read'],
            'reply'      => $r['reply'],
            'repliedBy'  => $r['replied_by'],
            'repliedAt'  => $r['replied_at'],
            'archivedAt' => $r['archived_at'],
            'createdAt'  => $r['created_at'],
        ];
    }, $rows);

    // Archived messages don't count toward the unread badge — they're filed away
    $unreadCount = count(array_filter($messages, fn($m) => !$m['isRead'] && !$m['archivedAt']));

    jsonResponse([
        'success'      => true,
        'messages'     => $messages,
        'unread_count' => $unreadCount,
    ]);

} catch (PDOException $e) {
    jsonResponse(['success' => false, 'message' => 'Database error.'], 500);
}
