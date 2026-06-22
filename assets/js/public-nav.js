// ================================================================
//  OPTICANA — public-nav.js
//  Shared across the public pages (index.html, pages/*.html).
//  If the visitor has an active session, swaps the navbar's "Login"
//  link for a profile dropdown (name/avatar + Dashboard + Sign Out),
//  does the same for the mobile collapsed menu, and pre-fills the
//  contact form with their account name/email if present on the page.
//  Also syncs clinic branding (logo, favicon, and on the Contact page,
//  the address/phone/email/hours) from the admin's Clinic Information
//  settings, so a change there reflects everywhere without code edits.
// ================================================================
;(function () {
  var base = window.location.pathname.indexOf('/pages/') !== -1 ? '../' : ''

  fetch(base + 'api/auth/me.php')
    .then(function (r) { return r.json() })
    .then(function (d) {
      if (!d || !d.success || !d.user) return
      applyProfileUI(d.user, base)
      prefillContactForm(d.user)
    })
    .catch(function () { /* not logged in, or PHP unavailable — leave the default Login UI */ })

  fetch(base + 'api/clinic/public.php')
    .then(function (r) { return r.json() })
    .then(function (d) {
      if (!d || !d.success || !d.clinic) return
      applyClinicBranding(d.clinic, base)
    })
    .catch(function () { /* PHP unavailable — leave the static defaults in the HTML */ })

  function initials(name) {
    return (name || '').trim().split(/\s+/).map(function (p) { return p[0] }).slice(0, 2).join('').toUpperCase()
  }

  function applyProfileUI(user, base) {
    var dashboardHref = base + 'app.html'
    var logoutHref    = base + 'api/auth/logout.php'
    var indexHref     = base + 'index.html'

    // ── Desktop: replace the standalone "Login" link with a profile button ──
    document.querySelectorAll('.nav-actions > a.nav-login').forEach(function (loginLink) {
      var actions = loginLink.parentElement
      var wrap = document.createElement('div')
      wrap.className = 'nav-profile'

      var avatarInner = user.photoUrl
        ? '<img src="' + base + user.photoUrl + '" alt="">'
        : initials(user.name)

      wrap.innerHTML =
        '<button type="button" class="nav-profile-btn" aria-haspopup="true" aria-expanded="false">' +
          '<span class="nav-profile-avatar">' + avatarInner + '</span>' +
          '<span class="nav-profile-name">' + esc(user.firstName || user.name || 'Account') + '</span>' +
          '<svg class="nav-profile-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" width="12" height="12"><polyline points="6 9 12 15 18 9"/></svg>' +
        '</button>' +
        '<div class="nav-profile-dropdown">' +
          '<div class="nav-profile-dropdown-head">' +
            '<div class="nav-profile-dropdown-name">' + esc(user.name || '') + '</div>' +
            '<div class="nav-profile-dropdown-email">' + esc(user.email || '') + '</div>' +
          '</div>' +
          '<div class="nav-profile-dropdown-divider"></div>' +
          '<a href="' + dashboardHref + '" class="nav-profile-dropdown-item">Dashboard</a>' +
          '<button type="button" class="nav-profile-dropdown-item nav-profile-logout">Sign Out</button>' +
        '</div>'

      actions.replaceChild(wrap, loginLink)

      var btn = wrap.querySelector('.nav-profile-btn')
      var dd  = wrap.querySelector('.nav-profile-dropdown')
      btn.addEventListener('click', function (e) {
        e.stopPropagation()
        var open = dd.classList.toggle('open')
        btn.setAttribute('aria-expanded', open ? 'true' : 'false')
      })
      document.addEventListener('click', function () {
        dd.classList.remove('open')
        btn.setAttribute('aria-expanded', 'false')
      })
      wrap.querySelector('.nav-profile-logout').addEventListener('click', function (e) {
        e.stopPropagation()
        signOut(logoutHref, indexHref)
      })
    })

    // ── Mobile: the collapsed menu's "Login" item becomes an account
    //    header (name, non-clickable) followed by explicit "Dashboard"
    //    and "Sign Out" items — mirrors the desktop dropdown structure
    //    so it's unambiguous these are actions, not just a label. ──
    document.querySelectorAll('li.nav-link-login').forEach(function (li) {
      if (li.parentElement.querySelector('.nav-link-account')) return // already added

      var avatarInner = user.photoUrl
        ? '<img src="' + base + user.photoUrl + '" alt="">'
        : initials(user.name)

      li.className = 'nav-item nav-link-account'
      li.innerHTML =
        '<div class="nav-mobile-account">' +
          '<span class="nav-profile-avatar">' + avatarInner + '</span>' +
          '<span class="nav-mobile-account-name">' + esc(user.name || 'Account') + '</span>' +
        '</div>'

      var dashLi = document.createElement('li')
      dashLi.className = 'nav-item nav-link-dashboard'
      dashLi.innerHTML =
        '<a href="' + dashboardHref + '" class="nav-link">' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><rect x="3" y="3" width="7" height="9"/><rect x="14" y="3" width="7" height="5"/><rect x="14" y="12" width="7" height="9"/><rect x="3" y="16" width="7" height="5"/></svg>' +
          '<span>Dashboard</span>' +
        '</a>'
      li.insertAdjacentElement('afterend', dashLi)

      var signOutLi = document.createElement('li')
      signOutLi.className = 'nav-item nav-link-logout'
      signOutLi.innerHTML =
        '<a href="#" class="nav-link">' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>' +
          '<span>Sign Out</span>' +
        '</a>'
      dashLi.insertAdjacentElement('afterend', signOutLi)
      signOutLi.querySelector('a').addEventListener('click', function (e) {
        e.preventDefault()
        signOut(logoutHref, indexHref)
      })
    })
  }

  function applyClinicBranding(clinic, base) {
    if (clinic.logoUrl) {
      document.querySelectorAll('#site-logo-img').forEach(function (img) { img.src = base + clinic.logoUrl })
      document.querySelectorAll('#site-favicon').forEach(function (link) { link.href = base + clinic.logoUrl })
    }

    var addressEl = document.getElementById('ci-pub-address')
    if (addressEl && clinic.address) addressEl.textContent = clinic.address

    var phoneEl = document.getElementById('ci-pub-phone')
    if (phoneEl && clinic.phone) {
      phoneEl.textContent = clinic.phone
      phoneEl.setAttribute('href', 'tel:' + clinic.phone.replace(/\D/g, ''))
    }

    var emailEl = document.getElementById('ci-pub-email')
    if (emailEl && clinic.email) {
      emailEl.textContent = clinic.email
      emailEl.setAttribute('href', 'mailto:' + clinic.email)
    }

    var hoursEl = document.getElementById('ci-pub-hours')
    if (hoursEl && clinic.hours) hoursEl.textContent = clinic.hours
  }

  function signOut(logoutHref, indexHref) {
    fetch(logoutHref, { method: 'POST' })
      .catch(function () {})
      .then(function () { window.location.href = indexHref })
  }

  function prefillContactForm(user) {
    var nameEl  = document.getElementById('cf-name')
    var emailEl = document.getElementById('cf-email')
    if (nameEl && !nameEl.value)   nameEl.value  = user.name  || ''
    if (emailEl && !emailEl.value) emailEl.value = user.email || ''
  }

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
    })
  }
})()
