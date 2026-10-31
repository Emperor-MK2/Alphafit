const reviews=[
 ['Артём Иванов','Отличный клуб! Профессиональные тренеры, современное оборудование и очень приятная атмосфера.','https://www.figma.com/api/mcp/asset/727e84ab-4e78-4ea6-8ddb-0080150cd8f9.png'],
 ['Екатерина Соколова','Занимаюсь уже 3 месяца, результат заметен! Большое спасибо тренерам за поддержку!','https://www.figma.com/api/mcp/asset/db7435b3-0f06-43e6-a01f-aa1bd6bb9b31.png'],
 ['Максим Кузнецов','Лучший фитнес-клуб в городе. Удобное расположение, чисто, всегда комфортно.','https://www.figma.com/api/mcp/asset/cabcb5d1-f449-468a-bec0-1331a5903e3f.png'],
 ['Дарья Петрова','Очень нравится клуб и тренеры. Теперь тренировки — это не рутина, а удовольствие!','https://www.figma.com/api/mcp/asset/45270bc5-65ee-4ea0-b9cb-5955d97bdf32.png']
];
let active=0;
function renderReviews(){const grid=document.querySelector('#reviewGrid');grid.innerHTML='';reviews.forEach((_,i)=>{const r=reviews[(i+active)%reviews.length];grid.insertAdjacentHTML('beforeend',`<article><img src="${r[2]}" alt="${r[0]}"><div><h3>${r[0]}</h3><div class="stars">★★★★★</div><p>${r[1]}</p></div></article>`)});}
renderReviews();
document.querySelector('#prev').onclick=()=>{active=(active+reviews.length-1)%reviews.length;renderReviews()};
document.querySelector('#next').onclick=()=>{active=(active+1)%reviews.length;renderReviews()};
document.querySelectorAll('[data-scroll]').forEach(btn=>btn.addEventListener('click',e=>{e.preventDefault();document.querySelector(btn.dataset.scroll)?.scrollIntoView({behavior:'smooth'})}));
document.querySelectorAll('.plan-btn').forEach(btn=>btn.addEventListener('click',()=>showToast('Вы выбрали тариф «'+btn.dataset.plan+'»')));
const menu=document.querySelector('.mobile-menu-btn');const mobileNav=document.querySelector('.mobile-nav');menu?.addEventListener('click',()=>{const open=mobileNav.classList.toggle('open');mobileNav.setAttribute('aria-hidden',open?'false':'true');menu.setAttribute('aria-expanded',open?'true':'false')});document.querySelectorAll('.mobile-nav a').forEach(a=>a.addEventListener('click',()=>{mobileNav.classList.remove('open');menu?.setAttribute('aria-expanded','false')}));
const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('in')}),{threshold:.08});document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));
function showToast(text){const t=document.querySelector('#toast');t.textContent=text;t.classList.add('show');clearTimeout(window.toastTimer);window.toastTimer=setTimeout(()=>t.classList.remove('show'),2200)}
/* ALPHAFIT — логика окна записи.
   Подключите в конце <body> после блока modal.html:  <script src="modal.js"></script>
   Кнопка открытия: любой элемент с атрибутом data-open-booking. */
