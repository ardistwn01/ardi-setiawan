const SUPABASE_URL = 'https://pjzsyntwyziwfnobmheo.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_JMAV14ik52aZnNbX5GwsGQ_XlXWLmoi';
const { createClient } = supabase;
const sb = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ============================================================
// AUTH
// ============================================================
async function checkAuth() {
  const { data: { session } } = await sb.auth.getSession();
  if (session) showDashboard();
}

document.getElementById('loginBtn').addEventListener('click', async () => {
  const email = document.getElementById('loginEmail').value;
  const pass = document.getElementById('loginPass').value;
  const errEl = document.getElementById('loginErr');
  errEl.textContent = '';
  const { error } = await sb.auth.signInWithPassword({ email, password: pass });
  if (error) { errEl.textContent = error.message; return; }
  showDashboard();
});

document.getElementById('logoutBtn').addEventListener('click', async () => {
  await sb.auth.signOut();
  document.getElementById('dashboard').style.display = 'none';
  document.getElementById('loginScreen').style.display = 'flex';
});

function showDashboard() {
  document.getElementById('loginScreen').style.display = 'none';
  document.getElementById('dashboard').style.display = 'grid';
  loadOverview();
}

// ============================================================
// MOBILE SIDEBAR TOGGLE
// ============================================================
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const sidebar = document.getElementById('sidebar');
const sidebarOverlay = document.getElementById('sidebarOverlay');
if (mobileMenuBtn && sidebar && sidebarOverlay) {
  mobileMenuBtn.addEventListener('click', () => {
    sidebar.classList.toggle('open');
    sidebarOverlay.classList.toggle('active');
  });
  sidebarOverlay.addEventListener('click', () => {
    sidebar.classList.remove('open');
    sidebarOverlay.classList.remove('active');
  });
  // Close sidebar when a nav item is clicked on mobile
  document.querySelectorAll('.nav-item').forEach(btn => {
    btn.addEventListener('click', () => {
      if (window.innerWidth <= 768) {
        sidebar.classList.remove('open');
        sidebarOverlay.classList.remove('active');
      }
    });
  });
}

// ============================================================
// TABS
// ============================================================
const tabTitles = { overview:'Overview', profile:'Profile', projects:'Projects', experience:'Experience', skills:'Skills', certificates:'Certificates', messages:'Messages' };
document.querySelectorAll('.nav-item').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    btn.classList.add('active');
    const tab = btn.dataset.tab;
    document.getElementById(`tab-${tab}`).classList.add('active');
    document.getElementById('dashTitle').textContent = tabTitles[tab];
    if (tab === 'profile') loadProfile();
    if (tab === 'projects') loadProjects();
    if (tab === 'experience') loadExperience();
    if (tab === 'skills') loadSkills();
    if (tab === 'certificates') loadCertificates();
    if (tab === 'messages') loadMessages();
  });
});

// ============================================================
// OVERVIEW
// ============================================================
async function loadOverview() {
  const [pr, ex, sk, ce, ms] = await Promise.all([
    sb.from('projects').select('id', { count: 'exact', head: true }),
    sb.from('experience').select('id', { count: 'exact', head: true }),
    sb.from('skills').select('id', { count: 'exact', head: true }),
    sb.from('certificates').select('id', { count: 'exact', head: true }),
    sb.from('messages').select('id', { count: 'exact', head: true }),
  ]);
  const unread = await sb.from('messages').select('id', { count: 'exact', head: true }).eq('is_read', false);

  document.getElementById('overviewStats').innerHTML = [
    { label: 'Projects', val: pr.count || 0 },
    { label: 'Experience', val: ex.count || 0 },
    { label: 'Skills', val: sk.count || 0 },
    { label: 'Certificates', val: ce.count || 0 },
    { label: 'Total Pesan', val: ms.count || 0 },
    { label: 'Belum Dibaca', val: unread.count || 0 },
  ].map(s => `<div class="stat-card"><div class="stat-card-num">${s.val}</div><div class="stat-card-label">${s.label}</div></div>`).join('');

  if (unread.count > 0) {
    const badge = document.getElementById('unreadBadge');
    badge.textContent = unread.count;
    badge.style.display = 'inline';
  }

  const { data: msgs } = await sb.from('messages').select('*').order('created_at', { ascending: false }).limit(5);
  document.getElementById('recentMessages').innerHTML = msgs?.length
    ? msgs.map(m => `<div class="recent-msg">${!m.is_read ? '<div class="unread-dot"></div>' : ''}<div><span style="font-weight:600">${m.name}</span> <span style="color:var(--text-muted);font-size:0.82rem">&lt;${m.email}&gt;</span><div style="color:var(--text-dim)">${m.subject || 'No subject'}</div></div><div style="margin-left:auto;font-size:0.78rem;color:var(--text-muted)">${new Date(m.created_at).toLocaleDateString('id-ID')}</div></div>`).join('')
    : '<p style="color:var(--text-muted);font-size:0.875rem">Belum ada pesan masuk.</p>';
}

