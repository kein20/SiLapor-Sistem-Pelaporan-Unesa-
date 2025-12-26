import DataManager from '../data/data-manager';

const Register = {
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
            <i class="fas fa-user-plus" style="font-size:3rem;"></i><br>
            Daftar Akun
          </h2>
          
          <form id="registerForm">
            <div class="form-group">
              <label class="form-label">Nama Lengkap</label>
              <input type="text" id="fullname" class="form-input" placeholder="Nama Lengkap Anda" required>
            </div>

            <div class="form-group">
              <label class="form-label">Username</label>
              <input type="text" id="username" class="form-input" placeholder="Buat Username" required>
            </div>
            
            <div class="form-group">
              <label class="form-label">Password</label>
              <input type="password" id="password" class="form-input" placeholder="******" required>
            </div>

            <div class="form-group">
              <label class="form-label">Konfirmasi Password</label>
              <input type="password" id="confirmPassword" class="form-input" placeholder="******" required>
            </div>
            
            <button type="submit" class="btn-submit" style="margin-top:10px; background-color: #ffe30fff;">Daftar Sekarang</button>
          </form>

          <p style="text-align:center; margin-top:15px; font-size:0.9rem; color:#666;">
            Sudah punya akun? <a href="#/login" style="color:var(--primary); font-weight:bold;">Login disini</a>
          </p>
        </div>
      </div>
    `;
  },

  async afterRender() {
    const registerForm = document.getElementById('registerForm');

    if (registerForm) {
      registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const fullname = document.getElementById('fullname').value;
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const confirmPassword =
          document.getElementById('confirmPassword').value;

        // Validasi Password
        if (password !== confirmPassword) {
          Swal.fire({
            icon: 'error',
            title: 'Password Tidak Cocok',
            text: 'Pastikan konfirmasi password sama dengan password Anda.',
            confirmButtonColor: '#d33',
          });
          return;
        }

        // Simulasi Registrasi Sukses (Untuk Opsi A Full, nanti bisa ditambah API call ke server)
        if (username && password) {
          Swal.fire({
            icon: 'success',
            title: 'Pendaftaran Berhasil!',
            text: 'Silakan login dengan akun baru Anda.',
            timer: 2000,
            showConfirmButton: false,
          }).then(() => {
            // Arahkan ke halaman login
            window.location.hash = '/login';
          });
        }
      });
    }
  },
};

export default Register;
