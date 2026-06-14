// Supabase 配置
const SUPABASE_URL = 'https://homyhvcmnoqpjahegdpq.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhvbXlodmNtbm9xcGphaGVnZHBxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE0NDUwOTUsImV4cCI6MjA5NzAyMTA5NX0.BvksNumB3JKbVHTjDmhX5d0FFC9r3Vpm8fg9TPlvwp8';
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhvbXlodmNtbm9xcGphaGVnZHBxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MTQ0NTA5NSwiZXhwIjoyMDk3MDIxMDk1fQ.xfoax1KZeUEeMUkiRcQzMmKwqf1AwCBUwMkAp9dP_Cw';

// 导出配置
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_KEY };
}
