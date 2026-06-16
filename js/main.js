import { sb } from './supabase.js';

// ============================================================
// TYPED EFFECT
// ============================================================
const phrases = [
  'full-stack web apps.',
  'AI-powered tools.',
  'mobile applications.',
  'seamless experiences.',
  'scalable backends.',
];
let pi = 0, ci = 0, deleting = false;
const typedEl = document.getElementById('typedText');
function typeLoop() {
  const phrase = phrases[pi];
  if (!deleting) {
    typedEl.textContent = phrase.slice(0, ++ci);
    if (ci === phrase.length) { deleting = true; return setTimeout(typeLoop, 2000); }
  } else {
    typedEl.textContent = phrase.slice(0, --ci);
    if (ci === 0) { deleting = false; pi = (pi + 1) % phrases.length; }
  }
  setTimeout(typeLoop, deleting ? 40 : 70);
}
typeLoop();

// ============================================================
// NAVBAR
// ============================================================
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navLinks = document.querySelector('.nav-links');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', scrollY > 60);
  // active section highlight
  const sections = document.querySelectorAll('section[id]');
  sections.forEach(s => {
    const top = s.offsetTop - 120;
    const bottom = top + s.offsetHeight;
    const link = document.querySelector(`.nav-links a[href="#${s.id}"]`);
    if (link) link.classList.toggle('active', scrollY >= top && scrollY < bottom);
  });
});
navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  navToggle.classList.toggle('active');
});
// Close mobile menu when a link is clicked
navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.classList.remove('active');
  });
});

// ============================================================
// SCROLL REVEAL
// ============================================================
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); } });
}, { threshold: 0.1 });

// ============================================================
// SKILL BAR ANIMATION
// ============================================================
const skillObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('.skill-bar-fill').forEach(bar => {
        bar.style.width = bar.dataset.level + '%';
      });
      skillObs.unobserve(e.target);
    }
  });
}, { threshold: 0.2 });

// ============================================================
// RENDER HELPERS
// ============================================================
const icons = {
  github: `<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg>`,
  linkedin: `<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>`,
  instagram: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>`,
  external: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3"/></svg>`,
  cert: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/></svg>`,
};

// ============================================================
// LOAD PROFILE
// ============================================================
async function loadProfile() {
  const { data } = await sb.from('profile').select('*').single();
  if (!data) return;

  document.title = `${data.name} — Portfolio`;
  document.getElementById('heroName').textContent = data.name;
  document.getElementById('heroBio').textContent = data.bio;
  document.getElementById('aboutBio').textContent = data.bio;

  if (data.avatar_url) {
    document.getElementById('aboutAvatar').src = data.avatar_url;
  }

  // About info
  const infoHtml = [
    data.location ? `<div class="about-info-item"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 1116 0z"/><circle cx="12" cy="10" r="3"/></svg>${data.location}</div>` : '',
    data.email ? `<div class="about-info-item"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 7L2 7"/></svg><a href="mailto:${data.email}" style="color:inherit">${data.email}</a></div>` : '',
    `<div class="about-info-item"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>UHAMKA · Teknik Informatika</div>`,
    `<div class="about-info-item"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 8.62 19.79 19.79 0 01.12 2.18 2 2 0 012.1 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92z"/></svg>NIM: 2303015136</div>`,
  ].join('');
  document.getElementById('aboutInfo').innerHTML = infoHtml;
  document.getElementById('aboutBadges').innerHTML = ['Full-Stack Dev', 'AI Enthusiast', 'Open Source', 'UHAMKA'].map(b => `<span class="badge">${b}</span>`).join('');

  // Contact
  document.getElementById('contactEmail').textContent = data.email || '-';
  document.getElementById('contactEmail').href = data.email ? `mailto:${data.email}` : '#';
  document.getElementById('contactLocation').textContent = data.location || '-';

  // CV button
  if (data.cv_url) {
    const cvBtn = document.getElementById('cvBtn');
    cvBtn.href = data.cv_url; cvBtn.style.display = 'inline-flex';
  }

  // Socials
  const socials = [
    data.github_url && { url: data.github_url, icon: icons.github, label: 'GitHub' },
    data.linkedin_url && { url: data.linkedin_url, icon: icons.linkedin, label: 'LinkedIn' },
    data.instagram_url && { url: data.instagram_url, icon: icons.instagram, label: 'Instagram' },
  ].filter(Boolean);

  const socialHtml = socials.map(s => `<a href="${s.url}" target="_blank" class="social-link" aria-label="${s.label}">${s.icon}</a>`).join('');
  document.getElementById('heroSocials').innerHTML = socialHtml;
  document.getElementById('footerSocials').innerHTML = socialHtml;
}