// ============================================================
// PROFILE
// ============================================================
async function loadProfile() {
  const { data } = await sb.from('profile').select('*').single();
  if (!data) return;
  document.getElementById('pName').value = data.name || '';
  document.getElementById('pTitle').value = data.title || '';
  document.getElementById('pBio').value = data.bio || '';
  document.getElementById('pEmail').value = data.email || '';
  document.getElementById('pLocation').value = data.location || '';
  document.getElementById('pGithub').value = data.github_url || '';
  document.getElementById('pLinkedin').value = data.linkedin_url || '';
  document.getElementById('pInstagram').value = data.instagram_url || '';
  document.getElementById('pAvatar').value = data.avatar_url || '';
  document.getElementById('pCv').value = data.cv_url || '';
}
document.getElementById('saveProfile').addEventListener('click', async () => {
  const { error } = await sb.from('profile').update({
    name: document.getElementById('pName').value,
    title: document.getElementById('pTitle').value,
    bio: document.getElementById('pBio').value,
    email: document.getElementById('pEmail').value,
    location: document.getElementById('pLocation').value,
    github_url: document.getElementById('pGithub').value,
    linkedin_url: document.getElementById('pLinkedin').value,
    instagram_url: document.getElementById('pInstagram').value,
    avatar_url: document.getElementById('pAvatar').value,
    cv_url: document.getElementById('pCv').value,
    updated_at: new Date().toISOString(),
  }).neq('id', '00000000-0000-0000-0000-000000000000');
  const msg = document.getElementById('profileMsg');
  msg.textContent = error ? '✗ Gagal menyimpan' : '✓ Tersimpan!';
  msg.style.color = error ? '#f87171' : '#4ade80';
  setTimeout(() => msg.textContent = '', 3000);
});

