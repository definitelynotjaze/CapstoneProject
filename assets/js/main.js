// ================================================================
//  OPTICANA — main.js
//  App entry point. Imports all modules, attaches globals,
//  handles modals, QR, toasts, and action handlers.
// ================================================================

// ── SVG Icon library ────────────────────────────────────────────
function icon(name, cls = 'icon') {
  const p = {
    home:          '<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>',
    calendar:      '<rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>',
    users:         '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
    user:          '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
    'file-text':   '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>',
    settings:      '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>',
    'bar-chart':   '<line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/><line x1="2" y1="20" x2="22" y2="20"/>',
    activity:      '<polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>',
    eye:           '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>',
    'log-out':     '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>',
    search:        '<circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>',
    plus:          '<line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>',
    edit:          '<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>',
    trash:         '<polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>',
    'trash-2':     '<polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/>',
    check:         '<polyline points="20 6 9 17 4 12"/>',
    x:             '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>',
    clock:         '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
    printer:       '<polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/>',
    download:      '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>',
    upload:        '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>',
    filter:        '<polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>',
    shield:        '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
    'chevron-down':'<polyline points="6 9 12 15 18 9"/>',
    'chevron-right':'<polyline points="9 18 15 12 9 6"/>',
    'chevron-left':'<polyline points="15 18 9 12 15 6"/>',
    'alert-circle':'<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>',
    'check-circle':'<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>',
    qr:            '<rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><path d="M14 14h3v3h3v3h-3v-3h-3z"/>',
    bell:          '<path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>',
    info:          '<circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>',
    'map-pin':     '<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>',
    phone:         '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.56 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>',
    mail:          '<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22 6 12 13 2 6"/>',
    'mail-open':   '<path d="M21.2 8.4 12 14 2.8 8.4"/><path d="M3 7.5 11.1 3a2 2 0 0 1 1.8 0L21 7.5"/><path d="M3 7.5v11a1.5 1.5 0 0 0 1.5 1.5h15A1.5 1.5 0 0 0 21 18.5v-11"/>',
    'refresh-cw':  '<polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>',
    award:         '<circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/>',
    'x-circle':    '<circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>',
    lock:          '<rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
    camera:        '<path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/>',
    'alert-triangle': '<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>',
    archive:          '<polyline points="21 8 21 21 3 21 3 8"/><rect x="1" y="3" width="22" height="5"/><line x1="10" y1="12" x2="14" y2="12"/>',
    'rotate-ccw':     '<polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-3.5"/>',
    clipboard:        '<path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/>',
    package:          '<line x1="16.5" y1="9.4" x2="7.5" y2="4.21"/><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>',
    grid:             '<rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>',
    hash:             '<line x1="4" y1="9" x2="20" y2="9"/><line x1="4" y1="15" x2="20" y2="15"/><line x1="10" y1="3" x2="8" y2="21"/><line x1="16" y1="3" x2="14" y2="21"/>',
    'external-link':  '<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>'
  }
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="${cls}">${p[name] || ''}</svg>`
}

// ── Attach globals (called in onclick="" attributes) ────────────
window.icon                  = icon
window.state                 = state
window.navigate              = navigate
window.renderPage            = renderPage
window.toggleSidebar         = toggleSidebar
window.toggleDropdown        = toggleDropdown
window.bootShell             = bootShell
window.logout                = logout
window.handleLogin           = handleLogin
window.handleRegister        = handleRegister
window.showRegister          = showRegister
window.showLogin             = showLogin
window._charts               = { initAppointmentsChart, initPatientGrowthChart, initReportStatusChart, initReportMonthlyChart, updateAppointmentsChart, updatePatientGrowthChart, initAnalyticsDoughnut, initAnalyticsStacked, initGenderChart, initAgeChart, initDoctorUtilChart, updateAnalyticsCharts, initStaffOverviewChart, updateStaffOverviewChart }
window._pages                = { pageAdminDashboard, pageAdminUsers, pageAppointments, pagePatientList, pagePatientView, pageContactMessages, pageQRScanner, pageSchedule, pageAdminReports, pageAdminSettings, pageActivityLog, pageStaffDashboard, pageStaffSettings, pageDoctorDashboard, pageDoctorAppointments, pageDoctorSchedule, pageDoctorSettings, pageExamination, pageExamRecords, pageNewExamination, pagePatientExamHistory, pagePatientDashboard, pagePatientAppts, pagePatientRecords, pagePatientQR, pagePatientPrescriptions, pagePatientNotifications, pagePatientSettings, pageComingSoon, pagePatientDoctorAvail, pageScanQR }
window.toggleNotifyDropdown  = toggleNotifyDropdown
window.toggleUserDropdown    = toggleUserDropdown
window.closeAllDropdowns     = closeAllDropdowns
window.markAllRead           = markAllRead

// ── Close dropdowns on outside click ────────────────────────────
document.addEventListener('click', (e) => {
  const notifyWrap  = document.getElementById('topbar-notify-wrap')
  const userWrap    = document.getElementById('topbar-user-wrap')
  if (notifyWrap && !notifyWrap.contains(e.target)) {
    const dd = document.getElementById('notify-dropdown')
    if (dd) dd.classList.remove('open')
  }
  if (userWrap && !userWrap.contains(e.target)) {
    const ud = document.getElementById('user-dropdown')
    if (ud) ud.classList.remove('open')
  }
})

// ── Topbar shadow on scroll ──────────────────────────────────────
document.addEventListener('scroll', () => {
  const tb = document.querySelector('.topbar')
  if (tb) tb.classList.toggle('scrolled', window.scrollY > 4)
}, { passive: true })

// ════════════════════════════════════════════════════════════════
//  MODAL SYSTEM
// ════════════════════════════════════════════════════════════════
function showModal(html, size = '') {
  document.getElementById('modal-root').innerHTML = `
    <div class="modal-overlay" onclick="if(event.target===this)window.closeModal()">
      <div class="modal-box${size ? ' ' + size : ''}">${html}</div>
    </div>`
}
function closeModal() {
  document.getElementById('modal-root').innerHTML = ''
  if (window._qrKillStream) window._qrKillStream()
}
window.closeModal = closeModal
window.showModal  = showModal

// ════════════════════════════════════════════════════════════════
//  TOAST
// ════════════════════════════════════════════════════════════════
function toast(msg, type = 'success', duration = 3000) {
  const el = document.createElement('div')
  const isSuccess = type === 'success'
  const isError   = type === 'error'
  el.style.cssText = `
    position:fixed;bottom:24px;right:24px;z-index:9999;
    display:flex;align-items:center;gap:10px;
    background:${isError ? '#FEE2E2' : isSuccess ? '#D1FAE5' : '#FFF8F0'};
    color:${isError ? '#991B1B' : isSuccess ? '#065F46' : '#92400E'};
    border:1px solid ${isError ? '#FECACA' : isSuccess ? '#A7F3D0' : '#FFD9A8'};
    padding:12px 18px;border-radius:10px;font-size:.85rem;font-weight:600;
    box-shadow:0 8px 24px rgba(0,0,0,.12);
    animation:fadeUp .2s ease forwards;
    max-width:340px;`
  el.innerHTML = `
    ${icon(isError ? 'alert-circle' : 'check-circle', 'icon-sm')}
    <span>${msg}</span>`
  document.body.appendChild(el)
  setTimeout(() => { el.style.opacity = '0'; el.style.transform = 'translateY(8px)'; el.style.transition = 'opacity .2s,transform .2s'; setTimeout(() => el.remove(), 200) }, duration)
}
window.toast = toast

// ════════════════════════════════════════════════════════════════
//  REAL QR CODE — uses QRCode.js (already loaded via CDN)
// ════════════════════════════════════════════════════════════════
let _qrIdCounter = 0

function mockQRSvg(data, size = 120) {
  const uid  = `_qr${++_qrIdCounter}`
  const safe = (data || 'OPTICANA').replace(/&/g,'&amp;').replace(/"/g,'&quot;')

  function _tryGen(retries) {
    const container = document.getElementById(uid)
    if (!container) return
    if (!window.QRCode) {
      if (retries > 0) setTimeout(() => _tryGen(retries - 1), 200)
      return
    }
    try {
      container.innerHTML = ''
      new window.QRCode(container, {
        text:         data || 'OPTICANA',
        width:        size,
        height:       size,
        colorDark:    '#1C1C1C',
        colorLight:   '#ffffff',
        correctLevel: window.QRCode.CorrectLevel.M
      })
      container.style.background = ''
    } catch (_) {}
  }

  setTimeout(() => _tryGen(10), 80)
  return `<div id="${uid}" data-qr="${safe}" style="width:${size}px;height:${size}px;display:inline-block;background:#f3f4f6;border-radius:4px;overflow:hidden;line-height:0"></div>`
}
window.mockQRSvg = mockQRSvg

// Show QR code modal after patient account is created
function _showRegistrationQRModal(user, tempPassword) {
  const wrapperId = 'reg-success-qr'
  const qrHtml    = window.mockQRSvg ? window.mockQRSvg(user.qrData, 180) : ''
  showModal(`
    <div class="modal-header" style="border-bottom:none;padding-bottom:0">
      <div class="modal-title" style="display:flex;align-items:center;gap:8px;color:#059669">
        <div style="width:32px;height:32px;border-radius:50%;background:#ECFDF5;display:flex;align-items:center;justify-content:center;flex-shrink:0">
          ${icon('check-circle','icon-sm')}
        </div>
        Account Created!
      </div>
    </div>
    <div class="modal-body" style="text-align:center;padding-top:8px">
      <p style="font-size:.88rem;color:#374151;margin:0 0 4px">Welcome, <strong>${user.firstName}</strong>! Your patient account is now active.</p>
      <p style="font-size:.78rem;color:#6B7280;margin:0 0 18px">Save your unique QR code — present it at the clinic for instant check-in and profile retrieval.</p>
      <div id="${wrapperId}" style="display:inline-block;padding:16px;background:#fff;border:2px solid #E5E7EB;border-radius:12px;margin-bottom:10px">
        ${qrHtml}
      </div>
      <div style="font-size:.72rem;font-family:monospace;color:#9CA3AF;margin-bottom:2px;word-break:break-all">${user.qrData}</div>
      <div style="font-size:.88rem;font-weight:700;color:#1C1C1C;margin-bottom:${tempPassword ? '14px' : '0'}">${user.name} · ${user.id}</div>
      ${tempPassword ? `
      <div style="background:#FFF7ED;border:1px solid #FED7AA;border-radius:8px;padding:10px 14px;font-size:.8rem;color:#92400E;text-align:left;margin-top:10px">
        <strong>Temporary Password:</strong> <code style="font-size:.85rem;background:#fff;padding:2px 6px;border-radius:4px;border:1px solid #FED7AA">${tempPassword}</code>
        <br><span style="font-size:.72rem;color:#B45309;margin-top:3px;display:block">Share this with the patient. They can change it from Settings after logging in.</span>
      </div>` : ''}
    </div>
    <div class="modal-footer" style="justify-content:center;gap:10px">
      <button class="btn-secondary" onclick="window.downloadQR('${wrapperId}','${user.id}')">
        ${icon('download','icon-sm')} Download QR
      </button>
      <button class="btn-primary" onclick="window.closeModal()${tempPassword ? '' : ";window.showLogin()"}">
        ${tempPassword ? 'Done' : 'Sign In to Continue'}
      </button>
    </div>`)
}
window._showRegistrationQRModal = _showRegistrationQRModal

// Keep generateQR for any canvas-based callers
function generateQR(data, containerId, size = 160) {
  const el = document.getElementById(containerId)
  if (!el) return
  el.innerHTML = mockQRSvg(data, size)
}
window.generateQR = generateQR

function _getQRDataUrl(rootEl) {
  const canvas = rootEl.querySelector('canvas')
  if (canvas) return canvas.toDataURL('image/png')
  const img = rootEl.querySelector('img[src^="data:"]')
  if (img) return img.src
  return null
}

function downloadQR(wrapperId, filename) {
  const root    = wrapperId ? document.getElementById(wrapperId) : document.body
  const dataUrl = _getQRDataUrl(root || document.body)
  if (!dataUrl) { toast('QR code is still loading — please wait a moment.', 'error'); return }
  const a    = document.createElement('a')
  a.download = `OPTICANA-QR-${filename || 'patient'}.png`
  a.href     = dataUrl
  a.click()
  toast('QR code downloaded.', 'success')
}
window.downloadQR = downloadQR

function printQR(wrapperId, patientName, patientId, qrData) {
  const root    = wrapperId ? document.getElementById(wrapperId) : document.body
  const dataUrl = _getQRDataUrl(root || document.body)
  const w = window.open('', '_blank', 'width=420,height=560')
  if (!w) { toast('Pop-up blocked — please allow pop-ups and try again.', 'error'); return }
  w.document.write(`<!DOCTYPE html><html><head><title>QR — ${patientName || 'Patient'}</title>
  <style>
    *{margin:0;padding:0;box-sizing:border-box}
    body{font-family:Arial,sans-serif;display:flex;justify-content:center;align-items:flex-start;padding:24px;background:#fff}
    .card{text-align:center;border:2px solid #E5E7EB;border-radius:12px;padding:28px 24px;width:280px}
    .clinic{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:#6B7280;margin-bottom:16px}
    .qr-box{width:200px;height:200px;margin:0 auto 16px}
    .qr-box img{width:200px;height:200px}
    .name{font-size:15px;font-weight:700;color:#1C1C1C;margin-bottom:3px}
    .pid{font-size:11px;color:#9CA3AF;font-family:monospace;margin-bottom:6px}
    .hint{font-size:9px;color:#CBD5E1;font-family:monospace;word-break:break-all}
    @media print{body{padding:0}}
  </style></head><body>
  <div class="card">
    <div class="clinic">Cana Optical Clinic</div>
    <div class="qr-box">${dataUrl ? `<img src="${dataUrl}" alt="QR">` : '<div style="background:#f3f4f6;width:200px;height:200px;display:flex;align-items:center;justify-content:center;color:#9CA3AF;font-size:12px">QR unavailable</div>'}</div>
    <div class="name">${patientName || ''}</div>
    <div class="pid">${patientId || ''}</div>
    <div class="hint">${qrData || ''}</div>
  </div>
  <script>window.onload=function(){window.print();setTimeout(function(){window.close()},500)}<\/script>
  </body></html>`)
  w.document.close()
}
window.printQR = printQR

// ════════════════════════════════════════════════════════════════
//  CAMERA QR SCANNER — uses the html5-qrcode library (local vendor copy)
// ════════════════════════════════════════════════════════════════
let _h5qr = null // active Html5Qrcode instance, one at a time

// Responsive scan-box size: a square that's ~70% of the smaller video
// dimension, clamped so it stays usable on very small or very large feeds.
function _qrBoxSizeFn(viewfinderWidth, viewfinderHeight) {
  const minEdge = Math.min(viewfinderWidth, viewfinderHeight)
  const size    = Math.max(180, Math.min(280, Math.floor(minEdge * 0.7)))
  return { width: size, height: size }
}

async function startQRCamera(containerId, onResult, onStatus) {
  if (!window.Html5Qrcode) {
    toast('QR scanner library failed to load.', 'error'); return
  }
  if (!navigator.mediaDevices?.getUserMedia) {
    toast('Camera not supported on this device or browser.', 'error'); return
  }

  await _qrKillStream() // make sure no other instance is running

  const instance = new Html5Qrcode(containerId)
  _h5qr = instance
  let handled = false

  try {
    await instance.start(
      // cameraIdOrConfig must have exactly one key — facingMode here.
      { facingMode: 'environment' },
      // Request a higher-resolution stream via videoConstraints — scanning
      // a QR off another screen (e.g. a phone) from a distance needs more
      // pixels per QR module than a typical default-resolution stream gives.
      { fps: 12, qrbox: _qrBoxSizeFn, aspectRatio: 1.333334,
        videoConstraints: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } } },
      (decodedText) => {
        if (handled) return
        handled = true
        _qrKillStream().then(() => { if (onResult) onResult(decodedText) })
      },
      () => { /* fires continuously while no QR is in frame — expected, ignore */ }
    )
    if (onStatus) onStatus()
  } catch (err) {
    const msg = /NotAllowedError|Permission/i.test(String(err)) ? 'Camera permission denied. Please allow camera access and try again.'
              : /NotFoundError/i.test(String(err))               ? 'No camera found on this device.'
              : /NotReadableError/i.test(String(err))             ? 'Camera is in use by another application.'
              : /OverconstrainedError/i.test(String(err))         ? 'Camera does not support the requested resolution. Retrying with defaults…'
              : 'Camera error: ' + err
    toast(msg, 'error')
    _h5qr = null
    _qrStopUI()
  }
}

async function _qrKillStream() {
  if (!_h5qr) return
  const instance = _h5qr
  _h5qr = null
  try { await instance.stop() } catch (_) {}
  try { instance.clear() } catch (_) {}
}
window._qrKillStream = _qrKillStream

function _qrStopUI() {
  const reader   = document.getElementById('qr-reader')
  const idle     = document.getElementById('qr-cam-idle')
  const startBtn = document.getElementById('qr-start-btn')
  const stopBtn  = document.getElementById('qr-stop-btn')
  const camArea  = document.getElementById('qr-camera-area')
  const scanBar  = document.getElementById('qr-scanning-bar')
  if (reader)   reader.style.display = 'none'
  if (idle)     idle.style.display = 'flex'
  if (scanBar)  scanBar.style.display = 'none'
  if (startBtn) startBtn.style.display = ''
  if (stopBtn)  stopBtn.style.display  = 'none'
  if (camArea)  { camArea.style.borderStyle = 'dashed'; camArea.style.background = '#FAFAFA'; camArea.style.padding = '48px 24px'; camArea.style.boxShadow = '' }
  const statusEl  = document.getElementById('qr-scan-status')
  const captionEl = document.getElementById('qr-status-caption')
  if (statusEl)  statusEl.style.display  = 'none'
  if (captionEl) captionEl.style.display = 'none'
}

async function stopQRCamera() {
  await _qrKillStream()
  _qrStopUI()
}
window.stopQRCamera = stopQRCamera

async function openQRCameraScanner() {
  const reader         = document.getElementById('qr-reader')
  const idle           = document.getElementById('qr-cam-idle')
  const startBtn       = document.getElementById('qr-start-btn')
  const stopBtn        = document.getElementById('qr-stop-btn')
  const camArea        = document.getElementById('qr-camera-area')
  const scanBar        = document.getElementById('qr-scanning-bar')
  const scanPulse      = document.getElementById('qr-scan-pulse')
  const scanText       = document.getElementById('qr-scan-bar-text')
  const statusCaption  = document.getElementById('qr-status-caption')
  if (!reader) return

  if (idle)     idle.style.display = 'none'
  reader.style.display = ''
  if (scanBar)  scanBar.style.display  = 'flex'
  if (startBtn) startBtn.style.display = 'none'
  if (stopBtn)  stopBtn.style.display  = ''
  if (camArea)  { camArea.style.borderStyle = 'solid'; camArea.style.background = '#000'; camArea.style.padding = '12px' }

  // Phase 1: starting
  if (scanPulse) { scanPulse.style.background = '#F59E0B'; scanPulse.style.animation = 'qrDotPulse .9s ease-in-out infinite' }
  if (scanText)  scanText.textContent = 'Starting camera…'
  if (statusCaption) { statusCaption.style.display = ''; statusCaption.textContent = 'Requesting camera access…' }

  startQRCamera('qr-reader',
    // onResult
    (qrData) => {
      if (scanPulse) { scanPulse.style.background = '#22C55E'; scanPulse.style.animation = 'none' }
      if (scanText)  scanText.textContent = 'QR code detected!'
      if (camArea)   { camArea.style.borderColor = '#22C55E'; camArea.style.boxShadow = '0 0 0 3px rgba(34,197,94,.25)' }
      if (statusCaption) statusCaption.textContent = 'QR code found — looking up patient…'

      _qrStopUI()

      const patient = patients.find(p => p.qrData === qrData)
      _qrStatsRecord(!!patient, patient?.id)
      if (patient) {
        if (scanBar) scanBar.style.display = 'none'
        if (statusCaption) statusCaption.style.display = 'none'
        showQRResult(patient)
        toast(`Patient found: ${patient.name}`)
      } else {
        if (scanPulse) scanPulse.style.background = '#EF4444'
        if (scanText)  scanText.textContent = 'QR not recognised — no matching patient.'
        if (camArea)   { camArea.style.borderColor = '#EF4444'; camArea.style.boxShadow = '0 0 0 3px rgba(239,68,68,.2)' }
        if (statusCaption) statusCaption.textContent = `Scanned: "${qrData}" — not found in patient records.`
        toast('No matching patient found for this QR code.', 'error')
      }
    },
    // onStatus — called once camera is live
    () => {
      if (scanPulse) { scanPulse.style.background = '#22C55E'; scanPulse.style.animation = 'qrDotPulse .6s ease-in-out infinite' }
      if (scanText)  scanText.textContent = 'Scanning…'
      if (statusCaption) statusCaption.textContent = 'Camera live  ·  Hold the QR code steady in the frame'
    }
  )
}
window.openQRCameraScanner = openQRCameraScanner

// ════════════════════════════════════════════════════════════════
//  QR SCAN STATS — backed by qr_scan_log table via api/qr/*
// ════════════════════════════════════════════════════════════════
async function _qrStatsRecord(found, patientId) {
  try {
    await fetch('api/qr/record.php', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ found: !!found, patientId: patientId || null })
    })
  } catch (_) { /* non-critical — stats just won't reflect this scan */ }
  _qrRenderStats()
}
window._qrStatsRecord = _qrStatsRecord

async function _qrRenderStats() {
  const el = id => document.getElementById(id)
  try {
    const r = await fetch('api/qr/stats.php')
    const d = await r.json()
    if (!d.success) return
    if (el('qr-stat-total'))    el('qr-stat-total').textContent    = d.total
    if (el('qr-stat-found'))    el('qr-stat-found').textContent    = d.found
    if (el('qr-stat-notfound')) el('qr-stat-notfound').textContent = d.notFound
  } catch (_) { /* non-critical — leave stats at last known value */ }
}
window._qrRenderStats = _qrRenderStats

// ════════════════════════════════════════════════════════════════
//  QR IMAGE UPLOAD — decode a QR from an uploaded image file
// ════════════════════════════════════════════════════════════════
function processQRImageFile(file) {
  if (!file) return
  if (!file.type.startsWith('image/')) {
    toast('Please select an image file (PNG, JPG, WEBP).', 'error'); return
  }

  const zone     = document.getElementById('qr-upload-zone')
  const idle     = document.getElementById('qr-upload-idle')
  const preview  = document.getElementById('qr-upload-preview')
  const statusEl = document.getElementById('qr-upload-status')

  const setStatus = (msg, color) => {
    if (!statusEl) return
    statusEl.style.display = ''
    statusEl.style.color   = color || '#6B7280'
    statusEl.textContent   = msg
  }

  const reader = new FileReader()
  reader.onload = function(e) {
    // Show preview
    if (preview) { preview.src = e.target.result; preview.style.display = 'block' }
    if (idle)    idle.style.display = 'none'
    if (zone)    zone.style.borderColor = '#E5E7EB'
    setStatus('Reading QR code…', '#9CA3AF')

    const img = new Image()
    img.onload = function() {
      const canvas = document.createElement('canvas')
      canvas.width  = img.width
      canvas.height = img.height
      const ctx = canvas.getContext('2d')
      ctx.drawImage(img, 0, 0)

      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const code    = window.jsQR && window.jsQR(imgData.data, imgData.width, imgData.height, { inversionAttempts: 'attemptBoth' })

      if (!code?.data) {
        setStatus('No QR code found. Try a clearer or higher-resolution image.', '#EF4444')
        if (zone) zone.style.borderColor = '#EF4444'
        return
      }

      setStatus('QR detected — looking up patient…', '#E8760A')
      const patient = patients.find(p => p.qrData === code.data)
      _qrStatsRecord(!!patient, patient?.id)
      if (patient) {
        setStatus(`Patient found: ${patient.name}`, '#059669')
        if (zone) zone.style.borderColor = '#059669'
        showQRResult(patient)
        toast(`Patient found: ${patient.name}`)
      } else {
        setStatus('QR code not recognised in this system.', '#EF4444')
        if (zone) zone.style.borderColor = '#EF4444'
        toast('QR code not recognised in this system.', 'error')
      }
    }
    img.onerror = () => setStatus('Could not read image file.', '#EF4444')
    img.src = e.target.result
  }
  reader.readAsDataURL(file)
}
window.processQRImageFile = processQRImageFile

// ════════════════════════════════════════════════════════════════
//  TABLE FILTER (search)
// ════════════════════════════════════════════════════════════════
function filterTable(input, tbodyId) {
  const q    = input.value.toLowerCase()
  const rows = document.querySelectorAll(`#${tbodyId} tr[data-search]`)
  rows.forEach(r => {
    r.style.display = r.dataset.search.includes(q) ? '' : 'none'
  })
  if (window.pgReset) window.pgReset(tbodyId)
}
window.filterTable = filterTable

// ════════════════════════════════════════════════════════════════
//  APPOINTMENT ACTIONS
// ════════════════════════════════════════════════════════════════

// Shared helper — POST to update.php, then sync local mock array
async function _apptUpdate(payload) {
  try {
    const r = await fetch('api/appointments/update.php', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(payload)
    })
    const d = await r.json()
    if (!d.success) { toast(d.message || 'Update failed.', 'error'); return false }
    return true
  } catch (_) {
    toast('Network error — please try again.', 'error')
    return false
  }
}

async function approveAppt(id) {
  const ok = await _apptUpdate({ id, action: 'status', status: 'approved' })
  if (!ok) return
  updateAppointmentStatus(id, 'approved')
  const a = appointments.find(a => a.id === id)
  if (a) addActivityLog({ id:'L'+Date.now(), user: state.user.name, role: state.role,
    action: `Approved appointment ${id} for ${a.patientName}`,
    timestamp: new Date().toISOString().replace('T',' ').slice(0,19), type:'appointment' })
  toast('Appointment confirmed. The patient will be notified of their scheduled consultation.')
  renderPage()
}

async function cancelAppt(id, reason) {
  const ok = await _apptUpdate({ id, action: 'status', status: 'cancelled', cancellationReason: reason || '' })
  if (!ok) return
  updateAppointmentStatus(id, 'cancelled')
  const a = appointments.find(a => a.id === id)
  if (a && reason) a.cancellationReason = reason
  toast('Appointment has been cancelled. The patient will be notified of the cancellation.', 'error')
  renderPage()
}

async function disapproveAppt(id) {
  const ok = await _apptUpdate({ id, action: 'status', status: 'disapproved' })
  if (!ok) return
  updateAppointmentStatus(id, 'disapproved')
  toast('Appointment request declined. The patient will be notified and may submit a new request.')
  renderPage()
}

function rescheduleAppt(id) {
  const a = appointments.find(a => a.id === id)
  if (!a) return
  const fulfillingRequest = !!a.rescheduleRequest
  const defaultDate = a.rescheduleRequest?.preferredDate || a.date
  showModal(`
    <div class="modal-header">
      <div class="modal-title">Reschedule Appointment</div>
      <button class="modal-close" onclick="window.closeModal()">&times;</button>
    </div>
    <div class="modal-body">
      ${fulfillingRequest ? `<div style="background:#FFF7ED;border:1px solid #FED7AA;border-radius:8px;padding:10px 12px;margin-bottom:14px;font-size:.8rem;color:#9A3412">
        Fulfilling the patient's reschedule request${a.rescheduleRequest.preferredDate ? ' — preferred date pre-filled below' : ''}.
      </div>` : ''}
      <div class="form-group"><label class="form-label">Patient</label>
        <input class="form-input" value="${a.patientName}" disabled></div>
      <div class="form-group"><label class="form-label">New Date</label>
        <input type="date" id="re-date" class="form-input" value="${defaultDate}"
               min="${new Date().toISOString().split('T')[0]}"></div>
      <div class="form-group"><label class="form-label">New Time</label>
        <select id="re-time" class="form-select">
          ${['8:00 AM','9:00 AM','10:00 AM','11:00 AM','1:00 PM','2:00 PM','3:00 PM','4:00 PM','5:00 PM']
            .map(t=>`<option${t===a.time?' selected':''}>${t}</option>`).join('')}
        </select></div>
      <div class="form-group" style="margin-bottom:0"><label class="form-label">Note <span style="font-size:.75rem;color:#9CA3AF">(optional)</span></label>
        <textarea id="re-note" class="form-textarea" rows="2" placeholder="e.g. Doctor unavailable on original date, patient requested earlier slot…" style="resize:none">${a.rescheduleNote || ''}</textarea></div>
    </div>
    <div class="modal-footer">
      <button class="btn-secondary" onclick="window.closeModal()">Cancel</button>
      <button class="btn-primary" onclick="window.doReschedule('${id}',${fulfillingRequest})">Confirm Reschedule</button>
    </div>`)
}

async function doReschedule(id, fulfillRequest = false) {
  const a    = appointments.find(a => a.id === id)
  if (!a) return
  const date = document.getElementById('re-date').value
  const time = document.getElementById('re-time').value
  const note = (document.getElementById('re-note')?.value || '').trim()
  const ok   = await _apptUpdate({ id, action: 'reschedule', date, time, rescheduleNote: note, fulfillRequest })
  if (!ok) {
    // The request may have already been accepted from another session/tab —
    // re-sync so the stale "Accept & Reschedule" UI clears instead of being
    // clickable again and silently re-applying outdated date/time.
    if (fulfillRequest) {
      closeModal()
      if (window._syncAppointments) window._syncAppointments()
    }
    return
  }
  a.date = date
  a.time = time
  if (note) a.rescheduleNote = note
  if (a.rescheduleRequest) delete a.rescheduleRequest
  closeModal()
  toast('Appointment rescheduled.')
  renderPage()
}

window.approveAppt    = approveAppt
window.cancelAppt     = cancelAppt
window.disapproveAppt = disapproveAppt
window.rescheduleAppt = rescheduleAppt
window.doReschedule   = doReschedule

// ════════════════════════════════════════════════════════════════
//  PATIENT — REQUEST RESCHEDULE
// ════════════════════════════════════════════════════════════════
function requestReschedule(id) {
  const a = appointments.find(a => a.id === id)
  if (!a) return
  const fmtD = d => { const dt = new Date(d); return isNaN(dt) ? d : dt.toLocaleDateString('en-PH', { year:'numeric', month:'short', day:'numeric' }) }
  showModal(`
    <div class="modal-header">
      <div class="modal-title">Request Reschedule</div>
      <button class="modal-close" onclick="window.closeModal()">&times;</button>
    </div>
    <div class="modal-body">
      <div style="background:#FFF7ED;border:1px solid #FED7AA;border-radius:8px;padding:12px;margin-bottom:14px;font-size:.84rem">
        <div style="font-weight:600;color:#1a1a1a">${a.type}</div>
        <div style="color:#6B7280;margin-top:2px">${fmtD(a.date)} at ${a.time} · ${a.doctorName}</div>
      </div>
      <div class="form-group">
        <label class="form-label">Reason for Reschedule <span style="color:#DC2626">*</span></label>
        <textarea id="rs-reason" class="form-textarea" rows="3" placeholder="e.g. Schedule conflict, unable to attend, medical emergency…" style="resize:none"></textarea>
      </div>
      <div class="form-group">
        <label class="form-label">Preferred New Date <span style="font-size:.75rem;color:#9CA3AF">(optional)</span></label>
        <input type="date" id="rs-date" class="form-input" min="${new Date().toISOString().split('T')[0]}">
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn-secondary" onclick="window.closeModal()">Cancel</button>
      <button class="btn-primary" onclick="window.doRequestReschedule('${id}')">Submit Request</button>
    </div>`)
}

async function doRequestReschedule(id) {
  const a = appointments.find(a => a.id === id)
  if (!a) return
  const reason        = (document.getElementById('rs-reason')?.value || '').trim()
  if (!reason) { toast('Please enter a reason for rescheduling.', 'error'); return }
  const preferredDate = document.getElementById('rs-date')?.value || ''
  const ok = await _apptUpdate({ id, action: 'request_reschedule', reason, preferredDate })
  if (!ok) return
  a.rescheduleRequest = {
    reason,
    preferredDate,
    requestedAt: new Date().toISOString().replace('T',' ').slice(0,16)
  }
  closeModal()
  toast('Reschedule request submitted. The clinic will review and contact you.')
  renderPage()
}

async function dismissRescheduleRequest(id) {
  const ok = await _apptUpdate({ id, action: 'dismiss_reschedule' })
  if (!ok) return
  const a = appointments.find(a => a.id === id)
  if (a) delete a.rescheduleRequest
  closeModal()
  toast('Reschedule request dismissed.')
  renderPage()
}

window.requestReschedule        = requestReschedule
window.doRequestReschedule      = doRequestReschedule
window.dismissRescheduleRequest = dismissRescheduleRequest

// ════════════════════════════════════════════════════════════════
//  VIEW APPOINTMENT DETAILS
// ════════════════════════════════════════════════════════════════
function viewAppt(id) {
  const a = appointments.find(a => a.id === id)
  if (!a) return

  const fmtD = d => { const dt = new Date(d); return isNaN(dt) ? d : dt.toLocaleDateString('en-PH', { year:'numeric', month:'short', day:'numeric' }) }
  const steps = ['Submitted','Under Review','Approved','Completed']
  const stepIdx = { pending:1, approved:2, completed:3, cancelled:1, disapproved:1 }[a.status] ?? 1
  const stepColor = i => i <= stepIdx ? '#E8760A' : '#E5E7EB'
  const textColor = i => i <= stepIdx ? '#E8760A' : '#9CA3AF'

  const timelineHtml = steps.map((s,i) => `
    <div style="display:flex;flex-direction:column;align-items:center;flex:1;position:relative">
      <div style="width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;
                  font-size:.7rem;font-weight:700;background:${stepColor(i)};color:${i<=stepIdx?'#fff':'#9CA3AF'};
                  border:2px solid ${stepColor(i)};z-index:1">${i+1}</div>
      <div style="font-size:.7rem;margin-top:5px;color:${textColor(i)};font-weight:${i===stepIdx?'700':'400'};text-align:center">${s}</div>
    </div>
    ${i < steps.length-1 ? `<div style="flex:1;height:2px;margin-top:14px;background:${i < stepIdx ? '#E8760A' : '#E5E7EB'};min-width:16px"></div>` : ''}`
  ).join('')

  const isAdmin = state.role === 'admin' || state.role === 'staff'
  const isDoctor = state.role === 'doctor'
  const actionBtns = (isAdmin || isDoctor) ? `
    ${a.status === 'pending' && isAdmin ? `
      <button class="btn-success" onclick="window.approveAppt('${a.id}');window.closeModal()">Approve</button>
      <button class="btn-danger"  onclick="window.confirmCancelAppt('${a.id}')">Cancel</button>
      <button class="btn-warning" onclick="window.disapproveAppt('${a.id}');window.closeModal()">Disapprove</button>` : ''}
    ${a.status === 'approved' && isAdmin ? `
      <button class="btn-primary" onclick="window.markApptCompleted('${a.id}')">Mark Completed</button>
      <button class="btn-ghost"   onclick="window.rescheduleAppt('${a.id}')">Reschedule</button>
      <button class="btn-danger"  onclick="window.confirmCancelAppt('${a.id}')">Cancel</button>` : ''}` :
    (a.status === 'pending' || a.status === 'approved') ? `
      <button class="btn-danger" onclick="window.confirmCancelAppt('${a.id}')">Cancel Appointment</button>` : ''

  const badgeMap = { pending:'badge-pending', approved:'badge-approved', cancelled:'badge-cancelled', disapproved:'badge-disapproved', completed:'badge-completed' }
  const badgeHtml = `<span class="badge ${badgeMap[a.status]||''}">${a.status.charAt(0).toUpperCase()+a.status.slice(1)}</span>`

  showModal(`
    <div class="modal-header">
      <div class="modal-title">Appointment Details</div>
      <button class="modal-close" onclick="window.closeModal()">&times;</button>
    </div>
    <div class="modal-body">
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:14px">
        <code style="font-size:.75rem;background:#F3F4F6;padding:2px 8px;border-radius:4px;color:#6B7280">${a.id}</code>
        ${badgeHtml}
      </div>
      <div style="display:flex;align-items:center;gap:12px;padding:12px;background:#FFFBF5;border-radius:8px;border:1px solid #FFE4C0;margin-bottom:14px">
        ${icon('user','icon-sm')}
        <div>
          <div style="font-weight:700;font-size:.9rem">${a.patientName}</div>
          <div style="font-size:.75rem;color:#6B7280">${a.patientId}</div>
        </div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:14px">
        <div style="background:#F9FAFB;border-radius:6px;padding:10px">
          <div style="font-size:.68rem;color:#9CA3AF;margin-bottom:2px;text-transform:uppercase;letter-spacing:.04em">Doctor</div>
          <div style="font-size:.84rem;font-weight:600;display:flex;align-items:center;gap:6px;flex-wrap:wrap">
            ${a.doctorName}
          </div>
        </div>
        <div style="background:#F9FAFB;border-radius:6px;padding:10px">
          <div style="font-size:.68rem;color:#9CA3AF;margin-bottom:2px;text-transform:uppercase;letter-spacing:.04em">Type</div>
          <div style="font-size:.84rem;font-weight:600">${a.type}</div>
        </div>
        <div style="background:#F9FAFB;border-radius:6px;padding:10px">
          <div style="font-size:.68rem;color:#9CA3AF;margin-bottom:2px;text-transform:uppercase;letter-spacing:.04em">Date</div>
          <div style="font-size:.84rem;font-weight:600">${fmtD(a.date)}</div>
        </div>
        <div style="background:#F9FAFB;border-radius:6px;padding:10px">
          <div style="font-size:.68rem;color:#9CA3AF;margin-bottom:2px;text-transform:uppercase;letter-spacing:.04em">Time</div>
          <div style="font-size:.84rem;font-weight:600">${a.time}</div>
        </div>
      </div>
      ${a.notes ? `<div style="background:#F9FAFB;border-radius:6px;padding:10px;margin-bottom:14px">
        <div style="font-size:.68rem;color:#9CA3AF;margin-bottom:4px;text-transform:uppercase;letter-spacing:.04em">Notes</div>
        <div style="font-size:.84rem">${a.notes}</div>
      </div>` : ''}
      ${a.cancellationReason ? `<div style="background:#FEF2F2;border:1px solid #FECACA;border-radius:8px;padding:12px;margin-bottom:14px">
        <div style="font-size:.72rem;font-weight:700;color:#991B1B;text-transform:uppercase;letter-spacing:.05em;margin-bottom:6px">Cancellation Reason</div>
        <div style="font-size:.84rem;color:#374151">${a.cancellationReason}</div>
      </div>` : ''}
      ${a.rescheduleNote ? `<div style="background:#F0FDF4;border:1px solid #BBF7D0;border-radius:8px;padding:12px;margin-bottom:14px">
        <div style="font-size:.72rem;font-weight:700;color:#166534;text-transform:uppercase;letter-spacing:.05em;margin-bottom:6px">Reschedule Note</div>
        <div style="font-size:.84rem;color:#374151">${a.rescheduleNote}</div>
      </div>` : ''}
      ${a.rescheduleRequest ? `<div style="background:#FFF7ED;border:1px solid #FED7AA;border-radius:8px;padding:12px;margin-bottom:14px">
        <div style="display:flex;align-items:center;gap:6px;font-size:.75rem;font-weight:700;color:#C2410C;text-transform:uppercase;letter-spacing:.05em;margin-bottom:8px">
          ${icon('refresh-cw','icon-sm')} Reschedule Request
        </div>
        <div style="font-size:.84rem;color:#374151;margin-bottom:6px">${a.rescheduleRequest.reason}</div>
        ${a.rescheduleRequest.preferredDate ? `<div style="font-size:.76rem;color:#6B7280">Preferred date: <strong>${(() => { const dt = new Date(a.rescheduleRequest.preferredDate); return isNaN(dt) ? a.rescheduleRequest.preferredDate : dt.toLocaleDateString('en-PH',{year:'numeric',month:'short',day:'numeric'}) })()}</strong></div>` : ''}
        <div style="font-size:.72rem;color:#9CA3AF;margin-top:4px">Submitted: ${a.rescheduleRequest.requestedAt}</div>
        ${(isAdmin || isDoctor) ? `<div style="margin-top:10px;display:flex;gap:6px">
          <button class="btn-primary" style="font-size:.78rem;padding:5px 12px" onclick="window.rescheduleAppt('${a.id}')">Accept &amp; Reschedule</button>
          <button class="btn-secondary" style="font-size:.78rem;padding:5px 12px" onclick="window.dismissRescheduleRequest('${a.id}')">Dismiss</button>
        </div>` : ''}
      </div>` : ''}
      <div>
        <div style="font-size:.68rem;color:#9CA3AF;margin-bottom:10px;text-transform:uppercase;letter-spacing:.04em">Progress</div>
        <div style="display:flex;align-items:flex-start">${timelineHtml}</div>
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn-secondary" onclick="window.closeModal()">Close</button>
      ${actionBtns}
    </div>`, 'modal-lg')
}
window.viewAppt = viewAppt

// ════════════════════════════════════════════════════════════════
//  APPOINTMENT DOCTOR HELPERS
// ════════════════════════════════════════════════════════════════

/**
 * Populate a doctor <select> using branch-data.js getAvailableDoctors().
 * Option value format: "id|name"
 */
function populateDoctorOptions(doctorSelectId, dateVal) {
  const sel = document.getElementById(doctorSelectId)
  if (!sel) return
  const filtered = typeof getAvailableDoctors === 'function'
    ? getAvailableDoctors(dateVal || null)
    : []
  if (!filtered.length) {
    sel.innerHTML = '<option value="">No doctors have consultations scheduled on this date — select another day</option>'
    sel.disabled = false
    return
  }
  sel.innerHTML = '<option value="">Select a doctor...</option>' +
    filtered.map(d => `<option value="${d.id}|${d.name}">${d.name}</option>`).join('')
  sel.disabled = false
}
window.populateDoctorOptions = populateDoctorOptions

// Admin Create Appointment modal — date changed
function onCaDateChange() {
  const date = document.getElementById('ca-date')?.value || null
  const prev = document.getElementById('ca-doctor')?.value || ''
  populateDoctorOptions('ca-doctor', date)
  const doctorSel = document.getElementById('ca-doctor')
  if (doctorSel && prev) {
    const opt = Array.from(doctorSel.options).find(o => o.value === prev)
    if (opt) doctorSel.value = prev
  }
}
window.onCaDateChange = onCaDateChange

// Patient Request Appointment form — date changed
function onApptDateChange() {
  const date = document.getElementById('appt-date')?.value || null
  const prev = document.getElementById('appt-doctor')?.value || ''
  populateDoctorOptions('appt-doctor', date)
  const doctorSel = document.getElementById('appt-doctor')
  if (doctorSel && prev) {
    const opt = Array.from(doctorSel.options).find(o => o.value === prev)
    if (opt) doctorSel.value = prev
  }
}
window.onApptDateChange = onApptDateChange

// Mark individual notification as read (notifications page + topbar badge)
function markNotifRead(id) {
  const notif = (window._notifications || []).find(n => n.id === id)
  if (notif && !notif.isRead) {
    notif.isRead = true
    if (window._unreadCount > 0) window._unreadCount--
    if (window._updateNotifUI) window._updateNotifUI()
    fetch('api/notifications/mark_read.php', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: id })
    }).catch(() => {})
  }
  if (notif && window._notifNavTarget) {
    navigate(window._notifNavTarget(notif.type, state.role))
  }
}
window.markNotifRead = markNotifRead

// Mark all notifications as read (from notifications page button)
async function markAllNotifsRead() {
  ;(window._notifications || []).forEach(n => { n.isRead = true })
  window._unreadCount = 0
  if (window._updateNotifUI) window._updateNotifUI()
  window.renderPage()
  try {
    await fetch('api/notifications/mark_read.php', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ all: true })
    })
    toast('All notifications marked as read.', 'success')
  } catch (_) {}
}
window.markAllNotifsRead = markAllNotifsRead

