// ================================================================
//  OPTICANA — router.js
//  Navigation, sidebar, topbar rendering, layout toggles
// ================================================================


// ── Shared State ────────────────────────────────────────────────
var state = {
  role: null, user: null,
  page: null, params: {},
  filter: 'all',
  selectedRole: 'admin',
  sidebarCollapsed: false,
  settingsSection: 'clinic',
  afterRender: null
}

// ── Sidebar nav config per role ─────────────────────────────────
const SIDEBAR_CONFIG = {
  admin: [
    { section: 'Overview' },
    { key: 'admin-dashboard',      label: 'Dashboard',        icon: 'home' },
    { section: 'Clinic' },
    { key: 'appointments',         label: 'Appointments',     icon: 'calendar',
      children: [
        { key: 'appointments', filter: 'today',       label: 'Today' },
        { key: 'appointments', filter: 'pending',     label: 'Pending' },
        { key: 'appointments', filter: 'approved',    label: 'Approved' },
        { key: 'appointments', filter: 'cancelled',   label: 'Cancelled' },
        { key: 'appointments', filter: 'disapproved', label: 'Disapproved' },
        { key: 'appointments', filter: 'completed',   label: 'Completed' }
      ]
    },
    { key: 'patient-list',         label: 'Patient Records',  icon: 'file-text',
      children: [
        { key: 'patient-list',     label: 'All Patients' },
        { key: 'add-patient',      label: 'Add Patient' }
      ]
    },
    { key: 'contact-messages',     label: 'Contact Messages', icon: 'mail', badgeKey: '_contactUnreadCount' },
    { key: 'examination',          label: 'Optical Examination', icon: 'eye',
      children: [
        { key: 'exam-records',     label: 'Exam Records' }
      ]
    },
    { key: 'schedule',             label: 'Doctor Schedule',  icon: 'clock' },
    { key: 'admin-reports',        label: 'Reports',          icon: 'bar-chart' },
    { section: 'System' },
    { key: 'admin-users',          label: 'User Management',  icon: 'users',
      children: [
        { key: 'admin-users',      label: 'All Users' },
        { key: 'add-user',         label: 'Add User', action: 'openAddUserModal' }
      ]
    },
    { key: 'activity-log',         label: 'Activity Log',     icon: 'activity' },
    { key: 'admin-settings',       label: 'Settings',         icon: 'settings',
      children: [
        { key: 'admin-settings', filter: 'profile',      label: 'My Profile' },
        { key: 'admin-settings', filter: 'clinic',       label: 'Clinic Information' },
        { key: 'admin-settings', filter: 'services',     label: 'Services' },
        { key: 'admin-settings', filter: 'consultation', label: 'Consultation Settings' },
        { key: 'admin-settings', filter: 'archives',     label: 'Archives' }
      ]
    }
  ],
  staff: [
    { section: 'Overview' },
    { key: 'staff-dashboard',      label: 'Dashboard',        icon: 'home' },
    { section: 'Clinic' },
    { key: 'appointments',         label: 'Appointments',     icon: 'calendar',
      children: [
        { key: 'appointments', filter: 'today',       label: 'Today' },
        { key: 'appointments', filter: 'pending',     label: 'Pending' },
        { key: 'appointments', filter: 'approved',    label: 'Approved' },
        { key: 'appointments', filter: 'cancelled',   label: 'Cancelled' },
        { key: 'appointments', filter: 'disapproved', label: 'Disapproved' },
        { key: 'appointments', filter: 'completed',   label: 'Completed' }
      ]
    },
    { key: 'patient-list',         label: 'Patient Records',  icon: 'file-text',
      children: [
        { key: 'patient-list',     label: 'All Patients' },
        { key: 'add-patient',      label: 'Add Patient' }
      ]
    },
    { key: 'contact-messages',     label: 'Contact Messages', icon: 'mail', badgeKey: '_contactUnreadCount' },
    { key: 'schedule',             label: 'Doctor Schedule',  icon: 'clock' },
    { section: 'Account' },
    { key: 'staff-settings',       label: 'Settings',         icon: 'settings' }
  ],
  doctor: [
    { section: 'Overview' },
    { key: 'doctor-dashboard',     label: 'Dashboard',        icon: 'home' },
    { section: 'Clinic' },
    { key: 'doctor-appointments',  label: 'My Appointments',  icon: 'calendar',
      children: [
        { key: 'doctor-appointments', filter: 'today',     label: 'Today' },
        { key: 'doctor-appointments', filter: 'upcoming',  label: 'Upcoming' },
        { key: 'doctor-appointments', filter: 'completed', label: 'Completed' }
      ]
    },
    { key: 'examination',          label: 'Optical Examination', icon: 'eye',
      children: [
        { key: 'new-examination',  label: 'New Examination' },
        { key: 'exam-records',     label: 'Examination Records' }
      ]
    },
    { key: 'patient-list',         label: 'Patient Records',  icon: 'file-text' },
    { key: 'doctor-schedule',      label: 'My Schedule',      icon: 'clock' },
    { section: 'Account' },
    { key: 'doctor-settings',      label: 'Settings',         icon: 'settings' }
  ],
  patient: [
    { section: 'Overview' },
    { key: 'patient-dashboard',    label: 'Dashboard',        icon: 'home' },
    { section: 'Services' },
    { key: 'patient-appts',        label: 'My Appointments',  icon: 'calendar',
      children: [
        { key: 'patient-appts',    filter: 'request', label: 'Request Appointment' },
        { key: 'patient-appts',    filter: 'history', label: 'Appointment History' }
      ]
    },
    { key: 'doctor-availability',  label: 'Doctor Availability', icon: 'user' },
    { key: 'patient-records',      label: 'My Records',       icon: 'file-text',
      children: [
        { key: 'patient-prescriptions', label: 'Prescriptions' },
        { key: 'patient-exam-history',  label: 'Examination History' }
      ]
    },
    { section: 'Account' },
    { key: 'patient-settings',     label: 'Settings',         icon: 'settings' }
  ]
}

