// Supabase 閰嶇疆
const SUPABASE_URL = 'https://YOUR_SUPABASE_URL.supabase.co';
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';  // 鏇挎崲涓轰綘鐨?Supabase anon key
const SUPABASE_SERVICE_KEY = 'YOUR_SUPABASE_SERVICE_KEY';  // 鏇挎崲涓轰綘鐨?Supabase service_role key

// 瀵煎嚭閰嶇疆
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_KEY };
}