// Print a single prescription card
function printPrescriptionCard(cardId) {
  const el = document.getElementById(cardId)
  if (!el) { window.print(); return }
  const w = window.open('', '_blank', 'width=600,height=500')
  w.document.write(`<!DOCTYPE html><html><head><title>Prescription</title>
    <style>body{font-family:Arial,sans-serif;padding:24px;font-size:14px}
    .grid{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:16px}
    .box{border:1px solid #ddd;border-radius:6px;padding:12px}
    .label{font-size:11px;color:#999;margin-bottom:8px;font-weight:bold;text-transform:uppercase}
    .val{font-family:monospace;font-size:16px;font-weight:bold;color:#111}
    .sub{font-size:11px;color:#888}
    </style></head><body>${el.innerHTML}</body></html>`)
  w.document.close()
  w.focus()
  setTimeout(() => { w.print(); w.close() }, 300)
}
window.printPrescriptionCard = printPrescriptionCard

// Toggle password field visibility (show/hide eye button)
function togglePwVisibility(inputId, btn) {
  const input = document.getElementById(inputId)
  if (!input) return
  const isHidden = input.type === 'password'
  input.type = isHidden ? 'text' : 'password'
  btn.style.color = isHidden ? '#E8760A' : '#9CA3AF'
}
window.togglePwVisibility = togglePwVisibility

// Custom radio pill helper — called via onchange on the hidden input
// Updates all label pills for the given radio group
function _syncRadioPills(radioName) {
  document.querySelectorAll(`input[name="${radioName}"]`).forEach(radio => {
    const lbl = document.querySelector(`label[for="${radio.id}"]`)
    if (!lbl) return
    const on = radio.checked
    lbl.style.background  = on ? '#FFF7ED' : '#f9fafb'
    lbl.style.borderColor = on ? '#E8891C' : '#e5e7eb'
    lbl.style.color       = on ? '#C4720E' : '#6b7280'
    lbl.style.boxShadow   = on ? '0 0 0 3px rgba(232,137,28,.15)' : ''
    const ring = lbl.querySelector('span:first-child')
    if (ring) ring.style.borderColor = on ? '#E8891C' : '#d1d5db'
    const dot = ring ? ring.querySelector('span') : null
    if (dot) {
      dot.style.background = on ? '#E8891C' : 'transparent'
      dot.style.transform  = on ? 'scale(1)' : 'scale(0)'
    }
  })
}
window._syncRadioPills = _syncRadioPills

// Validate + save new password via backend
async function validateSettingsPassword(newId, confId, errId, curId) {
  const curPwId = curId || 'sett-curpw'
  const curPw   = document.getElementById(curPwId)?.value || ''
  const newPw   = document.getElementById(newId)?.value   || ''
  const confPw  = document.getElementById(confId)?.value  || ''
  const errEl   = document.getElementById(errId)
  if (newPw !== confPw) { if (errEl) errEl.style.display = 'block'; return }
  if (errEl) errEl.style.display = 'none'
  if (!curPw || !newPw) { toast('Please fill in all password fields.', 'error'); return }
  if (newPw.length < 8)  { toast('New password must be at least 8 characters.', 'error'); return }

  try {
    const r = await fetch('api/users/change_password.php', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ currentPassword: curPw, newPassword: newPw })
    })
    const d = await r.json()
    if (d.success) {
      toast('Password updated successfully.', 'success')
      ;[curPwId, newId, confId].forEach(id => { const el = document.getElementById(id); if (el) el.value = '' })
    } else {
      toast(d.message || 'Failed to update password.', 'error')
    }
  } catch (_) {
    toast('Network error — please try again.', 'error')
  }
}
window.validateSettingsPassword = validateSettingsPassword

// Save profile for admin / staff / doctor (role-aware)
async function saveUserProfile() {
  const role   = state.role
  const prefix = role === 'doctor' ? 'doc' : role === 'staff' ? 'st' : 'ad'
  const fn     = document.getElementById(`${prefix}-fname`)?.value.trim() || ''
  const ln     = document.getElementById(`${prefix}-lname`)?.value.trim() || ''
  const email  = document.getElementById(`${prefix}-email`)?.value.trim() || ''
  const phone  = document.getElementById(`${prefix}-phone`)?.value.trim() || ''
  if (!fn || !ln) { toast('First and last name are required.', 'error'); return }

  try {
    const r = await fetch('api/users/update_profile.php', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ firstName: fn, lastName: ln, phone, email })
    })
    const d = await r.json()
    if (d.success) {
      toast('Profile updated successfully.', 'success')

      const fullName = (role === 'doctor' ? 'Dr. ' : '') + fn + ' ' + ln

      // Update state.user
      if (state.user) {
        state.user.firstName = fn
        state.user.lastName  = ln
        state.user.name      = fullName
        if (email) state.user.email = email
        state.user.contact   = phone
      }

      // Sync the in-memory mock arrays so navigating away and back shows new values
      if (role === 'doctor') {
        const entry = doctors.find(d => d.id === state.user?.id)
        if (entry) { entry.firstName = fn; entry.lastName = ln; entry.name = fullName; entry.contact = phone; if (email) entry.email = email }
      } else if (role === 'staff') {
        const entry = staff.find(s => s.id === state.user?.id)
        if (entry) { entry.firstName = fn; entry.lastName = ln; entry.name = fullName; entry.contact = phone; if (email) entry.email = email }
      } else if (role === 'admin') {
        const entry = admins.find(a => a.id === state.user?.id)
        if (entry) { entry.firstName = fn; entry.lastName = ln; entry.name = fullName; entry.contact = phone; if (email) entry.email = email }
      }

      // Re-render the current page so the profile banner reflects new values,
      // and re-render the sidebar so the name updates there too
      window.navigate(state.page, { ...state.params })
    } else {
      toast(d.message || 'Failed to update profile.', 'error')
    }
  } catch (_) {
    toast('Network error — please try again.', 'error')
  }
}
window.saveUserProfile = saveUserProfile

// Save patient profile fields via backend
async function savePatientSettings() {
  const fn      = document.getElementById('sett-first')?.value.trim()   || ''
  const ln      = document.getElementById('sett-last')?.value.trim()    || ''
  const contact = document.getElementById('sett-contact')?.value.trim() || ''
  const email   = document.getElementById('sett-email')?.value.trim()   || ''
  const address = document.getElementById('sett-address')?.value.trim() || ''
  if (!fn || !ln) { toast('First and last name are required.', 'error'); return }

  try {
    const r = await fetch('api/patients/update.php', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ action: 'profile', firstName: fn, lastName: ln, phone: contact, email, address })
    })
    const d = await r.json()
    if (d.success) toast('Profile updated successfully.', 'success')
    else           toast(d.message || 'Failed to update profile.', 'error')
  } catch (_) {
    toast('Network error — please try again.', 'error')
  }
}
window.savePatientSettings = savePatientSettings

// Combined search filter for the appointments list table
function filterApptTable(input) {
  const q = input.value.toLowerCase().trim()
  document.querySelectorAll('#appt-tbody tr').forEach(row => {
    const matchesSearch = !q || (row.dataset.search || '').includes(q)
    row.style.display = matchesSearch ? '' : 'none'
  })
  if (window.pgReset) window.pgReset('appt-tbody')
}
window.filterApptTable = filterApptTable

// ════════════════════════════════════════════════════════════════
//  CREATE APPOINTMENT (Admin/Staff)
// ════════════════════════════════════════════════════════════════
function openCreateApptModal() {
  const today = new Date().toISOString().split('T')[0]
  const times  = ['8:00 AM','9:00 AM','10:00 AM','11:00 AM','1:00 PM','2:00 PM','3:00 PM','4:00 PM','5:00 PM']
  showModal(`
    <div class="modal-header">
      <div class="modal-title">Create Appointment</div>
      <button class="modal-close" onclick="window.closeModal()">&times;</button>
    </div>
    <div class="modal-body" style="display:flex;flex-direction:column;gap:14px">
      <div class="form-row-2">
        <div class="form-group">
          <label class="form-label">Patient <span class="req">*</span></label>
          <select id="ca-patient" class="form-select">
            <option value="">Select patient</option>
            ${patients.map(p => `<option value="${p.id}|${p.name}">${p.name} (${p.id})</option>`).join('')}
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Appointment Type <span class="req">*</span></label>
          <select id="ca-type" class="form-select">
            ${CLINIC_SERVICES.filter(s => s.status === 'active').map(s => `<option>${s.name}</option>`).join('')}
          </select>
        </div>
      </div>
      <div class="form-row-2">
        <div class="form-group">
          <label class="form-label">Date <span class="req">*</span></label>
          <input type="date" id="ca-date" class="form-input" min="${today}"
                 onchange="window.onCaDateChange()">
        </div>
        <div class="form-group">
          <label class="form-label">Time <span class="req">*</span></label>
          <select id="ca-time" class="form-select">
            ${times.map(t => `<option>${t}</option>`).join('')}
          </select>
        </div>
      </div>
      <div class="form-row-2">
        <div class="form-group">
          <label class="form-label">Doctor <span class="req">*</span></label>
          <select id="ca-doctor" class="form-select">
            <option value="">Select a date first...</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Initial Status</label>
          <select id="ca-status" class="form-select">
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
          </select>
        </div>
      </div>
      <div class="form-group">
        <label class="form-label">Notes</label>
        <textarea id="ca-notes" class="form-textarea" placeholder="Optional notes or reason for visit…" style="height:38px;resize:vertical"></textarea>
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn-secondary" onclick="window.closeModal()">Cancel</button>
      <button id="ca-save-btn" class="btn-primary" onclick="window.doCreateAppt()">
        ${icon('plus','icon-sm')} Create Appointment
      </button>
    </div>`, 'modal-lg')
}

async function doCreateAppt() {
  const patientVal = document.getElementById('ca-patient').value
  const doctorVal  = document.getElementById('ca-doctor').value
  const date       = document.getElementById('ca-date').value
  const time       = document.getElementById('ca-time').value
  const type       = document.getElementById('ca-type').value
  const status     = document.getElementById('ca-status').value
  const notes      = document.getElementById('ca-notes').value

  if (!patientVal || !doctorVal || !date) {
    toast('Please complete all required fields before proceeding.', 'error'); return
  }

  const [patientId, patientName] = patientVal.split('|')
  const [doctorId,  doctorName]  = doctorVal.split('|')

  const btn = document.getElementById('ca-save-btn')
  if (btn) { btn.disabled = true; btn.innerHTML = icon('clock','icon-sm') + ' Saving…' }

  try {
    const r = await fetch('api/appointments/create.php', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ patientId, patientName, doctorId, doctorName, date, time, type, status, notes })
    })
    const d = await r.json()
    if (!d.success) { toast(d.message || 'Failed to create appointment.', 'error'); return }

    const newId = d.id
    addAppointment({ id: newId, patientId, patientName, doctorId, doctorName, date, time, type, status, notes })
    addActivityLog({ id:'L'+Date.now(), user: state.user.name, role: state.role,
      action: `Created appointment ${newId} for ${patientName}`,
      timestamp: new Date().toISOString().replace('T',' ').slice(0,19), type:'appointment' })
    closeModal()
    toast('Appointment created successfully. The patient will be notified.')
    renderPage()
  } catch (_) {
    toast('Network error — please try again.', 'error')
  } finally {
    if (btn) { btn.disabled = false; btn.innerHTML = icon('plus','icon-sm') + ' Create Appointment' }
  }
}

window.openCreateApptModal = openCreateApptModal
window.doCreateAppt        = doCreateAppt

// ════════════════════════════════════════════════════════════════
//  CONFIRM CANCEL + MARK COMPLETED
// ════════════════════════════════════════════════════════════════
function confirmCancelAppt(id) {
  const a = appointments.find(a => a.id === id)
  if (!a) return
  const isPatient = state.role === 'patient'
  const fmtD = d => { const dt = new Date(d); return isNaN(dt) ? d : dt.toLocaleDateString('en-PH', { year:'numeric', month:'short', day:'numeric' }) }
  showModal(`
    <div class="modal-header">
      <div class="modal-title">Cancel Appointment</div>
      <button class="modal-close" onclick="window.closeModal()">&times;</button>
    </div>
    <div class="modal-body">
      <div style="background:#FEF2F2;border:1px solid #FECACA;color:#991B1B;border-radius:8px;padding:12px;display:flex;gap:8px;align-items:flex-start;margin-bottom:14px">
        ${icon('alert-circle','icon-sm')} <span>${isPatient ? 'Are you sure you want to cancel this appointment? This action cannot be undone.' : 'Cancel this appointment? The patient will be notified of the cancellation.'}</span>
      </div>
      <div style="background:#F9FAFB;border-radius:8px;padding:10px 12px;margin-bottom:14px;font-size:.84rem">
        <div style="font-weight:600;color:#1a1a1a">${a.type}</div>
        <div style="color:#6B7280;margin-top:2px">${fmtD(a.date)} at ${a.time} · ${a.doctorName}</div>
        ${!isPatient ? `<div style="color:#6B7280;margin-top:1px">Patient: <strong>${a.patientName}</strong></div>` : ''}
      </div>
      <div class="form-group" style="margin-bottom:0">
        <label class="form-label">Reason for Cancellation <span style="color:#DC2626">*</span></label>
        <textarea id="cancel-reason" class="form-textarea" rows="3" placeholder="${isPatient ? 'e.g. Schedule conflict, personal emergency, feeling better…' : 'e.g. Doctor unavailable, clinic closure, scheduling conflict…'}" style="resize:none"></textarea>
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn-secondary" onclick="window.closeModal()">Keep Appointment</button>
      <button class="btn-danger" onclick="window.doCancelAppt('${a.id}')">Confirm Cancellation</button>
    </div>`)
}

async function doCancelAppt(id) {
  const reason = (document.getElementById('cancel-reason')?.value || '').trim()
  if (!reason) { toast('Please provide a reason for cancellation.', 'error'); return }
  await cancelAppt(id, reason)
  closeModal()
}

async function markApptCompleted(id) {
  const ok = await _apptUpdate({ id, action: 'status', status: 'completed' })
  if (!ok) return
  updateAppointmentStatus(id, 'completed')
  const a = appointments.find(a => a.id === id)
  if (a) addActivityLog({ id:'L'+Date.now(), user: state.user.name, role: state.role,
    action: `Marked appointment ${id} as completed for ${a.patientName}`,
    timestamp: new Date().toISOString().replace('T',' ').slice(0,19), type:'appointment' })
  closeModal()
  toast('Appointment marked as completed. The record has been updated.')
  renderPage()
}

window.confirmCancelAppt  = confirmCancelAppt
window.doCancelAppt       = doCancelAppt
window.markApptCompleted  = markApptCompleted

// ════════════════════════════════════════════════════════════════
//  PATIENT APPOINTMENT SUB-FILTER
// ════════════════════════════════════════════════════════════════
function filterPatientAppts(tab) {
  document.querySelectorAll('.pt-appt-tab').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tab === tab)
  })
  const rows = document.querySelectorAll('#pt-appt-tbody tr[data-appt-status]')
  rows.forEach(r => {
    r.style.display = (tab === 'all' || r.dataset.apptStatus === tab) ? '' : 'none'
  })
  if (window.pgReset) window.pgReset('pt-appt-tbody')
}
window.filterPatientAppts = filterPatientAppts

// ════════════════════════════════════════════════════════════════
//  PATIENT APPOINTMENT WIZARD
// ════════════════════════════════════════════════════════════════
// State shared across all wizard steps
const _wiz = {
  step: 0,
  selectedDate: '',
  selectedDateLabel: '',
  selectedDateShort: '',
  doctorId: '',
  doctorName: '',
  doctorSpec: '',
  time: '',
  type: 'Eye Examination',
  notes: '',
  calYear: 0,
  calMonth: 0
}

// ════════════════════════════════════════════════════════════════
//  PHILIPPINE PUBLIC HOLIDAYS
// ════════════════════════════════════════════════════════════════
function getPHHolidays(year) {
  // Easter Sunday — Anonymous Gregorian algorithm
  function easter(y) {
    const a=y%19,b=Math.floor(y/100),c=y%100,d=Math.floor(b/4),e=b%4
    const f=Math.floor((b+8)/25),g=Math.floor((b-f+1)/3)
    const h=(19*a+b-d-g+15)%30,i=Math.floor(c/4),k=c%4
    const l=(32+2*e+2*i-h-k)%7,m=Math.floor((a+11*h+22*l)/451)
    return new Date(y,Math.floor((h+l-7*m+114)/31)-1,((h+l-7*m+114)%31)+1)
  }
  function fmt(d){return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`}
  function add(d,n){const r=new Date(d);r.setDate(r.getDate()+n);return r}

  // Last Monday of August = National Heroes Day
  const aug31=new Date(year,7,31); let heroesDay=new Date(aug31)
  while(heroesDay.getDay()!==1) heroesDay.setDate(heroesDay.getDate()-1)

  const h={}
  // Fixed regular holidays
  h[`${year}-01-01`]="New Year's Day"
  h[`${year}-04-09`]="Araw ng Kagitingan"
  h[`${year}-05-01`]="Labor Day"
  h[`${year}-06-12`]="Independence Day"
  h[fmt(heroesDay)]="National Heroes Day"
  h[`${year}-11-01`]="All Saints' Day"
  h[`${year}-11-30`]="Bonifacio Day"
  h[`${year}-12-25`]="Christmas Day"
  h[`${year}-12-30`]="Rizal Day"
  // Special non-working
  h[`${year}-02-25`]="EDSA People Power Revolution Anniversary"
  h[`${year}-08-21`]="Ninoy Aquino Day"
  h[`${year}-11-02`]="All Souls' Day"
  h[`${year}-12-08`]="Feast of the Immaculate Conception"
  h[`${year}-12-31`]="New Year's Eve"
  // Holy Week (computed from Easter)
  const e=easter(year)
  h[fmt(add(e,-3))]="Maundy Thursday"
  h[fmt(add(e,-2))]="Good Friday"
  h[fmt(add(e,-1))]="Black Saturday"
  // Eid dates — declared by government; approximate for known years
  const eidFitr={2025:'2025-03-31',2026:'2026-03-20',2027:'2027-03-09'}
  const eidAdha={2025:'2025-06-07',2026:'2026-05-27',2027:'2027-05-16'}
  if(eidFitr[year]) h[eidFitr[year]]="Eid al-Fitr"
  if(eidAdha[year]) h[eidAdha[year]]="Eid al-Adha"
  return h
}
window.getPHHolidays = getPHHolidays

const _takenSlots = {
  mon: ['9:00 AM','2:00 PM'],
  wed: ['10:00 AM','3:00 PM'],
  fri: ['8:00 AM','1:00 PM'],
  tue: ['9:30 AM'],
  thu: ['2:30 PM']
}

// ── Stepper UI update ─────────────────────────────────────────────
function wizUpdateStepper(step) {
  for (let i = 0; i < 5; i++) {
    const si = document.getElementById('wiz-si-' + i)
    const ci = document.getElementById('wiz-c-' + i)
    if (!si || !ci) continue
    si.className = 'wiz-step-item' + (i < step ? ' done' : i === step ? ' active' : '')
    ci.innerHTML  = i < step
      ? `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" width="12" height="12"><polyline points="20 6 9 17 4 12"/></svg>`
      : String(i + 1)
  }
}

// ── Show a step with animation ────────────────────────────────────
function wizShowStep(idx, dir) {
  const steps = document.querySelectorAll('.wiz-step')
  steps.forEach((el, i) => {
    el.classList.remove('active','wiz-anim-right','wiz-anim-left')
    if (i === idx) {
      el.classList.add('active')
      el.classList.add(dir > 0 ? 'wiz-anim-right' : 'wiz-anim-left')
    }
  })
  wizUpdateStepper(idx)
}

// ── Navigate forward / backward ───────────────────────────────────
function wizGo(dir) {
  const nextStep = _wiz.step + dir
  if (nextStep < 0 || nextStep > 4) return
  // Collect current step data before moving
  if (_wiz.step === 3) {
    _wiz.type  = document.getElementById('appt-type')?.value || 'Eye Examination'
    _wiz.notes = document.getElementById('appt-notes')?.value || ''
  }
  if (nextStep === 4) wizPopulateReview()
  _wiz.step = nextStep
  wizShowStep(nextStep, dir)
  if (nextStep === 1) wizBuildDoctorCards()
  if (nextStep === 2) wizBuildTimeSlots()
  window.scrollTo(0, 0)
}
window.wizGo = wizGo

// Jump directly to a step (from review "Edit" links)
function wizJump(targetStep) {
  const dir = targetStep < _wiz.step ? -1 : 1
  _wiz.step = targetStep
  wizShowStep(targetStep, dir)
  if (targetStep === 1) wizBuildDoctorCards()
  if (targetStep === 2) wizBuildTimeSlots()
}
window.wizJump = wizJump

// ── Calendar init ─────────────────────────────────────────────────
function amcInit() {
  const now = new Date()
  const prefill = window._patCalPrefill || null
  window._patCalPrefill = null  // consume once

  Object.assign(_wiz, { step:0, selectedDate:'', selectedDateLabel:'', selectedDateShort:'',
    doctorId:'', doctorName:'', doctorSpec:'', _prefillDays:[], time:'', type:'Eye Examination', notes:'',
    calYear: now.getFullYear(), calMonth: now.getMonth() })

  // Apply pre-fill from Doctor Availability page
  if (prefill) {
    _wiz.doctorId   = prefill.doctorId
    _wiz.doctorName = prefill.doctorName
    _wiz.doctorSpec = prefill.doctorSpec || ''
    _wiz._prefillDays = prefill.doctorDays || []

    if (prefill.date) {
      // Date + doctor known — pre-fill both, land on Step 3 (time)
      _wiz.selectedDate = prefill.date
      const dt = new Date(prefill.date + 'T00:00:00')
      _wiz.selectedDateLabel = dt.toLocaleDateString('en-US', { weekday:'long', month:'long', day:'numeric', year:'numeric' })
      _wiz.selectedDateShort = dt.toLocaleDateString('en-US', { month:'long', day:'numeric' })
      _wiz.calYear  = dt.getFullYear()
      _wiz.calMonth = dt.getMonth()
      _wiz.step = 2
      wizShowStep(2, 1)
      wizBuildTimeSlots()
    } else {
      // Doctor only — land on Step 1, show prefill banner, filter calendar to doctor's days
      wizShowStep(0, 1)
    }

    // Update summary sidebar with whatever is known
    setTimeout(() => {
      const sd = document.getElementById('sum-doctor')
      if (sd) { sd.textContent = prefill.doctorName; sd.classList.remove('empty') }
      if (prefill.date) {
        const sdDate = document.getElementById('sum-date')
        if (sdDate) { sdDate.textContent = _wiz.selectedDateLabel; sdDate.classList.remove('empty') }
      }
      amcRenderPrefillBanner()
    }, 0)
  } else {
    wizShowStep(0, 1)
  }

  amcRender()
}
window.amcInit = amcInit

// Show/hide the "booking with doctor X" banner on Step 1
function amcRenderPrefillBanner() {
  const banner = document.getElementById('amc-prefill-banner')
  if (!banner) return
  if (_wiz.doctorName) {
    banner.style.display = 'flex'
    const nameEl = document.getElementById('amc-prefill-doc-name')
    if (nameEl) nameEl.textContent = _wiz.doctorName
  } else {
    banner.style.display = 'none'
  }
}
window.amcRenderPrefillBanner = amcRenderPrefillBanner

function amcGoMonth(dir) {
  const now = new Date()
  let y = _wiz.calYear, m = _wiz.calMonth + dir
  if (m < 0) { m = 11; y-- }
  if (m > 11) { m = 0; y++ }
  if (y < now.getFullYear() || (y === now.getFullYear() && m < now.getMonth())) return
  _wiz.calYear = y; _wiz.calMonth = m
  amcRender()
}
window.amcGoMonth = amcGoMonth

function amcRender() {
  const now      = new Date()
  const todayY   = now.getFullYear(), todayM = now.getMonth(), todayD = now.getDate()
  const { calYear: year, calMonth: month } = _wiz
  const maxDate  = new Date(todayY, todayM + 3, todayD)
  const dayNames = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']

  const lbl = document.getElementById('amc-month-label')
  if (lbl) lbl.textContent = new Date(year, month, 1).toLocaleDateString('en-PH', { month:'long', year:'numeric' })
  const prev = document.getElementById('amc-prev')
  if (prev) prev.style.opacity = (year===todayY && month===todayM) ? '0.3' : '1'

  const phHolidays = getPHHolidays(year)
  const firstDay  = new Date(year, month, 1).getDay()
  const daysInMon = new Date(year, month + 1, 0).getDate()
  let cells = ''
  for (let i = 0; i < firstDay; i++) cells += `<div class="amc-day amc-empty"></div>`
  for (let d = 1; d <= daysInMon; d++) {
    const dow       = new Date(year, month, d).getDay()
    const dateStr   = `${year}-${String(month+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`
    const isToday   = year===todayY && month===todayM && d===todayD
    const isPast    = new Date(year, month, d) < new Date(todayY, todayM, todayD)
    const isFar     = new Date(year, month, d) > maxDate
    const isSun     = dow === 0
    const isSel     = dateStr === _wiz.selectedDate
    const isHoliday = !!phHolidays[dateStr]
    const holidayName = phHolidays[dateStr] || ''
    const daysOut   = Math.round((new Date(year, month, d) - new Date(todayY, todayM, todayD)) / 86400000)
    const tooSoon   = daysOut < minAdvanceDays()
    const isDisabled = isPast || tooSoon || isHoliday
    // If doctor prefilled, restrict to their available days; otherwise allow Mon–Sat
    const prefillDays = _wiz._prefillDays || []
    const hasPrefill  = prefillDays.length > 0
    const docAvail    = hasPrefill ? prefillDays.includes(dayNames[dow]) : (dow >= 1 && dow <= 6)
    let cls = 'amc-day'
    if (isSel)                                       cls += ' amc-selected'
    else if (isToday)                                cls += ' amc-today'
    else if (isHoliday && !isPast)                   cls += ' amc-holiday'
    else if (docAvail && !isDisabled && !isFar)      cls += ' amc-avail'
    if (isDisabled || isSun || (hasPrefill && !docAvail)) cls += ' amc-past'
    if (isFar)                                            cls += ' amc-far'
    const clickable = !isDisabled && !isFar && docAvail && !isSun
    const onclick   = clickable ? `onclick="window.amcSelectDate('${dateStr}','${dayNames[dow]}')"` : ''
    const tooltip   = (tooSoon && !isPast) ? `title="${minAdvanceTooltip()}"` :
                      isHoliday ? `title="Clinic closed: ${holidayName}"` : ''
    const inner     = isHoliday && !isPast
      ? `${d}<span class="amc-holiday-lbl">${holidayName}</span>`
      : String(d)
    cells += `<div class="${cls}" ${onclick} ${tooltip}>${inner}</div>`
  }
  const grid = document.getElementById('amc-cells')
  if (grid) grid.innerHTML = cells
}

function amcSelectDate(dateStr, dayAbb) {
  _wiz.selectedDate = dateStr
  const dt = new Date(dateStr + 'T00:00:00')
  _wiz.selectedDateLabel = dt.toLocaleDateString('en-PH', { weekday:'long', month:'long', day:'numeric', year:'numeric' })
  _wiz.selectedDateShort = dt.toLocaleDateString('en-PH', { month:'long', day:'numeric' })

  const hasPrefillDoctor = !!_wiz.doctorId

  if (!hasPrefillDoctor) {
    // Normal flow: reset downstream doctor/time
    _wiz.doctorId = ''; _wiz.doctorName = ''; _wiz.doctorSpec = ''
    _wiz.time = ''
  } else {
    // Doctor pre-filled: only reset time
    _wiz.time = ''
  }
  amcRender()

  // Update summary
  const sd = document.getElementById('sum-date')
  if (sd) { sd.textContent = _wiz.selectedDateLabel; sd.classList.remove('empty') }
  if (!hasPrefillDoctor) {
    const sdoc = document.getElementById('sum-doctor')
    if (sdoc) { sdoc.textContent = 'Not selected yet'; sdoc.classList.add('empty') }
  }
  const st2 = document.getElementById('sum-time')
  if (st2) { st2.textContent = 'Not selected yet'; st2.classList.add('empty') }

  // Enable continue button
  const btn = document.getElementById('wiz-next-0')
  if (btn) btn.disabled = false

  // If doctor was pre-filled, skip Step 2 and go straight to Step 3
  if (hasPrefillDoctor) {
    setTimeout(() => {
      _wiz.step = 2
      wizShowStep(2, 1)
      wizBuildTimeSlots()
    }, 120)
  }
}
window.amcSelectDate = amcSelectDate