// ============================================================
// LOAD PROJECTS
// ============================================================
async function loadProjects() {
  const { data } = await sb.from('projects').select('*').order('sort_order');
  if (!data) return;

  document.getElementById('statProjects').textContent = data.length + '+';
  const grid = document.getElementById('projectsGrid');
  grid.innerHTML = '';

  function renderCards(filtered) {
    grid.innerHTML = '';
    filtered.forEach(p => {
      const letter = p.title.charAt(0).toUpperCase();
      const card = document.createElement('div');
      card.className = 'project-card reveal';
      card.innerHTML = `
        <div class="project-img">
          ${p.image_url ? `<img src="${p.image_url}" alt="${p.title}">` : `<span class="project-img-letter">${letter}</span>`}
          ${p.featured ? '<span class="project-featured-badge">Featured</span>' : ''}
        </div>
        <div class="project-body">
          <h3 class="project-title">${p.title}</h3>
          <p class="project-desc">${p.description}</p>
          <div class="project-stack">${(p.tech_stack||[]).map(t => `<span class="stack-tag">${t}</span>`).join('')}</div>
          <div class="project-links">
            ${p.live_url ? `<a href="${p.live_url}" target="_blank" class="project-link primary">${icons.external} Live Demo</a>` : ''}
            ${p.github_url ? `<a href="${p.github_url}" target="_blank" class="project-link">${icons.github} Source</a>` : ''}
          </div>
        </div>`;
      grid.appendChild(card);
      revealObs.observe(card);
    });
  }

  renderCards(data);

  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const f = btn.dataset.filter;
      renderCards(f === 'featured' ? data.filter(p => p.featured) : data);
    });
  });
}

// ============================================================
// LOAD EXPERIENCE
// ============================================================
async function loadExperience() {
  const { data } = await sb.from('experience').select('*').order('sort_order');
  if (!data) return;

  const tl = document.getElementById('experienceTimeline');
  tl.innerHTML = '';
  data.forEach(e => {
    const item = document.createElement('div');
    item.className = 'timeline-item reveal';
    item.innerHTML = `
      <div class="timeline-dot"></div>
      <div class="timeline-card">
        <div class="timeline-header">
          <h3 class="timeline-role">${e.role}</h3>
          <span class="timeline-date">${e.start_date} — ${e.end_date}</span>
        </div>
        <p class="timeline-company">${e.company}</p>
        <p class="timeline-desc">${e.description}</p>
        <div class="timeline-stack">${(e.tech_stack||[]).map(t => `<span class="stack-tag">${t}</span>`).join('')}</div>
      </div>`;
    tl.appendChild(item);
    revealObs.observe(item);
  });
}

// ============================================================
// LOAD SKILLS
// ============================================================
async function loadSkills() {
  const { data } = await sb.from('skills').select('*').order('sort_order');
  if (!data) return;

  const grouped = {};
  data.forEach(s => { (grouped[s.category] = grouped[s.category] || []).push(s); });

  const wrap = document.getElementById('skillsWrap');
  wrap.innerHTML = '';
  Object.entries(grouped).forEach(([cat, items]) => {
    const div = document.createElement('div');
    div.className = 'skill-category reveal';
    div.innerHTML = `
      <p class="skill-cat-title">${cat}</p>
      ${items.map(s => `
        <div class="skill-item">
          <div class="skill-meta">
            <span class="skill-name">${s.name}</span>
            <span class="skill-level-text">${s.level}%</span>
          </div>
          <div class="skill-bar"><div class="skill-bar-fill" data-level="${s.level}"></div></div>
        </div>`).join('')}`;
    wrap.appendChild(div);
    revealObs.observe(div);
    skillObs.observe(div);
  });
}

// ============================================================
// LOAD CERTIFICATES
// ============================================================
async function loadCertificates() {
  const { data } = await sb.from('certificates').select('*').order('sort_order');
  document.getElementById('statCerts').textContent = (data?.length || 0) + '+';
  if (!data?.length) {
    document.getElementById('certsGrid').innerHTML = '<p style="color:var(--text-muted);text-align:center;grid-column:1/-1">Belum ada sertifikat. Tambahkan di Admin Dashboard.</p>';
    return;
  }
  const grid = document.getElementById('certsGrid');
  grid.innerHTML = '';
  data.forEach(c => {
    const card = document.createElement('div');
    card.className = 'cert-card reveal';
    card.innerHTML = `
      <div class="cert-icon">${icons.cert}</div>
      <div>
        <p class="cert-title">${c.title}</p>
        <p class="cert-issuer">${c.issuer}</p>
        <p class="cert-date">${c.issue_date}</p>
        ${c.credential_url ? `<a href="${c.credential_url}" target="_blank" class="cert-link">View Credential ${icons.external}</a>` : ''}
      </div>`;
    grid.appendChild(card);
    revealObs.observe(card);
  });
}

// ============================================================
// CONTACT FORM
// ============================================================
document.getElementById('contactForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const btn = document.getElementById('sendBtn');
  const msg = document.getElementById('formMsg');
  btn.disabled = true;
  btn.querySelector('span').textContent = 'Mengirim...';

  const { error } = await sb.from('messages').insert({
    name: document.getElementById('msgName').value,
    email: document.getElementById('msgEmail').value,
    subject: document.getElementById('msgSubject').value,
    message: document.getElementById('msgBody').value,
  });

  if (error) {
    msg.className = 'form-msg error';
    msg.textContent = 'Gagal mengirim pesan. Silakan coba lagi.';
  } else {
    msg.className = 'form-msg success';
    msg.textContent = '✓ Pesan berhasil terkirim! Akan segera dibalas.';
    e.target.reset();
  }
  btn.disabled = false;
  btn.querySelector('span').textContent = 'Kirim Pesan';
});

// ============================================================
// INIT
// ============================================================
document.getElementById('footerYear').textContent = new Date().getFullYear();

Promise.all([
  loadProfile(),
  loadProjects(),
  loadExperience(),
  loadSkills(),
  loadCertificates(),
]);

// Reveal static sections
document.querySelectorAll('.section-header').forEach(el => {
  el.classList.add('reveal');
  revealObs.observe(el);
});
