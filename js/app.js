(function () {
  'use strict';

  var $ = function (id) { return document.getElementById(id); };

  var ROLES = {
    super: {
      badge: 'Admin Super',
      title: 'Masuk ke akun admin',
      label: 'Email / ID Admin',
      placeholder: 'Masukkan email atau ID'
    },
    guru: {
      badge: 'Admin Guru',
      title: 'Masuk ke akun guru',
      label: 'Email / ID Guru',
      placeholder: 'Masukkan email atau ID'
    },
    ortu: {
      badge: 'Orang Tua',
      title: 'Masuk ke akun orang tua',
      label: 'Email / No. HP',
      placeholder: 'Masukkan email atau nomor HP'
    }
  };

  var state = { step: 1, role: null };

  var panels = { 1: $('panel-1'), 2: $('panel-2'), 3: $('panel-3') };
  var steps = document.querySelectorAll('.step');
  var cards = document.querySelectorAll('.category-card');
  var categoryError = $('categoryError');

  /* ---------- Stepper & navigasi ---------- */
  function goTo(step) {
    state.step = step;
    Object.keys(panels).forEach(function (k) {
      panels[k].hidden = Number(k) !== step;
    });
    steps.forEach(function (el) {
      var n = Number(el.dataset.step);
      el.classList.toggle('is-active', n === step);
      el.classList.toggle('is-done', n < step || (step === 3 && n === 3 && false));
    });
    // Pada langkah 3, langkah 1 & 2 selesai, langkah 3 aktif (sesuai desain).
  }

  /* ---------- Langkah 1: pilih kategori ---------- */
  cards.forEach(function (card) {
    card.addEventListener('click', function () {
      var input = card.querySelector('input');
      input.checked = true;
      state.role = card.dataset.role;
      cards.forEach(function (c) { c.classList.toggle('is-selected', c === card); });
      categoryError.hidden = true;
    });
  });

  $('btnContinue').addEventListener('click', function () {
    if (!state.role) {
      categoryError.hidden = false;
      return;
    }
    var cfg = ROLES[state.role];
    $('roleBadgeText').textContent = cfg.badge;
    $('loginTitle').textContent = cfg.title;
    $('identityLabel').textContent = cfg.label;
    $('identity').placeholder = cfg.placeholder;
    resetForm();
    goTo(2);
    $('identity').focus();
  });

  /* ---------- Langkah 2: verifikasi ---------- */
  var form = $('loginForm');
  var identity = $('identity');
  var password = $('password');

  function setError(wrapId, errId, msg) {
    var wrap = $(wrapId);
    var err = $(errId);
    if (msg) {
      wrap.classList.add('has-error');
      err.textContent = msg;
      err.hidden = false;
    } else {
      wrap.classList.remove('has-error');
      err.hidden = true;
    }
  }

  function resetForm() {
    form.reset();
    setError('identityWrap', 'identityError', '');
    setError('passwordWrap', 'passwordError', '');
    $('formError').hidden = true;
    password.type = 'password';
    $('togglePass').querySelector('.eye-off').hidden = false;
    $('togglePass').querySelector('.eye-on').hidden = true;
    $('btnLogin').disabled = false;
    $('btnLoginText').textContent = 'Masuk';
  }

  $('togglePass').addEventListener('click', function () {
    var show = password.type === 'password';
    password.type = show ? 'text' : 'password';
    this.querySelector('.eye-off').hidden = show;
    this.querySelector('.eye-on').hidden = !show;
    this.setAttribute('aria-label', show ? 'Sembunyikan password' : 'Tampilkan password');
  });

  identity.addEventListener('input', function () { setError('identityWrap', 'identityError', ''); $('formError').hidden = true; });
  password.addEventListener('input', function () { setError('passwordWrap', 'passwordError', ''); $('formError').hidden = true; });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var ok = true;

    if (!identity.value.trim()) {
      setError('identityWrap', 'identityError', 'Email atau ID wajib diisi.');
      ok = false;
    }
    if (!password.value) {
      setError('passwordWrap', 'passwordError', 'Password wajib diisi.');
      ok = false;
    } else if (password.value.length < 6) {
      setError('passwordWrap', 'passwordError', 'Password minimal 6 karakter.');
      ok = false;
    }
    if (!ok) return;

    // Simulasi proses verifikasi (ganti dengan request ke backend nanti).
    var btn = $('btnLogin');
    btn.disabled = true;
    $('btnLoginText').textContent = 'Memverifikasi...';

    setTimeout(function () {
      goTo(3);
    }, 700);
  });

  $('btnBack').addEventListener('click', function () {
    goTo(1);
  });

  /* ---------- Init ---------- */
  goTo(1);
})();
