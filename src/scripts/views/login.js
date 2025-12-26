import DataManager from '../data/data-manager';

const Login = {
  async render() {
    // Jika sudah login, lempar ke beranda
    if (DataManager.isLoggedIn()) {
      window.location.hash = '/';
      return '';
    }

    return `
      <div class="container" style="display: flex; justify-content: center; align-items: center; min-height: 80vh;">
        <div class="card" style="padding: 30px; width: 100%; max-width: 400px; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
          <h2 style="text-align:center; color:var(--primary); margin-bottom:20px;">
            <i class="fas fa-user-circle" style="font-size:3rem;"></i><br>
            Login Pengguna
          </h2>
          
          <form id="loginForm">
            <div class="form-group">
              <label class="form-label">Username</label>
              <input type="text" id="username" class="form-input" placeholder="Contoh: Mahasiswa123" required>
            </div>
            
            <div class="form-group">
              <label class="form-label">Password</label>
              <input type="password" id="password" class="form-input" placeholder="******" required>
            </div>
            
            <button type="submit" class="btn-submit" style="margin-top:10px;">Masuk</button>
          </form>

          <p style="text-align:center; margin-top:15px; font-size:0.9rem; color:#666;">
            Belum punya akun? <a href="#/register" style="color:var(--primary); font-weight:bold;">Daftar disini</a>
          </p>
        </div>
      </div>
    `;
  },

  async afterRender() {
    const loginForm = document.getElementById('loginForm');

    if (loginForm) {
      loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        // Validasi Sederhana
        if (username && password) {
          // Simpan sesi
          DataManager.login(username);

          // [UPDATED] Menggunakan SweetAlert Success
          Swal.fire({
            icon: 'success',
            title: 'Login Berhasil!',
            text: `Selamat datang kembali, ${username}!`,
            timer: 1500, // Otomatis tutup dalam 1.5 detik
            showConfirmButton: false,
            confirmButtonColor: '#005baa'
          }).then(() => {
            // Pindah ke halaman Home setelah alert tutup
            window.location.hash = '/';
            // Refresh halaman agar menu navigasi (Login/Logout) terupdate
            window.location.reload();
          });

        } else {
          // [UPDATED] Menggunakan SweetAlert Error
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Username dan Password wajib diisi!',
            confirmButtonColor: '#d33'
          });
        }
      });
    }
  }
};

export default Login;