(function () {
  var overlay = document.getElementById('bk-booking');
  if (!overlay) return;
  var modal = overlay.querySelector('.bk-modal');
  var form = document.getElementById('bk-form');
  var phone = document.getElementById('bk-phone');
  var dateInput = document.getElementById('bk-date');
  var lastFocus = null;

  /* ---- открытие и закрытие ---- */
  function open(opener) {
    lastFocus = opener || document.activeElement;
    setMinDate();
    overlay.classList.add('is-open');
    overlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    setTimeout(function () {
      var f = modal.classList.contains('is-done') ? modal.querySelector('.bk-success .bk-btn') : document.getElementById('bk-name');
      if (f) f.focus();
    }, 60);
  }
  function close() {
    overlay.classList.remove('is-open');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    setTimeout(reset, 300);
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  function reset() {
    if (overlay.classList.contains('is-open')) return;
    form.reset();
    modal.classList.remove('is-done');
    clearErrors();
  }

  document.querySelectorAll('[data-open-booking]').forEach(function (b) {
    b.addEventListener('click', function (e) { e.preventDefault(); open(b); });
  });
  overlay.addEventListener('mousedown', function (e) { if (e.target === overlay) close(); });
  overlay.querySelectorAll('[data-close-booking]').forEach(function (b) { b.addEventListener('click', close); });

  document.addEventListener('keydown', function (e) {
    if (!overlay.classList.contains('is-open')) return;
    if (e.key === 'Escape') { close(); return; }
    if (e.key !== 'Tab') return;
    var items = modal.querySelectorAll('a[href], button:not([disabled]), input:not([disabled])');
    var vis = Array.prototype.filter.call(items, function (el) {
      return el.offsetParent !== null || el.type === 'radio' || el.type === 'checkbox';
    });
    if (!vis.length) return;
    var first = vis[0], last = vis[vis.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });

  /* ---- дата: не раньше сегодняшней ---- */
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function todayStr() { var d = new Date(); return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }
  function setMinDate() { dateInput.min = todayStr(); }

  /* ---- маска телефона ---- */
  function digitsOf(v) {
    var d = v.replace(/\D/g, '');
    if (d.charAt(0) === '7' || d.charAt(0) === '8') d = d.slice(1);
    return d.slice(0, 10);
  }
  function formatPhone(d) {
    if (!d) return '';
    var s = '+7 (' + d.slice(0, 3);
    if (d.length >= 3) s += ')';
    if (d.length > 3) s += ' ' + d.slice(3, 6);
    if (d.length > 6) s += '-' + d.slice(6, 8);
    if (d.length > 8) s += '-' + d.slice(8, 10);
    return s;
  }
  phone.addEventListener('input', function () { phone.value = formatPhone(digitsOf(phone.value)); });
  phone.addEventListener('focus', function () { if (!phone.value) phone.value = '+7 ('; });
  phone.addEventListener('blur', function () { if (digitsOf(phone.value).length === 0) phone.value = ''; });

  /* ---- проверка полей ---- */
  function fieldEl(name) { return form.querySelector('[data-field="' + name + '"]'); }
  function setError(name, bad) { fieldEl(name).classList.toggle('has-error', !!bad); }
  function clearErrors() { form.querySelectorAll('.has-error').forEach(function (f) { f.classList.remove('has-error'); }); }
  function checked(name) { var el = form.querySelector('input[name="' + name + '"]:checked'); return el ? el.value : ''; }

  function validate() {
    var bad = {
      name: form.elements.name.value.trim().length < 2,
      phone: digitsOf(phone.value).length !== 10,
      date: !dateInput.value || dateInput.value < todayStr(),
      time: !checked('time'),
      consent: !form.elements.consent.checked
    };
    var firstBad = null;
    ['name', 'phone', 'date', 'time', 'consent'].forEach(function (k) {
      setError(k, bad[k]);
      if (bad[k] && !firstBad) firstBad = k;
    });
    return firstBad;
  }
  // ошибка пропадает, как только человек исправил поле
  form.addEventListener('input', function (e) { var f = e.target.closest('[data-field]'); if (f) f.classList.remove('has-error'); });
  form.addEventListener('change', function (e) { var f = e.target.closest('[data-field]'); if (f) f.classList.remove('has-error'); });

  /* ---- отправка ----
     TODO: замените тело sendLead запросом на ваш сервер или CRM, например:
       return fetch('/api/lead', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
         .then(function (r) { if (!r.ok) throw new Error('send failed'); });
     Сейчас отправка только имитируется. */
    function sendLead(data) {
  return fetch('https://alphafit-telegram.emperor-mk2-lbx.workers.dev', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name: data.name,
      phone: data.phone,
      date: data.date,
      time: data.time
    })
  })
    .then(function (r) {
      if (!r.ok) throw new Error('http ' + r.status);
      return r.json();
    })
    .then(function (res) {
      if (res.status !== 'ok') {
        throw new Error(res.error || 'telegram error');
      }
    });
}

  function formatDate(iso) { var p = iso.split('-'); return p[2] + '.' + p[1] + '.' + p[0]; }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var firstBad = validate();
    if (firstBad) {
      var target = fieldEl(firstBad).querySelector('input');
      if (target) target.focus();
      return;
    }
    var data = {
      name: form.elements.name.value.trim(),
      phone: '+7' + digitsOf(phone.value),
      date: dateInput.value,
      time: checked('time'),
      consent: true
    };
    var btn = form.querySelector('.bk-btn');
    btn.disabled = true; btn.classList.add('is-loading');
    sendLead(data).then(function () {
      document.getElementById('bk-ok-phone').textContent = phone.value;
      document.getElementById('bk-ok-date').textContent = formatDate(data.date);
      document.getElementById('bk-ok-time').textContent = data.time;
      modal.classList.add('is-done');
      modal.scrollTop = 0;
      var okBtn = modal.querySelector('.bk-success .bk-btn');
      if (okBtn) okBtn.focus();
    }).catch(function () {
      alert('Не удалось отправить заявку. Попробуйте ещё раз или позвоните в клуб.');
    }).then(function () {
      btn.disabled = false; btn.classList.remove('is-loading');
    });
  });
})();