// ── Step 2: Doctor cards ──────────────────────────────────────────
function wizBuildDoctorCards() {
  const dt       = new Date(_wiz.selectedDate + 'T00:00:00')
  const dayShort = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][dt.getDay()]
  const availDocs = doctors.filter(d => (d.days || []).includes(dayShort))
  const lbl = document.getElementById('wiz-date-lbl2')
  if (lbl) lbl.textContent = _wiz.selectedDateLabel

  const container = document.getElementById('wiz-doctor-cards')
  if (!container) return

  if (!availDocs.length) {
    container.innerHTML = `<div style="text-align:center;padding:28px;color:#9CA3AF;font-size:.85rem">
      ${icon('x-circle','icon-lg')}<br><br>No doctors have consultations scheduled on this date.<br>Please go back and select a different day.</div>`
    return
  }

  const getInitials = name => name.replace('Dr. ','').split(' ').map(n=>n[0]).join('').slice(0,2).toUpperCase()

  container.innerHTML = availDocs.map(d => `
    <button class="doc-card${d.id === _wiz.doctorId ? ' selected' : ''}"
            onclick="window.wizSelectDoctor('${d.id}','${d.name}','${d.specialization}',this)">
      <div class="doc-card-avatar">${getInitials(d.name)}</div>
      <div style="flex:1;min-width:0">
        <div style="font-size:.9rem;font-weight:700;color:#1C1C1C">${d.name}</div>
        <div style="font-size:.78rem;color:#6B7280;margin-top:2px">${d.specialization} &bull; Available ${(d.days||[]).join(', ')}</div>
      </div>
      ${d.id === _wiz.doctorId ? `<span style="color:#E8760A">${icon('check-circle','icon-sm')}</span>` : ''}
    </button>`).join('')

  const btn = document.getElementById('wiz-next-1')
  if (btn) btn.disabled = !_wiz.doctorId

  // If doctor was pre-filled, also update summary sidebar
  if (_wiz.doctorId) {
    const sd = document.getElementById('sum-doctor')
    if (sd) { sd.textContent = _wiz.doctorName; sd.classList.remove('empty') }
  }
}

function wizSelectDoctor(id, name, spec, btnEl) {
  _wiz.doctorId = id; _wiz.doctorName = name; _wiz.doctorSpec = spec
  _wiz.time = '' // reset time when doctor changes
  document.querySelectorAll('.doc-card').forEach(b => {
    b.classList.remove('selected')
    const chk = b.querySelector('span[style*="E8760A"]')
    if (chk) chk.remove()
  })
  btnEl.classList.add('selected')
  btnEl.insertAdjacentHTML('beforeend', `<span style="color:#E8760A">${icon('check-circle','icon-sm')}</span>`)
  // Update hidden input and summary
  const inp = document.getElementById('appt-doctor')
  if (inp) inp.value = id + '|' + name
  const sd = document.getElementById('sum-doctor')
  if (sd) { sd.textContent = name; sd.classList.remove('empty') }
  const st2 = document.getElementById('sum-time')
  if (st2) { st2.textContent = 'Not selected yet'; st2.classList.add('empty') }
  const btn = document.getElementById('wiz-next-1')
  if (btn) btn.disabled = false
}
window.wizSelectDoctor = wizSelectDoctor

// ── Step 3: Time slots ────────────────────────────────────────────
function wizBuildTimeSlots() {
  const dt     = new Date(_wiz.selectedDate + 'T00:00:00')
  const dayAbb = ['sun','mon','tue','wed','thu','fri','sat'][dt.getDay()]
  const taken  = _takenSlots[dayAbb] || []
  const morning   = ['8:00 AM','8:30 AM','9:00 AM','9:30 AM','10:00 AM','10:30 AM','11:00 AM','11:30 AM']
  const afternoon = ['1:00 PM','1:30 PM','2:00 PM','2:30 PM','3:00 PM','3:30 PM','4:00 PM','4:30 PM']
  const slotBtn = t => {
    const isTaken  = taken.includes(t)
    const isSel    = t === _wiz.time
    const cls      = 'time-slot' + (isTaken ? ' taken' : isSel ? ' selected' : '')
    const disabled = isTaken ? 'disabled title="This time slot is already booked. Please choose from the available slots."' : ''
    return `<button class="${cls}" ${disabled} onclick="window.wizSelectTime('${t}',this)">${t}</button>`
  }
  const el = document.getElementById('appt-time-slots')
  if (el) el.innerHTML = `
    <div style="margin-bottom:14px">
      <div style="font-size:.7rem;text-transform:uppercase;letter-spacing:.06em;color:#9CA3AF;font-weight:700;margin-bottom:8px">Morning</div>
      <div style="display:flex;flex-wrap:wrap;gap:8px">${morning.map(slotBtn).join('')}</div>
    </div>
    <div>
      <div style="font-size:.7rem;text-transform:uppercase;letter-spacing:.06em;color:#9CA3AF;font-weight:700;margin-bottom:8px">Afternoon</div>
      <div style="display:flex;flex-wrap:wrap;gap:8px">${afternoon.map(slotBtn).join('')}</div>
    </div>`
  const lbl2 = document.getElementById('wiz-doc-lbl3')
  const lbl3 = document.getElementById('wiz-date-lbl3')
  if (lbl2) lbl2.textContent = _wiz.doctorName
  if (lbl3) lbl3.textContent = _wiz.selectedDateShort
  const btn = document.getElementById('wiz-next-2')
  if (btn) btn.disabled = !_wiz.time
}

function wizSelectTime(time, btnEl) {
  _wiz.time = time
  document.querySelectorAll('.time-slot').forEach(b => b.classList.remove('selected'))
  btnEl.classList.add('selected')
  const inp = document.getElementById('appt-time')
  if (inp) inp.value = time
  const st = document.getElementById('sum-time')
  if (st) { st.textContent = time; st.classList.remove('empty') }
  const btn = document.getElementById('wiz-next-2')
  if (btn) btn.disabled = false
}
window.wizSelectTime = wizSelectTime

// ── Step 4: Type selection ────────────────────────────────────────
function selectApptType(type, btn) {
  document.querySelectorAll('.appt-type-card').forEach(b => b.classList.remove('selected'))
  btn.classList.add('selected')
  _wiz.type = type
  const inp = document.getElementById('appt-type')
  if (inp) inp.value = type
  const st = document.getElementById('sum-type')
  if (st) st.textContent = type
}
window.selectApptType = selectApptType

// ── Step 5: Populate review ───────────────────────────────────────
function wizPopulateReview() {
  _wiz.type  = document.getElementById('appt-type')?.value  || _wiz.type
  _wiz.notes = document.getElementById('appt-notes')?.value || ''
  const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val }
  set('rev-date',   _wiz.selectedDateLabel)
  set('rev-doctor', _wiz.doctorName + (_wiz.doctorSpec ? ' — ' + _wiz.doctorSpec : ''))
  set('rev-time',   _wiz.time)
  set('rev-type',   _wiz.type)
  const notesEl = document.getElementById('rev-notes')
  if (notesEl) {
    notesEl.textContent   = _wiz.notes || 'No notes provided'
    notesEl.style.color   = _wiz.notes ? '#1C1C1C' : '#9CA3AF'
    notesEl.style.fontStyle = _wiz.notes ? 'normal' : 'italic'
    notesEl.style.fontWeight = _wiz.notes ? '600' : '400'
  }
}

// ── Submit ────────────────────────────────────────────────────────
async function requestAppointment() {
  if (!_wiz.selectedDate || !_wiz.doctorId || !_wiz.time) {
    toast('Please complete all required fields.', 'error'); return
  }
  const btn = document.getElementById('appt-submit-btn')
  if (btn) { btn.disabled = true; btn.innerHTML = icon('clock','icon-sm') + ' Submitting…' }

  const user = state.user
  try {
    const r = await fetch('api/appointments/create.php', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({
        patientId:   user.id,
        patientName: user.name,
        doctorId:    _wiz.doctorId,
        doctorName:  _wiz.doctorName,
        date:        _wiz.selectedDate,
        time:        _wiz.time,
        type:        _wiz.type,
        status:      'pending',
        notes:       _wiz.notes
      })
    })
    const d = await r.json()
    if (!d.success) { toast(d.message || 'Could not submit appointment.', 'error'); return }

    const newId = d.id
    addAppointment({
      id: newId, patientId: user.id, patientName: user.name,
      doctorId: _wiz.doctorId, doctorName: _wiz.doctorName,
      date: _wiz.selectedDate, time: _wiz.time, type: _wiz.type,
      status: 'pending', notes: _wiz.notes
    })
    addActivityLog({ id:'L'+Date.now(), user: user.name, role: 'Patient',
      action: `Requested appointment ${newId} with ${_wiz.doctorName}`,
      timestamp: new Date().toISOString().replace('T',' ').slice(0,19), type:'appointment' })

    const dt = new Date(_wiz.selectedDate + 'T00:00:00')
    const dateShort = dt.toLocaleDateString('en-PH', { month:'long', day:'numeric', year:'numeric' })
    showModal(`
      <div class="modal-body" style="text-align:center;padding:32px 24px">
        <div style="width:56px;height:56px;border-radius:50%;background:#ECFDF5;border:2px solid #16a34a;
                    display:flex;align-items:center;justify-content:center;margin:0 auto 16px">
          <svg viewBox="0 0 24 24" fill="none" stroke="#16a34a" stroke-width="2.5" width="24" height="24"><polyline points="20 6 9 17 4 12"/></svg>
        </div>
        <div style="font-size:1.1rem;font-weight:700;color:#1C1C1C;margin-bottom:8px">Your Appointment Request Has Been Submitted</div>
        <div style="font-size:.85rem;color:#6B7280;margin-bottom:16px">Your request for:</div>
        <div style="background:#FFF7ED;border-radius:10px;padding:14px 20px;margin-bottom:16px;text-align:left">
          <div style="font-size:.85rem;font-weight:600;color:#1C1C1C">${_wiz.doctorName}</div>
          <div style="font-size:.82rem;color:#6B7280;margin-top:4px">${dateShort} at ${_wiz.time}</div>
          <div style="font-size:.82rem;color:#6B7280">${_wiz.type}</div>
        </div>
        <div style="font-size:.8rem;color:#9CA3AF;margin-bottom:20px">has been submitted successfully. The clinic will review and confirm your schedule shortly.</div>
        <div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap">
          <button class="btn-secondary" onclick="window.closeModal();window.navigate('patient-appts',{filter:'history'})">View My Appointments</button>
          <button class="btn-primary" onclick="window.closeModal();window.navigate('patient-appts',{filter:'request'})">Request Another</button>
        </div>
      </div>`)
  } catch (_) {
    toast('Network error — please try again.', 'error')
    if (btn) { btn.disabled = false; btn.innerHTML = icon('check','icon-sm') + ' Confirm Appointment' }
  }
}
window.requestAppointment = requestAppointment

// keyboard nav
document.addEventListener('keydown', e => {
  if (!document.getElementById('wiz-step-0')) return
  if (e.key === 'Escape' && _wiz.step > 0) wizGo(-1)
})

// ════════════════════════════════════════════════════════════════
//  SAVE OPTICAL EXAMINATION
// ════════════════════════════════════════════════════════════════
function saveExamination(patientId) {
  const p = patients.find(p => p.id === patientId)
  if (!p) return

  const val = id => (document.getElementById(id) || {}).value || ''
  const od = { sph: val('ex-od-sph'), cyl: val('ex-od-cyl'), axis: val('ex-od-axis'), va: val('ex-od-va'), add: val('ex-od-add') }
  const os = { sph: val('ex-os-sph'), cyl: val('ex-os-cyl'), axis: val('ex-os-axis'), va: val('ex-os-va'), add: val('ex-os-add') }
  const rxPart = (eye) => [eye.sph, eye.cyl ? eye.cyl + (eye.axis ? ' ×' + eye.axis : '') : '', eye.add ? 'Add ' + eye.add : ''].filter(Boolean).join(' ')
  const newExam = {
    id:                  'E' + Date.now(),
    date:                new Date().toISOString().split('T')[0],
    doctor:              state.user.name,
    od,
    os,
    iop:                 { od: val('ex-iop-od'), os: val('ex-iop-os') },
    pd:                  val('ex-pd'),
    lensType:            val('ex-lens-type') || '—',
    status:              'completed',
    diagnosis:           val('ex-diagnosis'),
    recommendation:      val('ex-recommendation'),
    prescriptionDetails: ('OD: ' + rxPart(od) + ' / OS: ' + rxPart(os)).trim(),
    testResults:         val('ex-test-results'),
    remarks:             val('ex-remarks')
  }

  p.examinations.push(newExam)
  p.consultations.unshift({
    id: 'C' + Date.now(), date: newExam.date,
    doctor: state.user.name, type: 'Eye Examination',
    diagnosis: newExam.diagnosis,
    prescription: `OD: ${newExam.od.sph} ${newExam.od.cyl} x${newExam.od.axis} / OS: ${newExam.os.sph} ${newExam.os.cyl} x${newExam.os.axis}`,
    remarks: newExam.remarks
  })
  p.lastVisit = newExam.date

  addActivityLog({ id:'L'+Date.now(), user: state.user.name, role: 'Doctor',
    action: `Saved optical examination for ${p.name} (${p.id})`,
    timestamp: new Date().toISOString().replace('T',' ').slice(0,19), type:'examination' })

  toast('Examination record saved successfully. The prescription summary is now available for printing.')
  navigate('patient-view', { patientId, patientName: p.name })
}
window.saveExamination = saveExamination

function printExaminationForm(patientId) {
  const p = patients.find(pt => pt.id === patientId)
  if (!p) return
  const val = id => (document.getElementById(id)?.value || '').trim()
  const e = {
    id:       'DRAFT',
    date:     new Date().toISOString().split('T')[0],
    doctor:   state.user?.name || '—',
    od:       { sph: val('ex-od-sph'), cyl: val('ex-od-cyl'), axis: val('ex-od-axis'), va: val('ex-od-va'), add: '' },
    os:       { sph: val('ex-os-sph'), cyl: val('ex-os-cyl'), axis: val('ex-os-axis'), va: val('ex-os-va'), add: '' },
    iop:      { od: val('ex-iop-od'), os: val('ex-iop-os') },
    pd:       '',
    diagnosis:    val('ex-diagnosis'),
    recommendation: val('ex-recommendation'),
    remarks:      val('ex-remarks'),
    lensType: '', lensMaterial: '', lensCoating: [], frameSelection: '', prescriptionDetails: '', testResults: ''
  }
  _openExamPrintWindow(p, e)
}
window.printExaminationForm = printExaminationForm

// ════════════════════════════════════════════════════════════════
//  ADD CONSULTATION MODAL
// ════════════════════════════════════════════════════════════════
function openAddConsultationModal(patientId) {
  const p = patients.find(p => p.id === patientId)
  if (!p) return
  showModal(`
    <div class="modal-header">
      <div class="modal-title">Add Consultation — ${p.name}</div>
      <button class="modal-close" onclick="window.closeModal()">&times;</button>
    </div>
    <div class="modal-body">
      <div class="form-group"><label class="form-label">Date</label>
        <input type="date" id="con-date" class="form-input" value="${new Date().toISOString().split('T')[0]}"></div>
      <div class="form-group"><label class="form-label">Consultation Type</label>
        <select id="con-type" class="form-select">
          <option>Eye Examination</option><option>Vision Screening</option>
          <option>Refraction</option><option>Diagnosis of Refractive Errors</option>
          <option>Prescription of Corrective Lenses</option><option>Lens Fitting</option>
          <option>Optical Frame Selection</option><option>Follow-up Consultation</option>
        </select></div>
      <div class="form-group"><label class="form-label">Diagnosis</label>
        <input id="con-diag" class="form-input" placeholder="e.g. Myopia, Astigmatism"></div>
      <div class="form-group"><label class="form-label">Prescription</label>
        <input id="con-rx" class="form-input" placeholder="e.g. OD: -1.25 / OS: -1.00"></div>
      <div class="form-group"><label class="form-label">Remarks</label>
        <textarea id="con-rem" class="form-textarea" placeholder="Follow-up instructions, observations…"></textarea></div>
    </div>
    <div class="modal-footer">
      <button class="btn-secondary" onclick="window.closeModal()">Cancel</button>
      <button class="btn-primary" onclick="window.doAddConsultation('${patientId}')">Save Consultation</button>
    </div>`)
}

function doAddConsultation(patientId) {
  const p = patients.find(p => p.id === patientId)
  if (!p) return
  const gv = id => (document.getElementById(id) || {}).value || ''
  p.consultations.unshift({
    id: 'C' + Date.now(),
    date: gv('con-date'), doctor: state.user.name,
    type: gv('con-type'), diagnosis: gv('con-diag'),
    prescription: gv('con-rx'), remarks: gv('con-rem')
  })
  p.lastVisit = gv('con-date')
  closeModal()
  toast('Consultation record has been added to the patient\'s history.')
  renderPage()
}

window.openAddConsultationModal = openAddConsultationModal
window.doAddConsultation        = doAddConsultation

// ════════════════════════════════════════════════════════════════
//  ADD / EDIT USER MODAL
// ════════════════════════════════════════════════════════════════
function openAddUserModal() {
  showModal(`
    <div class="modal-header">
      <div class="modal-title">Add New User</div>
      <button class="modal-close" onclick="window.closeModal()">&times;</button>
    </div>
    <div class="modal-body">
      <div class="form-row-2">
        <div class="form-group"><label class="form-label">First Name <span class="req">*</span></label>
          <input id="nu-first" class="form-input" placeholder="First name"></div>
        <div class="form-group"><label class="form-label">Last Name <span class="req">*</span></label>
          <input id="nu-last" class="form-input" placeholder="Last name"></div>
      </div>
      <div class="form-group"><label class="form-label">Email <span class="req">*</span></label>
        <input id="nu-email" type="email" class="form-input" placeholder="email@canaoptical.com"></div>
      <div class="form-group"><label class="form-label">Contact Number</label>
        <input id="nu-contact" class="form-input" placeholder="09XXXXXXXXX"></div>
      <div class="form-group"><label class="form-label">Role <span class="req">*</span></label>
        <select id="nu-role" class="form-select" onchange="window.onAddUserRoleChange(this.value)">
          <option>Admin</option><option>Staff</option><option>Doctor</option><option>Patient</option>
        </select></div>

      <!-- Doctor-specific fields -->
      <div id="nu-doctor-fields" style="display:none">
        <div class="form-row-2">
          <div class="form-group"><label class="form-label">Specialization</label>
            <input id="nu-specialization" class="form-input" placeholder="e.g. Optometrist" value="Optometrist"></div>
          <div class="form-group"><label class="form-label">PRC License No.</label>
            <input id="nu-prc" class="form-input" placeholder="PRC-XXXXX"></div>
        </div>
        <div class="form-group"><label class="form-label">PTR No.</label>
          <input id="nu-ptr" class="form-input" placeholder="PTR-XXXXX"></div>
      </div>

      <!-- Patient-specific fields -->
      <div id="nu-patient-fields" style="display:none">
        <div class="form-row-2">
          <div class="form-group"><label class="form-label">Date of Birth</label>
            <input type="date" id="nu-dob" class="form-input"></div>
          <div class="form-group"><label class="form-label">Gender</label>
            <select id="nu-gender" class="form-select">
              <option value="">Select gender</option>
              <option>Male</option><option>Female</option><option>Other</option>
            </select></div>
        </div>
        <div class="form-group"><label class="form-label">Address</label>
          <input id="nu-address" class="form-input" placeholder="Street, Barangay, City, Province"></div>
        <div class="form-row-2">
          <div class="form-group"><label class="form-label">Blood Type</label>
            <select id="nu-blood" class="form-select">
              <option value="">Unknown</option>
              <option>A+</option><option>A-</option><option>B+</option><option>B-</option>
              <option>AB+</option><option>AB-</option><option>O+</option><option>O-</option>
            </select></div>
          <div class="form-group"><label class="form-label">Occupation</label>
            <input id="nu-occupation" class="form-input" placeholder="e.g. Teacher, Engineer"></div>
        </div>
      </div>

      <div class="form-group"><label class="form-label">Temporary Password <span class="req">*</span></label>
        <input id="nu-pass" type="password" class="form-input" placeholder="Minimum 8 characters"></div>
    </div>
    <div class="modal-footer">
      <button class="btn-secondary" onclick="window.closeModal()">Cancel</button>
      <button class="btn-primary" onclick="window.doAddUser()">Create Account</button>
    </div>`, 'modal-lg')
}

function onAddUserRoleChange(role) {
  const docFields = document.getElementById('nu-doctor-fields')
  const patFields = document.getElementById('nu-patient-fields')
  if (docFields) docFields.style.display = role === 'Doctor'  ? '' : 'none'
  if (patFields) patFields.style.display = role === 'Patient' ? '' : 'none'
}
window.onAddUserRoleChange = onAddUserRoleChange

function doAddUser() {
  const gv    = id => (document.getElementById(id)||{}).value?.trim() || ''
  const first   = gv('nu-first')
  const last    = gv('nu-last')
  const email   = gv('nu-email')
  const contact = gv('nu-contact')
  const role    = gv('nu-role') || 'Admin'
  const pass    = gv('nu-pass')

  if (!first || !last || !email || !pass) { toast('Please fill in all required fields.', 'error'); return }

  const name = `${first} ${last}`
  const base = { name, firstName: first, lastName: last, email, contact, password: pass, status: 'active' }

  if (role === 'Staff')  { base.id = 'S' + Date.now(); staff.push(base) }
  if (role === 'Admin')  { base.id = 'ADM' + Date.now(); admins.push(base) }
  if (role === 'Doctor') {
    base.id             = 'D' + Date.now()
    base.specialization = gv('nu-specialization') || 'Optometrist'
    base.prc            = gv('nu-prc')
    base.ptr            = gv('nu-ptr')
    base.available      = true
    base.days           = []
    base.availableDays  = []
    base.hours          = '8:00 AM – 5:00 PM'
    doctors.push(base)
  }
  if (role === 'Patient') {
    base.id = 'P' + String(patients.length+1).padStart(3,'0')
    const dobVal = gv('nu-dob')
    base.dob    = dobVal
    base.gender = gv('nu-gender')
    base.age    = dobVal ? (new Date().getFullYear() - new Date(dobVal).getFullYear()) : 0
    base.address      = gv('nu-address')
    base.bloodType    = gv('nu-blood') || 'Unknown'
    base.occupation   = gv('nu-occupation')
    base.registeredDate = new Date().toISOString().split('T')[0]
    base.lastVisit    = '—'
    base.qrData       = `OPTICANA-${base.id}-${first.toUpperCase()}${last.toUpperCase()}`
    base.prescriptions = []; base.consultations = []; base.examinations = []
    patients.push(base)
  }

  addActivityLog({ id:'L'+Date.now(), user: state.user.name, role: state.role,
    action: `Created new ${role} account: ${name}`,
    timestamp: new Date().toISOString().replace('T',' ').slice(0,19), type:'user' })

  closeModal()
  toast(`Account created successfully. ${name} can now log in with their credentials.`)
  renderPage()
}

function editUserModal(id, role) {
  const pool = { Admin: admins, Staff: staff, Doctor: doctors, Patient: patients }
  const u = (pool[role] || []).find(u => u.id === id)
  if (!u) return
  showModal(`
    <div class="modal-header">
      <div class="modal-title">Edit User — ${u.name}</div>
      <button class="modal-close" onclick="window.closeModal()">&times;</button>
    </div>
    <div class="modal-body">
      <div class="form-row-2">
        <div class="form-group"><label class="form-label">First Name</label>
          <input id="eu-first" class="form-input" value="${u.firstName || ''}"></div>
        <div class="form-group"><label class="form-label">Last Name</label>
          <input id="eu-last" class="form-input" value="${u.lastName || ''}"></div>
      </div>
      <div class="form-group"><label class="form-label">Email</label>
        <input id="eu-email" type="email" class="form-input" value="${u.email || ''}"></div>
      <div class="form-group"><label class="form-label">Contact</label>
        <input id="eu-contact" class="form-input" value="${u.contact || ''}"></div>
      <div class="form-group"><label class="form-label">Status</label>
        <select id="eu-status" class="form-select">
          <option${u.status==='active'?' selected':''}>active</option>
          <option${u.status==='inactive'?' selected':''}>inactive</option>
        </select></div>

      <!-- Reset Password (collapsible) -->
      <div style="margin-top:4px;border-top:1px solid #F3F4F6;padding-top:14px">
        <button type="button" onclick="window._togglePwReset()"
                style="display:flex;align-items:center;gap:6px;background:none;border:none;color:#6B7280;font-size:.82rem;font-weight:600;cursor:pointer;padding:0;font-family:inherit">
          ${ic('lock','icon-sm')}
          Reset Password
          <span id="eu-pw-chevron" style="font-size:.7rem;margin-left:2px">▸</span>
        </button>
        <div id="eu-pw-section" style="display:none;margin-top:12px">
          <div class="form-row-2">
            <div class="form-group"><label class="form-label">New Password</label>
              <input id="eu-new-pw" type="password" class="form-input" placeholder="Min. 8 characters" autocomplete="new-password"></div>
            <div class="form-group"><label class="form-label">Confirm Password</label>
              <input id="eu-confirm-pw" type="password" class="form-input" placeholder="Re-enter password" autocomplete="new-password"></div>
          </div>
          <p style="font-size:.74rem;color:#9CA3AF;margin:2px 0 0">Leave blank to keep the existing password.</p>
        </div>
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn-secondary" onclick="window.closeModal()">Cancel</button>
      <button class="btn-primary" onclick="window.doEditUser('${id}','${role}')">Save Changes</button>
    </div>`)
}


function _togglePwReset() {
  const sec = document.getElementById('eu-pw-section')
  const ch  = document.getElementById('eu-pw-chevron')
  if (!sec) return
  const open = sec.style.display === 'none'
  sec.style.display = open ? '' : 'none'
  if (ch) ch.textContent = open ? '▾' : '▸'
}
window._togglePwReset = _togglePwReset

async function doEditUser(id, role) {
  const pool = { Admin: admins, Staff: staff, Doctor: doctors, Patient: patients }
  const u = (pool[role] || []).find(u => u.id === id)
  if (!u) return

  const fn      = (document.getElementById('eu-first')   || {}).value?.trim() || u.firstName
  const ln      = (document.getElementById('eu-last')    || {}).value?.trim() || u.lastName
  const email   = (document.getElementById('eu-email')   || {}).value?.trim() || u.email
  const contact = (document.getElementById('eu-contact') || {}).value?.trim() || u.contact
  const status  = (document.getElementById('eu-status')  || {}).value         || u.status
  const newPw   = document.getElementById('eu-new-pw')?.value  || ''
  const cfPw    = document.getElementById('eu-confirm-pw')?.value || ''

  if (newPw) {
    if (newPw.length < 8) { toast('Password must be at least 8 characters.', 'error'); return }
    if (newPw !== cfPw)   { toast('Passwords do not match.', 'error'); return }
  }

  // Persist profile changes to database
  try {
    const r = await fetch('api/admin/update_user.php', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ profileId: id, role, firstName: fn, lastName: ln, email, contact, status })
    })
    const d = await r.json()
    if (!d.success) { toast(d.message || 'Failed to save changes.', 'error'); return }
  } catch (_) { toast('Network error — changes not saved.', 'error'); return }

  // Reset password via backend if provided
  if (newPw) {
    try {
      const r = await fetch('api/users/reset_password.php', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profileId: id, role, newPassword: newPw })
      })
      const d = await r.json()
      if (!d.success) { toast(d.message || 'Failed to reset password.', 'error'); return }
    } catch (_) { toast('Network error — password not reset.', 'error'); return }
  }

  // Update in-memory array so the table reflects new values immediately
  const prefix = role === 'Doctor' ? 'Dr. ' : ''
  u.firstName = fn
  u.lastName  = ln
  u.name      = prefix + fn + ' ' + ln
  u.email     = email
  u.contact   = contact
  u.status    = status

  closeModal()
  toast(newPw ? 'User updated and password reset successfully.' : 'User updated successfully.', 'success')
  renderPage()
}

function archiveUserConfirm(id, name) {
  showModal(`
    <div class="modal-header">
      <div class="modal-title" style="display:flex;align-items:center;gap:10px">
        <div style="width:32px;height:32px;border-radius:50%;background:#fef3c7;display:flex;align-items:center;justify-content:center;flex-shrink:0;color:#d97706">
          ${icon('archive','icon-sm')}
        </div>
        Archive Account: ${name}
      </div>
      <button class="modal-close" onclick="window.closeModal()">&times;</button>
    </div>
    <div class="modal-body">
      <p style="font-size:.88rem;color:#6b7280;margin-bottom:16px">Are you sure you want to archive this account? It will be removed from active lists but the data will be preserved.</p>
      <div class="form-group" style="margin:0">
        <label class="form-label">Reason for Archiving <span class="req">*</span></label>
        <textarea id="archive-reason-user" class="form-textarea" style="border-radius:8px;min-height:80px"
                  placeholder="Please provide a reason for archiving…"
                  oninput="document.getElementById('do-archive-user-btn').disabled=!this.value.trim()"></textarea>
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn-secondary" onclick="window.closeModal()">Cancel</button>
      <button id="do-archive-user-btn"
              style="display:inline-flex;align-items:center;gap:6px;white-space:nowrap;background:#d97706;color:white;border:none;border-radius:8px;padding:9px 20px;font-family:'Poppins',sans-serif;font-size:.85rem;font-weight:600;cursor:pointer;opacity:.5;pointer-events:none"
              disabled
              onclick="window.doArchiveUser('${id}','${name}')">
        ${icon('archive','icon-sm')}<span>Archive</span>
      </button>
    </div>`)
  // enable button once reason typed (re-wire after modal renders)
  setTimeout(() => {
    const ta = document.getElementById('archive-reason-user')
    const btn = document.getElementById('do-archive-user-btn')
    if (ta && btn) ta.addEventListener('input', () => {
      const ok = ta.value.trim().length > 0
      btn.disabled = !ok
      btn.style.opacity = ok ? '1' : '.5'
      btn.style.pointerEvents = ok ? 'auto' : 'none'
    })
  }, 50)
}

async function doArchiveUser(id, name) {
  const reason = (document.getElementById('archive-reason-user') || {}).value?.trim() || 'No reason provided'
  const pools = [
    { arr: patients, role: 'Patient' }, { arr: doctors, role: 'Doctor' },
    { arr: staff,    role: 'Staff'   }, { arr: admins,  role: 'Admin'  }
  ]
  let role = null
  pools.forEach(p => { if (p.arr.find(u => u.id === id)) role = p.role })
  if (!role) return

  try {
    const r = await fetch('api/archive/create.php', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ profileId: id, role, type: 'Account', name, reason, archivedBy: state.user.name })
    })
    const d = await r.json()
    if (!d.success) { toast(d.message || 'Failed to archive account.', 'error'); return }

    const arr = pools.find(p => p.role === role).arr
    const idx = arr.findIndex(u => u.id === id)
    if (idx !== -1) arr.splice(idx, 1)
    archivedRecords.push(d.record)
  } catch (_) { toast('Network error — account not archived.', 'error'); return }

  addActivityLog({ id:'L'+Date.now(), user: state.user.name, role: state.role,
    action: `Archived account: ${name} (${id}) — Reason: ${reason}`,
    timestamp: new Date().toISOString().replace('T',' ').slice(0,19), type:'user' })
  closeModal()
  toast(`Account archived successfully. It can be restored from Settings > Archives.`, 'success')
  renderPage()
}

window.openAddUserModal  = openAddUserModal
window.doAddUser         = doAddUser
window.editUserModal     = editUserModal
window.doEditUser        = doEditUser
window.archiveUserConfirm = archiveUserConfirm
window.doArchiveUser      = doArchiveUser

// ════════════════════════════════════════════════════════════════
//  ADD / EDIT PATIENT MODAL
// ════════════════════════════════════════════════════════════════
function openAddPatientModal() {
  showModal(`
    <div class="modal-header">
      <div class="modal-title">Register New Patient</div>
      <button class="modal-close" onclick="window.closeModal()">&times;</button>
    </div>
    <div class="modal-body" style="display:flex;flex-direction:column;gap:14px">
      <div class="form-row-2">
        <div class="form-group"><label class="form-label">First Name <span class="req">*</span></label>
          <input id="ap-first" class="form-input" placeholder="Juan"></div>
        <div class="form-group"><label class="form-label">Last Name <span class="req">*</span></label>
          <input id="ap-last" class="form-input" placeholder="Dela Cruz"></div>
      </div>
      <div class="form-row-2">
        <div class="form-group"><label class="form-label">Email</label>
          <input type="email" id="ap-email" class="form-input" placeholder="juan@email.com"></div>
        <div class="form-group"><label class="form-label">Contact Number</label>
          <input id="ap-contact" class="form-input" placeholder="09XXXXXXXXX"></div>
      </div>
      <div class="form-row-2">
        <div class="form-group"><label class="form-label">Date of Birth <span class="req">*</span></label>
          <input type="date" id="ap-dob" class="form-input"></div>
        <div class="form-group"><label class="form-label">Gender <span class="req">*</span></label>
          <select id="ap-gender" class="form-select">
            <option value="">Select gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select></div>
      </div>
      <div class="form-row-2">
        <div class="form-group"><label class="form-label">Blood Type</label>
          <select id="ap-blood" class="form-select">
            <option value="">Unknown</option>
            <option value="A+">A+</option><option value="A-">A-</option>
            <option value="B+">B+</option><option value="B-">B-</option>
            <option value="AB+">AB+</option><option value="AB-">AB-</option>
            <option value="O+">O+</option><option value="O-">O-</option>
          </select></div>
        <div class="form-group"><label class="form-label">Occupation</label>
          <input id="ap-occupation" class="form-input" placeholder="e.g. Teacher, Engineer, Student"></div>
      </div>
      <div class="form-group"><label class="form-label">Address</label>
        <input id="ap-address" class="form-input" placeholder="Street, City, Province"></div>
      <div class="form-group"><label class="form-label">Medical History</label>
        <textarea id="ap-medical" class="form-textarea" rows="2"
          placeholder="Known conditions, allergies, medications…"></textarea></div>
      <div class="form-group"><label class="form-label">Optical History</label>
        <textarea id="ap-optical" class="form-textarea" rows="2"
          placeholder="Prior eye conditions, prescriptions, surgeries…"></textarea></div>
    </div>
    <div class="modal-footer">
      <button class="btn-secondary" onclick="window.closeModal()">Cancel</button>
      <button id="ap-save-btn" class="btn-primary" onclick="window.doAddPatient()">
        ${icon('plus','icon-sm')} Register Patient &amp; Generate QR
      </button>
    </div>`, 'modal-lg')
}

async function doAddPatient() {
  const gv    = id => (document.getElementById(id)||{}).value?.trim() || ''
  const first = gv('ap-first'), last = gv('ap-last')
  if (!first || !last) { toast('First and last name are required.', 'error'); return }

  const btn = document.getElementById('ap-save-btn')
  if (btn) { btn.disabled = true; btn.innerHTML = `${icon('loader','icon-sm')} Registering…` }

  try {
    const r = await fetch('api/patients/create.php', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        firstName:      first,
        lastName:       last,
        gender:         gv('ap-gender'),
        dob:            gv('ap-dob'),
        contact:        gv('ap-contact'),
        email:          gv('ap-email'),
        address:        gv('ap-address'),
        occupation:     gv('ap-occupation'),
        medicalHistory: gv('ap-medical'),
        opticalHistory: gv('ap-optical'),
        bloodType:      gv('ap-blood') || 'Unknown',
      })
    })
    const d = await r.json()
    if (!d.success) { toast(d.message || 'Registration failed.', 'error'); return }

    const p = d.patient
    patients.push({ ...p, password: '', lastVisit: '—' })
    addActivityLog({ id:'L'+Date.now(), user: state.user.name, role: state.role,
      action: `Registered new patient: ${p.name} (${p.id})`,
      timestamp: new Date().toISOString().replace('T',' ').slice(0,19), type:'patient' })
    closeModal()
    renderPage()
    setTimeout(() => window._showRegistrationQRModal(p, d.tempPassword || null), 150)
  } catch (_) {
    toast('Network error — please try again.', 'error')
  } finally {
    if (btn) { btn.disabled = false; btn.innerHTML = `${icon('plus','icon-sm')} Register Patient & Generate QR` }
  }
}