// Breadcrumb labels
const PAGE_LABELS = {
  'admin-dashboard':       'Dashboard',
  'admin-users':           'User Management',
  'appointments':          'Appointments',
  'create-appointment':    'Create Appointment',
  'patient-list':          'Patient Records',
  'add-patient':           'Add Patient',
  'patient-view':          'Patient Profile',
  'contact-messages':      'Contact Messages',
  'qr-scanner':            'QR Scanner',
  'schedule':              'Doctor Schedule',
  'admin-reports':         'Reports',
  'admin-settings':        'Settings',
  'settings-clinic':       'Clinic Information',
  'settings-services':     'Services',
  'settings-consultation': 'Consultation Settings',
  'settings-archives':     'Archives',
  'activity-log':          'Activity Log',
  'staff-dashboard':       'Dashboard',
  'staff-settings':        'Settings',
  'doctor-dashboard':      'Dashboard',
  'doctor-appointments':   'My Appointments',
  'doctor-schedule':       'My Schedule',
  'doctor-settings':       'Settings',
  'examination':           'Optical Examination',
  'new-examination':       'New Examination',
  'exam-records':          'Examination Records',
  'doctor-schedule':       'My Schedule',
  'doctor-settings':       'Settings',
  'patient-dashboard':     'Dashboard',
  'patient-appts':         'My Appointments',
  'patient-records':       'My Records',
  'patient-qr':            'My QR Code',
  'doctor-availability':   'Doctor Availability',
  'patient-prescriptions': 'Prescriptions',
  'patient-exam-history':  'Examination History',
  'patient-notifications': 'Notifications',
  'notifications':         'Notifications',
  'patient-settings':      'Settings'
}

