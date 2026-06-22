<?php
// ================================================================
//  OPTICANA — api/appointments/update.php
//
//  POST { id, action, ...fields }
//
//  action:'status'             → { status, cancellationReason? }
//  action:'reschedule'         → { date, time, rescheduleNote? }
//  action:'request_reschedule' → { reason, preferredDate? }
//  action:'dismiss_reschedule' → (no extra fields)
// ================================================================

require_once '../../config/db.php';
require_once '../helpers.php';

requireMethod('POST');
startSession();

if (!isset($_SESSION['user_id'])) {
    jsonResponse(['success' => false, 'message' => 'Not authenticated.'], 401);
}

$role      = $_SESSION['role']       ?? '';
$profileId = $_SESSION['profile_id'] ?? '';
$userId    = (int)$_SESSION['user_id'];

$b      = getBody();
$id     = trim($b['id']     ?? '');
$action = trim($b['action'] ?? '');

if (!$id || !$action) {
    jsonResponse(['success' => false, 'message' => 'id and action are required.']);
}

try {
    $pdo = getDB();

    // Load current appointment
    $stmt = $pdo->prepare('SELECT * FROM appointments WHERE id = ? LIMIT 1');
    $stmt->execute([$id]);
    $appt = $stmt->fetch();
    if (!$appt) {
        jsonResponse(['success' => false, 'message' => 'Appointment not found.']);
    }

    // Access control: patients may only touch their own appointments
    if ($role === 'patient' && $appt['patient_id'] !== $profileId) {
        jsonResponse(['success' => false, 'message' => 'Unauthorized.'], 403);
    }
    // Doctors may only touch their own appointments (for status changes)
    if ($role === 'doctor' && $appt['doctor_id'] !== $profileId) {
        jsonResponse(['success' => false, 'message' => 'Unauthorized.'], 403);
    }

    // Helper: get patient's user_id for notification targeting
    $getPatientUserId = function() use ($pdo, $appt): ?int {
        $ps = $pdo->prepare('SELECT user_id FROM patients WHERE id = ? LIMIT 1');
        $ps->execute([$appt['patient_id']]);
        $row = $ps->fetch();
        return ($row && $row['user_id']) ? (int)$row['user_id'] : null;
    };

    // ── Status change (approve / cancel / disapprove / completed) ──
    if ($action === 'status') {
        $newStatus = trim($b['status'] ?? '');
        $allowed   = ['pending', 'approved', 'cancelled', 'disapproved', 'completed'];
        if (!in_array($newStatus, $allowed, true)) {
            jsonResponse(['success' => false, 'message' => 'Invalid status.']);
        }
        $cancelReason = trim($b['cancellationReason'] ?? '');

        // Patients may only cancel their own
        if ($role === 'patient' && !in_array($newStatus, ['cancelled'], true)) {
            jsonResponse(['success' => false, 'message' => 'Patients may only cancel appointments.'], 403);
        }

        // Deciding the appointment's status (approve/disapprove/cancel/complete)
        // supersedes any reschedule request still sitting on it — otherwise the
        // "Reschedule Req." flag keeps showing after the appointment has already
        // moved on, even though nobody addressed the patient's actual ask.
        $pdo->prepare(
            'UPDATE appointments SET status = ?, cancellation_reason = ?, reschedule_request = NULL WHERE id = ?'
        )->execute([$newStatus, $cancelReason ?: null, $id]);

        // Update last_visit on patient if completed
        if ($newStatus === 'completed' && $appt['patient_id']) {
            $pdo->prepare('UPDATE patients SET last_visit = ? WHERE id = ?')
                ->execute([$appt['date'], $appt['patient_id']]);
        }

        // Notify patient when status changes (not for patient-initiated cancel)
        if ($role !== 'patient' && $patientUid = $getPatientUserId()) {
            $fmtDate = date('M j, Y', strtotime($appt['date']));
            $doctor  = $appt['doctor_name'] ?? 'your doctor';
            if ($newStatus === 'approved') {
                createNotification($pdo, $patientUid, 'approved',
                    'Appointment Approved',
                    "Your appointment with {$doctor} on {$fmtDate} at {$appt['time']} has been approved."
                );
            } elseif ($newStatus === 'cancelled') {
                createNotification($pdo, $patientUid, 'cancelled',
                    'Appointment Cancelled',
                    "Your appointment with {$doctor} on {$fmtDate} has been cancelled by the clinic."
                    . ($cancelReason ? " Reason: {$cancelReason}" : '')
                );
            } elseif ($newStatus === 'disapproved') {
                createNotification($pdo, $patientUid, 'disapproved',
                    'Appointment Not Approved',
                    "Your appointment request with {$doctor} on {$fmtDate} could not be approved."
                );
            }
        }

        jsonResponse(['success' => true]);
    }

    // ── Admin/staff reschedule (change date + time) ────────────────
    if ($action === 'reschedule') {
        if (!in_array($role, ['admin', 'staff'], true)) {
            jsonResponse(['success' => false, 'message' => 'Unauthorized.'], 403);
        }
        $newDate = trim($b['date'] ?? '');
        $newTime = trim($b['time'] ?? '');
        $note    = trim($b['rescheduleNote'] ?? '');
        // True when this reschedule is fulfilling a specific patient-submitted
        // request (the "Accept & Reschedule" button), as opposed to an ad-hoc
        // reschedule the staff/admin initiated on their own.
        $fulfillRequest = !empty($b['fulfillRequest']);
        if (!$newDate || !$newTime) {
            jsonResponse(['success' => false, 'message' => 'Date and time are required.']);
        }

        if ($fulfillRequest) {
            // Only apply if the request is still pending — guards against the
            // same request being accepted twice from two different sessions/tabs
            // (e.g. admin and staff both viewing it), which would otherwise let
            // a stale second click silently overwrite the already-applied change.
            $upd = $pdo->prepare(
                'UPDATE appointments SET date = ?, time = ?, reschedule_note = ?, reschedule_request = NULL
                 WHERE id = ? AND reschedule_request IS NOT NULL'
            );
            $upd->execute([$newDate, $newTime, $note ?: null, $id]);
            if ($upd->rowCount() === 0) {
                jsonResponse(['success' => false, 'message' => 'This reschedule request was already handled.']);
            }
        } else {
            $pdo->prepare(
                'UPDATE appointments SET date = ?, time = ?, reschedule_note = ?, reschedule_request = NULL WHERE id = ?'
            )->execute([$newDate, $newTime, $note ?: null, $id]);
        }

        // Notify patient of reschedule
        if ($patientUid = $getPatientUserId()) {
            $fmtDate = date('M j, Y', strtotime($newDate));
            createNotification($pdo, $patientUid, 'rescheduled',
                'Appointment Rescheduled',
                "Your appointment has been rescheduled to {$fmtDate} at {$newTime}."
                . ($note ? " Note: {$note}" : '')
            );
        }

        jsonResponse(['success' => true]);
    }

    // ── Patient requests a reschedule ──────────────────────────────
    if ($action === 'request_reschedule') {
        if ($role !== 'patient') {
            jsonResponse(['success' => false, 'message' => 'Only patients may submit reschedule requests.'], 403);
        }
        $reason   = trim($b['reason']        ?? '');
        $prefDate = trim($b['preferredDate'] ?? '');
        if (!$reason) {
            jsonResponse(['success' => false, 'message' => 'Please provide a reason.']);
        }
        $payload = json_encode([
            'reason'        => $reason,
            'preferredDate' => $prefDate ?: null,
            'requestedAt'   => date('Y-m-d H:i'),
        ]);
        $pdo->prepare('UPDATE appointments SET reschedule_request = ? WHERE id = ?')
            ->execute([$payload, $id]);

        // Notify admin/staff of the reschedule request
        $patName = $appt['patient_name'] ?? 'A patient';
        notifyAdminStaff($pdo, 'reschedule_request',
            'Reschedule Request',
            "{$patName} has requested to reschedule appointment #{$id}."
            . ($prefDate ? " Preferred date: {$prefDate}." : '')
        );

        jsonResponse(['success' => true]);
    }

    // ── Admin/staff dismiss reschedule request ─────────────────────
    if ($action === 'dismiss_reschedule') {
        if (!in_array($role, ['admin', 'staff'], true)) {
            jsonResponse(['success' => false, 'message' => 'Unauthorized.'], 403);
        }
        $pdo->prepare('UPDATE appointments SET reschedule_request = NULL WHERE id = ?')
            ->execute([$id]);
        jsonResponse(['success' => true]);
    }

    jsonResponse(['success' => false, 'message' => 'Unknown action.'], 400);

} catch (PDOException $e) {
    jsonResponse(['success' => false, 'message' => 'Database error. Please try again.'], 500);
}
