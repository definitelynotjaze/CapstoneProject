// ================================================================
//  OPTICANA — branch-data.js
//  Single-clinic data layer. Loaded as a plain script (non-module).
// ================================================================

/**
 * Returns doctors filtered by available day, sourced from the live
 * `doctors` array (db.js) so it stays in sync with admin edits and the
 * API (photos, schedule changes, new/removed doctors) instead of a
 * separate hardcoded snapshot.
 */
function getAvailableDoctors(selectedDate) {
  let filtered = doctors
    .filter(d => d.status === 'active')
    .map(d => ({ ...d, availableDays: d.availableDays || d.days || [] }));
  if (selectedDate) {
    const dayName = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][new Date(selectedDate).getDay()];
    filtered = filtered.filter(d => d.availableDays.includes(dayName));
  }
  return filtered;
}