function openEditPatientModal(patientId) {
  const p = patients.find(p => p.id === patientId)
  if (!p) return
  showModal(`
    <div class="modal-header">
      <div class="modal-title">Edit Patient — ${p.name}</div>
      <button class="modal-close" onclick="window.closeModal()">&times;</button>
    </div>
    <div class="modal-body">
      <div class="form-row-2">
        <div class="form-group"><label class="form-label">First Name</label>
          <input id="ep-first" class="form-input" value="${p.firstName}"></div>
        <div class="form-group"><label class="form-label">Last Name</label>
          <input id="ep-last" class="form-input" value="${p.lastName}"></div>
      </div>
      <div class="form-row-2">
        <div class="form-group"><label class="form-label">Date of Birth</label>
          <input type="date" id="ep-dob" class="form-input" value="${p.dob || ''}"></div>
        <div class="form-group"><label class="form-label">Gender</label>
          <select id="ep-gender" class="form-select">
            ${['Male','Female','Other'].map(g=>`<option${g===p.gender?' selected':''}>${g}</option>`).join('')}
          </select></div>
      </div>
      <div class="form-group"><label class="form-label">Contact</label>
        <input id="ep-contact" class="form-input" value="${p.contact}"></div>
      <div class="form-group"><label class="form-label">Email</label>
        <input type="email" id="ep-email" class="form-input" value="${p.email}"
               ${!p.email ? 'disabled title="This patient has no login account — email can\'t be set here."' : ''}></div>
      <div class="form-group"><label class="form-label">Address</label>
        <input id="ep-address" class="form-input" value="${p.address}"></div>
      <div class="form-group" style="margin-bottom:0"><label class="form-label">Blood Type</label>
        <select id="ep-blood" class="form-select">
          ${['Unknown','A+','A-','B+','B-','AB+','AB-','O+','O-'].map(b=>`<option${b===p.bloodType?' selected':''}>${b}</option>`).join('')}
        </select></div>
    </div>
    <div class="modal-footer">
      <button class="btn-secondary" onclick="window.closeModal()">Cancel</button>
      <button class="btn-primary" onclick="window.doEditPatient('${patientId}')">Save Changes</button>
    </div>`)
}

async function doEditPatient(patientId) {
  const p  = patients.find(p => p.id === patientId)
  const gv = id => (document.getElementById(id)||{}).value?.trim() || ''
  if (!p) return

  const firstName = gv('ep-first')
  const lastName  = gv('ep-last')
  if (!firstName || !lastName) { toast('First and last name are required.', 'error'); return }

  const payload = {
    id: patientId, firstName, lastName,
    gender: gv('ep-gender'), dob: gv('ep-dob'),
    contact: gv('ep-contact'), email: gv('ep-email'),
    address: gv('ep-address'), bloodType: gv('ep-blood')
  }

  try {
    const r = await fetch('api/patients/admin_update.php', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    const d = await r.json()
    if (!d.success) { toast(d.message || 'Could not update patient.', 'error'); return }
  } catch (_) {
    toast('Network error — could not update patient.', 'error')
    return
  }

  p.firstName = firstName
  p.lastName  = lastName
  p.name      = `${firstName} ${lastName}`
  if (payload.gender) p.gender = payload.gender
  if (payload.dob)    p.dob    = payload.dob
  p.contact   = payload.contact
  if (payload.email && p.email) p.email = payload.email
  p.address   = payload.address
  p.bloodType = payload.bloodType

  closeModal(); toast('Patient info updated.'); renderPage()
}

window.openAddPatientModal  = openAddPatientModal
window.doAddPatient         = doAddPatient
window.openEditPatientModal = openEditPatientModal
window.doEditPatient        = doEditPatient

// ════════════════════════════════════════════════════════════════
//  DELETE PATIENT
// ════════════════════════════════════════════════════════════════
function confirmArchivePatient(id) {
  const p = patients.find(p => p.id === id)
  if (!p) return
  showModal(`
    <div class="modal-header">
      <div class="modal-title" style="display:flex;align-items:center;gap:10px">
        <div style="width:32px;height:32px;border-radius:50%;background:#fef3c7;display:flex;align-items:center;justify-content:center;flex-shrink:0;color:#d97706">
          ${icon('archive','icon-sm')}
        </div>
        Archive Patient: ${p.name}
      </div>
      <button class="modal-close" onclick="window.closeModal()">&times;</button>
    </div>
    <div class="modal-body">
      <div style="display:flex;align-items:center;gap:12px;padding:12px;background:#F9FAFB;border-radius:8px;margin-bottom:16px">
        <div style="width:42px;height:42px;border-radius:50%;background:#E8760A;display:flex;align-items:center;justify-content:center;color:#fff;font-weight:700;flex-shrink:0">
          ${p.name.split(' ').map(n=>n[0]).slice(0,2).join('')}
        </div>
        <div>
          <div style="font-weight:700">${p.name}</div>
          <div style="font-size:.78rem;color:#6B7280">${p.id} &bull; ${p.consultations.length} consultation${p.consultations.length!==1?'s':''} &bull; ${p.examinations.length} exam${p.examinations.length!==1?'s':''}</div>
        </div>
      </div>
      <p style="font-size:.88rem;color:#6b7280;margin-bottom:16px">Are you sure you want to archive this patient? They will be removed from active lists but the data will be preserved.</p>
      <div class="form-group" style="margin:0">
        <label class="form-label">Reason for Archiving <span class="req">*</span></label>
        <textarea id="archive-reason-patient" class="form-textarea" style="border-radius:8px;min-height:80px"
                  placeholder="Please provide a reason for archiving…"></textarea>
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn-secondary" onclick="window.closeModal()">Cancel</button>
      <button id="do-archive-patient-btn"
              style="display:inline-flex;align-items:center;gap:6px;white-space:nowrap;background:#d97706;color:white;border:none;border-radius:8px;padding:9px 20px;font-family:'Poppins',sans-serif;font-size:.85rem;font-weight:600;cursor:pointer;opacity:.5;pointer-events:none"
              disabled
              onclick="window.doArchivePatient('${id}')">
        ${icon('archive','icon-sm')}<span>Archive</span>
      </button>
    </div>`)
  setTimeout(() => {
    const ta = document.getElementById('archive-reason-patient')
    const btn = document.getElementById('do-archive-patient-btn')
    if (ta && btn) ta.addEventListener('input', () => {
      const ok = ta.value.trim().length > 0
      btn.disabled = !ok
      btn.style.opacity = ok ? '1' : '.5'
      btn.style.pointerEvents = ok ? 'auto' : 'none'
    })
  }, 50)
}

async function doArchivePatient(id) {
  const idx = patients.findIndex(p => p.id === id)
  if (idx === -1) return
  const p = patients[idx]
  const reason = (document.getElementById('archive-reason-patient') || {}).value?.trim() || 'No reason provided'

  try {
    const r = await fetch('api/archive/create.php', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ profileId: id, role: 'Patient', type: 'Patient', name: p.name, reason, archivedBy: state.user.name })
    })
    const d = await r.json()
    if (!d.success) { toast(d.message || 'Failed to archive patient.', 'error'); return }
    patients.splice(idx, 1)
    archivedRecords.push(d.record)
  } catch (_) { toast('Network error — patient not archived.', 'error'); return }

  addActivityLog({ id:'L'+Date.now(), user: state.user.name, role: state.role,
    action: `Archived patient: ${p.name} (${id}) — Reason: ${reason}`,
    timestamp: new Date().toISOString().replace('T',' ').slice(0,19), type:'patient' })
  closeModal()
  toast(`Patient archived successfully. The record can be restored from Settings > Archives.`, 'success')
  renderPage()
}

window.confirmArchivePatient = confirmArchivePatient
window.doArchivePatient      = doArchivePatient

// ════════════════════════════════════════════════════════════════
//  CONTACT MESSAGES — view / read state / delete
// ════════════════════════════════════════════════════════════════
function openContactMessageModal(id) {
  const m = contactMessages.find(m => m.id === id)
  if (!m) return

  // Mutate (and persist) the read state BEFORE building the modal markup —
  // otherwise the toggle button below renders against the pre-open state
  // and ends up showing "Mark as read" right after the message was already
  // silently marked read, so clicking it actually marks it unread instead.
  if (!m.isRead) _setContactMessageRead(id, true, true)

  const dt = new Date(m.createdAt)
  const fullDate = isNaN(dt) ? m.createdAt : dt.toLocaleString('en-PH', { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: '2-digit' })

  const replyHtml = m.reply ? (() => {
    const rdt = new Date(m.repliedAt)
    const rDate = isNaN(rdt) ? m.repliedAt : rdt.toLocaleString('en-PH', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })
    return `
      <div style="margin-top:14px">
        <p style="margin:0 0 6px;font-size:.72rem;font-weight:700;letter-spacing:.04em;text-transform:uppercase;color:#9CA3AF">
          Replied by ${m.repliedBy || 'Clinic Staff'} &bull; ${rDate}
        </p>
        <div style="background:#FFF8F0;border:1.5px solid #FFD9A8;border-radius:10px;padding:16px;font-size:.88rem;color:#1C1C1C;line-height:1.6;white-space:pre-wrap">${m.reply}</div>
      </div>`
  })() : ''

  showModal(`
    <div class="modal-header">
      <div class="modal-title" style="display:flex;align-items:center;gap:10px">
        ${avatar(m.name, 'patient-avatar')}
        <div>
          <div>${m.name}</div>
          <div style="font-size:.72rem;font-weight:500;color:#9CA3AF">${m.email}</div>
        </div>
      </div>
      <button class="modal-close" onclick="window.closeModal()">&times;</button>
    </div>
    <div class="modal-body">
      <div style="display:flex;gap:16px;flex-wrap:wrap;margin-bottom:14px;font-size:.78rem;color:#6B7280">
        ${m.service ? `<span><strong style="color:#374151">Service:</strong> ${m.service}</span>` : ''}
        <span><strong style="color:#374151">Received:</strong> ${fullDate}</span>
      </div>
      <div style="background:#F9FAFB;border:1px solid #E5E7EB;border-radius:10px;padding:16px;font-size:.88rem;color:#374151;line-height:1.6;white-space:pre-wrap">${m.message}</div>
      ${replyHtml}
    </div>
    <div class="modal-footer" style="justify-content:space-between;flex-wrap:wrap;gap:8px">
      <div style="display:flex;gap:8px">
        <button type="button" class="btn-ghost" style="display:inline-flex;align-items:center;gap:6px"
                onclick="window.toggleContactMessageRead(${m.id})">
          ${icon(m.isRead ? 'mail-open' : 'check-circle', 'icon-sm')} ${m.isRead ? 'Mark as Unread' : 'Mark as Read'}
        </button>
        <button type="button" class="btn-ghost" style="display:inline-flex;align-items:center;gap:6px"
                onclick="window.toggleContactMessageArchive(${m.id})">
          ${icon('archive', 'icon-sm')} ${m.archivedAt ? 'Unarchive' : 'Archive'}
        </button>
      </div>
      <div style="display:flex;gap:8px">
        <button class="btn-secondary" onclick="window.closeModal()">Close</button>
        <button class="btn-primary" onclick="window.openContactReplyModal(${m.id})">
          ${icon('mail', 'icon-sm')} ${m.reply ? 'Edit Reply' : 'Reply'}
        </button>
      </div>
    </div>`)
}
window.openContactMessageModal = openContactMessageModal

async function _setContactMessageRead(id, read, rerender = true) {
  const m = contactMessages.find(m => m.id === id)
  if (!m) return
  m.isRead = read
  window._contactUnreadCount = contactMessages.filter(x => !x.isRead).length
  if (window._updateSidebarBadges) window._updateSidebarBadges()
  if (rerender) renderPage()
  try {
    await fetch('api/contact/mark_read.php', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, read })
    })
  } catch (_) { /* local state already updated; will reconcile on next sync */ }
}

function toggleContactMessageRead(id) {
  const m = contactMessages.find(m => m.id === id)
  if (!m) return
  const newRead = !m.isRead
  _setContactMessageRead(id, newRead, true)
  if (newRead) {
    // Rebuild the modal in place so the toggle button reflects the new state
    openContactMessageModal(id)
  } else {
    // Marking unread while viewing is a bit contradictory — return to the inbox
    closeModal()
  }
}
window.toggleContactMessageRead = toggleContactMessageRead

// ── Archive ──────────────────────────────────────────────────────
async function toggleContactMessageArchive(id) {
  const m = contactMessages.find(m => m.id === id)
  if (!m) return
  const archive = !m.archivedAt
  m.archivedAt = archive ? new Date().toISOString() : null
  closeModal()
  renderPage()
  try {
    await fetch('api/contact/archive.php', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, archived: archive })
    })
    toast(archive ? 'Message archived.' : 'Message moved back to inbox.', 'success')
  } catch (_) {
    toast('Network error — change may not have saved.', 'error')
  }
}
window.toggleContactMessageArchive = toggleContactMessageArchive

// ── Reply ────────────────────────────────────────────────────────
function openContactReplyModal(id) {
  const m = contactMessages.find(m => m.id === id)
  if (!m) return

  showModal(`
    <div class="modal-header">
      <div class="modal-title">Reply to ${m.name}</div>
      <button class="modal-close" onclick="window.closeModal()">&times;</button>
    </div>
    <div class="modal-body">
      <p style="margin:0 0 10px;font-size:.78rem;color:#9CA3AF">Sent to <strong style="color:#374151">${m.email}</strong> by email.</p>
      <div style="border-left:3px solid #e5e7eb;padding:2px 0 2px 14px;margin-bottom:14px;font-size:.8rem;color:#6B7280;line-height:1.55;max-height:90px;overflow:auto">${m.message}</div>
      <div class="form-group" style="margin:0">
        <label class="form-label">Your Reply <span class="req">*</span></label>
        <textarea id="cr-reply-text" class="form-textarea" style="border-radius:8px;min-height:120px"
                  placeholder="Type your reply…">${m.reply || ''}</textarea>
      </div>
      <div id="cr-reply-error" style="display:none;color:#DC2626;font-size:.78rem;margin-top:6px"></div>
    </div>
    <div class="modal-footer">
      <button class="btn-secondary" onclick="window.openContactMessageModal(${id})">Back</button>
      <button id="cr-send-btn" class="btn-primary" onclick="window.sendContactReply(${id})">
        ${icon('mail', 'icon-sm')} Send Reply
      </button>
    </div>`)

  setTimeout(() => { document.getElementById('cr-reply-text')?.focus() }, 50)
}
window.openContactReplyModal = openContactReplyModal

async function sendContactReply(id) {
  const m = contactMessages.find(m => m.id === id)
  if (!m) return

  const ta       = document.getElementById('cr-reply-text')
  const errBox   = document.getElementById('cr-reply-error')
  const sendBtn  = document.getElementById('cr-send-btn')
  const replyTxt = (ta?.value || '').trim()

  if (!replyTxt) {
    if (errBox) { errBox.textContent = 'Please write a reply before sending.'; errBox.style.display = 'block' }
    return
  }

  sendBtn.disabled = true
  sendBtn.innerHTML = `${icon('refresh-cw', 'icon-sm')} Sending…`

  try {
    const r = await fetch('api/contact/reply.php', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, reply: replyTxt })
    })
    const d = await r.json()
    if (!d.success) {
      sendBtn.disabled = false
      sendBtn.innerHTML = `${icon('mail', 'icon-sm')} Send Reply`
      if (errBox) { errBox.textContent = d.message || 'Failed to send reply.'; errBox.style.display = 'block' }
      return
    }
    m.reply     = replyTxt
    m.repliedAt = new Date().toISOString()
    m.repliedBy = state.user?.name || 'Clinic Staff'
    toast(d.emailSent ? 'Reply sent and emailed to the sender.' : 'Reply saved (email could not be sent).', 'success')
    openContactMessageModal(id)
    renderPage()
  } catch (_) {
    sendBtn.disabled = false
    sendBtn.innerHTML = `${icon('mail', 'icon-sm')} Send Reply`
    if (errBox) { errBox.textContent = 'Network error. Please try again.'; errBox.style.display = 'block' }
  }
}
window.sendContactReply = sendContactReply

async function markAllContactRead() {
  contactMessages.forEach(m => { m.isRead = true })
  window._contactUnreadCount = 0
  if (window._updateSidebarBadges) window._updateSidebarBadges()
  renderPage()
  try {
    await fetch('api/contact/mark_read.php', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ all: true })
    })
  } catch (_) {}
}
window.markAllContactRead = markAllContactRead

function confirmDeleteContactMessage(id) {
  const m = contactMessages.find(m => m.id === id)
  if (!m) return
  showModal(`
    <div class="modal-header">
      <div class="modal-title" style="display:flex;align-items:center;gap:10px">
        <div style="width:32px;height:32px;border-radius:50%;background:#fee2e2;display:flex;align-items:center;justify-content:center;flex-shrink:0;color:#DC2626">
          ${icon('trash-2','icon-sm')}
        </div>
        Delete Message
      </div>
      <button class="modal-close" onclick="window.closeModal()">&times;</button>
    </div>
    <div class="modal-body">
      <p style="font-size:.88rem;color:#374151">Delete the message from <strong>${m.name}</strong>? This cannot be undone.</p>
    </div>
    <div class="modal-footer">
      <button class="btn-secondary" onclick="window.closeModal()">Cancel</button>
      <button style="background:#DC2626;color:white;border:none;border-radius:8px;padding:9px 20px;font-family:'Poppins',sans-serif;font-size:.85rem;font-weight:600;cursor:pointer;display:inline-flex;align-items:center;gap:6px"
              onclick="window.doDeleteContactMessage(${id})">
        ${icon('trash-2','icon-sm')}<span>Delete</span>
      </button>
    </div>`)
}
window.confirmDeleteContactMessage = confirmDeleteContactMessage

async function doDeleteContactMessage(id) {
  const idx = contactMessages.findIndex(m => m.id === id)
  if (idx === -1) return
  try {
    const r = await fetch('api/contact/delete.php', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    })
    const d = await r.json()
    if (!d.success) { toast(d.message || 'Failed to delete message.', 'error'); return }
  } catch (_) { toast('Network error — message not deleted.', 'error'); return }

  contactMessages.splice(idx, 1)
  window._contactUnreadCount = contactMessages.filter(m => !m.isRead).length
  if (window._updateSidebarBadges) window._updateSidebarBadges()
  closeModal()
  toast('Message deleted.', 'success')
  renderPage()
}
window.doDeleteContactMessage = doDeleteContactMessage

// ════════════════════════════════════════════════════════════════
//  ARCHIVES — RESTORE + PERMANENT DELETE
// ════════════════════════════════════════════════════════════════
function confirmRestore(id, name) {
  const safeId   = String(id)
  const safeName = name.replace(/\\/g,'\\\\').replace(/'/g,"\\'")
  showModal(`
    <div class="modal-header">
      <div class="modal-title" style="display:flex;align-items:center;gap:10px">
        <div style="width:32px;height:32px;border-radius:50%;background:#d1fae5;display:flex;align-items:center;justify-content:center;flex-shrink:0;color:#16a34a">
          ${icon('rotate-ccw','icon-sm')}
        </div>
        Restore Record
      </div>
      <button class="modal-close" onclick="window.closeModal()">&times;</button>
    </div>
    <div class="modal-body">
      <p style="font-size:.88rem;color:#374151">Are you sure you want to restore <strong>${name}</strong> back to the active list?</p>
    </div>
    <div class="modal-footer">
      <button class="btn-secondary" onclick="window.closeModal()">Cancel</button>
      <button style="background:#16a34a;color:white;border:none;border-radius:8px;padding:9px 20px;font-family:'Poppins',sans-serif;font-size:.85rem;font-weight:600;cursor:pointer;display:inline-flex;align-items:center;gap:6px"
              onclick="window.doRestore('${safeId}','${safeName}')">
        ${icon('rotate-ccw','icon-sm')} Restore
      </button>
    </div>`)
}

async function doRestore(id, name) {
  const rec = archivedRecords.find(r => r.id === id)
  if (!rec) return

  if (rec.type === 'Account' || rec.type === 'Patient') {
    try {
      const r = await fetch('api/archive/restore.php', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      })
      const d = await r.json()
      if (!d.success) { toast(d.message || 'Failed to restore record.', 'error'); return }
    } catch (_) { toast('Network error — record not restored.', 'error'); return }
    // Re-fetch the affected pool(s) from the database so the restored row reappears
    if (window._syncPatients) window._syncPatients()
    if (window._syncDoctors)  window._syncDoctors()
    if (window._syncStaff)    window._syncStaff()
  } else if (rec.data) {
    const d = rec.data
    if (rec.type === 'Appointment') {
      if (!appointments.find(a => a.id === d.id)) appointments.push(d)
    } else if (rec.type === 'Service') {
      if (!CLINIC_SERVICES.find(s => s.id === d.id)) {
        try {
          const r = await fetch('api/services/update.php', {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: d.id, status: 'active' })
          })
          const sd = await r.json()
          if (sd.success) CLINIC_SERVICES.push(sd.service)
        } catch (_) {}
      }
    }
  }

  removeArchivedRecord(id)
  addActivityLog({ id: 'L' + Date.now(), user: state.user.name, role: state.role,
    action: `Restored archived record: ${name}`,
    timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19), type: 'settings' })
  closeModal()
  toast('Record restored successfully. It is now visible in the active list.', 'success')
  renderPage()
}

function confirmPermDelete(id, name) {
  showModal(`
    <div class="modal-header">
      <div class="modal-title" style="display:flex;align-items:center;gap:10px">
        <div style="width:32px;height:32px;border-radius:50%;background:#fee2e2;display:flex;align-items:center;justify-content:center;flex-shrink:0;color:#dc2626">
          ${icon('alert-triangle','icon-sm')}
        </div>
        Permanently Delete Record
      </div>
      <button class="modal-close" onclick="window.closeModal()">&times;</button>
    </div>
    <div class="modal-body">
      <div style="background:#fef2f2;border:1px solid #fecaca;color:#991b1b;border-radius:8px;padding:12px;font-size:.85rem;margin-bottom:16px">
        This action cannot be undone. The record <strong>${name}</strong> will be permanently removed from the system.
      </div>
      <div class="form-group" style="margin:0">
        <label class="form-label">Type <strong>DELETE</strong> to confirm</label>
        <input id="perm-delete-confirm" class="form-input" placeholder="DELETE"
               oninput="var ok=this.value==='DELETE';var btn=document.getElementById('perm-delete-btn');btn.disabled=!ok;btn.style.opacity=ok?'1':'.45';btn.style.pointerEvents=ok?'auto':'none'">
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn-secondary" onclick="window.closeModal()">Cancel</button>
      <button id="perm-delete-btn"
              style="background:#dc2626;color:white;border:none;border-radius:8px;padding:9px 20px;font-family:'Poppins',sans-serif;font-size:.85rem;font-weight:600;cursor:pointer;opacity:.45;pointer-events:none;display:inline-flex;align-items:center;gap:6px"
              disabled
              onclick="window.doPermDelete('${id}','${name.replace(/'/g,"\\'")}')" >
        ${icon('trash','icon-sm')} Delete Forever
      </button>
    </div>`)
}

async function doPermDelete(id, name) {
  const rec = archivedRecords.find(r => r.id === id)

  if (rec && (rec.type === 'Account' || rec.type === 'Patient')) {
    try {
      const r = await fetch('api/archive/delete.php', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      })
      const d = await r.json()
      if (!d.success) { toast(d.message || 'Failed to permanently delete record.', 'error'); return }
    } catch (_) { toast('Network error — record not deleted.', 'error'); return }
  }

  removeArchivedRecord(id)
  addActivityLog({ id:'L'+Date.now(), user: state.user.name, role: state.role,
    action: `Permanently deleted archived record: ${name}`,
    timestamp: new Date().toISOString().replace('T',' ').slice(0,19), type:'settings' })
  closeModal()
  toast('Record permanently deleted.', 'error')
  renderPage()
}

window.confirmRestore    = confirmRestore
window.doRestore         = doRestore
window.confirmPermDelete = confirmPermDelete
window.doPermDelete      = doPermDelete

// ════════════════════════════════════════════════════════════════
//  ARCHIVES — VIEW DETAIL MODAL
// ════════════════════════════════════════════════════════════════
function viewArchivedRecord(id) {
  const r = archivedRecords.find(rec => rec.id === id)
  if (!r) return

  const typeColors = {
    Patient:     { bg: '#DBEAFE', color: '#1D4ED8' },
    Appointment: { bg: '#FEF3C7', color: '#D97706' },
    Account:     { bg: '#EDE9FE', color: '#5B21B6' },
    Examination: { bg: '#D1FAE5', color: '#065F46' },
    Service:     { bg: '#FCE7F3', color: '#9D174D' }
  }
  const tc = typeColors[r.type] || { bg: '#F3F4F6', color: '#374151' }
  const badge = `<span style="background:${tc.bg};color:${tc.color};font-size:.72rem;font-weight:700;padding:3px 12px;border-radius:20px">${r.type}</span>`

  function row(label, value) {
    if (!value) return ''
    return `<div style="display:flex;gap:12px;padding:10px 0;border-bottom:1px solid #F3F4F6">
      <div style="font-size:.78rem;color:#9CA3AF;width:110px;flex-shrink:0">${label}</div>
      <div style="font-size:.82rem;color:#1F2937;font-weight:500;flex:1">${value}</div>
    </div>`
  }

  let extraRows = ''
  if (r.data) {
    const d = r.data
    if (r.type === 'Patient') {
      extraRows += row('Gender', d.gender)
      extraRows += row('Date of Birth', d.dob)
      extraRows += row('Contact', d.contact)
      extraRows += row('Email', d.email)
      extraRows += row('Address', d.address)
    } else if (r.type === 'Account') {
      extraRows += row('Role', d.role)
      extraRows += row('Email', d.email)
      extraRows += row('Contact', d.contact)
      extraRows += row('Specialization', d.specialization)
    } else if (r.type === 'Appointment') {
      extraRows += row('Doctor', d.doctorName)
      extraRows += row('Patient', d.patientName)
      extraRows += row('Date', d.date)
      extraRows += row('Time', d.time)
      extraRows += row('Type', d.type)
      extraRows += row('Status', d.status)
    } else if (r.type === 'Service') {
      extraRows += row('Description', d.description)
      extraRows += row('Duration', d.duration ? `${d.duration} min` : null)
      extraRows += row('Status', d.status)
    }
  }

  showModal(`
    <div class="modal-header">
      <div class="modal-title">Archived Record</div>
      <button class="modal-close" onclick="window.closeModal()">&times;</button>
    </div>
    <div class="modal-body" style="padding:0 24px 8px">
      <div style="display:flex;align-items:center;gap:12px;padding:16px 0;border-bottom:1px solid #F3F4F6;margin-bottom:4px">
        <div style="width:44px;height:44px;border-radius:50%;background:${tc.bg};display:flex;align-items:center;justify-content:center;flex-shrink:0">
          ${icon('archive','icon-sm')}
        </div>
        <div>
          <div style="font-size:.95rem;font-weight:700;color:#1C1C1C">${r.name}</div>
          <div style="margin-top:4px;display:flex;gap:8px;align-items:center;flex-wrap:wrap">
            ${badge}
            <span style="font-size:.75rem;color:#9CA3AF">${r.refId}</span>
          </div>
        </div>
      </div>
      ${row('Archived By', r.archivedBy)}
      ${row('Date Archived', r.date)}
      ${row('Reason', r.reason)}
      ${extraRows}
    </div>
    <div class="modal-footer">
      <button class="btn-secondary" onclick="window.closeModal()">Close</button>
      <button style="background:#16a34a;color:white;border:none;border-radius:8px;padding:9px 20px;font-family:'Poppins',sans-serif;font-size:.85rem;font-weight:600;cursor:pointer;display:inline-flex;align-items:center;gap:6px"
              onclick="window.confirmRestore('${r.id}','${r.name.replace(/'/g, "\\'")}')">
        ${icon('rotate-ccw','icon-sm')} Restore
      </button>
    </div>`)
}
window.viewArchivedRecord = viewArchivedRecord

// ════════════════════════════════════════════════════════════════
//  SETTINGS — SAVE CLINIC INFO
// ════════════════════════════════════════════════════════════════
function saveClinicInfo() {
  const gv = id => (document.getElementById(id)?.value || '').trim()
  const name    = gv('ci-name')
  const phone   = gv('ci-phone')
  const address = gv('ci-address')
  const email   = gv('ci-email')
  const hours   = gv('ci-hours')

  if (!name)    { toast('Clinic name is required.', 'error'); return }
  if (!email)   { toast('Email address is required.', 'error'); return }

  clinicInfo.name    = name
  clinicInfo.phone   = phone
  clinicInfo.mobile  = phone
  clinicInfo.address = address
  clinicInfo.email   = email
  clinicInfo.hours   = hours

  fetch('api/clinic/settings.php', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, phone, address, email, hours })
  }).catch(() => {})

  addActivityLog({ id: 'L' + Date.now(), user: state.user.name, role: state.role,
    action: 'Updated clinic information',
    timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19), type: 'settings' })

  if (window.renderSidebar) renderSidebar()
  toast('Clinic information updated successfully.', 'success')
}
window.saveClinicInfo = saveClinicInfo

// ════════════════════════════════════════════════════════════════
//  SETTINGS — SAVE CONSULTATION SETTINGS
// ════════════════════════════════════════════════════════════════
function saveSchedulingRules() {
  const gv = id => (document.getElementById(id)?.value || '').trim()
  consultationSettings.defaultDuration         = gv('cs-duration')  || consultationSettings.defaultDuration
  consultationSettings.maxAdvanceBooking        = gv('cs-adv-max')   || consultationSettings.maxAdvanceBooking
  consultationSettings.minAdvanceBooking        = gv('cs-adv-min')   || consultationSettings.minAdvanceBooking
  consultationSettings.maxApptsPerDoctorPerDay  = parseInt(gv('cs-max-appt')) || consultationSettings.maxApptsPerDoctorPerDay

  fetch('api/clinic/settings.php', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      defaultDuration: consultationSettings.defaultDuration,
      maxAdvanceBooking: consultationSettings.maxAdvanceBooking,
      minAdvanceBooking: consultationSettings.minAdvanceBooking,
      maxApptsPerDoctorPerDay: consultationSettings.maxApptsPerDoctorPerDay
    })
  }).catch(() => {})

  addActivityLog({ id: 'L' + Date.now(), user: state.user.name, role: state.role,
    action: 'Updated scheduling rules',
    timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19), type: 'settings' })
  toast('Scheduling rules saved successfully.', 'success')
}
window.saveSchedulingRules = saveSchedulingRules

function saveOperatingHours() {
  const gv = id => (document.getElementById(id)?.value || '').trim()
  consultationSettings.morningStart   = gv('cs-am-start')    || consultationSettings.morningStart
  consultationSettings.morningEnd     = gv('cs-am-end')      || consultationSettings.morningEnd
  consultationSettings.afternoonStart = gv('cs-pm-start')    || consultationSettings.afternoonStart
  consultationSettings.afternoonEnd   = gv('cs-pm-end')      || consultationSettings.afternoonEnd
  consultationSettings.lunchBreak     = document.getElementById('cs-lunch-break')?.checked ?? consultationSettings.lunchBreak

  consultationSettings.clinicDays = Array.from(document.querySelectorAll('.cs-clinic-day')).filter(cb => cb.checked).map(cb => cb.value)

  fetch('api/clinic/settings.php', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      morningStart: consultationSettings.morningStart,
      morningEnd: consultationSettings.morningEnd,
      afternoonStart: consultationSettings.afternoonStart,
      afternoonEnd: consultationSettings.afternoonEnd,
      lunchBreak: consultationSettings.lunchBreak,
      clinicDays: consultationSettings.clinicDays
    })
  }).catch(() => {})

  addActivityLog({ id: 'L' + Date.now(), user: state.user.name, role: state.role,
    action: `Updated operating hours: ${consultationSettings.morningStart}–${consultationSettings.afternoonEnd}`,
    timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19), type: 'settings' })
  toast('Operating hours saved successfully.', 'success')
}
window.saveOperatingHours = saveOperatingHours

// ════════════════════════════════════════════════════════════════
//  SERVICES MANAGEMENT
// ════════════════════════════════════════════════════════════════
function _rebuildServicesTable() {
  const tbody = document.getElementById('services-tbody')
  if (!tbody) return
  function svcStatusBadge(s) {
    return s === 'active'
      ? `<span style="background:#D1FAE5;color:#065F46;font-size:.72rem;font-weight:600;padding:2px 10px;border-radius:20px">Active</span>`
      : `<span style="background:#F3F4F6;color:#6B7280;font-size:.72rem;font-weight:600;padding:2px 10px;border-radius:20px">Inactive</span>`
  }
  tbody.innerHTML = CLINIC_SERVICES.map((s, i) => `
    <tr data-search="${s.name.toLowerCase()} ${s.description.toLowerCase()}">
      <td style="color:#9CA3AF;font-size:.75rem">${i + 1}</td>
      <td><strong style="font-size:.83rem">${s.name}</strong></td>
      <td style="font-size:.78rem;color:#6B7280;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:0">${s.description}</td>
      <td style="font-size:.82rem">${s.duration} min</td>
      <td>${svcStatusBadge(s.status)}</td>
      <td>
        <div style="display:flex;gap:4px;align-items:center;flex-wrap:nowrap">
          <button class="btn-icon" title="Edit" onclick="window.editServiceModal(${s.id})">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="icon-sm"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          </button>
          <button class="btn-icon" title="Archive" style="color:#D97706;border-color:#FEF3C7"
                  onclick="window.archiveServiceConfirm(${s.id},'${s.name.replace(/'/g,"\\'")}')">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="icon-sm"><polyline points="21 8 21 21 3 21 3 8"/><rect x="1" y="3" width="22" height="5"/><line x1="10" y1="12" x2="14" y2="12"/></svg>
          </button>
        </div>
      </td>
    </tr>`).join('')
  const countEl = document.getElementById('svc-count')
  if (countEl) countEl.textContent = `${CLINIC_SERVICES.length} service${CLINIC_SERVICES.length !== 1 ? 's' : ''}`
  if (window.initPagination) window.initPagination('services-tbody')
}

async function addService() {
  const name     = (document.getElementById('svc-name')?.value     || '').trim()
  const desc     = (document.getElementById('svc-desc')?.value     || '').trim()
  const duration = parseInt(document.getElementById('svc-duration')?.value || '30', 10)
  const status   = document.getElementById('svc-status')?.value    || 'active'
  if (!name) { toast('Service name is required.', 'error'); return }
  try {
    const r = await fetch('api/services/create.php', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, description: desc, duration, status, icon: 'eye' })
    })
    const d = await r.json()
    if (!d.success) { toast(d.message || 'Could not add service.', 'error'); return }
    CLINIC_SERVICES.push(d.service)
  } catch (_) {
    toast('Network error — could not add service.', 'error')
    return
  }
  document.getElementById('svc-name').value     = ''
  document.getElementById('svc-desc').value     = ''
  document.getElementById('svc-duration').value = '30'
  document.getElementById('svc-status').value   = 'active'
  _rebuildServicesTable()
  toast('Service added successfully.', 'success')
}
window.addService = addService

function editServiceModal(id) {
  const svc = CLINIC_SERVICES.find(s => s.id === id)
  if (!svc) return
  showModal(`
    <div class="modal-header">
      <div class="modal-title">Edit Service</div>
      <button class="modal-close" onclick="window.closeModal()">&times;</button>
    </div>
    <div class="modal-body" style="display:flex;flex-direction:column;gap:14px">
      <div class="form-group">
        <label class="form-label">Service Name <span class="req">*</span></label>
        <input class="form-input" id="es-name" value="${svc.name.replace(/"/g,'&quot;')}">
      </div>
      <div class="form-group">
        <label class="form-label">Description</label>
        <input class="form-input" id="es-desc" value="${svc.description.replace(/"/g,'&quot;')}">
      </div>
      <div class="form-row-2">
        <div class="form-group" style="margin-bottom:0">
          <label class="form-label">Duration (minutes)</label>
          <input class="form-input" type="number" id="es-duration" value="${svc.duration}" min="5" max="240">
        </div>
        <div class="form-group" style="margin-bottom:0">
          <label class="form-label">Status</label>
          <select class="form-select" id="es-status">
            <option value="active"${svc.status==='active'?' selected':''}>Active</option>
            <option value="inactive"${svc.status==='inactive'?' selected':''}>Inactive</option>
          </select>
        </div>
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn-ghost" onclick="window.closeModal()">Cancel</button>
      <button class="btn-primary" onclick="window.doEditService(${id})">Save Changes</button>
    </div>
  `)
}
window.editServiceModal = editServiceModal