// ============================================================
// PROJECTS
// ============================================================
async function loadProjects() {
  const { data } = await sb.from('projects').select('*').order('sort_order');
  document.getElementById('projectsList').innerHTML = data?.map(p => `
    <div class="data-item">
      <div>
        <div class="data-item-title">${p.title} ${p.featured ? '<span style="font-size:0.72rem;background:rgba(59,130,246,0.2);color:var(--accent);padding:2px 8px;border-radius:100px;margin-left:6px">Featured</span>' : ''}</div>
        <div class="data-item-sub">${(p.tech_stack||[]).join(', ')} ${p.live_url ? `· <a href="${p.live_url}" target="_blank" style="color:var(--accent)">Live ↗</a>` : ''}</div>
      </div>
      <div class="data-item-actions">
        <button class="btn btn-outline btn-sm" onclick="editProject('${p.id}')">Edit</button>
        <button class="btn btn-danger btn-sm" onclick="deleteProject('${p.id}')">Hapus</button>
      </div>
    </div>`).join('') || '<p style="color:var(--text-muted)">Belum ada project.</p>';
}
document.getElementById('addProject').addEventListener('click', () => {
  document.getElementById('projectId').value = '';
  document.getElementById('projTitle').value = '';
  document.getElementById('projDesc').value = '';
  document.getElementById('projLive').value = '';
  document.getElementById('projGithub').value = '';
  document.getElementById('projImg').value = '';
  document.getElementById('projStack').value = '';
  document.getElementById('projOrder').value = '0';
  document.getElementById('projFeatured').checked = false;
  document.getElementById('projectFormTitle').textContent = 'Tambah Project';
  document.getElementById('projectForm').style.display = 'block';
  document.getElementById('projectForm').scrollIntoView({ behavior: 'smooth' });
});
window.editProject = async (id) => {
  const { data } = await sb.from('projects').select('*').eq('id', id).single();
  if (!data) return;
  document.getElementById('projectId').value = data.id;
  document.getElementById('projTitle').value = data.title;
  document.getElementById('projDesc').value = data.description;
  document.getElementById('projLive').value = data.live_url;
  document.getElementById('projGithub').value = data.github_url;
  document.getElementById('projImg').value = data.image_url;
  document.getElementById('projStack').value = (data.tech_stack||[]).join(', ');
  document.getElementById('projOrder').value = data.sort_order;
  document.getElementById('projFeatured').checked = data.featured;
  document.getElementById('projectFormTitle').textContent = 'Edit Project';
  document.getElementById('projectForm').style.display = 'block';
  document.getElementById('projectForm').scrollIntoView({ behavior: 'smooth' });
};
window.deleteProject = async (id) => {
  if (!confirm('Hapus project ini?')) return;
  await sb.from('projects').delete().eq('id', id);
  loadProjects();
};
document.getElementById('saveProject').addEventListener('click', async () => {
  const id = document.getElementById('projectId').value;
  const payload = {
    title: document.getElementById('projTitle').value,
    description: document.getElementById('projDesc').value,
    live_url: document.getElementById('projLive').value,
    github_url: document.getElementById('projGithub').value,
    image_url: document.getElementById('projImg').value,
    tech_stack: document.getElementById('projStack').value.split(',').map(s=>s.trim()).filter(Boolean),
    sort_order: parseInt(document.getElementById('projOrder').value)||0,
    featured: document.getElementById('projFeatured').checked,
  };
  if (id) await sb.from('projects').update(payload).eq('id', id);
  else await sb.from('projects').insert(payload);
  document.getElementById('projectForm').style.display = 'none';
  loadProjects();
});
document.getElementById('cancelProject').addEventListener('click', () => document.getElementById('projectForm').style.display = 'none');

// ============================================================
// EXPERIENCE
// ============================================================
async function loadExperience() {
  const { data } = await sb.from('experience').select('*').order('sort_order');
  document.getElementById('expList').innerHTML = data?.map(e => `
    <div class="data-item">
      <div>
        <div class="data-item-title">${e.role}</div>
        <div class="data-item-sub">${e.company} · ${e.start_date} — ${e.end_date}</div>
      </div>
      <div class="data-item-actions">
        <button class="btn btn-outline btn-sm" onclick="editExp('${e.id}')">Edit</button>
        <button class="btn btn-danger btn-sm" onclick="deleteExp('${e.id}')">Hapus</button>
      </div>
    </div>`).join('') || '<p style="color:var(--text-muted)">Belum ada experience.</p>';
}
document.getElementById('addExp').addEventListener('click', () => {
  document.getElementById('expId').value = '';
  ['expCompany','expRole','expDesc','expStart','expEnd','expStack'].forEach(id => document.getElementById(id).value = '');
  document.getElementById('expCurrent').checked = false;
  document.getElementById('expForm').style.display = 'block';
  document.getElementById('expForm').scrollIntoView({ behavior: 'smooth' });
});
window.editExp = async (id) => {
  const { data: e } = await sb.from('experience').select('*').eq('id', id).single();
  if (!e) return;
  document.getElementById('expId').value = e.id;
  document.getElementById('expCompany').value = e.company;
  document.getElementById('expRole').value = e.role;
  document.getElementById('expDesc').value = e.description;
  document.getElementById('expStart').value = e.start_date;
  document.getElementById('expEnd').value = e.end_date;
  document.getElementById('expStack').value = (e.tech_stack||[]).join(', ');
  document.getElementById('expCurrent').checked = e.is_current;
  document.getElementById('expForm').style.display = 'block';
  document.getElementById('expForm').scrollIntoView({ behavior: 'smooth' });
};
window.deleteExp = async (id) => {
  if (!confirm('Hapus experience ini?')) return;
  await sb.from('experience').delete().eq('id', id);
  loadExperience();
};
document.getElementById('saveExp').addEventListener('click', async () => {
  const id = document.getElementById('expId').value;
  const payload = {
    company: document.getElementById('expCompany').value,
    role: document.getElementById('expRole').value,
    description: document.getElementById('expDesc').value,
    start_date: document.getElementById('expStart').value,
    end_date: document.getElementById('expEnd').value,
    tech_stack: document.getElementById('expStack').value.split(',').map(s=>s.trim()).filter(Boolean),
    is_current: document.getElementById('expCurrent').checked,
  };
  if (id) await sb.from('experience').update(payload).eq('id', id);
  else await sb.from('experience').insert(payload);
  document.getElementById('expForm').style.display = 'none';
  loadExperience();
});
document.getElementById('cancelExp').addEventListener('click', () => document.getElementById('expForm').style.display = 'none');