// ── Navigate ────────────────────────────────────────────────────
function navigate(page, params = {}) {
  // Handle sidebar actions that open modals/overlays
  if (page === 'add-user')    { window.openAddUserModal();    return }
  if (page === 'add-patient') { window.navigate('patient-list'); setTimeout(() => window.openAddPatientModal(), 100); return }

  // Default admin-settings to clinic section
  if (page === 'admin-settings' && params.filter === undefined) params.filter = 'clinic'

  if (params.filter !== undefined) state.filter = params.filter
  state.page   = page
  state.params = params
  if (window.closeModal) window.closeModal()
  closeMobileSidebar()
  if (window.stopQRCamera) window.stopQRCamera()
  renderPage()

  // Refresh appointment data when doctor visits appointment pages (shows newly approved)
  if (state.role === 'doctor' && (page === 'doctor-dashboard' || page === 'doctor-appointments')) {
    if (window._syncAppointments) window._syncAppointments(true)
  }
  // Ensure patient data is loaded before opening the examination form
  if (page === 'new-examination' && window._syncPatients && !patients.length) {
    window._syncPatients()
  }
  // Refresh archived records when visiting the Archives section
  if (page === 'admin-settings' && params.filter === 'archives' && window._syncArchives) {
    window._syncArchives()
  }
}

// ── renderPage ──────────────────────────────────────────────────
function renderPage() {
  const { page, role } = state
  const Pages = window._pages

  const map = {
    'admin-dashboard':       Pages.pageAdminDashboard,
    'admin-users':           Pages.pageAdminUsers,
    'appointments':          Pages.pageAppointments,
    'create-appointment':    Pages.pageComingSoon,
    'patient-list':          Pages.pagePatientList,
    'add-patient':           Pages.pageComingSoon,
    'patient-view':          Pages.pagePatientView,
    'contact-messages':      Pages.pageContactMessages,
    'qr-scanner':            Pages.pageQRScanner,
    'schedule':              Pages.pageSchedule,
    'admin-reports':         Pages.pageAdminReports,
    'admin-settings':        Pages.pageAdminSettings,
    'activity-log':          Pages.pageActivityLog,
    'staff-dashboard':       Pages.pageStaffDashboard,
    'staff-settings':        Pages.pageStaffSettings,
    'doctor-dashboard':      Pages.pageDoctorDashboard,
    'doctor-appointments':   Pages.pageDoctorAppointments,
    'examination':           Pages.pageExamination,
    'new-examination':       Pages.pageNewExamination,
    'exam-records':          Pages.pageExamRecords,
    'doctor-schedule':       Pages.pageDoctorSchedule,
    'doctor-settings':       Pages.pageDoctorSettings,
    'patient-dashboard':     Pages.pagePatientDashboard,
    'patient-appts':         Pages.pagePatientAppts,
    'patient-records':       Pages.pagePatientRecords,
    'patient-qr':            Pages.pagePatientQR,
    'doctor-availability':   Pages.pagePatientDoctorAvail,
    'patient-prescriptions': Pages.pagePatientPrescriptions,
    'patient-exam-history':  Pages.pagePatientExamHistory,
    'patient-notifications': Pages.pagePatientNotifications,
    'notifications':         Pages.pagePatientNotifications,
    'patient-settings':      Pages.pagePatientSettings,
    'scan-qr':               Pages.pageScanQR
  }

  const fn = map[page]
  const el = document.getElementById('main-content')
  if (!fn || !el) return

  el.innerHTML = fn()
  el.className = 'fade-up'

  renderTopbar()
  highlightSidebarActive()

  // Charts, QR etc. need next tick
  const cb = state.afterRender
  state.afterRender = null
  if (cb) setTimeout(cb, 60)
}

// ── Shell bootstrap (called once after login) ───────────────────
function bootShell(role, user) {
  renderSidebar()
  renderTopbar()
  applySidebarBucket(true)

  // Navigate to default page for role
  const defaults = {
    admin:   'admin-dashboard',
    staff:   'staff-dashboard',
    doctor:  'doctor-dashboard',
    patient: 'patient-dashboard'
  }
  state.filter = 'all'
  navigate(defaults[role] || 'admin-dashboard')
}