window.doEditService = async function(id) {
  const svc = CLINIC_SERVICES.find(s => s.id === id)
  if (!svc) return
  const name = (document.getElementById('es-name')?.value || '').trim()
  if (!name) { toast('Service name is required.', 'error'); return }
  const description = (document.getElementById('es-desc')?.value     || '').trim()
  const duration     = parseInt(document.getElementById('es-duration')?.value || svc.duration, 10)
  const status       = document.getElementById('es-status')?.value    || svc.status
  try {
    const r = await fetch('api/services/update.php', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, name, description, duration, status })
    })
    const d = await r.json()
    if (!d.success) { toast(d.message || 'Could not update service.', 'error'); return }
    Object.assign(svc, d.service)
  } catch (_) {
    toast('Network error — could not update service.', 'error')
    return
  }
  closeModal()
  _rebuildServicesTable()
  toast('Service updated successfully.', 'success')
}

function archiveServiceConfirm(id, name) {
  showModal(`
    <div class="modal-header">
      <div class="modal-title">Archive Service</div>
      <button class="modal-close" onclick="window.closeModal()">&times;</button>
    </div>
    <div class="modal-body">
      <p style="font-size:.9rem;color:#374151;margin-bottom:12px">
        Archive <strong>${name}</strong>? It will no longer appear in appointment type options.
      </p>
      <div class="form-group" style="margin-bottom:0">
        <label class="form-label">Reason <span class="req">*</span></label>
        <input class="form-input" id="svc-archive-reason" placeholder="Reason for archiving">
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn-ghost" onclick="window.closeModal()">Cancel</button>
      <button class="btn-warning" onclick="window.doArchiveService(${id})">Archive Service</button>
    </div>
  `)
}
window.archiveServiceConfirm = archiveServiceConfirm

window.doArchiveService = async function(id) {
  const reason = (document.getElementById('svc-archive-reason')?.value || '').trim()
  if (!reason) { toast('Please provide a reason.', 'error'); return }
  const idx = CLINIC_SERVICES.findIndex(s => s.id === id)
  if (idx === -1) return
  const svc = CLINIC_SERVICES[idx]
  try {
    const r = await fetch('api/services/update.php', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status: 'inactive' })
    })
    const d = await r.json()
    if (!d.success) { toast(d.message || 'Could not archive service.', 'error'); return }
  } catch (_) {
    toast('Network error — could not archive service.', 'error')
    return
  }
  CLINIC_SERVICES.splice(idx, 1)
  addArchivedRecord({ id: 'AR' + Date.now(), type: 'Service', name: svc.name, refId: 'SVC' + svc.id,
    archivedBy: state.user.name, reason, date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    data: { ...svc } })
  addActivityLog({ id: 'L' + Date.now(), user: state.user.name, role: state.role,
    action: `Archived service: ${svc.name} — Reason: ${reason}`,
    timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19), type: 'settings' })
  closeModal()
  _rebuildServicesTable()
  toast('Service archived. It can be restored from Settings > Archives.', 'success')
}

// ════════════════════════════════════════════════════════════════
//  PRINT PATIENT QR MODAL
// ════════════════════════════════════════════════════════════════
function showPatientQRModal(patientId) {
  const p = patients.find(p => p.id === patientId)
  if (!p) return
  const wid = 'pqr-modal-wrap'
  showModal(`
    <div class="modal-header">
      <div class="modal-title">Patient QR Code</div>
      <button class="modal-close" onclick="window.closeModal()">&times;</button>
    </div>
    <div class="modal-body" style="text-align:center">
      <div id="${wid}" style="display:inline-block;padding:20px;background:#fff;border:2px solid #E5E7EB;border-radius:12px;margin-bottom:14px">
        ${mockQRSvg(p.qrData, 180)}
      </div>
      <div style="font-size:.75rem;font-family:monospace;color:#9CA3AF;margin-bottom:4px;word-break:break-all">${p.qrData}</div>
      <div style="font-size:1rem;font-weight:700;color:#1C1C1C">${p.name}</div>
      <div style="font-size:.82rem;color:#9CA3AF">${p.id} &bull; ${p.gender} &bull; ${p.age} yrs</div>
    </div>
    <div class="modal-footer" style="gap:8px">
      <button class="btn-secondary" onclick="window.closeModal()">Close</button>
      <button class="btn-ghost" onclick="window.downloadQR('${wid}','${p.id}')">
        ${icon('download','icon-sm')} Download
      </button>
      <button class="btn-primary" onclick="window.printQR('${wid}','${p.name}','${p.id}','${p.qrData}')">
        ${icon('printer','icon-sm')} Print
      </button>
    </div>`)
}
window.showPatientQRModal = showPatientQRModal

// ════════════════════════════════════════════════════════════════
//  PATIENT VIEW TAB SWITCHING
// ════════════════════════════════════════════════════════════════
function switchPatientTab(tab) {
  document.querySelectorAll('.ptab-panel').forEach(p => p.style.display = 'none')
  document.querySelectorAll('.ptab-btn').forEach(b => b.classList.remove('active'))
  const panel = document.getElementById('ptab-' + tab)
  const btn   = document.querySelector(`.ptab-btn[data-tab="${tab}"]`)
  if (panel) panel.style.display = ''
  if (btn)   btn.classList.add('active')
}
window.switchPatientTab = switchPatientTab

// ════════════════════════════════════════════════════════════════
//  QR SCANNER MODAL (simulated)
// ════════════════════════════════════════════════════════════════
function openQRScanner() {
  showModal(`
    <div class="modal-header">
      <div class="modal-title">Scan Patient QR Code</div>
      <button class="modal-close" onclick="window.closeModal()">&times;</button>
    </div>
    <div class="modal-body" style="text-align:center">
      <div id="qrm-area" style="border:2px dashed #E5E7EB;border-radius:12px;padding:36px 24px;margin-bottom:14px;
           background:#FAFAFA;position:relative;min-height:260px;overflow:hidden;display:flex;
           flex-direction:column;align-items:center;justify-content:center">
        <div id="qrm-idle" style="display:flex;flex-direction:column;align-items:center">
          ${icon('qr','icon-xl')}
          <div style="font-size:.9rem;font-weight:600;color:#374151;margin-top:12px">Camera is off</div>
          <div style="font-size:.78rem;color:#9CA3AF;margin-top:4px">Start the camera to scan automatically</div>
        </div>
        <div id="qrm-reader" style="display:none;width:100%"></div>
      </div>
      <div id="qrm-status" style="display:none;font-size:.76rem;color:#6B7280;margin-bottom:10px;line-height:1.5"></div>
      <div style="display:flex;gap:8px;margin-bottom:16px">
        <button id="qrm-start-btn" class="btn-primary" style="flex:1;justify-content:center" onclick="window._qrmStart()">
          ${icon('camera','icon-sm')} Start Camera
        </button>
        <button id="qrm-stop-btn" class="btn-secondary" style="flex:1;justify-content:center;display:none" onclick="window._qrmStop()">
          ${icon('x','icon-sm')} Stop Camera
        </button>
      </div>
      <div style="font-size:.8rem;color:#9CA3AF;margin-bottom:16px">— or enter QR code manually —</div>
      <input id="qr-manual" class="form-input" placeholder="e.g. OPTICANA-P001-MARIASANTOS" style="text-align:center;font-family:monospace">
    </div>
    <div class="modal-footer">
      <button class="btn-secondary" onclick="window.closeModal()">Cancel</button>
      <button class="btn-primary" onclick="window.doQRScan()">Find Patient</button>
    </div>`)
}

function _qrmStart() {
  const idle     = document.getElementById('qrm-idle')
  const startBtn = document.getElementById('qrm-start-btn')
  const stopBtn  = document.getElementById('qrm-stop-btn')
  const area     = document.getElementById('qrm-area')
  const reader   = document.getElementById('qrm-reader')
  const status   = document.getElementById('qrm-status')
  if (!reader) return

  if (idle)     idle.style.display = 'none'
  reader.style.display = ''
  if (startBtn) startBtn.style.display = 'none'
  if (stopBtn)  stopBtn.style.display  = ''
  if (area)     { area.style.borderStyle = 'solid'; area.style.background = '#000'; area.style.padding = '10px' }
  if (status)   { status.style.display = ''; status.textContent = 'Requesting camera access…' }

  startQRCamera('qrm-reader',
    // onResult
    (qrData) => {
      window._qrmStop()
      const patient = patients.find(p => p.qrData === qrData)
      if (patient) {
        if (status) status.textContent = `Patient found: ${patient.name}`
        closeModal()
        navigate('patient-view', { patientId: patient.id, patientName: patient.name })
        toast(`Patient found: ${patient.name}`)
      } else {
        if (status) { status.style.color = '#EF4444'; status.textContent = `Scanned "${qrData}" — no matching patient.` }
        toast('No matching patient found for this QR code.', 'error')
      }
    },
    // onStatus
    () => { if (status) status.textContent = 'Camera live — hold the QR code steady in the frame' }
  )
}
window._qrmStart = _qrmStart

function _qrmStop() {
  _qrKillStream()
  const idle     = document.getElementById('qrm-idle')
  const startBtn = document.getElementById('qrm-start-btn')
  const stopBtn  = document.getElementById('qrm-stop-btn')
  const area     = document.getElementById('qrm-area')
  const reader   = document.getElementById('qrm-reader')
  const status   = document.getElementById('qrm-status')
  if (reader)   reader.style.display = 'none'
  if (idle)     idle.style.display = 'flex'
  if (startBtn) startBtn.style.display = ''
  if (stopBtn)  stopBtn.style.display  = 'none'
  if (area)     { area.style.borderStyle = 'dashed'; area.style.background = '#FAFAFA'; area.style.padding = '36px 24px' }
  if (status)   status.style.display = 'none'
}
window._qrmStop = _qrmStop

function doQRScan() {
  const val = (document.getElementById('qr-manual') || {}).value?.trim().toUpperCase()
  if (!val) { toast('Please enter a QR code value.', 'error'); return }
  const p = patients.find(p => p.qrData.toUpperCase() === val)
  if (!p) { toast('No patient found with that QR code.', 'error'); return }
  closeModal()
  navigate('patient-view', { patientId: p.id, patientName: p.name })
  toast(`Patient found: ${p.name}`)
}

window.openQRScanner = openQRScanner
window.doQRScan      = doQRScan

// ════════════════════════════════════════════════════════════════
//  QR SCANNER PAGE FUNCTIONS
// ════════════════════════════════════════════════════════════════
function showQRResult(p) {
  const card    = document.getElementById('qr-result-card')
  const body    = document.getElementById('qr-result-body')
  if (!card || !body) return
  const initls   = (p.name || '').split(' ').map(n=>n[0]).slice(0,2).join('').toUpperCase()
  const patAppts = appointments.filter(a => a.patientId === p.id)
  const exams    = p.examinations || []
  const lastExam = exams.length ? exams[exams.length - 1] : null
  body.innerHTML = `
    <div style="display:flex;align-items:center;gap:14px;margin-bottom:16px">
      <div style="width:56px;height:56px;border-radius:50%;background:linear-gradient(135deg,#E8760A,#F5A44D);
                  display:flex;align-items:center;justify-content:center;font-size:1.2rem;font-weight:800;color:#fff;flex-shrink:0;overflow:hidden">
        ${p.photoUrl ? `<img src="${p.photoUrl}" alt="${p.name}" style="width:100%;height:100%;object-fit:cover;border-radius:50%;display:block">` : initls}
      </div>
      <div>
        <div style="font-size:1.1rem;font-weight:700;color:#1C1C1C">${p.name}</div>
        <div style="font-size:.78rem;color:#6B7280">${p.id} &bull; ${p.gender} &bull; ${p.age} yrs</div>
        <div style="font-size:.78rem;color:#6B7280">Last Visit: ${p.lastVisit && p.lastVisit!=='—' ? new Date(p.lastVisit).toLocaleDateString('en-PH',{year:'numeric',month:'short',day:'numeric'}) : '—'}</div>
      </div>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:16px">
      <div style="background:#F9FAFB;border-radius:6px;padding:8px 10px">
        <div style="font-size:.68rem;color:#9CA3AF;text-transform:uppercase;letter-spacing:.04em">Eye Condition</div>
        <div style="font-size:.82rem;font-weight:600;color:#1C1C1C;margin-top:2px">${lastExam ? lastExam.diagnosis : 'No exam on record'}</div>
      </div>
      <div style="background:#F9FAFB;border-radius:6px;padding:8px 10px">
        <div style="font-size:.68rem;color:#9CA3AF;text-transform:uppercase;letter-spacing:.04em">Appointments</div>
        <div style="font-size:.82rem;font-weight:600;color:#1C1C1C;margin-top:2px">${patAppts.length} total</div>
      </div>
    </div>
    <div style="display:flex;gap:8px;flex-wrap:wrap">
      <button class="btn-primary" style="flex:1;justify-content:center;min-width:120px"
              onclick="window.navigate('patient-view',{patientId:'${p.id}',patientName:'${p.name}'})">
        ${icon('eye','icon-sm')} View Profile
      </button>
      ${state.role === 'doctor' ? `<button class="btn-secondary" style="flex:1;justify-content:center;min-width:120px"
              onclick="window.navigate('examination',{patientId:'${p.id}'})">
        ${icon('eye','icon-sm')} Start Consultation
      </button>` : ''}
      <button class="btn-ghost" style="flex:1;justify-content:center;min-width:120px"
              onclick="window.openCreateApptModal()">
        ${icon('calendar','icon-sm')} New Appointment
      </button>
    </div>`
  card.style.display = ''
  card.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
}

function _renderPatientResult(p) {
  const initls = (p.name || '').split(' ').map(n=>n[0]).slice(0,2).join('')
  return `
    <div style="padding:10px 14px;cursor:pointer;border-bottom:1px solid #F3F4F6;display:flex;align-items:center;gap:10px"
         onmouseover="this.style.background='#FFFBF5'" onmouseout="this.style.background=''"
         onclick="window.selectPatientResult('${p.id}')">
      <div style="width:32px;height:32px;border-radius:50%;background:#E8760A;display:flex;align-items:center;justify-content:center;color:#fff;font-size:.72rem;font-weight:700;flex-shrink:0">
        ${initls}
      </div>
      <div>
        <div style="font-size:.84rem;font-weight:600">${p.name}</div>
        <div style="font-size:.74rem;color:#9CA3AF">${p.id} &bull; ${p.gender || ''} &bull; ${p.age || '?'} yrs</div>
      </div>
    </div>`
}

function liveSearchPatient(query) {
  const res = document.getElementById('qr-live-results')
  if (!res) return
  if (!query.trim()) { res.style.display = 'none'; res.innerHTML = ''; return }

  const q = query.toLowerCase()
  const matches = patients.filter(p =>
    p.name.toLowerCase().includes(q) || p.id.toLowerCase().includes(q)
  ).slice(0, 6)
  if (!matches.length) { res.style.display = 'none'; return }
  res.innerHTML = matches.map(_renderPatientResult).join('')
  res.style.display = ''
}

function selectPatientResult(id) {
  const input = document.getElementById('qr-search-input')
  const resEl = document.getElementById('qr-live-results')
  if (resEl) resEl.style.display = 'none'

  const p = patients.find(p => p.id === id)
  if (!p) return
  if (input) input.value = p.name
  showQRResult(p)
}

function searchPatientManual() {
  const raw = (document.getElementById('qr-search-input') || {}).value?.trim()
  if (!raw) { toast('Enter a patient ID or name.', 'error'); return }

  const q = raw.toLowerCase()
  const p = patients.find(p => p.id.toLowerCase() === q || p.name.toLowerCase().includes(q))
  if (!p) { toast('No patient found.', 'error'); return }
  showQRResult(p)
  toast(`Patient found: ${p.name}`)
}

window.liveSearchPatient   = liveSearchPatient
window.selectPatientResult = selectPatientResult
window.searchPatientManual = searchPatientManual

// ════════════════════════════════════════════════════════════════
//  DOCTOR SCHEDULE MODAL
// ════════════════════════════════════════════════════════════════
function openSetScheduleModal(doctorId) {
  const d = doctorId ? doctors.find(doc => doc.id === doctorId) : null
  const allDays = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']

  function buildDayChecks(doc) {
    const activeDays = doc ? (doc.availableDays || doc.days || []) : []
    return allDays.map(day => `
      <label style="cursor:pointer;display:flex;align-items:center;gap:6px;font-size:.85rem;padding:6px 10px;border:1px solid #E5E7EB;border-radius:6px">
        <input type="checkbox" class="sched-day-cb" value="${day}" ${activeDays.includes(day) ? 'checked' : ''} style="accent-color:#E8760A"> ${day}
      </label>`).join('')
  }

  showModal(`
    <div class="modal-header">
      <div class="modal-title">Set Doctor Availability</div>
      <button class="modal-close" onclick="window.closeModal()">&times;</button>
    </div>
    <div class="modal-body">
      <div class="form-group"><label class="form-label">Doctor</label>
        <select id="sched-doc" class="form-select" onchange="window._schedDocChange(this.value)">
          ${doctors.map(doc => `<option value="${doc.id}"${doc.id === doctorId ? ' selected' : ''}>${doc.name}</option>`).join('')}
        </select></div>
      <div class="form-group"><label class="form-label">Available Days</label>
        <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:6px" id="sched-days-wrap">
          ${buildDayChecks(d)}
        </div></div>
      <div class="form-row-2">
        <div class="form-group"><label class="form-label">Start Time</label>
          <input id="sched-start" class="form-input" value="${d ? (d.hours || '8:00 AM – 5:00 PM').split('–')[0].trim() : '8:00 AM'}"></div>
        <div class="form-group"><label class="form-label">End Time</label>
          <input id="sched-end" class="form-input" value="${d ? (d.hours || '8:00 AM – 5:00 PM').split('–')[1]?.trim() ?? '5:00 PM' : '5:00 PM'}"></div>
      </div>
      <div class="form-group" style="display:flex;align-items:center;justify-content:space-between">
        <label class="form-label" style="margin:0">Mark as Available</label>
        <input id="sched-avail" type="checkbox" ${!d || d.available ? 'checked' : ''} style="width:16px;height:16px;accent-color:#E8760A">
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn-secondary" onclick="window.closeModal()">Cancel</button>
      <button class="btn-primary" onclick="window.doSaveSchedule()">Save Schedule</button>
    </div>`)
}

window._schedDocChange = function(id) {
  const doc = doctors.find(d => d.id === id)
  const allDays = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']
  const activeDays = doc ? (doc.availableDays || doc.days || []) : []
  const wrap = document.getElementById('sched-days-wrap')
  if (wrap) {
    wrap.innerHTML = allDays.map(day => `
      <label style="cursor:pointer;display:flex;align-items:center;gap:6px;font-size:.85rem;padding:6px 10px;border:1px solid #E5E7EB;border-radius:6px">
        <input type="checkbox" class="sched-day-cb" value="${day}" ${activeDays.includes(day) ? 'checked' : ''} style="accent-color:#E8760A"> ${day}
      </label>`).join('')
  }
  const startEl = document.getElementById('sched-start')
  const endEl   = document.getElementById('sched-end')
  const availEl = document.getElementById('sched-avail')
  if (doc) {
    const parts = (doc.hours || '8:00 AM – 5:00 PM').split('–')
    if (startEl) startEl.value = parts[0]?.trim() || '8:00 AM'
    if (endEl)   endEl.value   = parts[1]?.trim() || '5:00 PM'
    if (availEl) availEl.checked = doc.available !== false
  }
}

function doSaveSchedule() {
  const docId   = document.getElementById('sched-doc')?.value
  const startT  = document.getElementById('sched-start')?.value?.trim() || '8:00 AM'
  const endT    = document.getElementById('sched-end')?.value?.trim()   || '5:00 PM'
  const isAvail = document.getElementById('sched-avail')?.checked ?? true
  const selDays = Array.from(document.querySelectorAll('.sched-day-cb:checked')).map(cb => cb.value)

  const doc = doctors.find(d => d.id === docId)
  if (doc) {
    doc.availableDays = selDays
    doc.days          = selDays
    doc.hours         = `${startT} – ${endT}`
    doc.available     = isAvail
  }

  if (typeof getAvailableDoctors === 'function') {
    const bdDoc = getAvailableDoctors().find(d => d.id === docId)
    if (bdDoc) {
      bdDoc.availableDays = selDays
      bdDoc.available     = isAvail
    }
  }

  addActivityLog({ id: 'L' + Date.now(), user: state.user.name, role: state.role,
    action: `Updated availability for ${doc?.name || 'doctor'}: ${selDays.join(', ')}`,
    timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19), type: 'settings' })

  closeModal()
  toast('Schedule updated successfully.')
  renderPage()
}

window.openSetScheduleModal = openSetScheduleModal
window.doSaveSchedule       = doSaveSchedule

// ════════════════════════════════════════════════════════════════
//  OPTICAL EXAMINATION — WIZARD CONTROLLER
// ════════════════════════════════════════════════════════════════
var _wizStep = 1
var _wizTotal = 6

var _STEP_LABELS = [
  'Patient Info', 'Visual Exam', 'Diagnosis',
  'Results', 'Dispensing', 'Review'
]

function examWizInit() {
  _wizStep = 1
  examWizRender(1, null)
}

function examWizGo(dir) {
  var next = _wizStep + dir
  if (next < 1 || next > _wizTotal) return
  examWizRender(next, dir)
}

function examWizJump(n) {
  if (n === _wizStep) return
  examWizRender(n, n > _wizStep ? 1 : -1)
}

function examWizRender(next, dir) {
  var prev = _wizStep
  _wizStep = next

  // Slide out old step
  var oldEl = document.getElementById('wiz-step-' + prev)
  if (oldEl && dir !== null) {
    oldEl.style.transition = 'opacity 0.25s ease, transform 0.25s cubic-bezier(0.4,0,0.2,1)'
    oldEl.style.opacity = '0'
    oldEl.style.transform = dir > 0 ? 'translateX(-24px)' : 'translateX(24px)'
    setTimeout(function() { oldEl.style.display = 'none'; oldEl.style.opacity = ''; oldEl.style.transform = ''; }, 260)
  } else if (oldEl) {
    oldEl.style.display = 'none'
  }

  // Slide in new step
  var newEl = document.getElementById('wiz-step-' + next)
  if (newEl) {
    if (dir !== null) {
      newEl.style.opacity = '0'
      newEl.style.transform = dir > 0 ? 'translateX(24px)' : 'translateX(-24px)'
    }
    newEl.style.display = ''
    if (dir !== null) {
      requestAnimationFrame(function() {
        newEl.style.transition = 'opacity 0.25s ease, transform 0.25s cubic-bezier(0.4,0,0.2,1)'
        newEl.style.opacity = '1'
        newEl.style.transform = 'translateX(0)'
      })
    }
  }

  // Update stepper pills
  for (var i = 1; i <= _wizTotal; i++) {
    var circle = document.getElementById('wiz-circle-' + i)
    var pill = document.getElementById('wiz-pill-' + i)
    if (!circle) continue
    if (i < next) {
      // Completed
      circle.style.background = '#E8891C'
      circle.style.color = 'white'
      circle.style.boxShadow = 'none'
      circle.style.border = 'none'
      circle.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" width="14" height="14"><polyline points="20 6 9 17 4 12"/></svg>'
    } else if (i === next) {
      // Active
      circle.style.background = '#E8891C'
      circle.style.color = 'white'
      circle.style.boxShadow = '0 2px 8px rgba(232,137,28,0.35)'
      circle.style.border = 'none'
      circle.innerHTML = String(i)
    } else {
      // Future
      circle.style.background = '#f3f4f6'
      circle.style.color = '#9ca3af'
      circle.style.boxShadow = 'none'
      circle.style.border = '2px solid #e5e7eb'
      circle.innerHTML = String(i)
    }
    // Label color — target text wrapper's children (not the circle)
    if (pill) {
      var textWrap = pill.querySelectorAll(':scope > div')[1]
      var lbl = textWrap ? textWrap.querySelector('div:first-child') : null
      var sub = textWrap ? textWrap.querySelector('div:last-child') : null
      if (lbl) { lbl.style.color = i <= next ? '#1f2937' : '#9ca3af'; lbl.style.fontWeight = i === next ? '700' : '500' }
      if (sub) sub.style.color = i <= next ? '#6b7280' : '#d1d5db'
    }
    // Connector line color
    var line = document.getElementById('wiz-line-' + i)
    if (line) line.style.background = i < next ? '#E8891C' : '#e5e7eb'
  }

  // Update step label
  var labelEl = document.getElementById('wiz-step-label')
  if (labelEl) { labelEl.textContent = 'Step ' + next + ' of ' + _wizTotal + ': ' + _STEP_LABELS[next - 1]; labelEl.style.color = '#6b7280'; labelEl.style.fontWeight = '600' }

  // Back button
  var backBtn = document.getElementById('wiz-btn-back')
  if (backBtn) backBtn.style.display = next > 1 ? 'inline-flex' : 'none'

  // Next vs Save/Print buttons
  var nextBtn = document.getElementById('wiz-btn-next')
  var saveBtn = document.getElementById('wiz-btn-save')
  var printBtn = document.getElementById('wiz-btn-print')
  if (next < _wizTotal) {
    if (nextBtn)  nextBtn.style.display  = 'inline-flex'
    if (saveBtn)  saveBtn.style.display  = 'none'
    if (printBtn) printBtn.style.display = 'none'
  } else {
    if (nextBtn)  nextBtn.style.display  = 'none'
    if (saveBtn)  saveBtn.style.display  = 'inline-flex'
    if (printBtn) printBtn.style.display = 'inline-flex'
    // Trigger rx preview when arriving at step 6
    if (window.updateRxPreview && window._examPatientId) {
      setTimeout(function() { window.updateRxPreview(window._examPatientId) }, 60)
    }
  }
}
window.examWizInit = examWizInit
window.examWizGo   = examWizGo
window.examWizJump = examWizJump

// ════════════════════════════════════════════════════════════════
//  OPTICAL EXAMINATION — START FROM APPOINTMENT / WALK-IN
// ════════════════════════════════════════════════════════════════
window._examApptId     = null   // tracks which appointment triggered this exam
window._examApptDoctor = null   // admin-side: doctor from appointment

function startExamFromAppt(apptId, fallbackPatientId) {
  if (apptId) {
    const appt = appointments.find(a => a.id === apptId)
    if (!appt) return
    window._examApptId     = apptId
    window._examApptDoctor = appt.doctorName || null
    toast('Starting consultation for ' + appt.patientName + '…', 'info')
    navigate('new-examination', { patientId: appt.patientId })
  } else if (fallbackPatientId) {
    // Walk-in: no linked appointment
    window._examApptId     = null
    window._examApptDoctor = null
    const pt = patients.find(p => p.id === fallbackPatientId)
    if (pt) toast('Starting consultation for ' + pt.name + '…', 'info')
    navigate('new-examination', { patientId: fallbackPatientId })
  }
}
window.startExamFromAppt = startExamFromAppt

function toggleWalkinSearch() {
  const sec = document.getElementById('walkin-search-section')
  const lbl = document.getElementById('walkin-toggle-label')
  if (!sec) return
  const open = sec.style.display === 'none'
  sec.style.display = open ? '' : 'none'
  if (lbl) lbl.textContent = open ? 'Hide ✕' : 'Search Other Patients ›'
  if (open) {
    const inp = document.getElementById('walkin-search-input')
    if (inp) setTimeout(() => inp.focus(), 50)
  }
}
window.toggleWalkinSearch = toggleWalkinSearch


// ════════════════════════════════════════════════════════════════
//  OPTICAL EXAMINATION — SAVE NEW EXAM
// ════════════════════════════════════════════════════════════════
async function saveNewExam(patientId) {
  const p = patients.find(p => p.id === patientId)
  if (!p) return

  const gv = id => (document.getElementById(id) || {}).value?.trim() || ''
  const coatings = []
  document.querySelectorAll('[id^="ne-coat-"]:checked').forEach(cb => coatings.push(cb.value))

  const diagnosis = gv('ne-diagnosis')
  if (!diagnosis) { toast('Please enter a diagnosis.', 'error'); return }

  const date = gv('ne-date') || new Date().toISOString().split('T')[0]

  const newExam = {
    date,
    doctor: (window._examApptDoctor && state.role === 'admin') ? window._examApptDoctor : state.user.name,
    od: {
      sph: gv('ne-od-sph'), cyl: gv('ne-od-cyl'), axis: gv('ne-od-axis'),
      va:  gv('ne-od-va'),  add: gv('ne-od-add')
    },
    os: {
      sph: gv('ne-os-sph'), cyl: gv('ne-os-cyl'), axis: gv('ne-os-axis'),
      va:  gv('ne-os-va'),  add: gv('ne-os-add')
    },
    iop:                 { od: gv('ne-iop-od'), os: gv('ne-iop-os') },
    pd:                  gv('ne-pd'),
    diagnosis,
    recommendation:      gv('ne-recommendation'),
    testResults:         gv('ne-test-results'),
    prescriptionDetails: gv('ne-rx-details'),
    lensType:            gv('ne-lens-type'),
    lensMaterial:        gv('ne-lens-material'),
    lensCoating:         coatings,
    frameSelection:      gv('ne-frame'),
    remarks:             gv('ne-remarks'),
    status:              'completed'
  }

  const saveBtn = document.getElementById('wiz-btn-save')
  if (saveBtn) { saveBtn.disabled = true; saveBtn.textContent = 'Saving…' }

  try {
    const apptId = window._examApptId || null
    const r = await fetch('api/examinations/create.php', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ patientId, apptId, ...newExam })
    })
    const d = await r.json()
    if (!d.success) {
      toast(d.message || 'Failed to save examination.', 'error')
      return
    }

    // Update local arrays so the UI stays consistent
    newExam.id = d.id
    p.examinations.unshift(newExam)
    p.consultations.unshift({
      id: 'C' + Date.now(), date: newExam.date,
      doctor: state.user.name, type: 'Eye Examination',
      diagnosis: newExam.diagnosis,
      prescription: `OD: ${newExam.od.sph} ${newExam.od.cyl} x${newExam.od.axis} / OS: ${newExam.os.sph} ${newExam.os.cyl} x${newExam.os.axis}`,
      remarks: newExam.remarks
    })
    p.lastVisit = newExam.date

    if (apptId) {
      updateAppointmentStatus(apptId, 'completed')
      window._examApptId     = null
      window._examApptDoctor = null
    }

    toast('Examination record saved successfully.', 'success')
    navigate('new-examination')
  } catch (_) {
    toast('Network error — please try again.', 'error')
  } finally {
    if (saveBtn) { saveBtn.disabled = false; saveBtn.innerHTML = window.icon('check','icon-sm') + ' Save Examination' }
  }
}
window.saveNewExam = saveNewExam

// ════════════════════════════════════════════════════════════════
//  OPTICAL EXAMINATION — PRINT WIZARD DRAFT (Step 6)
// ════════════════════════════════════════════════════════════════
function printNewExamDraft(patientId) {
  const p = patients.find(pt => pt.id === patientId)
  if (!p) return
  const gv = id => (document.getElementById(id)?.value || '').trim()
  const radioVal = name => document.querySelector(`input[name="${name}"]:checked`)?.value || ''
  const coatings = []
  document.querySelectorAll('[id^="ne-coat-"]:checked').forEach(cb => coatings.push(cb.value))
  const doctor = (window._examApptDoctor && state.role === 'admin') ? window._examApptDoctor : (state.user?.name || '—')
  const ishihara = radioVal('ne-ishihara')
  const eyeglass = radioVal('ne-eyeglass')
  const testParts = [
    ishihara ? `Ishihara: ${ishihara}` : '',
    gv('ne-test-results') || ''
  ].filter(Boolean).join('. ')

  const e = {
    id:       'DRAFT',
    date:     gv('ne-date') || new Date().toISOString().split('T')[0],
    doctor,
    od:       { sph: gv('ne-od-sph'), cyl: gv('ne-od-cyl'), axis: gv('ne-od-axis'), va: gv('ne-od-va'), add: gv('ne-od-add') },
    os:       { sph: gv('ne-os-sph'), cyl: gv('ne-os-cyl'), axis: gv('ne-os-axis'), va: gv('ne-os-va'), add: gv('ne-os-add') },
    iop:      { od: gv('ne-iop-od'), os: gv('ne-iop-os') },
    pd:       gv('ne-pd'),
    diagnosis:         gv('ne-diagnosis'),
    recommendation:    [gv('ne-lens-type'), eyeglass ? `Eyeglass Rec: ${eyeglass}` : '', coatings.join(', ')].filter(Boolean).join(' · ') || '—',
    testResults:       testParts || null,
    prescriptionDetails: gv('ne-rx-details') || null,
    lensType:          gv('ne-lens-type'),
    lensMaterial:      gv('ne-lens-material'),
    lensCoating:       coatings,
    frameSelection:    gv('ne-frame'),
    remarks:           gv('ne-remarks')
  }
  _openExamPrintWindow(p, e)
}
window.printNewExamDraft = printNewExamDraft

// ════════════════════════════════════════════════════════════════
//  OPTICAL EXAMINATION — RX PREVIEW UPDATER
// ════════════════════════════════════════════════════════════════
function updateRxPreview(patientId) {
  const el = document.getElementById('ne-rx-preview')
  if (!el) return
  const gv = id => (document.getElementById(id) || {}).value?.trim() || '—'
  const p  = patients.find(p => p.id === patientId)
  const pName = p ? p.name : patientId

  const row = (lbl, od, os) => `
    <tr>
      <td style="padding:7px 10px;font-size:.78rem;color:#6B7280;font-weight:600;border-bottom:1px solid #F3F4F6">${lbl}</td>
      <td style="padding:7px 10px;font-size:.82rem;font-weight:700;color:#1C1C1C;border-bottom:1px solid #F3F4F6;text-align:center">${od}</td>
      <td style="padding:7px 10px;font-size:.82rem;font-weight:700;color:#1C1C1C;border-bottom:1px solid #F3F4F6;text-align:center">${os}</td>
    </tr>`

  const doctorName  = window.state?.user?.name || 'Dr. Lalaine Cana'
  const pidDisplay  = gv('ne-patient-id') !== '—' ? gv('ne-patient-id') : (p ? p.id : '—')
  const patientName = gv('ne-patient-name') !== '—' ? gv('ne-patient-name') : pName
  const examDate    = gv('ne-date') !== '—' ? gv('ne-date') : new Date().toISOString().split('T')[0]
  const thCell = (txt, color='#6B7280') =>
    `<th style="padding:8px 10px;font-size:.68rem;font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:${color};text-align:center;background:#f9fafb;border-bottom:2px solid #e5e7eb">${txt}</th>`
  const tdCell = (val, color='#1C1C1C') =>
    `<td style="padding:8px 10px;font-size:.82rem;font-weight:700;color:${color};text-align:center;border-bottom:1px solid #f3f4f6">${val||'—'}</td>`
  const infoRow = (label, val, orange=false) =>
    `<div><div style="font-size:.58rem;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:#9CA3AF;margin-bottom:2px">${label}</div><div style="font-size:.8rem;font-weight:600;color:${orange?'#E8891C':'#1C1C1C'}">${val}</div></div>`

  el.innerHTML = `
    <!-- Clinic Header -->
    <div style="display:flex;align-items:center;gap:12px;padding-bottom:14px;margin-bottom:14px;border-bottom:1px solid #e5e7eb">
      <img src="${window._clinicLogoUrl || 'brand_assests/cana logo.png'}" style="width:40px;height:40px;border-radius:50%;object-fit:contain;border:1px solid #e5e7eb;padding:2px;flex-shrink:0" onerror="this.style.display='none'">
      <div>
        <div style="font-size:.9rem;font-weight:700;color:#1C1C1C;line-height:1.2">OPTICANA — Cana Optical Clinic</div>
        <div style="font-size:.68rem;color:#6B7280;margin-top:2px">Unit 3 Paseo de Carmona, Brgy. Maduya, Carmona, Cavite</div>
      </div>
    </div>

    <!-- Patient Details (2-column) -->
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:14px;padding-bottom:14px;border-bottom:1px solid #f3f4f6">
      ${infoRow('Patient Name', patientName)}
      ${infoRow('Patient ID', pidDisplay, true)}
      ${infoRow('Doctor', doctorName)}
      ${infoRow('Consultation Date', examDate)}
    </div>

    <!-- Prescription Table -->
    <table style="width:100%;border-collapse:collapse;margin-bottom:14px;border:1px solid #e5e7eb;border-radius:8px;overflow:hidden">
      <thead>
        <tr>
          ${thCell('Eye', '#6B7280')}
          ${thCell('Sphere', '#1C1C1C')}
          ${thCell('Cylinder', '#1C1C1C')}
          ${thCell('Axis', '#1C1C1C')}
          ${thCell('VA', '#1C1C1C')}
        </tr>
      </thead>
      <tbody>
        <tr>
          <td style="padding:8px 10px;font-size:.78rem;font-weight:700;color:#16a34a;border-bottom:1px solid #f3f4f6;text-align:center">OD (Right)</td>
          ${tdCell(gv('ne-od-sph'))}
          ${tdCell(gv('ne-od-cyl'))}
          ${tdCell(gv('ne-od-axis'))}
          ${tdCell(gv('ne-od-va'))}
        </tr>
        <tr>
          <td style="padding:8px 10px;font-size:.78rem;font-weight:700;color:#E8891C;border-bottom:1px solid #f3f4f6;text-align:center">OS (Left)</td>
          ${tdCell(gv('ne-os-sph'))}
          ${tdCell(gv('ne-os-cyl'))}
          ${tdCell(gv('ne-os-axis'))}
          ${tdCell(gv('ne-os-va'))}
        </tr>
      </tbody>
    </table>

    <!-- Summary fields -->
    <div style="display:flex;flex-direction:column;gap:8px;margin-bottom:16px;padding:12px;background:#f9fafb;border-radius:8px;border:1px solid #e5e7eb">
      <div style="display:flex;gap:8px;font-size:.8rem">
        <span style="font-weight:600;color:#6B7280;min-width:140px">Diagnosis:</span>
        <span style="color:#1C1C1C;font-weight:500">${gv('ne-diagnosis')}</span>
      </div>
      <div style="display:flex;gap:8px;font-size:.8rem">
        <span style="font-weight:600;color:#6B7280;min-width:140px">Final VA:</span>
        <span style="color:#1C1C1C;font-weight:500">${gv('ne-final-va')}</span>
      </div>
      <div style="display:flex;gap:8px;font-size:.8rem">
        <span style="font-weight:600;color:#6B7280;min-width:140px">Recommended Lenses:</span>
        <span style="color:#1C1C1C;font-weight:500">${gv('ne-lens-type')}</span>
      </div>
      <div style="display:flex;gap:8px;font-size:.8rem">
        <span style="font-weight:600;color:#6B7280;min-width:140px">Frame Selection:</span>
        <span style="color:#1C1C1C;font-weight:500">${gv('ne-frame')}</span>
      </div>
    </div>

    <!-- Doctor signature -->
    <div style="display:flex;justify-content:flex-end">
      <div style="text-align:center;min-width:160px;border-top:1px solid #d1d5db;padding-top:8px">
        <div style="font-size:.65rem;color:#9CA3AF;text-transform:uppercase;letter-spacing:.06em;margin-bottom:4px">Examining Optometrist</div>
        <div style="font-size:.85rem;font-weight:700;color:#1C1C1C">${doctorName}, OD</div>
      </div>
    </div>`
}
window.updateRxPreview = updateRxPreview

