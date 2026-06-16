// ============================================================
// GANTI dengan kredensial Supabase kamu
// Panduan lengkap: lihat SETUP_GUIDE.md
// ============================================================
const SUPABASE_URL = 'https://pjzsyntwyziwfnobmheo.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_JMAV14ik52aZnNbX5GwsGQ_XlXWLmoi';

// Ambil dari CDN global (di-load via <script> tag di index.html)
const sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export { sb };
