// ============================================================
// SUPABASE CLIENT
// ============================================================

const supabaseClient = window.supabase.createClient(
  CONFIG.SUPABASE_URL,
  CONFIG.SUPABASE_ANON_KEY
);

// Helper: query
async function dbSelect(tabel, options = {}) {
  let q = supabaseClient.from(tabel).select(options.select || '*');
  if (options.eq) Object.entries(options.eq).forEach(([k, v]) => { q = q.eq(k, v); });
  if (options.order) q = q.order(options.order.column, { ascending: options.order.ascending !== false });
  if (options.limit) q = q.limit(options.limit);
  const { data, error } = await q;
  if (error) throw error;
  return data;
}

// Helper: insert
async function dbInsert(tabel, data) {
  const { data: result, error } = await supabaseClient.from(tabel).insert(data).select();
  if (error) throw error;
  return result;
}

// Helper: update
async function dbUpdate(tabel, kolomId, id, data) {
  const { data: result, error } = await supabaseClient.from(tabel).update(data).eq(kolomId, id).select();
  if (error) throw error;
  return result;
}