// ════════════════════════════════════════════════════════════════
//  OPTICAL EXAMINATION — CONSULTATION TIMELINE TOGGLE
// ════════════════════════════════════════════════════════════════
function toggleConsultEntry(id) {
  const body  = document.getElementById('consult-body-' + id)
  const arrow = document.getElementById('consult-arrow-' + id)
  if (!body) return
  const isOpen = body.style.display !== 'none'
  body.style.display  = isOpen ? 'none' : ''
  if (arrow) arrow.style.transform = isOpen ? '' : 'rotate(180deg)'
}
window.toggleConsultEntry = toggleConsultEntry

// ════════════════════════════════════════════════════════════════
//  OPTICAL EXAMINATION — VIEW EXAM DETAIL MODAL
// ════════════════════════════════════════════════════════════════
function viewExamDetail(patientId, examId) {
  const p = patients.find(p => p.id === patientId)
  if (!p) return
  const e = p.examinations.find(e => e.id === examId)
  if (!e) return

  const statusColor = { completed:'#059669', pending:'#D97706', cancelled:'#DC2626' }
  const sc = statusColor[e.status] || '#6B7280'

  const eyeRow = (lbl, odVal, osVal) => `
    <tr>
      <td style="padding:8px 12px;font-size:.8rem;color:#6B7280;font-weight:600;border-bottom:1px solid #F3F4F6">${lbl}</td>
      <td style="padding:8px 12px;font-size:.85rem;font-weight:700;color:#1D4ED8;border-bottom:1px solid #F3F4F6;text-align:center">${odVal || '—'}</td>
      <td style="padding:8px 12px;font-size:.85rem;font-weight:700;color:#059669;border-bottom:1px solid #F3F4F6;text-align:center">${osVal || '—'}</td>
    </tr>`

  showModal(`
    <div class="modal-header">
      <div class="modal-title">Examination Detail — ${p.name}</div>
      <button class="modal-close" onclick="window.closeModal()">&times;</button>
    </div>
    <div class="modal-body" style="padding:0">

      <!-- Header strip -->
      <div style="background:linear-gradient(135deg,#1C1C2E,#2D2D44);color:#fff;padding:18px 22px;display:flex;align-items:center;justify-content:space-between">
        <div>
          <div style="font-size:.72rem;color:rgba(255,255,255,.5);text-transform:uppercase;letter-spacing:.06em">Exam ID</div>
          <div style="font-size:1rem;font-weight:700;font-family:monospace">${e.id}</div>
        </div>
        <div style="text-align:right">
          <div style="font-size:.72rem;color:rgba(255,255,255,.5);text-transform:uppercase;letter-spacing:.06em">Date &amp; Doctor</div>
          <div style="font-size:.88rem;font-weight:600">${new Date(e.date).toLocaleDateString('en-PH',{year:'numeric',month:'short',day:'numeric'})}</div>
          <div style="font-size:.78rem;color:rgba(255,255,255,.65)">${e.doctor}</div>
        </div>
        <div style="background:${sc};color:#fff;border-radius:20px;padding:4px 12px;font-size:.75rem;font-weight:700;text-transform:capitalize">
          ${e.status || 'completed'}
        </div>
      </div>

      <div style="padding:18px 22px;display:flex;flex-direction:column;gap:18px">
        <!-- Visual Acuity Table -->
        <div>
          <div style="font-size:.72rem;font-weight:700;color:#9CA3AF;text-transform:uppercase;letter-spacing:.06em;margin-bottom:8px">Visual Acuity</div>
          <table style="width:100%;border-collapse:collapse;border:1px solid #F3F4F6;border-radius:8px;overflow:hidden">
            <thead>
              <tr style="background:#F9FAFB">
                <th style="padding:8px 12px;font-size:.7rem;color:#9CA3AF;text-align:left;font-weight:600;text-transform:uppercase">Measure</th>
                <th style="padding:8px 12px;font-size:.7rem;color:#1D4ED8;text-align:center;font-weight:700;text-transform:uppercase">OD (Right)</th>
                <th style="padding:8px 12px;font-size:.7rem;color:#059669;text-align:center;font-weight:700;text-transform:uppercase">OS (Left)</th>
              </tr>
            </thead>
            <tbody>
              ${eyeRow('Sphere',       e.od?.sph, e.os?.sph)}
              ${eyeRow('Cylinder',     e.od?.cyl, e.os?.cyl)}
              ${eyeRow('Axis',         e.od?.axis, e.os?.axis)}
              ${eyeRow('Visual Acuity',e.od?.va,  e.os?.va)}
              ${eyeRow('Add Power',    e.od?.add, e.os?.add)}
            </tbody>
          </table>
        </div>

        <!-- IOP + PD -->
        <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px">
          <div style="background:#F9FAFB;border-radius:8px;padding:10px 14px">
            <div style="font-size:.65rem;color:#9CA3AF;text-transform:uppercase;letter-spacing:.05em">IOP — OD</div>
            <div style="font-size:1.1rem;font-weight:800;color:#1C1C1C;margin-top:2px">${e.iop?.od || '—'} <span style="font-size:.7rem;font-weight:400;color:#9CA3AF">mmHg</span></div>
          </div>
          <div style="background:#F9FAFB;border-radius:8px;padding:10px 14px">
            <div style="font-size:.65rem;color:#9CA3AF;text-transform:uppercase;letter-spacing:.05em">IOP — OS</div>
            <div style="font-size:1.1rem;font-weight:800;color:#1C1C1C;margin-top:2px">${e.iop?.os || '—'} <span style="font-size:.7rem;font-weight:400;color:#9CA3AF">mmHg</span></div>
          </div>
          <div style="background:#F9FAFB;border-radius:8px;padding:10px 14px">
            <div style="font-size:.65rem;color:#9CA3AF;text-transform:uppercase;letter-spacing:.05em">PD</div>
            <div style="font-size:1.1rem;font-weight:800;color:#1C1C1C;margin-top:2px">${e.pd || '—'} <span style="font-size:.7rem;font-weight:400;color:#9CA3AF">mm</span></div>
          </div>
        </div>

        <!-- Diagnosis + Test Results -->
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
          <div>
            <div style="font-size:.72rem;font-weight:700;color:#9CA3AF;text-transform:uppercase;letter-spacing:.06em;margin-bottom:6px">Diagnosis</div>
            <div style="font-size:.88rem;font-weight:700;color:#1C1C1C">${e.diagnosis || '—'}</div>
            ${e.recommendation ? `<div style="font-size:.78rem;color:#6B7280;margin-top:4px">${e.recommendation}</div>` : ''}
          </div>
          <div>
            <div style="font-size:.72rem;font-weight:700;color:#9CA3AF;text-transform:uppercase;letter-spacing:.06em;margin-bottom:6px">Lens Prescription</div>
            <div style="font-size:.82rem;color:#1C1C1C">${e.lensType || '—'} / ${e.lensMaterial || '—'}</div>
            ${e.lensCoating?.length ? `<div style="font-size:.75rem;color:#6B7280;margin-top:2px">${e.lensCoating.join(', ')}</div>` : ''}
            ${e.frameSelection ? `<div style="font-size:.75rem;color:#6B7280;margin-top:2px">Frame: ${e.frameSelection}</div>` : ''}
          </div>
        </div>

        ${e.testResults ? `
        <div>
          <div style="font-size:.72rem;font-weight:700;color:#9CA3AF;text-transform:uppercase;letter-spacing:.06em;margin-bottom:6px">Test Results</div>
          <div style="font-size:.82rem;color:#374151;background:#F9FAFB;border-radius:6px;padding:10px 12px;line-height:1.6">${e.testResults}</div>
        </div>` : ''}

        ${e.remarks ? `
        <div>
          <div style="font-size:.72rem;font-weight:700;color:#9CA3AF;text-transform:uppercase;letter-spacing:.06em;margin-bottom:6px">Doctor's Remarks</div>
          <div style="font-size:.82rem;color:#374151;font-style:italic">"${e.remarks}"</div>
        </div>` : ''}
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn-secondary" onclick="window.closeModal()">Close</button>
      <button class="btn-ghost" onclick="window.viewPrescriptionModal('${patientId}','${examId}')">
        ${icon('file-text','icon-sm')} View Prescription
      </button>
      ${state.role !== 'patient' ? `<button class="btn-ghost" style="color:#0891b2;border-color:#0891b2" onclick="window.closeModal();window.generateClearance('${patientId}','${examId}')">
        ${icon('award','icon-sm')} Generate Ophthalmic Clearance
      </button>
      <button class="btn-primary" onclick="window.printPrescription('${patientId}','${examId}')">
        ${icon('printer','icon-sm')} Print
      </button>` : ''}
    </div>`, 'modal-lg')
}
window.viewExamDetail = viewExamDetail

// ── View/Print/Clearance from getExamRecords() ───────────────────
function viewExamRecord(examId) {
  const e = getExamRecords().find(r => r.id === examId)
  if (!e) { toast('Record not found.', 'error'); return }

  const eyeRow = (lbl, odVal, osVal) => `
    <tr>
      <td style="padding:8px 12px;font-size:.8rem;color:#6B7280;font-weight:600;border-bottom:1px solid #F3F4F6">${lbl}</td>
      <td style="padding:8px 12px;font-size:.85rem;font-weight:700;color:#1D4ED8;border-bottom:1px solid #F3F4F6;text-align:center">${odVal || '—'}</td>
      <td style="padding:8px 12px;font-size:.85rem;font-weight:700;color:#059669;border-bottom:1px solid #F3F4F6;text-align:center">${osVal || '—'}</td>
    </tr>`

  showModal(`
    <div class="modal-header">
      <div class="modal-title">Examination Record — ${e.id}</div>
      <button class="modal-close" onclick="window.closeModal()">&times;</button>
    </div>
    <div class="modal-body" style="padding:0">
      <div style="background:linear-gradient(135deg,#1C1C2E,#2D2D44);color:#fff;padding:18px 22px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:10px">
        <div>
          <div style="font-size:.72rem;color:rgba(255,255,255,.5);text-transform:uppercase;letter-spacing:.06em">Patient</div>
          <div style="font-size:1rem;font-weight:700">${e.patientName}</div>
          <div style="font-size:.75rem;color:rgba(255,255,255,.55)">${e.patientId}</div>
        </div>
        <div style="text-align:right">
          <div style="font-size:.72rem;color:rgba(255,255,255,.5);text-transform:uppercase;letter-spacing:.06em">Date &amp; Doctor</div>
          <div style="font-size:.88rem;font-weight:600">${fmtDate(e.date)}</div>
          <div style="font-size:.78rem;color:rgba(255,255,255,.65)">${e.doctor}</div>
        </div>
        <div style="background:#059669;color:#fff;border-radius:20px;padding:4px 12px;font-size:.75rem;font-weight:700">Completed</div>
      </div>
      <div style="padding:18px 22px;display:flex;flex-direction:column;gap:16px">
        <div>
          <div style="font-size:.72rem;font-weight:700;color:#9CA3AF;text-transform:uppercase;letter-spacing:.06em;margin-bottom:8px">Refraction</div>
          <table style="width:100%;border-collapse:collapse;border:1px solid #F3F4F6;border-radius:8px;overflow:hidden">
            <thead>
              <tr style="background:#F9FAFB">
                <th style="padding:8px 12px;font-size:.7rem;color:#9CA3AF;text-align:left;font-weight:600;text-transform:uppercase">Measure</th>
                <th style="padding:8px 12px;font-size:.7rem;color:#1D4ED8;text-align:center;font-weight:700;text-transform:uppercase">OD (Right)</th>
                <th style="padding:8px 12px;font-size:.7rem;color:#059669;text-align:center;font-weight:700;text-transform:uppercase">OS (Left)</th>
              </tr>
            </thead>
            <tbody>
              ${eyeRow('Sphere',        e.od?.sph,  e.os?.sph)}
              ${eyeRow('Cylinder',      e.od?.cyl,  e.os?.cyl)}
              ${eyeRow('Axis',          e.od?.axis, e.os?.axis)}
              ${eyeRow('Visual Acuity', e.od?.va,   e.os?.va)}
              ${eyeRow('Add Power',     e.od?.add,  e.os?.add)}
            </tbody>
          </table>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px">
          <div style="background:#F9FAFB;border-radius:8px;padding:10px 14px">
            <div style="font-size:.65rem;color:#9CA3AF;text-transform:uppercase;letter-spacing:.05em">IOP — OD</div>
            <div style="font-size:1.1rem;font-weight:800;color:#1C1C1C;margin-top:2px">${e.iop?.od || '—'} <span style="font-size:.7rem;font-weight:400;color:#9CA3AF">mmHg</span></div>
          </div>
          <div style="background:#F9FAFB;border-radius:8px;padding:10px 14px">
            <div style="font-size:.65rem;color:#9CA3AF;text-transform:uppercase;letter-spacing:.05em">IOP — OS</div>
            <div style="font-size:1.1rem;font-weight:800;color:#1C1C1C;margin-top:2px">${e.iop?.os || '—'} <span style="font-size:.7rem;font-weight:400;color:#9CA3AF">mmHg</span></div>
          </div>
          <div style="background:#F9FAFB;border-radius:8px;padding:10px 14px">
            <div style="font-size:.65rem;color:#9CA3AF;text-transform:uppercase;letter-spacing:.05em">PD</div>
            <div style="font-size:1.1rem;font-weight:800;color:#1C1C1C;margin-top:2px">${e.pd || '—'} <span style="font-size:.7rem;font-weight:400;color:#9CA3AF">mm</span></div>
          </div>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
          <div>
            <div style="font-size:.7rem;color:#9CA3AF;text-transform:uppercase;font-weight:700;letter-spacing:.05em;margin-bottom:4px">Diagnosis</div>
            <div style="font-size:.88rem;font-weight:600;color:#1C1C1C">${e.diagnosis}</div>
          </div>
          <div>
            <div style="font-size:.7rem;color:#9CA3AF;text-transform:uppercase;font-weight:700;letter-spacing:.05em;margin-bottom:4px">Lens Type</div>
            <div style="font-size:.88rem;font-weight:600;color:#1C1C1C">${e.lensType || '—'}</div>
          </div>
        </div>
        ${e.recommendation ? `<div>
          <div style="font-size:.7rem;color:#9CA3AF;text-transform:uppercase;font-weight:700;letter-spacing:.05em;margin-bottom:4px">Recommendation</div>
          <div style="font-size:.82rem;color:#374151;line-height:1.6">${e.recommendation}</div>
        </div>` : ''}
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn-ghost" onclick="window.closeModal()">Close</button>
      <button class="btn-ghost" onclick="window.printExamRecord('${e.id}');window.closeModal()">
        ${icon('printer','icon-sm')} Print
      </button>
      <button class="btn-primary" style="color:#fff;background:#0891b2;border-color:#0891b2"
              onclick="window.closeModal();window.generateClearanceFromRecord('${e.id}')">
        ${icon('award','icon-sm')} Generate Clearance
      </button>
    </div>`, 'modal-lg')
}
window.viewExamRecord = viewExamRecord

function printExamRecord(examId) {
  const r = getExamRecords().find(r => r.id === examId)
  if (!r) { toast('Record not found.', 'error'); return }
  const p = patients.find(pt => pt.id === r.patientId) || {
    id: r.patientId, name: r.patientName,
    gender: '—', age: '—', dob: null, contact: '—', email: '', address: '', bloodType: '', medicalHistory: ''
  }
  const e = (p.examinations||[]).find(ex => ex.id === examId) || r
  _openExamPrintWindow(p, e)
}
window.printExamRecord = printExamRecord

function generateClearanceFromRecord(examId) {
  const e = getExamRecords().find(r => r.id === examId)
  if (!e) { toast('Record not found.', 'error'); return }
  // Build a synthetic patient object for the clearance modal
  const p = patients.find(p => p.id === e.patientId) || {
    id: e.patientId, name: e.patientName, firstName: e.patientName.split(' ')[0],
    lastName: e.patientName.split(' ').slice(1).join(' '),
    gender: '—', dob: '—', address: '—', contact: '—'
  }
  // Inject exam into patient temporarily if needed
  const existing = p.examinations?.find(ex => ex.id === examId)
  if (!existing && p.examinations) p.examinations.push(e)
  generateClearance(e.patientId, examId)
}
window.generateClearanceFromRecord = generateClearanceFromRecord

// ════════════════════════════════════════════════════════════════
//  OPTICAL EXAMINATION — GENERATE OPHTHALMIC CLEARANCE
// ════════════════════════════════════════════════════════════════
function generateClearance(patientId, examId) {
  const p = patients.find(p => p.id === patientId)
  const e = p?.examinations?.find(ex => ex.id === examId)
  if (!p || !e) { toast('Examination record not found.', 'error'); return }

  // Doctor credential lookup
  const DOCTOR_INFO = {
    'Dr. Lalaine Cana':         { name: 'DR. MARIA LALAINE A. CANA, OD', prc: 'PRC LICENSE NO. 0005787', title: 'CEO - PRESIDENT' },
    'Dr. Ruziel Palaje':        { name: 'DR. RUZIEL PALAJE, OD',         prc: 'PRC LICENSE NO. XXXXX',   title: 'OPTOMETRIST' },
    'Dr. Christian Garabiles':  { name: 'DR. CHRISTIAN GARABILES, OD',   prc: 'PRC LICENSE NO. XXXXX',   title: 'OPTOMETRIST' },
    'Dr. Carmen Sumaya':        { name: 'DR. CARMEN SUMAYA, OD',         prc: 'PRC LICENSE NO. XXXXX',   title: 'OPTOMETRIST' },
    'Dr. Julianne Rosche Cana': { name: 'DR. JULIANNE ROSCHE CANA, OD',  prc: 'PRC LICENSE NO. XXXXX',   title: 'OPTOMETRIST' },
  }
  const doc = DOCTOR_INFO[e.doctor] || {
    name:  (e.doctor || 'DOCTOR').toUpperCase() + ', OD',
    prc:   'PRC LICENSE NO. XXXXX',
    title: 'OPTOMETRIST'
  }

  // Date formatter: "2025-12-10" → "December 10, 2025"
  const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']
  const fmtDate = d => {
    const [y, m, dy] = (d || '').split('-')
    return `${MONTHS[+m - 1] || ''} ${+dy}, ${y}`
  }

  // Pronoun based on gender
  const g    = (p.gender || '').toLowerCase()
  const pronoun = g === 'female' ? 'She' : g === 'male' ? 'He' : 'He/She'
  const poss    = g === 'female' ? 'her' : g === 'male' ? 'his' : 'his/her'

  // RX prescription string builder
  const rxStr = eye => {
    if (!eye) return '\u2014'
    const parts = []
    if (eye.sph && eye.sph !== '0.00') parts.push(`${eye.sph} D sph`)
    if (eye.cyl && eye.cyl !== '0.00') parts.push(`() ${eye.cyl} D cyl x ${eye.axis || '0'}`)
    return parts.join(' ') || (eye.sph ? `${eye.sph} D sph` : '\u2014')
  }

  // Field values — NVA/NNVA may not be stored in older records; fallback to dash
  const nvaOD  = e.od?.nva  || e.nva  || '\u2014'
  const nvaOS  = e.os?.nva  || e.nva  || '\u2014'
  const nnvaOD = e.od?.nnva || e.nnva || '\u2014'
  const nnvaOS = e.os?.nnva || e.nnva || '\u2014'
  const fvaOD  = e.od?.va   || '\u2014'
  const fvaOS  = e.os?.va   || '\u2014'
  const rxOD   = rxStr(e.od)
  const rxOS   = rxStr(e.os)

  // Default editable text blocks
  const remarks1 = `Such condition requires the patient to wear eyeglasses for correctional purposes. A recheck up after 6 months is highly recommended to monitor ${poss} vision.`
  const remarks2 = `This certificate is being issued upon the request of the said patient for whatever purpose it would serve ${poss}.`

  // Remove any existing overlay
  const existing = document.getElementById('clearance-overlay')
  if (existing) existing.remove()

  const overlay = document.createElement('div')
  overlay.id = 'clearance-overlay'
  overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.6);z-index:9999;display:flex;align-items:center;justify-content:center;padding:20px;'

  overlay.innerHTML = `
    <div style="background:#fff;width:100%;max-width:760px;max-height:94vh;overflow-y:auto;display:flex;flex-direction:column;box-shadow:0 24px 80px rgba(0,0,0,.35);">

      <!-- Modal header — hidden on print via .clearance-modal-header -->
      <div class="clearance-modal-header" style="display:flex;align-items:center;justify-content:space-between;padding:13px 22px;border-bottom:1px solid #e5e7eb;flex-shrink:0;">
        <div style="display:flex;align-items:center;gap:8px;color:#1F2937;">
          ${icon('award','icon-sm')}
          <span style="font-size:.9rem;font-weight:700;">Ophthalmic Clearance Preview</span>
        </div>
        <button onclick="document.getElementById('clearance-overlay').remove()"
                style="background:none;border:none;cursor:pointer;color:#6B7280;padding:4px;display:flex;align-items:center;">
          ${icon('x','icon')}
        </button>
      </div>

      <!-- ═══ CERTIFICATE DOCUMENT ═══ -->
      <div class="clearance-document" style="padding:48px 56px;background:#fff;flex:1;font-family:Georgia,'Times New Roman',serif;color:#111;font-size:.95rem;line-height:1.7;">

        <!-- LETTERHEAD -->
        <div style="border:1.5px solid #222;padding:18px 24px;margin-bottom:36px;text-align:center;">
          <div style="display:flex;align-items:center;justify-content:center;gap:16px;margin-bottom:10px;">
            <img src="${window._clinicLogoUrl || 'brand_assests/cana logo.png'}" alt="Cana Optical" style="height:64px;flex-shrink:0;">
            <div style="text-align:left;line-height:1;">
              <div style="font-family:Arial,sans-serif;font-size:2rem;font-weight:900;letter-spacing:.05em;color:#111;">CANA OPTICAL</div>
            </div>
          </div>
          <div style="font-family:Arial,sans-serif;font-size:.73rem;text-transform:uppercase;letter-spacing:.05em;color:#222;margin-bottom:3px;">UNIT 3, PASEO DE CARMONA, CARMONA, CAVITE</div>
          <div style="font-family:Arial,sans-serif;font-size:.73rem;font-weight:700;color:#222;">MOBILE NUMBER: 09952376617 / 09296636080</div>
        </div>

        <!-- TITLE -->
        <div style="text-align:center;margin:32px 0;font-family:Arial,sans-serif;font-size:1.5rem;font-weight:700;letter-spacing:.15em;text-transform:uppercase;color:#111;">
          CERTIFICATION
        </div>

        <!-- BODY PARAGRAPH -->
        <p style="font-size:.95rem;line-height:1.7;text-indent:3em;margin:0 0 0;color:#111;">
          This is to certify that <strong style="text-transform:uppercase;font-weight:700;letter-spacing:.02em;">${p.name.toUpperCase()}</strong> has undergone a complete eye examination dated ${fmtDate(e.date)}. ${pronoun} was diagnosed as stated below :
        </p>

        <!-- DATA SECTION: NVA / NNVA / RX / FVA -->
        <div style="margin:28px 0 24px;font-family:'Courier New',Courier,monospace;">
          <!-- Column headers -->
          <div style="display:grid;grid-template-columns:17% 17% 44% 22%;font-family:Arial,sans-serif;font-size:.82rem;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:#111;padding-bottom:6px;">
            <span>NVA</span>
            <span>NNVA</span>
            <span>RX</span>
            <span>FVA</span>
          </div>
          <div style="height:2px;background:#222;margin-bottom:8px;"></div>
          <!-- OD row -->
          <div style="display:grid;grid-template-columns:17% 17% 44% 22%;line-height:2.2;font-size:.9rem;color:#111;">
            <span>OD ${nvaOD}</span>
            <span>OD ${nnvaOD}</span>
            <span>OD ${rxOD}</span>
            <span>OD ${fvaOD}</span>
          </div>
          <!-- OS row -->
          <div style="display:grid;grid-template-columns:17% 17% 44% 22%;line-height:2.2;font-size:.9rem;color:#111;">
            <span>OS ${nvaOS}</span>
            <span>OS ${nnvaOS}</span>
            <span>OS ${rxOS}</span>
            <span>OS ${fvaOS}</span>
          </div>
        </div>

        <!-- DIAGNOSIS -->
        <div style="margin:20px 0;font-size:.9rem;color:#111;display:flex;gap:14px;align-items:baseline;">
          <span style="font-family:Arial,sans-serif;font-weight:700;text-transform:uppercase;white-space:nowrap;flex-shrink:0;">DIAGNOSIS :</span>
          <span style="font-family:Arial,sans-serif;font-weight:700;text-transform:uppercase;">${(e.diagnosis || '\u2014').toUpperCase()}</span>
        </div>

        <!-- REMARKS 1 — editable -->
        <textarea id="clearance-remarks-1" rows="4" class="clearance-textarea"
          style="width:100%;box-sizing:border-box;font-family:Georgia,'Times New Roman',serif;font-size:.95rem;line-height:1.7;color:#111;border:none;outline:none;resize:vertical;padding:0;background:transparent;margin:16px 0 4px;display:block;"
          onfocus="this.style.outline='1px dashed #aaa';this.style.padding='4px'"
          onblur="this.style.outline='none';this.style.padding='0'"
        >${remarks1}</textarea>

        <!-- REMARKS 2 — editable -->
        <textarea id="clearance-remarks-2" rows="3" class="clearance-textarea"
          style="width:100%;box-sizing:border-box;font-family:Georgia,'Times New Roman',serif;font-size:.95rem;line-height:1.7;color:#111;border:none;outline:none;resize:vertical;padding:0;background:transparent;margin-bottom:16px;display:block;"
          onfocus="this.style.outline='1px dashed #aaa';this.style.padding='4px'"
          onblur="this.style.outline='none';this.style.padding='0'"
        >${remarks2}</textarea>

        <!-- SIGNATURE — right-aligned -->
        <div style="margin-top:48px;text-align:right;">
          <div style="font-family:Arial,sans-serif;font-size:.88rem;font-weight:700;text-transform:uppercase;color:#111;margin-bottom:52px;">SIGNED :</div>
          <div style="display:inline-block;text-align:center;min-width:260px;">
            <div style="border-bottom:1px solid #111;margin-bottom:8px;"></div>
            <div style="font-family:Arial,sans-serif;font-size:.85rem;font-weight:700;text-transform:uppercase;color:#111;">${doc.name}</div>
            <div style="font-family:Arial,sans-serif;font-size:.78rem;color:#111;margin-top:2px;">${doc.prc}</div>
            <div style="font-family:Arial,sans-serif;font-size:.78rem;color:#111;">${doc.title}</div>
          </div>
        </div>

      </div>
      <!-- ═══ END CERTIFICATE ═══ -->

      <!-- Action footer — hidden on print via .clearance-actions -->
      <div class="clearance-actions" style="display:flex;justify-content:flex-end;gap:12px;padding:16px 24px;border-top:1px solid #e5e7eb;flex-shrink:0;background:#f9fafb;">
        <button onclick="document.getElementById('clearance-overlay').remove()"
                style="display:flex;align-items:center;gap:6px;padding:8px 18px;border-radius:6px;border:1px solid #D1D5DB;background:#fff;color:#374151;font-size:.85rem;font-weight:500;cursor:pointer;">
          ${icon('x','icon-sm')} Close
        </button>
        <button onclick="window.toast('PDF downloaded successfully.','success')"
                style="display:flex;align-items:center;gap:6px;padding:8px 18px;border-radius:6px;border:1px solid #0891b2;background:#fff;color:#0891b2;font-size:.85rem;font-weight:500;cursor:pointer;">
          ${icon('download','icon-sm')} Download PDF
        </button>
        <button onclick="window.print()"
                style="display:flex;align-items:center;gap:6px;padding:8px 20px;border-radius:6px;border:none;background:#0891b2;color:#fff;font-size:.85rem;font-weight:600;cursor:pointer;">
          ${icon('printer','icon-sm')} Print Document
        </button>
      </div>
    </div>
  `

  document.body.appendChild(overlay)
  overlay.addEventListener('click', ev => { if (ev.target === overlay) overlay.remove() })
}
window.generateClearance = generateClearance

