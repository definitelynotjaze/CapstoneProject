<?php
// ================================================================
//  OPTICANA — api/appointments/create.php
//  POST { patientId, patientName, doctorId, doctorName,
//         date, time, type, status, notes }
//  → { success:true, id:'A001' }
// ================================================================

require_once '../../config/db.php';
require_once '../helpers.php';

requireMethod('POST');
startSession();

if (!isset($_SESSION['user_id'])) {
    jsonResponse(['success' => false, 'message' => 'Not authenticated.'], 401);
}

$role = $_SESSION['role'] ?? '';
// Patients book their own via requestAppointment; admin/staff create for any patient
if (!in_array($role, ['admin', 'staff', 'patient'], true)) {
    jsonResponse(['success' => false, 'message' => 'Unauthorized.'], 403);
}

$b = getBody();

$patientId   = trim($b['patientId']   ?? '');
$patientName = trim($b['patientName'] ?? '');
$doctorId    = trim($b['doctorId']    ?? '');
$doctorName  = trim($b['doctorName']  ?? '');
$date        = trim($b['date']        ?? '');
$time        = trim($b['time']        ?? '');
$type        = trim($b['type']        ?? 'Eye Examination');
$notes       = trim($b['notes']       ?? '');
$status      = trim($b['status']      ?? 'pending');

// Patient can only book for themselves
if ($role === 'patient') {
    $profileId = $_SESSION['profile_id'] ?? '';
    $patientId = $profileId;
    $status    = 'pending';
}

if (!$patientId || !$doctorId || !$date || !$time) {
    jsonResponse(['success' => false, 'message' => 'Patient, doctor, date and time are required.']);
}

// Validate status
$allowedStatus = ['pending', 'approved', 'cancelled', 'disapproved', 'completed'];
if (!in_array($status, $allowedStatus, true)) $status = 'pending';

try {
    $pdo = getDB();

    // Enforce the clinic's minimum-advance-booking rule for self-service patient
    // bookings (admin/staff retain discretion to schedule same-day walk-ins).
    if ($role === 'patient') {
        $minDays = minAdvanceBookingDays($pdo);
        $today   = new DateTime('today');
        $reqDate = new DateTime($date);
        $daysOut = (int)$today->diff($reqDate)->format('%r%a');
        if ($daysOut < $minDays) {
            $msg = $minDays === 0
                ? 'Please select a valid date.'
                : "Appointments must be booked at least {$minDays} day" . ($minDays > 1 ? 's' : '') . ' in advance.';
            jsonResponse(['success' => false, 'message' => $msg]);
        }
    }

    // Generate next ID: A001, A002, …
    $last = $pdo->query("SELECT id FROM appointments ORDER BY id DESC LIMIT 1")->fetchColumn();
    $next = 1;
    if ($last && preg_match('/^A(\d+)$/i', $last, $m)) {
        $next = (int)$m[1] + 1;
    }
    $newId = 'A' . str_pad($next, 3, '0', STR_PAD_LEFT);
    // Ensure uniqueness in case of gaps
    $dup = $pdo->prepare('SELECT id FROM appointments WHERE id = ?');
    while (true) {
        $dup->execute([$newId]);
        if (!$dup->fetch()) break;
        $next++;
        $newId = 'A' . str_pad($next, 3, '0', STR_PAD_LEFT);
    }

    $pdo->prepare(
        'INSERT INTO appointments
           (id, patient_id, patient_name, doctor_id, doctor_name, date, time, type, status, notes)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
    )->execute([$newId, $patientId, $patientName, $doctorId, $doctorName, $date, $time, $type, $status, $notes]);

    // Send notifications about the new appointment
    $fmtDate = date('M j, Y', strtotime($date));
    if ($role === 'patient') {
        // Patient booked — notify admin/staff
        notifyAdminStaff($pdo, 'new_appointment',
            'New Appointment Request',
            "{$patientName} has requested an appointment with {$doctorName} on {$fmtDate} at {$time}."
        );
    } else {
        // Admin/staff booked — notify patient
        $ps = $pdo->prepare('SELECT user_id FROM patients WHERE id = ? LIMIT 1');
        $ps->execute([$patientId]);
        $pRow = $ps->fetch();
        if ($pRow && $pRow['user_id']) {
            createNotification($pdo, (int)$pRow['user_id'], 'info',
                'Appointment Scheduled',
                "An appointment with {$doctorName} has been scheduled for you on {$fmtDate} at {$time}."
            );
        }
    }

    jsonResponse(['success' => true, 'id' => $newId]);

} catch (PDOException $e) {
    jsonResponse(['success' => false, 'message' => 'Database error. Please try again.'], 500);
}
