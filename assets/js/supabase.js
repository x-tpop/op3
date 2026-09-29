// ============================================================
// SUPABASE CLIENT
// ============================================================

// Load Supabase dari CDN (dipanggil di HTML)
// <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>

const supabaseClient = window.supabase.createClient(
  CONFIG.SUPABASE_URL,
  CONFIG.SUPABASE_ANON_KEY
);

// ============================================================
// HELPER: Query Supabase
// ============================================================
async function supabaseQuery(tabel, options = {}) {
  let query = supabaseClient.from(tabel).select(options.select || '*');
  
  if (options.eq) {
    Object.entries(options.eq).forEach(([key, val]) => {
      query = query.eq(key, val);
    });
  }
  
  if (options.order) {
    query = query.order(options.order.column, { ascending: options.order.ascending });
  }
  
  if (options.limit) {
    query = query.limit(options.limit);
  }
  
  const { data, error } = await query;
  if (error) throw error;
  return data;
}

// ============================================================
// HELPER: Insert Supabase
// ============================================================
async function supabaseInsert(tabel, data) {
  const { data: result, error } = await supabaseClient
    .from(tabel)
    .insert(data)
    .select();
  
  if (error) throw error;
  return result;
}

// ============================================================
// HELPER: Update Supabase
// ============================================================
async function supabaseUpdate(tabel, idKolom, idValue, data) {
  const { data: result, error } = await supabaseClient
    .from(tabel)
    .update(data)
    .eq(idKolom, idValue)
    .select();
  
  if (error) throw error;
  return result;
}
