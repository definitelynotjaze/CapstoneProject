<?php
// ================================================================
//  OPTICANA — api/patients/admin_update.php
//  Admin/Staff only. Edits an existing patient's profile, including
//  gender and date of birth — fields the patient cannot self-edit
//  (see api/patients/update.php, which is patient-self-service only
//  and intentionally excludes gender/dob for record-accuracy reasons).
//
//  POST { id, firstName, lastName, gender?, dob?, contact?, email?,
//         address?, bloodType? }
// ================================================================

require_once '../../config/db.php';
require_once '../helpers.php';

requireMethod('POST');
startSession();

if (!isset($_SESSION['user_id'])) {
    jsonResponse(['success' => false, 'message' => 'Not authenticated.'], 401);
}
if (!in_array($_SESSION['role'], ['admin', 'staff'], true)) {
    jsonResponse(['success' => false, 'message' => 'Unauthorized.'], 403);
}

$b    = getBody();
$id   = trim($b['id'] ?? '');
if (!$id) {
    jsonResponse(['success' => false, 'message' => 'Patient id is required.']);
}

$first   = trim($b['firstName'] ?? '');
$last    = trim($b['lastName']  ?? '');
if (!$first || !$last) {
    jsonResponse(['success' => false, 'message' => 'First and last name are required.']);
}

$gender  = trim($b['gender']  ?? '');
$dob     = trim($b['dob']     ?? '');
$contact = trim($b['contact'] ?? '');
$email   = trim($b['email']   ?? '');
$address = trim($b['address'] ?? '');
$blood   = trim($b['bloodType'] ?? '');

if ($gender && !in_array($gender, ['Male', 'Female', 'Other'], true)) {
    jsonResponse(['success' => false, 'message' => 'Invalid gender value.']);
}

try {
    $pdo = getDB();

    $stmt = $pdo->prepare('SELECT * FROM patients WHERE id = ? LIMIT 1');
    $stmt->execute([$id]);
    $patient = $stmt->fetch();
    if (!$patient) {
        jsonResponse(['success' => false, 'message' => 'Patient not found.'], 404);
    }

    $sets   = ['first_name = ?', 'last_name = ?'];
    $values = [$first, $last];

    if ($gender) { $sets[] = 'gender = ?'; $values[] = $gender; }

    if ($dob) {
        $bd  = new DateTime($dob);
        $age = (int)$bd->diff(new DateTime())->y;
        $sets[] = 'dob = ?'; $values[] = $dob;
        $sets[] = 'age = ?'; $values[] = $age;
    }

    if ($contact !== '') { $sets[] = 'contact = ?'; $values[] = $contact; }
    if ($address !== '') { $sets[] = 'address = ?'; $values[] = $address; }
    if ($blood   !== '') { $sets[] = 'blood_type = ?'; $values[] = $blood; }

    $values[] = $id;
    $pdo->prepare('UPDATE patients SET ' . implode(', ', $sets) . ' WHERE id = ?')->execute($values);

    // Email lives on `users`, only updatable if this patient already has a login account
    if ($email && $patient['user_id']) {
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            jsonResponse(['success' => false, 'message' => 'Please enter a valid email address.']);
        }
        $chk = $pdo->prepare('SELECT id FROM users WHERE email = ? AND id != ? LIMIT 1');
        $chk->execute([$email, $patient['user_id']]);
        if ($chk->fetch()) {
            jsonResponse(['success' => false, 'message' => 'That email is already registered to another account.']);
        }
        $pdo->prepare('UPDATE users SET email = ? WHERE id = ?')->execute([$email, $patient['user_id']]);
    }

    jsonResponse(['success' => true]);

} catch (PDOException $e) {
    jsonResponse(['success' => false, 'message' => 'Database error. Please try again.'], 500);
}