// ── Sidebar ─────────────────────────────────────────────────────
function renderSidebar() {
  const { role, user } = state
  const config = SIDEBAR_CONFIG[role] || []

  let nav = ''
  config.forEach(item => {
    // Section divider/label
    if (item.section) {
      nav += `<div class="nav-section-label"><span>${item.section}</span></div>`
      return
    }

    const hasChildren = item.children && item.children.length > 0
    // For action-only items (like scan-qr), clicking the item directly fires action
    const isActive    = state.page === item.key
    const clickAction = item.action
      ? `window.${item.action}()`
      : `window.navigate('${item.key}')`

    if (hasChildren) {
      const isOpen = item.children.some(c => c.key === state.page)
      nav += `
        <div>
          <div class="nav-item${isOpen ? ' nav-parent-open' : ''}" onclick="window.toggleDropdown('dd-${item.key}')">
            ${window.icon(item.icon, 'icon')}
            <span class="nav-item-label">${item.label}</span>
            <svg class="nav-arrow${isOpen ? ' open' : ''}" id="arrow-dd-${item.key}"
                 viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </div>
          <div class="nav-submenu${isOpen ? ' open' : ''}" id="dd-${item.key}">
            ${item.children.map(c => {
              const cActive = state.page === c.key && (c.filter === undefined || state.filter === c.filter)
              // Modal-only actions: don't navigate, just open the modal
              const cClick  = c.action
                ? `window.${c.action}()`
                : `window.navigate('${c.key}'${c.filter ? `, {filter:'${c.filter}'}` : ''})`
              return `
              <div class="nav-sub-item${cActive ? ' active' : ''}" onclick="${cClick}">
                <span class="nav-sub-dot"></span>
                ${c.label}
              </div>`
            }).join('')}
          </div>
        </div>`
    } else {
      const badgeCount = item.badgeKey ? (window[item.badgeKey] || 0) : 0
      const badgeHtml  = badgeCount > 0 ? `<span class="nav-badge">${badgeCount > 99 ? '99+' : badgeCount}</span>` : ''
      nav += `
        <div class="nav-item${isActive ? ' active' : ''}" onclick="${clickAction}">
          ${window.icon(item.icon, 'icon')}
          <span class="nav-item-label">${item.label}</span>
          ${badgeHtml}
        </div>`
    }
  })

  const isAdmin = role === 'admin'
  const initials = user ? (user.firstName[0] + user.lastName[0]).toUpperCase() : '??'
  const displayName = user?.name || 'User'
  const roleBadgeMap = { admin: 'Administrator', staff: 'Staff', doctor: 'Doctor', patient: 'Patient' }
  const roleBadge = roleBadgeMap[role] || role
  const avatarHtml = user?.photoUrl
    ? `<div class="sidebar-avatar sidebar-profile-avatar" style="overflow:hidden;padding:0;background:transparent"><img src="${user.photoUrl}" alt="Photo" style="width:100%;height:100%;object-fit:cover;border-radius:50%;display:block"></div>`
    : `<div class="sidebar-avatar sidebar-profile-avatar">${initials}</div>`

  document.getElementById('sidebar-nav').innerHTML = nav
  document.getElementById('sidebar-profile').innerHTML = `
    <div class="sidebar-profile-wrap">
      ${avatarHtml}
      <div class="sidebar-profile-info">
        <div class="sidebar-profile-name">${displayName}</div>
        <div class="sidebar-profile-role">${roleBadge}</div>
      </div>
    </div>`
  document.getElementById('sidebar-foot').innerHTML = `
    <a class="sidebar-logout" href="index.html" style="text-decoration:none">
      ${window.icon('external-link', 'icon')}
      <span>View Website</span>
    </a>
    <div class="sidebar-logout" onclick="window.logout()">
      ${window.icon('log-out', 'icon')}
      <span>Sign Out</span>
    </div>`
}

