// ============================================================
// AUTH — Login, Logout, Cek Session
// ============================================================

// ============================================================
// LOGIN
// ============================================================
async function login(username, password) {
  try {
    // Cari user di tabel users
    const { data, error } = await supabaseClient
      .from('users')
      .select('*')
      .eq('username', username)
      .eq('password', password)
      .eq('aktif', true)
      .single();
    
    if (error || !data) {
      return { success: false, message: 'Username atau password salah!' };
    }
    
    // Simpan session di localStorage
    const session = {
      id_user: data.id_user,
      username: data.username,
      nama_lengkap: data.nama_lengkap,
      role: data.role,
      id_pegawai: data.id_pegawai,
      login_at: new Date().toISOString()
    };
    
    localStorage.setItem('op3_session', JSON.stringify(session));
    
    // Update last_login
    await supabaseClient
      .from('users')
      .update({ last_login: new Date().toISOString() })
      .eq('id_user', data.id_user);
    
    return { success: true, session };
  } catch (error) {
    return { success: false, message: 'Error: ' + error.message };
  }
}

// ============================================================
// LOGOUT
// ============================================================
function logout() {
  localStorage.removeItem('op3_session');
  window.location.href = 'index.html';
}

// ============================================================
// CEK SESSION
// ============================================================
function getSession() {
  const session = localStorage.getItem('op3_session');
  return session ? JSON.parse(session) : null;
}

function requireLogin() {
  const session = getSession();
  if (!session) {
    window.location.href = 'index.html';
    return null;
  }
  return session;
}

// ============================================================
// CEK ROLE
// ============================================================
function hasRole(...roles) {
  const session = getSession();
  return session && roles.includes(session.role);
}

// ============================================================
// HANDLE FORM LOGIN
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const username = document.getElementById('username').value.trim();
      const password = document.getElementById('password').value.trim();
      const btnLogin = document.getElementById('btnLogin');
      const errorMsg = document.getElementById('errorMsg');
      
      // Disable button
      btnLogin.disabled = true;
      btnLogin.textContent = 'Memproses...';
      errorMsg.style.display = 'none';
      
      const result = await login(username, password);
      
      if (result.success) {
        window.location.href = 'dashboard.html';
      } else {
        errorMsg.textContent = result.message;
        errorMsg.style.display = 'block';
        btnLogin.disabled = false;
        btnLogin.textContent = 'Masuk';
      }
    });
  }
});