// ============================================================
// SKILLS
// ============================================================
async function loadSkills() {
  const { data } = await sb.from('skills').select('*').order('sort_order');
  document.getElementById('skillsList').innerHTML = data?.map(s => `
    <div class="data-item">
      <div>
        <div class="data-item-title">${s.name} <span style="font-size:0.75rem;color:var(--text-muted)">(${s.category})</span></div>
        <div class="data-item-sub" style="display:flex;align-items:center;gap:8px">
          <div style="width:100px;height:4px;background:rgba(255,255,255,0.07);border-radius:2px">
            <div style="width:${s.level}%;height:100%;background:var(--accent);border-radius:2px"></div>
          </div>
          ${s.level}%
        </div>
      </div>
      <div class="data-item-actions">
        <button class="btn btn-outline btn-sm" onclick="editSkill('${s.id}')">Edit</button>
        <button class="btn btn-danger btn-sm" onclick="deleteSkill('${s.id}')">Hapus</button>
      </div>
    </div>`).join('') || '<p style="color:var(--text-muted)">Belum ada skill.</p>';
}
document.getElementById('addSkill').addEventListener('click', () => {
  document.getElementById('skillId').value = '';
  ['skillCat','skillName'].forEach(id => document.getElementById(id).value = '');
  document.getElementById('skillLevel').value = '80';
  document.getElementById('skillOrder').value = '0';
  document.getElementById('skillForm').style.display = 'block';
  document.getElementById('skillForm').scrollIntoView({ behavior: 'smooth' });
});
window.editSkill = async (id) => {
  const { data: s } = await sb.from('skills').select('*').eq('id', id).single();
  if (!s) return;
  document.getElementById('skillId').value = s.id;
  document.getElementById('skillCat').value = s.category;
  document.getElementById('skillName').value = s.name;
  document.getElementById('skillLevel').value = s.level;
  document.getElementById('skillOrder').value = s.sort_order;
  document.getElementById('skillForm').style.display = 'block';
  document.getElementById('skillForm').scrollIntoView({ behavior: 'smooth' });
};
window.deleteSkill = async (id) => {
  if (!confirm('Hapus skill ini?')) return;
  await sb.from('skills').delete().eq('id', id);
  loadSkills();
};
document.getElementById('saveSkill').addEventListener('click', async () => {
  const id = document.getElementById('skillId').value;
  const payload = {
    category: document.getElementById('skillCat').value,
    name: document.getElementById('skillName').value,
    level: parseInt(document.getElementById('skillLevel').value)||80,
    sort_order: parseInt(document.getElementById('skillOrder').value)||0,
  };
  if (id) await sb.from('skills').update(payload).eq('id', id);
  else await sb.from('skills').insert(payload);
  document.getElementById('skillForm').style.display = 'none';
  loadSkills();
});
document.getElementById('cancelSkill').addEventListener('click', () => document.getElementById('skillForm').style.display = 'none');