// Re-renders just to refresh badge counts (e.g. unread contact messages)
// after a background sync — the sidebar is cheap to rebuild from state.
function updateSidebarBadges() {
  if (document.getElementById('sidebar-nav')) renderSidebar()
}
window._updateSidebarBadges = updateSidebarBadges

// ── Highlight active sidebar item ───────────────────────────────
function highlightSidebarActive() {
  document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'))
  document.querySelectorAll('.nav-sub-item').forEach(el => el.classList.remove('active'))
  // re-render sidebar keeps highlights; easier to just re-render
  renderSidebar()
}

// ── Topbar ──────────────────────────────────────────────────────
function renderTopbar() {
  const { role, page, params } = state
  const label = PAGE_LABELS[page] || page || 'Dashboard'
  const roleLbl = { admin: 'Administrator', staff: 'Staff', doctor: 'Doctor', patient: 'Patient' }[role] || ''

  // Find sub-label from sidebar config when a filter is active
  const config = SIDEBAR_CONFIG[role] || []
  const parentItem = config.find(item => item.key === page && item.children)
  let subLabel = null
  if (parentItem && state.filter && state.filter !== 'all') {
    const child = parentItem.children.find(c => c.filter === state.filter)
    if (child) subLabel = child.label
  }

  const chevron = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="icon-sm" style="color:#D1D5DB"><polyline points="9 18 15 12 9 6"/></svg>`

  const crumbEl = document.getElementById('topbar-crumb')
  const rightEl = document.getElementById('topbar-right')

  if (crumbEl) crumbEl.innerHTML = subLabel
    ? `<span>${roleLbl}</span>${chevron}<span>${label}</span>${chevron}<strong>${subLabel}</strong>`
    : `<span>${roleLbl}</span>${chevron}<strong>${label}${params.patientName ? ` — ${params.patientName}` : ''}</strong>`

  if (rightEl) {
    const notifRole = state.role
    const unread    = window._unreadCount || 0
    const badgeVis  = unread > 0 ? '' : 'display:none'
    const badgeTxt  = unread > 9 ? '9+' : String(unread)

    rightEl.innerHTML = `
      <!-- Notification Bell -->
      <div class="topbar-notify-wrap" id="topbar-notify-wrap">
        <div class="topbar-notify" id="topbar-bell-btn" onclick="window.toggleNotifyDropdown(event)" title="Notifications">
          ${window.icon('bell', 'icon')}
          <span class="notify-badge" style="${badgeVis}">${badgeTxt}</span>
        </div>
        <div class="notify-dropdown" id="notify-dropdown">
          <div class="notify-dropdown-head">
            <span class="notify-dropdown-title">Notifications</span>
            <button class="notify-mark-read" onclick="window.markAllRead()">Mark all as read</button>
          </div>
          <div class="notify-list" id="notify-list-inner">
            ${_buildNotifDropdownHtml()}
          </div>
          <div class="notify-dropdown-foot">
            <a href="#" onclick="event.preventDefault();window.navigate('${notifRole === 'patient' ? 'patient-notifications' : 'notifications'}');window.closeAllDropdowns()">View all notifications</a>
          </div>
        </div>
      </div>

      <!-- Clinic identity -->
      <div class="topbar-clinic">
        <img src="${window._clinicLogoUrl || 'brand_assests/cana logo.png'}" alt="Cana Optical" class="topbar-clinic-img">
        <div class="topbar-clinic-text">
          <span class="topbar-clinic-name">Cana Optical</span>
          <span class="topbar-clinic-sub">Carmona, Cavite</span>
        </div>
      </div>`
  }
}

function _notifTimeAgo(dateStr) {
  const d = new Date(dateStr)
  if (isNaN(d)) return dateStr
  const diff = (Date.now() - d.getTime()) / 1000
  if (diff < 60)     return 'Just now'
  if (diff < 3600)   return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400)  return `${Math.floor(diff / 3600)}h ago`
  if (diff < 172800) return 'Yesterday'
  if (diff < 604800) return `${Math.floor(diff / 86400)} days ago`
  return d.toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' })
}
window._notifTimeAgo = _notifTimeAgo

const _NOTIF_ICON  = { approved:'check-circle', cancelled:'x-circle', disapproved:'x-circle', rescheduled:'calendar', new_appointment:'calendar', reschedule_request:'alert-circle', welcome:'star', info:'info', contact_message:'mail' }
const _NOTIF_COLOR = { approved:'green', cancelled:'red', disapproved:'red', rescheduled:'blue', new_appointment:'orange', reschedule_request:'orange', welcome:'purple', info:'gray', contact_message:'orange' }

function _notifNavTarget(type, role) {
  const apptPage = role === 'patient' ? 'patient-appts' : 'appointments'
  const dashPage = role === 'admin'  ? 'admin-dashboard'
                 : role === 'staff'  ? 'staff-dashboard'
                 : role === 'doctor' ? 'doctor-dashboard'
                 :                     'patient-dashboard'
  const map = {
    approved:           apptPage,
    cancelled:          apptPage,
    disapproved:        apptPage,
    rescheduled:        apptPage,
    new_appointment:    apptPage,
    reschedule_request: apptPage,
    reminder:           apptPage,
    record:             role === 'patient' ? 'patient-records'       : 'patient-list',
    prescription:       role === 'patient' ? 'patient-prescriptions' : 'patient-list',
    welcome:            dashPage,
    info:               dashPage,
    contact_message:    'contact-messages',
  }
  return map[type] || dashPage
}
window._notifNavTarget = _notifNavTarget

function _buildNotifDropdownHtml() {
  const notifs = window._notifications || []
  const recent = notifs.slice(0, 5)
  if (!recent.length) {
    return `<div style="text-align:center;padding:28px 16px;color:#9CA3AF;font-size:.8rem">No notifications yet</div>`
  }
  return recent.map(n => `
    <div class="notify-item${n.isRead ? '' : ' unread'}" onclick="window._markNotifDropdown(${n.id})" style="cursor:pointer">
      <div class="notify-item-icon ${_NOTIF_COLOR[n.type] || 'gray'}">${window.icon(_NOTIF_ICON[n.type] || 'info', 'icon-sm')}</div>
      <div class="notify-item-body">
        <div class="notify-item-title">${n.title}</div>
        <div class="notify-item-msg">${n.body}</div>
        <div class="notify-item-time">${_notifTimeAgo(n.createdAt)}</div>
      </div>
    </div>`).join('')
}
window._buildNotifDropdownHtml = _buildNotifDropdownHtml

function _updateNotifUI() {
  const badge = document.querySelector('.notify-badge')
  const count = window._unreadCount || 0
  if (badge) {
    badge.textContent = count > 9 ? '9+' : String(count)
    badge.style.display = count > 0 ? '' : 'none'
  }
  const list = document.getElementById('notify-list-inner')
  if (list) list.innerHTML = _buildNotifDropdownHtml()
}
window._updateNotifUI = _updateNotifUI

// Mark single notif as read from topbar dropdown, then navigate
function _markNotifDropdown(id) {
  const notif = (window._notifications || []).find(n => n.id === id)
  if (!notif) return
  if (!notif.isRead) {
    notif.isRead = true
    if (window._unreadCount > 0) window._unreadCount--
    _updateNotifUI()
    fetch('api/notifications/mark_read.php', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    }).catch(() => {})
  }
  closeAllDropdowns()
  navigate(_notifNavTarget(notif.type, state.role))
}
window._markNotifDropdown = _markNotifDropdown

// ── Dropdown toggles (exported for global access) ────────────────
function toggleNotifyDropdown(e) {
  e.stopPropagation()
  const dd = document.getElementById('notify-dropdown')
  const ud = document.getElementById('user-dropdown')
  if (ud) ud.classList.remove('open')
  if (dd) dd.classList.toggle('open')
}

function toggleUserDropdown(e) {
  e.stopPropagation()
  const dd = document.getElementById('notify-dropdown')
  const ud = document.getElementById('user-dropdown')
  if (dd) dd.classList.remove('open')
  if (ud) ud.classList.toggle('open')
}

function closeAllDropdowns() {
  const dd = document.getElementById('notify-dropdown')
  const ud = document.getElementById('user-dropdown')
  if (dd) dd.classList.remove('open')
  if (ud) ud.classList.remove('open')
}

function markAllRead() {
  ;(window._notifications || []).forEach(n => { n.isRead = true })
  window._unreadCount = 0
  _updateNotifUI()
  fetch('api/notifications/mark_read.php', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ all: true })
  }).catch(() => {})
}

// ── Sidebar collapse ────────────────────────────────────────────
function toggleSidebar() {
  if (window.innerWidth <= 767) {
    const sidebar  = document.getElementById('sidebar')
    const mainArea = document.getElementById('main-area')
    const overlay  = document.getElementById('sidebar-overlay')
    // Strip desktop-collapse state so the drawer always opens at full width
    sidebar.classList.remove('collapsed')
    if (mainArea) mainArea.classList.remove('collapsed')
    const isOpen = sidebar.classList.toggle('mobile-open')
    if (overlay) overlay.classList.toggle('show', isOpen)
  } else {
    state.sidebarCollapsed = !state.sidebarCollapsed
    document.getElementById('sidebar').classList.toggle('collapsed', state.sidebarCollapsed)
    document.getElementById('main-area').classList.toggle('collapsed', state.sidebarCollapsed)
  }
}

function closeMobileSidebar() {
  document.getElementById('sidebar')?.classList.remove('mobile-open')
  document.getElementById('sidebar-overlay')?.classList.remove('show')
}
window.closeMobileSidebar = closeMobileSidebar

// ── Responsive default: pick a sidebar mode when the viewport crosses
//    into a new size bucket, without fighting a manual toggle made by
//    the user while they stay within the same bucket. ─────────────
function _sidebarBucketFor(w) {
  if (w <= 767)  return 'mobile'
  if (w <= 1024) return 'tablet'
  return 'desktop'
}
let _lastSidebarBucket = null
function applySidebarBucket(force) {
  const sidebar  = document.getElementById('sidebar')
  const mainArea = document.getElementById('main-area')
  if (!sidebar || !mainArea) return
  const bucket = _sidebarBucketFor(window.innerWidth)
  if (bucket === _lastSidebarBucket && !force) return
  _lastSidebarBucket = bucket
  closeMobileSidebar()
  if (bucket === 'mobile') {
    state.sidebarCollapsed = false
    sidebar.classList.remove('collapsed')
    mainArea.classList.remove('collapsed')
  } else if (bucket === 'tablet') {
    // Default to icon-rail mode on tablets/small laptops, but the user
    // can still expand it — the hamburger keeps using the same toggle.
    state.sidebarCollapsed = true
    sidebar.classList.add('collapsed')
    mainArea.classList.add('collapsed')
  } else {
    state.sidebarCollapsed = false
    sidebar.classList.remove('collapsed')
    mainArea.classList.remove('collapsed')
  }
}
window.applySidebarBucket = applySidebarBucket

window.addEventListener('resize', () => applySidebarBucket(false))

// ── Dropdown open/close ─────────────────────────────────────────
function toggleDropdown(id) {
  const menu  = document.getElementById(id)
  const arrow = document.getElementById('arrow-' + id)
  if (!menu) return
  const sidebar = document.getElementById('sidebar')
  // A collapsed icon-rail sidebar can't show a submenu in place — expand
  // it first so the click actually leads somewhere instead of being a dead end.
  if (sidebar && sidebar.classList.contains('collapsed') && window.innerWidth > 767) {
    state.sidebarCollapsed = false
    sidebar.classList.remove('collapsed')
    document.getElementById('main-area')?.classList.remove('collapsed')
    menu.classList.add('open')
    if (arrow) arrow.classList.add('open')
    return
  }
  menu.classList.toggle('open')
  if (arrow) arrow.classList.toggle('open')
}