// ════════════════════════════════════════════════════════════════
//  OPTICAL EXAMINATION — CLEAN PRINT WINDOW (A4 document)
// ════════════════════════════════════════════════════════════════
function _openExamPrintWindow(p, e) {
  const _inits  = name => (name||'').split(' ').slice(0,2).map(w=>w[0]||'').join('').toUpperCase()
  const _fmtDt  = d => d ? new Date(d.includes('T') ? d : d+'T00:00:00').toLocaleDateString('en-PH',{year:'numeric',month:'long',day:'numeric'}) : '—'
  const eyeRow  = (lbl, od, os) => `
    <tr>
      <td style="padding:8px 12px;font-size:12px;color:#555;font-weight:600;border-bottom:1px solid #eee">${lbl}</td>
      <td style="padding:8px 12px;font-size:13px;font-weight:800;color:#1D4ED8;text-align:center;border-bottom:1px solid #eee">${od||'—'}</td>
      <td style="padding:8px 12px;font-size:13px;font-weight:800;color:#059669;text-align:center;border-bottom:1px solid #eee">${os||'—'}</td>
    </tr>`
  const pill    = txt => `<span style="display:inline-block;background:#E8760A;color:#fff;font-size:10px;font-weight:700;padding:2px 9px;border-radius:20px;margin:2px 3px 2px 0">${txt}</span>`
  const secLbl  = txt => `<div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:#999;margin:14px 0 6px">${txt}</div>`
  const noteBox = txt => `<div style="background:#fffbf0;border:1px solid #fde68a;border-radius:6px;padding:9px 12px;font-size:11px;color:#444;line-height:1.6;margin-bottom:12px">${txt}</div>`

  const showAdd = e.od?.add && e.od.add !== '0.00'
  const examDate = _fmtDt(e.date)
  const dob      = _fmtDt(p.dob)
  const generated = new Date().toLocaleDateString('en-PH',{year:'numeric',month:'long',day:'numeric',hour:'2-digit',minute:'2-digit'})

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Optical Examination — ${p.name}</title>
  <style>
    @page { size: A4; margin: 15mm 18mm 15mm 18mm; }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: Arial, Helvetica, sans-serif; color: #111; font-size: 12px; line-height: 1.5; background: #fff; }
    table { width: 100%; border-collapse: collapse; }
    .clinic-hdr  { text-align: center; border-bottom: 2.5px solid #E8760A; padding-bottom: 12px; margin-bottom: 18px; }
    .clinic-name { font-size: 22px; font-weight: 900; color: #E8760A; letter-spacing: -.02em; }
    .clinic-sub  { font-size: 11px; color: #888; margin-top: 3px; }
    .clinic-doc  { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: .1em; color: #bbb; margin-top: 5px; }
    .patient-block { display: flex; gap: 16px; align-items: flex-start; padding: 14px 16px; background: #f9f9f9; border: 1px solid #eee; border-radius: 8px; margin-bottom: 16px; }
    .avatar { width: 56px; height: 56px; border-radius: 50%; background: linear-gradient(135deg,#E8760A,#F5A44D); display: flex; align-items: center; justify-content: center; color: #fff; font-size: 20px; font-weight: 900; flex-shrink: 0; }
    .pt-name   { font-size: 17px; font-weight: 800; color: #111; margin-bottom: 1px; }
    .pt-id     { font-size: 11px; font-family: monospace; color: #aaa; margin-bottom: 5px; }
    .pt-meta   { display: flex; flex-wrap: wrap; gap: 6px 14px; }
    .pt-meta span { font-size: 11px; color: #555; }
    .pt-addr   { font-size: 10.5px; color: #999; margin-top: 3px; }
    .issuer    { text-align: right; flex-shrink: 0; min-width: 160px; }
    .iss-lbl   { font-size: 9.5px; text-transform: uppercase; letter-spacing: .05em; color: #bbb; margin-bottom: 3px; }
    .iss-name  { font-size: 14px; font-weight: 700; color: #111; }
    .iss-date  { font-size: 11px; color: #888; }
    .iss-id    { font-size: 10px; font-family: monospace; color: #bbb; margin-top: 3px; }
    .tbl-hdr th { background: #f5f5f5; padding: 9px 12px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .04em; }
    .tbl-border { border: 1px solid #eee; border-radius: 8px; overflow: hidden; margin-bottom: 14px; }
    .info-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px; margin-bottom: 14px; }
    .info-box  { background: #f9f9f9; border: 1px solid #eee; border-radius: 6px; padding: 9px 12px; }
    .ib-lbl    { font-size: 10px; text-transform: uppercase; letter-spacing: .05em; color: #aaa; margin-bottom: 3px; }
    .ib-val    { font-size: 14px; font-weight: 800; color: #111; }
    .ib-unit   { font-size: 10px; color: #aaa; font-weight: 400; }
    .diag-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 14px; }
    .diag-box  { background: #f9f9f9; border: 1px solid #eee; border-radius: 6px; padding: 10px 14px; }
    .db-lbl    { font-size: 10px; text-transform: uppercase; letter-spacing: .05em; color: #aaa; margin-bottom: 4px; }
    .db-val    { font-size: 14px; font-weight: 800; color: #111; margin-bottom: 3px; }
    .db-sub    { font-size: 11px; color: #555; }
    .remarks-block { border-top: 1px solid #eee; padding-top: 10px; margin-top: 4px; font-style: italic; font-size: 11px; color: #555; }
    .sig-grid  { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-top: 32px; padding-top: 16px; border-top: 1px dashed #ccc; }
    .sig-line  { border-top: 1px solid #111; padding-top: 6px; text-align: center; font-size: 11px; font-weight: 700; text-transform: uppercase; }
    .sig-sub   { font-size: 10px; color: #888; margin-top: 2px; text-align: center; }
    .stamp     { font-size: 9.5px; color: #ccc; text-align: right; font-family: monospace; margin-top: 18px; }
  </style>
</head>
<body>

  <!-- CLINIC HEADER -->
  <div class="clinic-hdr">
    <div class="clinic-name">CANA OPTICAL CLINIC</div>
    <div class="clinic-sub">Optical Examination Record</div>
    <div class="clinic-doc">Confidential Medical Document</div>
  </div>

  <!-- PATIENT PROFILE -->
  ${secLbl('Patient Information')}
  <div class="patient-block">
    <div class="avatar">${_inits(p.name)}</div>
    <div style="flex:1;min-width:0">
      <div class="pt-name">${p.name}</div>
      <div class="pt-id">${p.id}</div>
      <div class="pt-meta">
        <span>${p.gender||'—'}, ${p.age||'—'} yrs</span>
        ${p.dob ? `<span>DOB: ${dob}</span>` : ''}
        ${p.bloodType ? `<span style="font-weight:700;color:#DC2626">Blood Type: ${p.bloodType}</span>` : ''}
      </div>
      <div class="pt-meta" style="margin-top:3px">
        ${p.contact ? `<span>${p.contact}</span>` : ''}
        ${p.email ? `<span>${p.email}</span>` : ''}
      </div>
      ${p.address ? `<div class="pt-addr">${p.address}</div>` : ''}
      ${p.medicalHistory ? `<div class="pt-addr" style="margin-top:4px;color:#888"><strong>Medical History:</strong> ${p.medicalHistory}</div>` : ''}
    </div>
    <div class="issuer">
      <div class="iss-lbl">Examined By</div>
      <div class="iss-name">${e.doctor||'—'}</div>
      <div class="iss-date">${examDate}</div>
      <div class="iss-id">${e.id}</div>
    </div>
  </div>

  <!-- VISUAL ACUITY & REFRACTION -->
  ${secLbl('Visual Acuity &amp; Refraction')}
  <div class="tbl-border">
    <table>
      <thead class="tbl-hdr">
        <tr>
          <th style="text-align:left;color:#777;width:35%">Measurement</th>
          <th style="text-align:center;color:#1D4ED8">OD (Right Eye)</th>
          <th style="text-align:center;color:#059669">OS (Left Eye)</th>
        </tr>
      </thead>
      <tbody>
        ${eyeRow('Sphere (SPH)', e.od?.sph, e.os?.sph)}
        ${eyeRow('Cylinder (CYL)', e.od?.cyl, e.os?.cyl)}
        ${eyeRow('Axis', e.od?.axis, e.os?.axis)}
        ${eyeRow('Visual Acuity', e.od?.va, e.os?.va)}
        ${showAdd ? eyeRow('Add Power', e.od?.add, e.os?.add) : ''}
      </tbody>
    </table>
  </div>

  <!-- IOP / PD -->
  <div class="info-grid">
    <div class="info-box">
      <div class="ib-lbl">IOP — OD</div>
      <div class="ib-val">${e.iop?.od||'—'} <span class="ib-unit">mmHg</span></div>
    </div>
    <div class="info-box">
      <div class="ib-lbl">IOP — OS</div>
      <div class="ib-val">${e.iop?.os||'—'} <span class="ib-unit">mmHg</span></div>
    </div>
    <div class="info-box">
      <div class="ib-lbl">PD (Pupillary Distance)</div>
      <div class="ib-val">${e.pd||'—'} <span class="ib-unit">mm</span></div>
    </div>
  </div>

  <!-- DIAGNOSIS & LENS -->
  ${secLbl('Clinical Assessment')}
  <div class="diag-grid">
    <div class="diag-box">
      <div class="db-lbl">Diagnosis</div>
      <div class="db-val">${e.diagnosis||'—'}</div>
      ${e.recommendation ? `<div class="db-sub">${e.recommendation}</div>` : ''}
    </div>
    <div class="diag-box">
      <div class="db-lbl">Lens Prescription</div>
      <div class="db-val" style="font-size:13px">${e.lensType||'—'}${e.lensMaterial && e.lensMaterial!=='N/A' ? ' / '+e.lensMaterial : ''}</div>
      ${e.lensCoating?.length ? `<div style="margin-top:5px">${e.lensCoating.map(pill).join('')}</div>` : ''}
      ${e.frameSelection && e.frameSelection!=='N/A — monitoring only' ? `<div class="db-sub" style="margin-top:5px">Frame: ${e.frameSelection}</div>` : ''}
    </div>
  </div>

  ${e.prescriptionDetails ? secLbl('Prescription Notes') + noteBox(e.prescriptionDetails) : ''}
  ${e.testResults        ? secLbl('Test Results')       + noteBox(e.testResults)        : ''}
  ${e.remarks ? `<div class="remarks-block">"${e.remarks}"<br><span style="font-size:10px;color:#aaa;font-style:normal">— ${e.doctor}</span></div>` : ''}

  <!-- SIGNATURES -->
  <div class="sig-grid">
    <div>
      <div style="height:44px"></div>
      <div class="sig-line">${e.doctor||'Examining Doctor'}</div>
      <div class="sig-sub">Optometrist / Examining Doctor</div>
    </div>
    <div>
      <div style="height:44px"></div>
      <div class="sig-line">${p.name}</div>
      <div class="sig-sub">Patient Signature &amp; Date</div>
    </div>
  </div>

  <div class="stamp">Exam ID: ${e.id} &bull; Printed: ${generated}</div>

</body></html>`

  const w = window.open('', '_blank', 'width=820,height=900,scrollbars=yes')
  if (!w) { toast('Pop-up blocked — allow pop-ups and try again.', 'error'); return }
  w.document.write(html)
  w.document.close()
  w.focus()
  setTimeout(() => { w.print() }, 450)
}

// ════════════════════════════════════════════════════════════════
//  OPTICAL EXAMINATION — VIEW PRESCRIPTION MODAL
// ════════════════════════════════════════════════════════════════
function viewPrescriptionModal(patientId, examId) {
  const p = patients.find(p => p.id === patientId)
  if (!p) return
  const e = p.examinations.find(e => e.id === examId)
  if (!e) return

  const eyeRow = (lbl, odVal, osVal) => `
    <tr>
      <td style="padding:9px 14px;font-size:.82rem;color:#6B7280;font-weight:600;border-bottom:1px solid #F3F4F6">${lbl}</td>
      <td style="padding:9px 14px;font-size:.88rem;font-weight:800;color:#1D4ED8;border-bottom:1px solid #F3F4F6;text-align:center">${odVal || '—'}</td>
      <td style="padding:9px 14px;font-size:.88rem;font-weight:800;color:#059669;border-bottom:1px solid #F3F4F6;text-align:center">${osVal || '—'}</td>
    </tr>`

  showModal(`
    <div class="modal-header">
      <div class="modal-title">Prescription — ${p.name}</div>
      <button class="modal-close" onclick="window.closeModal()">&times;</button>
    </div>
    <div class="modal-body" id="print-rx-area" style="padding:24px 28px">

      <!-- Clinic header -->
      <div style="text-align:center;border-bottom:2px solid #E8760A;padding-bottom:14px;margin-bottom:18px">
        <div style="font-size:1.3rem;font-weight:900;color:#E8760A;letter-spacing:-.02em">CANA OPTICAL CLINIC</div>
        <div style="font-size:.78rem;color:#6B7280;margin-top:2px">Optical Prescription Record</div>
      </div>

      <!-- Patient profile card -->
      <div style="display:flex;align-items:flex-start;gap:14px;padding:14px 16px;background:#F9FAFB;border-radius:10px;border:1px solid #F3F4F6;margin-bottom:16px">
        <div style="width:52px;height:52px;border-radius:50%;background:linear-gradient(135deg,#E8760A,#F5A44D);display:flex;align-items:center;justify-content:center;font-size:1.2rem;font-weight:800;color:#fff;flex-shrink:0;box-shadow:0 3px 10px rgba(232,118,10,.25)">${(p.name||'').split(' ').slice(0,2).map(w=>w[0]||'').join('').toUpperCase()}</div>
        <div style="flex:1;min-width:0">
          <div style="font-size:1.05rem;font-weight:800;color:#111;margin-bottom:1px">${p.name}</div>
          <div style="font-size:.72rem;font-family:monospace;color:#9CA3AF;margin-bottom:5px">${p.id}</div>
          <div style="display:flex;flex-wrap:wrap;gap:6px 12px">
            <span style="font-size:.75rem;color:#555">${p.gender||'—'}, ${p.age||'—'} yrs</span>
            ${p.contact ? `<span style="font-size:.75rem;color:#555">${p.contact}</span>` : ''}
            ${p.bloodType ? `<span style="font-size:.75rem;font-weight:700;color:#DC2626">BT ${p.bloodType}</span>` : ''}
          </div>
          ${p.address ? `<div style="font-size:.71rem;color:#9CA3AF;margin-top:3px">${p.address}</div>` : ''}
        </div>
        <div style="text-align:right;flex-shrink:0">
          <div style="font-size:.65rem;color:#9CA3AF;text-transform:uppercase;letter-spacing:.04em;margin-bottom:3px">Issued By</div>
          <div style="font-size:.88rem;font-weight:700;color:#111">${e.doctor}</div>
          <div style="font-size:.75rem;color:#6B7280">${new Date(e.date.includes('T')?e.date:e.date+'T00:00:00').toLocaleDateString('en-PH',{year:'numeric',month:'long',day:'numeric'})}</div>
          <div style="font-size:.68rem;font-family:monospace;color:#9CA3AF;margin-top:3px">${e.id}</div>
        </div>
      </div>

      <!-- Vision Rx table -->
      <table style="width:100%;border-collapse:collapse;border:1px solid #E5E7EB;border-radius:8px;overflow:hidden;margin-bottom:14px">
        <thead>
          <tr style="background:#F9FAFB">
            <th style="padding:10px 14px;font-size:.72rem;color:#9CA3AF;text-align:left;font-weight:600;text-transform:uppercase;letter-spacing:.04em">Measurement</th>
            <th style="padding:10px 14px;font-size:.75rem;color:#1D4ED8;text-align:center;font-weight:800;text-transform:uppercase;letter-spacing:.04em">OD (Right Eye)</th>
            <th style="padding:10px 14px;font-size:.75rem;color:#059669;text-align:center;font-weight:800;text-transform:uppercase;letter-spacing:.04em">OS (Left Eye)</th>
          </tr>
        </thead>
        <tbody>
          ${eyeRow('Sphere (SPH)',   e.od?.sph, e.os?.sph)}
          ${eyeRow('Cylinder (CYL)', e.od?.cyl, e.os?.cyl)}
          ${eyeRow('Axis',           e.od?.axis, e.os?.axis)}
          ${eyeRow('Visual Acuity',  e.od?.va,  e.os?.va)}
          ${e.od?.add ? eyeRow('Add Power', e.od?.add, e.os?.add) : ''}
        </tbody>
      </table>

      <!-- Details row -->
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-bottom:14px">
        <div style="background:#F9FAFB;border-radius:6px;padding:9px 12px">
          <div style="font-size:.65rem;color:#9CA3AF;text-transform:uppercase;letter-spacing:.04em">IOP</div>
          <div style="font-size:.85rem;font-weight:700;color:#1C1C1C;margin-top:2px">OD ${e.iop?.od || '—'} / OS ${e.iop?.os || '—'} mmHg</div>
        </div>
        <div style="background:#F9FAFB;border-radius:6px;padding:9px 12px">
          <div style="font-size:.65rem;color:#9CA3AF;text-transform:uppercase;letter-spacing:.04em">PD</div>
          <div style="font-size:.85rem;font-weight:700;color:#1C1C1C;margin-top:2px">${e.pd || '—'} mm</div>
        </div>
        <div style="background:#F9FAFB;border-radius:6px;padding:9px 12px">
          <div style="font-size:.65rem;color:#9CA3AF;text-transform:uppercase;letter-spacing:.04em">Lens</div>
          <div style="font-size:.85rem;font-weight:700;color:#1C1C1C;margin-top:2px">${e.lensType || '—'}</div>
        </div>
      </div>

      ${e.prescriptionDetails ? `
      <div style="margin-bottom:12px">
        <div style="font-size:.7rem;font-weight:700;color:#9CA3AF;text-transform:uppercase;letter-spacing:.05em;margin-bottom:5px">Prescription Notes</div>
        <div style="font-size:.82rem;color:#374151;background:#FFFBF5;border:1px solid #FDE68A;border-radius:6px;padding:9px 12px;line-height:1.6">${e.prescriptionDetails}</div>
      </div>` : ''}

      ${e.lensCoating?.length ? `
      <div style="margin-bottom:12px">
        <div style="font-size:.7rem;font-weight:700;color:#9CA3AF;text-transform:uppercase;letter-spacing:.05em;margin-bottom:4px">Lens Coatings</div>
        <div style="display:flex;gap:6px;flex-wrap:wrap">
          ${e.lensCoating.map(c=>`<span style="background:#E8760A;color:#fff;font-size:.72rem;font-weight:600;padding:3px 10px;border-radius:20px">${c}</span>`).join('')}
        </div>
      </div>` : ''}

      ${e.remarks ? `
      <div style="border-top:1px solid #F3F4F6;padding-top:12px;margin-top:4px">
        <div style="font-size:.7rem;font-weight:700;color:#9CA3AF;text-transform:uppercase;letter-spacing:.05em;margin-bottom:5px">Doctor's Remarks</div>
        <div style="font-size:.82rem;color:#374151;font-style:italic">"${e.remarks}"</div>
      </div>` : ''}

      <!-- Signature line -->
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-top:28px;padding-top:18px;border-top:1px dashed #E5E7EB">
        <div style="text-align:center">
          <div style="border-top:1px solid #1C1C1C;padding-top:6px;font-size:.78rem;color:#374151;font-weight:600">${e.doctor}</div>
          <div style="font-size:.7rem;color:#9CA3AF">Optometrist</div>
        </div>
        <div style="text-align:center">
          <div style="border-top:1px solid #1C1C1C;padding-top:6px;font-size:.78rem;color:#374151;font-weight:600">${p.name}</div>
          <div style="font-size:.7rem;color:#9CA3AF">Patient Signature</div>
        </div>
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn-secondary" onclick="window.closeModal()">Close</button>
      ${state.role !== 'patient' ? `<button class="btn-primary" onclick="window.printPrescription('${patientId}','${examId}')">
        ${icon('printer','icon-sm')} Print Prescription
      </button>` : ''}
    </div>`, 'modal-lg')
}
window.viewPrescriptionModal = viewPrescriptionModal

// ════════════════════════════════════════════════════════════════
//  OPTICAL EXAMINATION — PRINT PRESCRIPTION
// ════════════════════════════════════════════════════════════════
function printPrescription(patientId, examId) {
  const p = patients.find(pt => pt.id === patientId)
  if (!p) return
  const e = p.examinations.find(ex => ex.id === examId)
  if (!e) return
  _openExamPrintWindow(p, e)
}
window.printPrescription = printPrescription

// ════════════════════════════════════════════════════════════════
//  DASHBOARD UPDATERS
// ════════════════════════════════════════════════════════════════

function updateAdminCharts() {
  const el    = id => document.getElementById(id)
  const range = parseInt(el('admin-chart-range-select')?.value || '6', 10)
  const now   = new Date()
  const labels = []
  const apptMonths = []
  const ptMonths   = []
  for (let i = range - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    labels.push(d.toLocaleString('en-US', { month: 'short' }))
    const y = d.getFullYear(), m = d.getMonth()
    apptMonths.push(appointments.filter(a => {
      const ad = new Date(a.date); return ad.getFullYear() === y && ad.getMonth() === m && !['cancelled','disapproved'].includes(a.status)
    }).length)
    ptMonths.push(patients.filter(p => {
      if (!p.registeredDate) return false
      const pd = new Date(p.registeredDate); return pd.getFullYear() === y && pd.getMonth() === m
    }).length)
  }

  if (window._charts?.updateAppointmentsChart) window._charts.updateAppointmentsChart(apptMonths, labels)
  if (window._charts?.updatePatientGrowthChart) window._charts.updatePatientGrowthChart(ptMonths, labels)
  const rangeEl = el('admin-chart-range-label')
  if (rangeEl && labels.length) rangeEl.textContent = labels.length > 1 ? `${labels[0]} – ${labels[labels.length - 1]}` : labels[0]
}
window.updateAdminCharts = updateAdminCharts

function updateAdminDashboard() {
  const todayStr     = new Date().toISOString().split('T')[0]
  const todayCnt     = appointments.filter(a => a.date === todayStr && !['cancelled','disapproved'].includes(a.status)).length
  const completedCnt = appointments.filter(a => a.status === 'completed').length
  const cancelledCnt = appointments.filter(a => a.status === 'cancelled').length
  const totalDocs    = doctors.length
  const availDocs    = doctors.filter(d => d.status === 'active' && d.available).length
  const pendingCnt   = appointments.filter(a => a.status === 'pending').length

  // ── Update stat cards ─────────────────────────────────────────
  const el = id => document.getElementById(id)
  if (el('admin-stat-patients'))  { el('admin-stat-patients').textContent  = patients.length; const pdelta = el('admin-stat-patients').closest('.stat-info')?.querySelector('.stat-delta'); if (pdelta) pdelta.textContent = patients.filter(p=>p.status==='active').length + ' active' }
  if (el('admin-stat-appts'))     { el('admin-stat-appts').textContent     = appointments.length; const d = el('admin-stat-appts').closest('.stat-info')?.querySelector('.stat-delta'); if (d) d.textContent = pendingCnt + ' pending' }
  if (el('admin-stat-doctors'))     el('admin-stat-doctors').textContent   = availDocs + '/' + totalDocs
  if (el('admin-stat-today'))       el('admin-stat-today').textContent     = todayCnt
  if (el('admin-stat-completed'))   el('admin-stat-completed').textContent = completedCnt
  if (el('admin-stat-cancelled'))   el('admin-stat-cancelled').textContent = cancelledCnt

  // ── Update charts with real monthly data ─────────────────────
  updateAdminCharts()

  // ── Update doctor availability list ──────────────────────────
  const docList = el('admin-doctors-list')
  if (docList && doctors.length > 0) {
    docList.innerHTML = doctors.map(d => {
      const avail   = d.available && d.status === 'active'
      const docAvatar = d.photoUrl
        ? `<div style="width:32px;height:32px;border-radius:50%;overflow:hidden;flex-shrink:0"><img src="${d.photoUrl}" alt="${d.name}" style="width:100%;height:100%;object-fit:cover;object-position:top;display:block"></div>`
        : `<div style="width:32px;height:32px;border-radius:50%;background:#E8760A;color:#fff;font-size:.65rem;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0">${d.name.split(' ').filter(Boolean).map(w=>w[0]).slice(0,2).join('').toUpperCase()}</div>`
      return `<div class="doctor-avail-item">
        <div class="doctor-avail-info">
          <div class="avail-dot ${avail ? 'available' : 'unavailable'}"></div>
          ${docAvatar}
          <div>
            <div style="font-size:.85rem;font-weight:600;color:#1C1C1C">${d.name}</div>
            <div style="font-size:.75rem;color:#9CA3AF">${d.specialization} &bull; ${(d.days||[]).join(', ')}</div>
          </div>
        </div>
        ${badge(avail ? 'active' : 'inactive')}
      </div>`
    }).join('')
  }

  // ── Update recent appointments ────────────────────────────────
  const apptsTbody = el('admin-appts-tbody')
  if (apptsTbody) {
    const recent = [...appointments].sort((a, b) => b.date.localeCompare(a.date) || String(b.id).localeCompare(String(a.id))).slice(0, 6)
    apptsTbody.innerHTML = recent.map(a => `<tr>
      <td style="font-size:.82rem;font-weight:600">${a.patientName || '—'}</td>
      <td style="font-size:.78rem;color:#6B7280">${(a.doctorName || '').replace('Dr. ', '').split(' ').pop()}</td>
      <td style="font-size:.78rem;color:#6B7280;white-space:nowrap">${fmtDate(a.date)}</td>
      <td>${badge(a.status)}</td>
    </tr>`).join('')
  }

  // ── Update activity feed ──────────────────────────────────────
  const _iconForType  = t => ({ appointment:'calendar', examination:'eye', patient:'user', login:'log-out', report:'file-text', schedule:'clock', settings:'settings', account:'shield', archive:'archive' }[t] || 'activity')
  const _colorForType = t => ({ appointment:'orange', examination:'blue', patient:'green', login:'purple', report:'blue', schedule:'orange', settings:'orange', account:'red', archive:'red' }[t] || 'orange')
  const _relTime = ts => {
    const diff = Date.now() - new Date(ts.replace(' ', 'T')).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 60) return mins <= 1 ? 'Just now' : `${mins} min ago`
    const hrs = Math.floor(mins / 60)
    if (hrs < 24) return `${hrs} hour${hrs > 1 ? 's' : ''} ago`
    const days = Math.floor(hrs / 24)
    return days === 1 ? 'Yesterday' : `${days} days ago`
  }
  const actFeed = el('admin-activity-feed')
  if (actFeed && activityLog.length > 0) {
    actFeed.innerHTML = activityLog.slice(0, 5).map(a => `
    <div class="activity-item">
      <div class="activity-icon-wrap ${_colorForType(a.type)}">${icon(_iconForType(a.type), 'icon-sm')}</div>
      <div class="activity-content">
        <div class="activity-action"><strong>${a.user}</strong> ${a.action}</div>
        <div class="activity-meta">${_relTime(a.timestamp)}</div>
      </div>
    </div>`).join('')
  }
}
window.updateAdminDashboard = updateAdminDashboard

function updateStaffDashboard() {
  const pending  = appointments.filter(a => a.status === 'pending')
  const approved = appointments.filter(a => a.status === 'approved')

  const el = id => document.getElementById(id)
  if (el('staff-stat-pending'))  el('staff-stat-pending').textContent  = pending.length
  if (el('staff-stat-approved')) el('staff-stat-approved').textContent = approved.length
  if (el('staff-stat-patients')) el('staff-stat-patients').textContent = patients.length

  // ── Update weekly chart ───────────────────────────────────────
  if (window._charts?.updateStaffOverviewChart) {
    const now      = new Date()
    const weekDay  = now.getDay()
    const monday   = new Date(now)
    monday.setDate(now.getDate() - (weekDay === 0 ? 6 : weekDay - 1))
    monday.setHours(0, 0, 0, 0)
    const dayLabels    = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    const weeklyCounts = dayLabels.map((_, i) => {
      const day = new Date(monday)
      day.setDate(monday.getDate() + i)
      const dateStr = day.toISOString().split('T')[0]
      return appointments.filter(a => a.date === dateStr && !['cancelled', 'disapproved'].includes(a.status)).length
    })
    window._charts.updateStaffOverviewChart(weeklyCounts, dayLabels)
  }

  // ── Update pending approvals table ────────────────────────────
  const tbody = el('staff-appts-tbody')
  if (tbody && pending.length > 0) {
    tbody.innerHTML = pending.slice(0, 5).map(a => `<tr>
      <td style="font-size:.82rem;font-weight:600">${a.patientName || '—'}</td>
      <td style="font-size:.78rem;color:#6B7280">${(a.doctorName || '').replace('Dr. ', '')}</td>
      <td style="font-size:.78rem">${fmtDate(a.date)}</td>
      <td><button class="btn-success" onclick="window.approveAppt('${a.id}')">Approve</button></td>
    </tr>`).join('')
  }
}
window.updateStaffDashboard = updateStaffDashboard

// ════════════════════════════════════════════════════════════════
//  DOCTOR SCHEDULE — TAB / PANEL SWITCHERS
// ════════════════════════════════════════════════════════════════
function switchScheduleDoctor(id) {
  document.querySelectorAll('.sched-doctor-panel').forEach(p => p.style.display = 'none')
  const panel = document.getElementById('sched-panel-' + id)
  if (panel) panel.style.display = ''
  document.querySelectorAll('.sched-tab').forEach(t => {
    t.classList.toggle('active', String(t.dataset.doc) === String(id))
  })
}
window.switchScheduleDoctor = switchScheduleDoctor

// ════════════════════════════════════════════════════════════════
//  CALENDAR MONTH NAVIGATION — shared helpers
// ════════════════════════════════════════════════════════════════
function buildCalCells(year, month, docDays, docId) {
  const now      = new Date()
  const todayY   = now.getFullYear()
  const todayM   = now.getMonth()
  const todayD   = now.getDate()
  const dayNames = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMon = new Date(year, month + 1, 0).getDate()

  const apptsByDate = {}
  appointments
    .filter(a => (docId ? a.doctorId === docId : true) && ['approved','pending'].includes(a.status))
    .forEach(a => {
      if (!apptsByDate[a.date]) apptsByDate[a.date] = []
      apptsByDate[a.date].push(a)
    })

  let cells = ''
  for (let i = 0; i < firstDay; i++) cells += `<div class="cal-day other-month"></div>`
  for (let d = 1; d <= daysInMon; d++) {
    const dow      = new Date(year, month, d).getDay()
    const dayAbb   = dayNames[dow]
    const isToday  = year === todayY && month === todayM && d === todayD
    const dateStr  = `${year}-${String(month+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`
    const avail    = (docDays || []).includes(dayAbb)
    const dayAppts = apptsByDate[dateStr] || []
    let cls = avail ? 'avail' : ''
    if (isToday) cls += (cls ? ' ' : '') + 'today'
    const tip = dayAppts.length
      ? `onmouseenter="window.showCalTip(this,'${JSON.stringify(dayAppts.map(a=>({time:a.time,patientName:a.patientName,status:a.status}))).replace(/'/g,'&#39;').replace(/"/g,'&quot;')}')" onmouseleave="window.hideCalTip()"`
      : ''
    cells += `<div class="cal-day ${cls}${dayAppts.length?' has-appts':''}" ${tip}>${d}</div>`
  }
  return cells
}

// Real schedule appointments — looked up from the shared appointments array
function _getSchedAppts(dateStr, docId) {
  const _timeVal = t => { if (!t) return 0; const cl = t.includes('PM') && !t.startsWith('12'); const [h, m] = t.replace(/ [AP]M$/, '').split(':').map(Number); return (cl ? h + 12 : (t.includes('AM') && h === 12 ? 0 : h)) * 60 + m }
  return appointments
    .filter(a => a.date === dateStr && (!docId || a.doctorId === docId) && !['cancelled', 'disapproved'].includes(a.status))
    .sort((a, b) => _timeVal(a.time) - _timeVal(b.time))
    .map(a => ({ time: a.time, patient: a.patientName, type: a.type }))
}

// Build calendar cells for the doctor schedule page (uses real appointments)
function buildDocCalCells(year, month, docDays) {
  const now       = new Date()
  const todayY    = now.getFullYear()
  const todayM    = now.getMonth()
  const todayD    = now.getDate()
  const dayNames  = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']
  const firstDay  = new Date(year, month, 1).getDay()
  const daysInMon = new Date(year, month + 1, 0).getDate()
  const doc       = doctors.find(d => d.id === state.user?.id)

  let cells = ''
  for (let i = 0; i < firstDay; i++) cells += `<div class="cal-day other-month"></div>`
  for (let d = 1; d <= daysInMon; d++) {
    const dow      = new Date(year, month, d).getDay()
    const dayAbb   = dayNames[dow]
    const isToday  = year === todayY && month === todayM && d === todayD
    const isPast   = new Date(year, month, d) < new Date(todayY, todayM, todayD)
    const dateStr  = `${year}-${String(month+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`
    const avail    = (docDays || []).includes(dayAbb)
    const hasAppts = doc ? appointments.some(a => a.date === dateStr && a.doctorId === doc.id && !['cancelled','disapproved'].includes(a.status)) : false

    let cls = avail ? 'avail' : ''
    if (isToday) cls += (cls ? ' ' : '') + 'today'
    if (hasAppts) cls += ' has-appts'
    const fadeStyle = isPast && !isToday ? 'opacity:0.5;' : ''

    cells += `<div class="cal-day ${cls}" style="${fadeStyle}"
      onclick="window.docSchedClickDay('${dateStr}','${avail}','${dayAbb}',this)">${d}</div>`
  }
  return cells
}

// Doctor schedule page — update calendar + show today's schedule
function docSchedGoMonth(year, month) {
  const now    = new Date()
  const todayY = now.getFullYear()
  const todayM = now.getMonth()
  const todayD = now.getDate()

  const { user } = state
  const doc = doctors.find(d => d.id === user?.id) || doctors[0]
  if (!doc) return

  const monthName = new Date(year, month, 1).toLocaleDateString('en-PH', { month: 'long', year: 'numeric' })
  const prevMonth = month === 0 ? 11 : month - 1
  const prevYear  = month === 0 ? year - 1 : year
  const nextMonth = month === 11 ? 0 : month + 1
  const nextYear  = month === 11 ? year + 1 : year

  const titleEl = document.getElementById('doc-sched-title')
  if (titleEl) titleEl.textContent = monthName

  const calEl = document.getElementById('doc-sched-cal')
  if (calEl) calEl.innerHTML = buildDocCalCells(year, month, doc.days)

  const prev     = document.getElementById('doc-sched-prev')
  const next     = document.getElementById('doc-sched-next')
  const todayBtn = document.getElementById('doc-sched-today')
  if (prev)     prev.onclick     = () => docSchedGoMonth(prevYear, prevMonth)
  if (next)     next.onclick     = () => docSchedGoMonth(nextYear, nextMonth)
  if (todayBtn) todayBtn.onclick = () => docSchedGoMonth(todayY, todayM)

  // Show today's schedule in the panel by default
  const todayStr = `${todayY}-${String(todayM+1).padStart(2,'0')}-${String(todayD).padStart(2,'0')}`
  const dayAbb   = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][new Date(todayY, todayM, todayD).getDay()]
  const avail    = (doc.days || []).includes(dayAbb)
  window.docSchedClickDay(todayStr, String(avail), dayAbb, null)
}
window.docSchedGoMonth = docSchedGoMonth

function docSchedClickDay(dateStr, availStr, dayAbb, cellEl) {
  // Highlight selected cell
  document.querySelectorAll('#doc-sched-cal .cal-day').forEach(el => el.style.outline = '')
  if (cellEl) cellEl.style.outline = '2px solid #E8760A'

  const avail = availStr === 'true' || availStr === true
  const doc   = doctors.find(d => d.id === state.user?.id)
  const appts = _getSchedAppts(dateStr, doc?.id)
  const dt       = new Date(dateStr + 'T00:00:00')
  const isWeekend = dt.getDay() === 0 || dt.getDay() === 6
  const dayNames  = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']
  const dateLabel = dt.toLocaleDateString('en-PH', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })

  const titleEl = document.getElementById('doc-sched-list-title')
  const listEl  = document.getElementById('doc-sched-list')
  if (!listEl) return
  if (titleEl) titleEl.textContent = dateLabel

  if (!avail && isWeekend) {
    listEl.innerHTML = `<div style="padding:28px 20px;text-align:center;color:#9CA3AF;font-size:.85rem">
      ${icon('calendar','icon-lg')}<br><br>
      <strong style="color:#374151;font-size:.9rem">Weekend</strong><br>
      <span style="font-size:.82rem">No consultations scheduled.</span></div>`
    return
  }

  if (!avail) {
    listEl.innerHTML = `<div style="padding:28px 20px;text-align:center;color:#9CA3AF;font-size:.85rem">
      ${icon('x-circle','icon-lg')}<br><br>
      <strong style="color:#374151;font-size:.9rem">Not Scheduled</strong><br>
      <span style="font-size:.82rem">You are not available for consultations on ${dayNames[dt.getDay()]}s.</span></div>`
    return
  }

  const hoursBlock = `
    <div style="padding:14px 20px;border-bottom:1px solid #F3F4F6">
      <div style="font-size:.68rem;text-transform:uppercase;letter-spacing:.06em;color:#9CA3AF;font-weight:700;margin-bottom:8px">Consultation Hours</div>
      <div style="display:flex;flex-direction:column;gap:5px">
        <div style="display:flex;align-items:center;gap:7px;font-size:.82rem;color:#374151">
          ${icon('clock','icon-sm')} 8:00 AM – 12:00 PM
        </div>
        <div style="display:flex;align-items:center;gap:7px;font-size:.82rem;color:#374151">
          ${icon('clock','icon-sm')} 1:00 PM – 5:00 PM
        </div>
      </div>
    </div>`

  if (!appts.length) {
    listEl.innerHTML = hoursBlock + `<div style="padding:28px 20px;text-align:center;color:#9CA3AF;font-size:.85rem">
      ${icon('check-circle','icon-lg')}<br><br>
      <span style="font-size:.82rem">No appointments scheduled for this day.</span></div>`
    return
  }

  const apptItems = appts.map(a => `
    <div style="display:flex;gap:10px;align-items:flex-start;margin-bottom:16px">
      <div style="width:7px;height:7px;border-radius:50%;background:#E8760A;flex-shrink:0;margin-top:5px"></div>
      <div>
        <div style="font-size:.82rem;font-weight:700;color:#1C1C1C">${a.time}</div>
        <div style="font-size:.88rem;color:#1C1C1C;margin-top:2px">${a.patient}</div>
        <div style="font-size:.78rem;color:#9CA3AF;margin-top:1px">${a.type}</div>
      </div>
    </div>`).join('')

  listEl.innerHTML = hoursBlock + `
    <div style="padding:14px 20px">
      <div style="font-size:.68rem;text-transform:uppercase;letter-spacing:.06em;color:#9CA3AF;font-weight:700;margin-bottom:12px">
        Appointments (${appts.length})
      </div>
      ${apptItems}
    </div>`
}
window.docSchedClickDay = docSchedClickDay

// Staff/Admin schedule page — update all doctor calendar grids in place
function schedGoMonth(year, month) {
  const now    = new Date()
  const todayY = now.getFullYear()
  const todayM = now.getMonth()

  const monthName = new Date(year, month, 1).toLocaleDateString('en-PH', { month: 'long', year: 'numeric' })
  const prevMonth = month === 0 ? 11 : month - 1
  const prevYear  = month === 0 ? year - 1 : year
  const nextMonth = month === 11 ? 0 : month + 1
  const nextYear  = month === 11 ? year + 1 : year

  const allDocs = typeof getAvailableDoctors === 'function' ? getAvailableDoctors() : []

  // Update each doctor's calendar grid
  allDocs.forEach(doc => {
    const calEl = document.getElementById('sched-cal-' + doc.id)
    if (calEl) calEl.innerHTML = buildCalCells(year, month, doc.availableDays, doc.id)
  })

  // Update all month titles and wire all nav buttons in all panels
  document.querySelectorAll('.sched-month-title').forEach(el => { el.textContent = monthName })
  document.querySelectorAll('.sched-prev').forEach(btn => { btn.onclick = () => schedGoMonth(prevYear, prevMonth) })
  document.querySelectorAll('.sched-next').forEach(btn => { btn.onclick = () => schedGoMonth(nextYear, nextMonth) })
  document.querySelectorAll('.sched-today').forEach(btn => { btn.onclick = () => schedGoMonth(todayY, todayM) })
}
window.schedGoMonth = schedGoMonth

// ════════════════════════════════════════════════════════════════
//  PATIENT DOCTOR AVAILABILITY — TAB / PANEL SWITCHERS
// ════════════════════════════════════════════════════════════════
function switchPatDocDoctor(id) {
  document.querySelectorAll('.pat-doc-panel').forEach(p => p.style.display = 'none')
  const panel = document.getElementById('pat-doc-panel-' + id)
  if (panel) panel.style.display = ''
  document.querySelectorAll('.pat-doc-tab').forEach(t => {
    t.classList.toggle('active', String(t.dataset.doc) === String(id))
  })
}
window.switchPatDocDoctor = switchPatDocDoctor

// ════════════════════════════════════════════════════════════════
//  BLOCK DATE MODAL (Admin/Staff)
// ════════════════════════════════════════════════════════════════
function openBlockDateModal(doctorName) {
  showModal(`
    <div class="modal-header">
      <div class="modal-title">Block Date — ${doctorName}</div>
      <button class="modal-close" onclick="window.closeModal()">&times;</button>
    </div>
    <div class="modal-body">
      <div class="form-group">
        <label class="form-label">Date to Block <span class="req">*</span></label>
        <input id="block-date-input" type="date" class="form-input"
               min="${new Date().toISOString().split('T')[0]}">
      </div>
      <div class="form-group">
        <label class="form-label">Reason</label>
        <input id="block-date-reason" type="text" class="form-input"
               placeholder="e.g. Leave, Conference, Holiday…">
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn-secondary" onclick="window.closeModal()">Cancel</button>
      <button class="btn-primary" onclick="
        const d = document.getElementById('block-date-input').value;
        if (!d) { window.toast('Please select a date.','error'); return; }
        window.closeModal();
        window.toast('Date blocked for ${doctorName.replace(/'/g,"\\'")}.');
      ">Block Date</button>
    </div>`)
}
window.openBlockDateModal = openBlockDateModal

// ════════════════════════════════════════════════════════════════
//  CALENDAR APPOINTMENT TOOLTIP
// ════════════════════════════════════════════════════════════════
;(function () {
  const tip = document.createElement('div')
  tip.id = 'cal-tooltip'
  document.body.appendChild(tip)
})()

function showCalTip(el, json) {
  const tip = document.getElementById('cal-tooltip')
  if (!tip) return
  let appts
  try { appts = JSON.parse(json) } catch { return }

  const statusColor = s => ({ approved:'#10B981', pending:'#F59E0B', completed:'#9CA3AF', cancelled:'#EF4444', disapproved:'#EF4444' })[s] || '#9CA3AF'

  tip.innerHTML = `
    <div style="font-weight:600;margin-bottom:6px;font-size:.73rem;color:#F9FAFB">
      ${appts.length} Appointment${appts.length > 1 ? 's' : ''}
    </div>
    ${appts.map(a => `
    <div style="display:flex;align-items:center;gap:7px;padding:4px 0;border-top:1px solid rgba(255,255,255,0.08)">
      <span style="font-size:.67rem;color:#9CA3AF;white-space:nowrap;flex-shrink:0">${a.time}</span>
      <span style="font-size:.7rem;flex:1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${a.patientName}</span>
      <span style="width:7px;height:7px;border-radius:50%;background:${statusColor(a.status)};flex-shrink:0" title="${a.status}"></span>
    </div>`).join('')}
  `

  const rect = el.getBoundingClientRect()
  tip.style.display = 'block'
  const tipW = tip.offsetWidth
  let left = rect.left + rect.width / 2
  // Keep within viewport
  left = Math.max(tipW / 2 + 8, Math.min(left, window.innerWidth - tipW / 2 - 8))
  tip.style.left = left + 'px'

  // Show above or below depending on space
  const spaceAbove = rect.top
  const tipH = tip.offsetHeight + 14
  if (spaceAbove >= tipH) {
    tip.style.top  = (rect.top + window.scrollY - tipH + 4) + 'px'
    tip.style.setProperty('--arr-top', '100%')
    tip.classList.remove('tip-below')
  } else {
    tip.style.top  = (rect.bottom + window.scrollY + 9) + 'px'
    tip.classList.add('tip-below')
  }
}
window.showCalTip = showCalTip

function hideCalTip() {
  const tip = document.getElementById('cal-tooltip')
  if (tip) tip.style.display = 'none'
}
window.hideCalTip = hideCalTip

// ════════════════════════════════════════════════════════════════
//  LOGIN PAGE HELPERS
// ════════════════════════════════════════════════════════════════
function toggleLoginPw() {
  const inp = document.getElementById('login-password')
  const ico = document.getElementById('login-eye-icon')
  if (!inp) return
  const show = inp.type === 'password'
  inp.type = show ? 'text' : 'password'
  if (ico) ico.innerHTML = show
    ? `<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/>`
    : `<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>`
}
window.toggleLoginPw = toggleLoginPw

const EYE_OPEN = `<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>`
const EYE_CLOSED = `<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/>`

function toggleRegPw(inputId, iconId) {
  const inp = document.getElementById(inputId)
  const ico = document.getElementById(iconId)
  if (!inp) return
  const show = inp.type === 'password'
  inp.type = show ? 'text' : 'password'
  if (ico) ico.innerHTML = show ? EYE_CLOSED : EYE_OPEN
}
window.toggleRegPw = toggleRegPw

function checkRegPwMatch() {
  const pw   = document.getElementById('reg-password')?.value || ''
  const conf = document.getElementById('reg-confirm')?.value  || ''
  const hint = document.getElementById('reg-confirm-hint')
  if (!hint) return
  if (conf && pw !== conf) {
    hint.textContent = 'The passwords you entered do not match. Please re-enter your password.'
    hint.className = 'reg-hint error'
  } else {
    hint.textContent = ''
    hint.className = 'reg-hint'
  }
}
window.checkRegPwMatch = checkRegPwMatch

// ════════════════════════════════════════════════════════════════
//  PHOTO / LOGO UPLOAD (frontend-only, FileReader preview)
// ════════════════════════════════════════════════════════════════

function handlePhotoUpload(input, avatarId) {
  const file = input.files[0]
  if (!file) return

  if (file.size > 3 * 1024 * 1024) {
    toast('File too large. Please choose an image under 3 MB.', 'error')
    input.value = ''
    return
  }

  // Show an instant local preview while the upload is in flight
  const reader = new FileReader()
  reader.onload = e => {
    _applyAvatarPhoto(avatarId, e.target.result)
  }
  reader.readAsDataURL(file)

  // Upload to server
  const form = new FormData()
  form.append('photo', file)

  fetch('api/users/upload_photo.php', { method: 'POST', body: form })
    .then(r => r.json())
    .then(d => {
      if (!d.success) { toast(d.message || 'Upload failed.', 'error'); return }

      if (state.user) {
        state.user.photoUrl = d.photoUrl
        if (state.role === 'patient') {
          const entry = patients.find(pt => pt.id === state.user.id)
          if (entry) entry.photoUrl = d.photoUrl
        }
      }

      // Swap the preview src to the permanent server path
      _applyAvatarPhoto(avatarId, d.photoUrl)
      toast('Profile photo updated.', 'success')
    })
    .catch(() => toast('Upload failed. Please try again.', 'error'))
}

function _applyAvatarPhoto(avatarId, src) {
  const imgTag = `<img src="${src}" alt="Profile photo" style="width:100%;height:100%;object-fit:cover;border-radius:50%;display:block">`
  const el = document.getElementById(avatarId)
  if (el) { el.style.cssText += ';background:transparent;padding:0'; el.innerHTML = imgTag }
  const sidebar = document.querySelector('.sidebar-profile-avatar')
  if (sidebar) { sidebar.style.cssText += ';background:transparent;padding:0'; sidebar.innerHTML = imgTag }
}
window.handlePhotoUpload = handlePhotoUpload

/**
 * handleLogoUpload — same idea but for the clinic logo preview in
 * the Admin › Appearance settings panel. Uploads to the server so the
 * new logo persists and syncs everywhere (dashboard + public pages).
 */
async function handleLogoUpload(input, previewId) {
  const file = input.files[0]
  if (!file) return

  const formData = new FormData()
  formData.append('logo', file)

  try {
    const r = await fetch('api/clinic/upload_logo.php', { method: 'POST', body: formData })
    const d = await r.json()
    if (!d.success) { toast(d.message || 'Could not upload logo.', 'error'); return }
    clinicInfo.logoUrl = d.logoUrl
    window._clinicLogoUrl = d.logoUrl
    const el = document.getElementById(previewId)
    if (el) { el.src = d.logoUrl; el.style.opacity = '1' }
    renderSidebar()
    toast('Logo updated.', 'success')
  } catch (_) {
    toast('Network error — could not upload logo.', 'error')
  }
}
window.handleLogoUpload = handleLogoUpload

// ════════════════════════════════════════════════════════════════
//  ACTIVITY LOG FILTERS
// ════════════════════════════════════════════════════════════════
function applyLogFilters() {
  const roleF  = (document.getElementById('log-role-filter')?.value || '').toLowerCase()
  const typeF  = (document.getElementById('log-type-filter')?.value || '').toLowerCase()
  const fromF  = document.getElementById('log-date-from')?.value || ''
  const toF    = document.getElementById('log-date-to')?.value   || ''
  const searchF= (document.getElementById('log-search')?.value   || '').toLowerCase()

  let visible = 0
  document.querySelectorAll('#log-tbody tr[data-search]').forEach(row => {
    const rowRole   = (row.dataset.role   || '').toLowerCase()
    const rowType   = (row.dataset.type   || '').toLowerCase()
    const rowTs     = (row.dataset.ts     || '')
    const rowSearch = (row.dataset.search || '').toLowerCase()
    const rowDate   = rowTs.slice(0, 10) // "YYYY-MM-DD"

    const matchRole   = !roleF   || rowRole   === roleF
    const matchType   = !typeF   || rowType   === typeF
    const matchFrom   = !fromF   || rowDate   >= fromF
    const matchTo     = !toF     || rowDate   <= toF
    const matchSearch = !searchF || rowSearch.includes(searchF)

    const show = matchRole && matchType && matchFrom && matchTo && matchSearch
    row.style.display = show ? '' : 'none'
    if (show) visible++
  })

  const emptyRow = document.getElementById('log-empty-row')
  if (emptyRow) emptyRow.style.display = visible ? 'none' : ''

  const countEl = document.getElementById('log-count')
  if (countEl) countEl.textContent = `${visible} log entr${visible !== 1 ? 'ies' : 'y'}`
  if (window.pgReset) window.pgReset('log-tbody')
}
window.applyLogFilters = applyLogFilters

function clearLogFilters() {
  const ids = ['log-role-filter','log-type-filter','log-search','log-date-from','log-date-to']
  ids.forEach(id => { const el = document.getElementById(id); if (el) el.value = '' })
  applyLogFilters()
}
window.clearLogFilters = clearLogFilters

function clearAllLogs() {
  showModal(`
    <div class="modal-header">
      <h3 class="modal-title" style="display:flex;align-items:center;gap:8px">
        ${icon('trash-2','icon-sm')} Clear All Logs
      </h3>
      <button class="modal-close" onclick="window.closeModal()">×</button>
    </div>
    <div class="modal-body">
      <div style="display:flex;align-items:flex-start;gap:12px;padding:12px 16px;background:#FEF2F2;border:1px solid #FECACA;border-radius:8px;margin-bottom:12px">
        ${icon('alert-triangle','icon-sm')}
        <div>
          <p style="color:#991B1B;font-size:.88rem;font-weight:600;margin:0 0 2px">This action cannot be undone.</p>
          <p style="color:#B91C1C;font-size:.82rem;margin:0">All activity log entries will be permanently deleted from the database.</p>
        </div>
      </div>
      <p style="color:#374151;font-size:.85rem;margin:0">Are you sure you want to clear the entire activity log?</p>
    </div>
    <div class="modal-footer">
      <button class="btn-ghost" onclick="window.closeModal()">Cancel</button>
      <button id="clear-logs-confirm-btn" class="btn-danger" style="display:flex;align-items:center;gap:6px" onclick="window._doClearAllLogs()">
        ${icon('trash-2','icon-sm')} Yes, Clear All
      </button>
    </div>
  `)
}
window.clearAllLogs = clearAllLogs

window._doClearAllLogs = async function () {
  const btn = document.getElementById('clear-logs-confirm-btn')
  if (btn) { btn.disabled = true; btn.textContent = 'Clearing…' }
  try {
    const r = await fetch('api/activity/clear.php', { method: 'POST' })
    const d = await r.json()
    if (!d.success) {
      if (btn) { btn.disabled = false; btn.innerHTML = `${icon('trash-2','icon-sm')} Yes, Clear All` }
      toast(d.message || 'Failed to clear logs.', 'error'); return
    }
  } catch (_) {
    if (btn) { btn.disabled = false; btn.innerHTML = `${icon('trash-2','icon-sm')} Yes, Clear All` }
    toast('Network error — logs not cleared.', 'error'); return
  }
  activityLog.length = 0
  window.closeModal()
  window.renderPage()
  window.toast('Activity log cleared.', 'success')
}

function exportLog() {
  if (!activityLog.length) { toast('No log entries to export.', 'error'); return }
  const header = ['#', 'User', 'Role', 'Action', 'Timestamp', 'Type']
  const rows   = activityLog.map((l, i) => [
    i + 1,
    `"${(l.user   || '').replace(/"/g, '""')}"`,
    `"${(l.role   || '').replace(/"/g, '""')}"`,
    `"${(l.action || '').replace(/"/g, '""')}"`,
    `"${(l.timestamp || '').replace(/"/g, '""')}"`,
    l.type || ''
  ])
  const csv = [header, ...rows].map(r => r.join(',')).join('\n')
  const a   = document.createElement('a')
  a.href    = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv)
  a.download = `OPTICANA-activity-log-${new Date().toISOString().slice(0, 10)}.csv`
  a.click()
  toast('Log exported successfully.', 'success')
}
window.exportLog = exportLog

// ════════════════════════════════════════════════════════════════
//  REPORTS — generateReport + helpers
// ════════════════════════════════════════════════════════════════
function fmtDate(d) {
  if (!d || d === '—') return '—'
  const dt = new Date(d)
  return isNaN(dt) ? d : dt.toLocaleDateString('en-PH', { year:'numeric', month:'short', day:'numeric' })
}

function badge(status) {
  const map = {
    pending:'badge-pending', approved:'badge-approved', cancelled:'badge-cancelled',
    disapproved:'badge-disapproved', completed:'badge-completed', active:'badge-active',
    inactive:'badge-inactive', admin:'badge-admin', staff:'badge-staff',
    doctor:'badge-doctor', patient:'badge-patient'
  }
  const label = status.charAt(0).toUpperCase() + status.slice(1)
  return `<span class="badge ${map[status] || ''}">${label}</span>`
}

// ── Report data builders (real data) ─────────────────────────────
function _buildReportData(key, from, to) {
  const fromDate = from ? new Date(from) : null
  const toDate   = to   ? new Date(to + 'T23:59:59') : null

  function inRange(dateStr) {
    if (!dateStr || dateStr === '—') return true
    const d = new Date(dateStr)
    if (isNaN(d)) return true
    if (fromDate && d < fromDate) return false
    if (toDate   && d > toDate)   return false
    return true
  }

  function fmtD(d) {
    if (!d || d === '—') return '—'
    const dt = new Date(d)
    return isNaN(dt) ? d : dt.toLocaleDateString('en-PH', { year:'numeric', month:'short', day:'numeric' })
  }

  function rxEye(e) {
    if (!e) return '—'
    const cyl = e.cyl && e.cyl !== '0.00' ? ' ' + e.cyl + ' ×' + e.axis : ''
    return (e.sph || '—') + cyl
  }

  function toMin(t) {
    if (!t) return 0
    const [time, period] = t.split(' ')
    let [h, m] = time.split(':').map(Number)
    if (period === 'PM' && h !== 12) h += 12
    if (period === 'AM' && h === 12) h = 0
    return h * 60 + (m || 0)
  }

  function svcDuration(type) {
    const s = CLINIC_SERVICES.find(s => s.name.toLowerCase() === (type||'').toLowerCase())
    return s ? s.duration + ' min' : '—'
  }

  switch (key) {
    case 'patient-visit': {
      const rows = appointments
        .filter(a => inRange(a.date))
        .sort((a,b) => b.date.localeCompare(a.date))
        .map(a => {
          const pt = patients.find(p => p.id === a.patientId)
          let diagnosis = '—'
          if (pt) {
            const c = pt.consultations.find(c => c.date === a.date)
                   || pt.examinations.find(e => e.date === a.date)
            if (c && c.diagnosis) diagnosis = c.diagnosis
          }
          return { patient: a.patientName, pid: a.patientId, doctor: a.doctorName,
                   date: fmtD(a.date), service: a.type, diagnosis, status: a.status }
        })
      return {
        title: 'Patient Visit History Report',
        headers: ['Patient', 'Patient ID', 'Doctor', 'Date', 'Service', 'Status', 'Diagnosis'],
        rows,
        render: r => [r.patient, `<span style="font-size:.75rem;color:#6b7280">${r.pid}</span>`,
                      r.doctor, r.date, r.service, badge(r.status), r.diagnosis]
      }
    }

    case 'diagnosis-history': {
      const diagMap = {}
      patients.forEach(pt => {
        ;[...pt.consultations, ...pt.examinations].forEach(rec => {
          if (!inRange(rec.date) || !rec.diagnosis) return
          if (!diagMap[rec.diagnosis]) diagMap[rec.diagnosis] = { frequency: 0, lastDate: rec.date }
          diagMap[rec.diagnosis].frequency++
          if (rec.date > diagMap[rec.diagnosis].lastDate) diagMap[rec.diagnosis].lastDate = rec.date
        })
      })
      const total = Object.values(diagMap).reduce((s,v) => s + v.frequency, 0) || 1
      const rows = Object.entries(diagMap)
        .sort((a,b) => b[1].frequency - a[1].frequency)
        .map(([diag, v]) => ({
          diagnosis: diag, frequency: v.frequency,
          percentage: ((v.frequency / total) * 100).toFixed(1) + '%',
          lastOccurrence: fmtD(v.lastDate)
        }))
      return {
        title: 'Diagnosis History Report',
        headers: ['Diagnosis', 'Frequency', 'Percentage', 'Most Recent'],
        rows,
        render: r => [r.diagnosis, `<strong>${r.frequency}</strong>`, r.percentage, r.lastOccurrence]
      }
    }

    case 'prescription-records': {
      const rows = []
      patients.forEach(pt => {
        pt.prescriptions.forEach(rx => {
          if (!inRange(rx.date)) return
          rows.push({ patient: pt.name, doctor: rx.doctor, date: rx.date,
                      od: rxEye(rx.od), os: rxEye(rx.os), lensType: rx.lensType })
        })
      })
      rows.sort((a,b) => b.date.localeCompare(a.date))
      return {
        title: 'Prescription Records Report',
        headers: ['Patient', 'Doctor', 'Date', 'OD (Right Eye)', 'OS (Left Eye)', 'Lens Type'],
        rows: rows.map(r => ({ ...r, date: fmtD(r.date) })),
        render: r => [r.patient, r.doctor, r.date,
                      `<code style="font-size:.73rem">${r.od}</code>`,
                      `<code style="font-size:.73rem">${r.os}</code>`, r.lensType]
      }
    }

    case 'daily-appointment': {
      const targetDate = from || new Date().toISOString().split('T')[0]
      const rows = appointments
        .filter(a => a.date === targetDate)
        .sort((a,b) => toMin(a.time) - toMin(b.time))
        .map(a => ({ patient: a.patientName, doctor: a.doctorName,
                     time: a.time, service: a.type, status: a.status }))
      const label = fmtD(targetDate)
      return {
        title: `Daily Appointment Report — ${label}`,
        headers: ['Patient', 'Doctor', 'Time', 'Service', 'Status'],
        rows,
        render: r => [r.patient, r.doctor, r.time, r.service, badge(r.status)]
      }
    }

    case 'completed-appts': {
      const rows = appointments
        .filter(a => a.status === 'completed' && inRange(a.date))
        .sort((a,b) => b.date.localeCompare(a.date))
        .map(a => ({ patient: a.patientName, doctor: a.doctorName,
                     date: fmtD(a.date), service: a.type, duration: svcDuration(a.type) }))
      return {
        title: 'Completed Appointment Report',
        headers: ['Patient', 'Doctor', 'Date', 'Service', 'Duration'],
        rows,
        render: r => [r.patient, r.doctor, r.date, r.service, r.duration]
      }
    }

    case 'cancelled-appts': {
      const rows = appointments
        .filter(a => (a.status === 'cancelled' || a.status === 'disapproved') && inRange(a.date))
        .sort((a,b) => b.date.localeCompare(a.date))
        .map(a => ({ patient: a.patientName, doctor: a.doctorName,
                     date: fmtD(a.date), reason: a.notes || '—', status: a.status }))
      return {
        title: 'Cancelled / Disapproved Appointment Report',
        headers: ['Patient', 'Doctor', 'Date', 'Reason / Notes', 'Status'],
        rows,
        render: r => [r.patient, r.doctor, r.date,
                      `<span style="font-size:.78rem;color:#6b7280">${r.reason}</span>`,
                      badge(r.status)]
      }
    }

    default:
      return null
  }
}

// ── Chart builders (real data) ────────────────────────────────────
function _buildReportCharts(key, from, to) {
  const today = new Date()
  const monthLabels = []
  for (let i = 5; i >= 0; i--) {
    const d = new Date(today.getFullYear(), today.getMonth() - i, 1)
    monthLabels.push(d.toLocaleString('en-US', { month: 'short' }))
  }

  function monthIdx(dateStr) {
    const d = new Date(dateStr)
    if (isNaN(d)) return -1
    for (let i = 5; i >= 0; i--) {
      const t = new Date(today.getFullYear(), today.getMonth() - i, 1)
      if (d.getFullYear() === t.getFullYear() && d.getMonth() === t.getMonth()) return 5 - i
    }
    return -1
  }

  const colors = ['#E8891C','#2563eb','#7c3aed','#16a34a','#dc2626','#6b7280','#f59e0b']

  switch (key) {
    case 'patient-visit': {
      const visitsByMonth = Array(6).fill(0)
      const svcCount = {}
      appointments.forEach(a => {
        const idx = monthIdx(a.date)
        if (idx >= 0) visitsByMonth[idx]++
        svcCount[a.type] = (svcCount[a.type] || 0) + 1
      })
      const topSvc = Object.entries(svcCount).sort((a,b) => b[1]-a[1])
      return {
        left:  { title: 'Patient Visits per Month', type: 'bar', labels: monthLabels,
                 datasets: [{ label: 'Visits', data: visitsByMonth, backgroundColor: '#E8891C', borderRadius: 5 }] },
        right: { title: 'Top Services Requested', type: 'bar', indexAxis: 'y',
                 labels: topSvc.map(s=>s[0]),
                 datasets: [{ label: 'Requests', data: topSvc.map(s=>s[1]), backgroundColor: '#2563eb', borderRadius: 4 }] }
      }
    }

    case 'diagnosis-history': {
      const diagCount = {}
      patients.forEach(pt => {
        ;[...pt.consultations, ...pt.examinations].forEach(rec => {
          if (rec.diagnosis) diagCount[rec.diagnosis] = (diagCount[rec.diagnosis] || 0) + 1
        })
      })
      const sorted = Object.entries(diagCount).sort((a,b)=>b[1]-a[1]).slice(0,7)
      const top3 = sorted.slice(0,3).map(([d])=>d)
      const monthly = top3.map(() => Array(6).fill(0))
      patients.forEach(pt => {
        ;[...pt.consultations, ...pt.examinations].forEach(rec => {
          const idx = monthIdx(rec.date)
          if (idx < 0 || !rec.diagnosis) return
          const ti = top3.indexOf(rec.diagnosis)
          if (ti >= 0) monthly[ti][idx]++
        })
      })
      return {
        left:  { title: 'Diagnosis Distribution', type: 'doughnut',
                 labels: sorted.map(s=>s[0]),
                 datasets: [{ data: sorted.map(s=>s[1]), backgroundColor: colors.slice(0,sorted.length), borderWidth: 2 }] },
        right: { title: 'Top 3 Diagnoses by Month', type: 'bar', labels: monthLabels,
                 datasets: top3.map((d,i) => ({
                   label: d.split(',')[0], data: monthly[i],
                   backgroundColor: colors[i], borderRadius: 4
                 })) }
      }
    }

    case 'prescription-records': {
      const lensCount = {}
      const rxByMonth = Array(6).fill(0)
      patients.forEach(pt => {
        pt.prescriptions.forEach(rx => {
          const primary = (rx.lensType || '').split(',')[0].trim()
          lensCount[primary] = (lensCount[primary] || 0) + 1
          const idx = monthIdx(rx.date)
          if (idx >= 0) rxByMonth[idx]++
        })
      })
      const lenses = Object.entries(lensCount).sort((a,b)=>b[1]-a[1])
      return {
        left:  { title: 'Prescriptions by Lens Type', type: 'pie',
                 labels: lenses.map(l=>l[0]),
                 datasets: [{ data: lenses.map(l=>l[1]), backgroundColor: colors.slice(0,lenses.length), borderWidth: 2 }] },
        right: { title: 'Prescriptions Issued per Month', type: 'line', labels: monthLabels,
                 datasets: [{ label: 'Prescriptions', data: rxByMonth,
                   borderColor: '#E8891C', backgroundColor: 'rgba(232,137,28,.12)',
                   fill: true, tension: 0.4, pointRadius: 4, pointBackgroundColor: '#E8891C' }] }
      }
    }

    case 'daily-appointment': {
      const targetDate = from || today.toISOString().split('T')[0]
      const dayAppts = appointments.filter(a => a.date === targetDate)
      const statusCount = {}
      let morning = 0, afternoon = 0
      const statusColors = { completed:'#16a34a', approved:'#2563eb', pending:'#E8891C',
                             cancelled:'#dc2626', disapproved:'#6b7280' }
      function toMin(t) {
        if (!t) return 0
        const [time, period] = t.split(' ')
        let [h, m] = time.split(':').map(Number)
        if (period === 'PM' && h !== 12) h += 12
        if (period === 'AM' && h === 12) h = 0
        return h * 60 + (m || 0)
      }
      dayAppts.forEach(a => {
        statusCount[a.status] = (statusCount[a.status] || 0) + 1
        if (toMin(a.time) < 720) morning++; else afternoon++
      })
      const statuses = Object.entries(statusCount)
      return {
        left:  { title: 'Appointment Status Breakdown', type: 'doughnut',
                 labels: statuses.map(([s]) => s.charAt(0).toUpperCase() + s.slice(1)),
                 datasets: [{ data: statuses.map(([,v])=>v),
                   backgroundColor: statuses.map(([s])=>statusColors[s]||'#9ca3af'), borderWidth: 2 }] },
        right: { title: 'Appointments by Time of Day', type: 'bar',
                 labels: ['Morning (8–12)', 'Afternoon (1–5)'],
                 datasets: [{ label: 'Appointments', data: [morning, afternoon],
                   backgroundColor: ['#2563eb','#E8891C'], borderRadius: 6 }] }
      }
    }

    case 'completed-appts': {
      const byMonth = Array(6).fill(0)
      const byDoc = {}
      appointments.filter(a => a.status === 'completed').forEach(a => {
        const idx = monthIdx(a.date)
        if (idx >= 0) byMonth[idx]++
        const svc = CLINIC_SERVICES.find(s => s.name.toLowerCase() === (a.type||'').toLowerCase())
        const dur = svc ? svc.duration : 25
        if (a.doctorName) {
          if (!byDoc[a.doctorName]) byDoc[a.doctorName] = { total: 0, count: 0 }
          byDoc[a.doctorName].total += dur
          byDoc[a.doctorName].count++
        }
      })
      const docNames = Object.keys(byDoc)
      const docAvg   = Object.values(byDoc).map(v => Math.round(v.total / v.count))
      return {
        left:  { title: 'Completed Appointments per Month', type: 'bar', labels: monthLabels,
                 datasets: [{ label: 'Completed', data: byMonth, backgroundColor: '#16a34a', borderRadius: 5 }] },
        right: { title: 'Avg. Duration by Doctor', type: 'bar',
                 labels: docNames,
                 datasets: [{ label: 'Avg. Minutes', data: docAvg, backgroundColor: '#E8891C', borderRadius: 5 }] }
      }
    }

    case 'cancelled-appts': {
      const byMonth = Array(6).fill(0)
      let cancelledCount = 0, disapprovedCount = 0
      appointments.filter(a => a.status === 'cancelled' || a.status === 'disapproved').forEach(a => {
        const idx = monthIdx(a.date)
        if (idx >= 0) byMonth[idx]++
        if (a.status === 'cancelled') cancelledCount++; else disapprovedCount++
      })
      const labels = [], data = [], bgColors = []
      if (cancelledCount)   { labels.push('Cancelled');   data.push(cancelledCount);   bgColors.push('#dc2626') }
      if (disapprovedCount) { labels.push('Disapproved'); data.push(disapprovedCount); bgColors.push('#E8891C') }
      return {
        left:  { title: 'Cancellations by Status', type: 'doughnut',
                 labels, datasets: [{ data, backgroundColor: bgColors, borderWidth: 2 }] },
        right: { title: 'Cancellations / Disapprovals by Month', type: 'bar', labels: monthLabels,
                 datasets: [{ label: 'Total', data: byMonth, backgroundColor: '#dc2626', borderRadius: 5 }] }
      }
    }

    default:
      return null
  }
}

var _rptChartLeft  = null
var _rptChartRight = null

function generateReport() {
  const key    = document.getElementById('rpt-type')?.value || ''
  const from   = document.getElementById('rpt-from')?.value || ''
  const to     = document.getElementById('rpt-to')?.value   || ''
  const area   = document.getElementById('rpt-table-area')
  const hdr    = document.getElementById('rpt-table-header')
  const btn    = document.getElementById('rpt-gen-btn')
  const trends = document.getElementById('rpt-trends-section')

  if (!area) return

  if (!key) {
    window.toast('Please select a report type.', 'error')
    return
  }

  // Skeleton loading
  if (btn) { btn.disabled = true; btn.innerHTML = icon('clock','icon-sm') + ' Generating\u2026' }
  const skeletonRow = `<tr>${Array(5).fill(`<td><div style="height:12px;border-radius:4px;background:#f3f4f6;animation:skeleton-pulse 1.2s ease-in-out infinite"></div></td>`).join('')}</tr>`
  if (hdr) hdr.style.display = 'none'
  area.innerHTML = `
    <style>@keyframes skeleton-pulse{0%,100%{opacity:1}50%{opacity:.4}}</style>
    <table class="tbl">
      <thead><tr>${Array(5).fill(`<th><div style="height:10px;width:60px;border-radius:4px;background:#e5e7eb"></div></th>`).join('')}</tr></thead>
      <tbody>${Array(6).fill(skeletonRow).join('')}</tbody>
    </table>`
  if (trends) { trends.style.display = 'block'; trends.style.opacity = '0.3' }

  setTimeout(() => {
    if (btn) { btn.disabled = false; btn.innerHTML = icon('bar-chart','icon-sm') + ' Generate Report' }

    const def = _buildReportData(key, from, to)
    if (!def) return

    // Report header card
    const fromFmt = from ? fmtDate(from) : '\u2014'
    const toFmt   = to   ? fmtDate(to)   : '\u2014'
    const now = new Date().toLocaleString('en-PH', { month:'long', day:'numeric', year:'numeric', hour:'numeric', minute:'2-digit' })
    const count = def.rows.length

    if (hdr) {
      hdr.style.display = 'block'
      hdr.innerHTML = `
        <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:12px">
          <div>
            <div style="font-size:.95rem;font-weight:700;color:#1f2937;margin-bottom:4px">${def.title}</div>
            <div style="font-size:.78rem;color:#6b7280">Date Range: ${fromFmt} \u2013 ${toFmt}&ensp;&middot;&ensp;Generated on: ${now}</div>
            <div style="font-size:.75rem;color:#9ca3af;margin-top:3px">Showing <strong style="color:#374151">${count}</strong> record${count!==1?'s':''}</div>
          </div>
          <div style="display:flex;gap:8px;align-items:center" class="rpt-no-print">
            <button class="btn-secondary" onclick="window.exportReportCSV()"
                    style="font-size:.78rem;padding:6px 14px;display:flex;align-items:center;gap:6px">
              ${icon('download','icon-sm')} Export CSV
            </button>
            <div class="search-input-wrap">${icon('search','icon-sm')}<input class="search-input" placeholder="Search\u2026" oninput="window.filterTable(this,'rpt-tbody')"></div>
          </div>
        </div>`
    }

    // Render table
    area.innerHTML = reportTable(def.headers, def.rows.map(def.render))
    if (window.initPagination) window.initPagination('rpt-tbody')

    // Render trends
    if (trends) {
      trends.style.opacity = '1'
      trends.style.display = 'block'
      renderReportCharts(key, from, to)
    }

    // Smooth scroll to results
    const wrap = document.getElementById('rpt-results-wrap')
    if (wrap) wrap.scrollIntoView({ behavior: 'smooth', block: 'start' })

  }, 1000)
}
window.generateReport = generateReport

function resetReport() {
  const typeEl = document.getElementById('rpt-type')
  if (typeEl) typeEl.value = ''

  const today      = new Date().toISOString().split('T')[0]
  const monthStart = today.slice(0,8) + '01'
  const fromEl = document.getElementById('rpt-from')
  const toEl   = document.getElementById('rpt-to')
  if (fromEl) fromEl.value = monthStart
  if (toEl)   toEl.value   = today

  const hdr = document.getElementById('rpt-table-header')
  if (hdr) { hdr.style.display = 'none'; hdr.innerHTML = '' }

  const area = document.getElementById('rpt-table-area')
  if (area) area.innerHTML = `
    <div style="text-align:center;padding:56px 24px;color:#9CA3AF">
      <div style="font-size:.9rem;font-weight:500;color:#6b7280;margin-bottom:6px">No report generated yet</div>
      <div style="font-size:.8rem;color:#9ca3af">Select a report type and click <strong>Generate Report</strong> to view data.</div>
    </div>`

  const trends = document.getElementById('rpt-trends-section')
  if (trends) trends.style.display = 'none'

  if (_rptChartLeft)  { _rptChartLeft.destroy();  _rptChartLeft  = null }
  if (_rptChartRight) { _rptChartRight.destroy(); _rptChartRight = null }
}
window.resetReport = resetReport

function renderReportCharts(key, from, to) {
  if (!window.Chart) return
  Chart.defaults.font.family = 'Poppins'

  if (_rptChartLeft)  { _rptChartLeft.destroy();  _rptChartLeft  = null }
  if (_rptChartRight) { _rptChartRight.destroy(); _rptChartRight = null }

  const cfg = _buildReportCharts(key, from, to)
  if (!cfg) return

  const lTitle = document.getElementById('rpt-chart-left-title')
  const rTitle = document.getElementById('rpt-chart-right-title')
  if (lTitle) lTitle.textContent = cfg.left.title
  if (rTitle) rTitle.textContent = cfg.right.title

  const tooltipDefaults = {
    backgroundColor: '#1f2937',
    padding: 10,
    cornerRadius: 8,
    titleFont: { size: 12, family: 'Poppins' },
    bodyFont: { size: 11, family: 'Poppins' }
  }

  const lCanvas = document.getElementById('rpt-chart-left')
  if (lCanvas) {
    const isDoughnut = cfg.left.type === 'doughnut' || cfg.left.type === 'pie'
    _rptChartLeft = new Chart(lCanvas, {
      type: cfg.left.type,
      data: { labels: cfg.left.labels, datasets: cfg.left.datasets },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: cfg.left.indexAxis || 'x',
        plugins: {
          legend: { display: isDoughnut, position: 'bottom', labels: { boxWidth: 10, padding: 12, font: { size: 11 } } },
          tooltip: tooltipDefaults
        },
        scales: isDoughnut ? {} : {
          x: { grid: { display: false }, ticks: { font: { size: 11 } } },
          y: { grid: { color: '#f3f4f6' }, ticks: { font: { size: 11 } } }
        }
      }
    })
  }

  const rCanvas = document.getElementById('rpt-chart-right')
  if (rCanvas) {
    const isDoughnut = cfg.right.type === 'doughnut' || cfg.right.type === 'pie'
    _rptChartRight = new Chart(rCanvas, {
      type: cfg.right.type,
      data: { labels: cfg.right.labels, datasets: cfg.right.datasets },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: cfg.right.indexAxis || 'x',
        plugins: {
          legend: {
            display: isDoughnut || cfg.right.datasets.length > 1,
            position: 'bottom',
            labels: { boxWidth: 10, padding: 12, font: { size: 11 } }
          },
          tooltip: tooltipDefaults
        },
        scales: isDoughnut ? {} : {
          x: { grid: { display: false }, ticks: { font: { size: 11 } } },
          y: { grid: { color: '#f3f4f6' }, ticks: { font: { size: 11 } } }
        }
      }
    })
  }
}
window.renderReportCharts = renderReportCharts

function reportTable(headers, rows) {
  if (!rows.length) return `<div class="table-empty">No records match the selected report type and filters. Try adjusting your search criteria.</div>`
  return `
    <table class="tbl">
      <thead><tr>${headers.map(h=>`<th>${h}</th>`).join('')}</tr></thead>
      <tbody id="rpt-tbody">
        ${rows.map(r=>`<tr data-search="${r.map(c=>String(c).replace(/<[^>]+>/g,'')).join(' ').toLowerCase()}">
          ${r.map(cell=>`<td style="font-size:.82rem">${cell}</td>`).join('')}
        </tr>`).join('')}
      </tbody>
    </table>`
}

// ════════════════════════════════════════════════════════════════
//  INIT
// ════════════════════════════════════════════════════════════════
function init() {
  // Show login screen
  document.getElementById('login-screen').style.display = 'flex'
  document.getElementById('register-screen').style.display = 'none'
  document.getElementById('app-shell').style.display = 'none'

  // Keyboard shortcut: Escape closes modal
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeModal()
  })
}

document.addEventListener('DOMContentLoaded', init)