// ============================================================
// CERTIFICATES
// ============================================================
async function loadCertificates() {
  const { data } = await sb.from('certificates').select('*').order('sort_order');
  document.getElementById('certsList').innerHTML = data?.map(c => `
    <div class="data-item">
      <div>
        <div class="data-item-title">${c.title}</div>
        <div class="data-item-sub">${c.issuer} · ${c.issue_date}</div>
      </div>
      <div class="data-item-actions">
        <button class="btn btn-outline btn-sm" onclick="editCert('${c.id}')">Edit</button>
        <button class="btn btn-danger btn-sm" onclick="deleteCert('${c.id}')">Hapus</button>
      </div>
    </div>`).join('') || '<p style="color:var(--text-muted)">Belum ada sertifikat.</p>';
}
document.getElementById('addCert').addEventListener('click', () => {
  document.getElementById('certId').value = '';
  ['certTitle','certIssuer','certDate','certUrl','certImg'].forEach(id => document.getElementById(id).value = '');
  document.getElementById('certForm').style.display = 'block';
  document.getElementById('certForm').scrollIntoView({ behavior: 'smooth' });
});
window.editCert = async (id) => {
  const { data: c } = await sb.from('certificates').select('*').eq('id', id).single();
  if (!c) return;
  document.getElementById('certId').value = c.id;
  document.getElementById('certTitle').value = c.title;
  document.getElementById('certIssuer').value = c.issuer;
  document.getElementById('certDate').value = c.issue_date;
  document.getElementById('certUrl').value = c.credential_url;
  document.getElementById('certImg').value = c.image_url;
  document.getElementById('certForm').style.display = 'block';
  document.getElementById('certForm').scrollIntoView({ behavior: 'smooth' });
};
window.deleteCert = async (id) => {
  if (!confirm('Hapus sertifikat ini?')) return;
  await sb.from('certificates').delete().eq('id', id);
  loadCertificates();
};
document.getElementById('saveCert').addEventListener('click', async () => {
  const id = document.getElementById('certId').value;
  const payload = {
    title: document.getElementById('certTitle').value,
    issuer: document.getElementById('certIssuer').value,
    issue_date: document.getElementById('certDate').value,
    credential_url: document.getElementById('certUrl').value,
    image_url: document.getElementById('certImg').value,
  };
  if (id) await sb.from('certificates').update(payload).eq('id', id);
  else await sb.from('certificates').insert(payload);
  document.getElementById('certForm').style.display = 'none';
  loadCertificates();
});
document.getElementById('cancelCert').addEventListener('click', () => document.getElementById('certForm').style.display = 'none');

// ============================================================
// MESSAGES
// ============================================================
async function loadMessages() {
  const { data } = await sb.from('messages').select('*').order('created_at', { ascending: false });
  document.getElementById('messagesList').innerHTML = data?.map(m => `
    <div class="msg-item ${m.is_read ? '' : 'unread'}">
      <div class="msg-header">
        <span class="msg-sender">${m.name} ${!m.is_read ? '<span style="font-size:0.72rem;background:rgba(59,130,246,0.2);color:var(--accent);padding:2px 8px;border-radius:100px;margin-left:6px">Baru</span>' : ''}</span>
        <span class="msg-date">${new Date(m.created_at).toLocaleString('id-ID')}</span>
      </div>
      <div class="msg-email"><a href="mailto:${m.email}" style="color:var(--accent)">${m.email}</a></div>
      ${m.subject ? `<div class="msg-subject">📌 ${m.subject}</div>` : ''}
      <div class="msg-body">${m.message}</div>
      <div class="msg-actions">
        <a href="mailto:${m.email}?subject=Re: ${m.subject||''}" class="btn btn-outline btn-sm">Balas</a>
        ${!m.is_read ? `<button class="btn btn-outline btn-sm" onclick="markRead('${m.id}')">Tandai Dibaca</button>` : ''}
        <button class="btn btn-danger btn-sm" onclick="deleteMsg('${m.id}')">Hapus</button>
      </div>
    </div>`).join('') || '<p style="color:var(--text-muted)">Belum ada pesan masuk.</p>';
}
window.markRead = async (id) => {
  await sb.from('messages').update({ is_read: true }).eq('id', id);
  loadMessages();
  loadOverview();
};
window.deleteMsg = async (id) => {
  if (!confirm('Hapus pesan ini?')) return;
  await sb.from('messages').delete().eq('id', id);
  loadMessages();
};

// ============================================================
// INIT
// ============================================================
checkAuth();
