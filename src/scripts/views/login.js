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

              <div class="password-wrapper">
                <input
                  type="password"
                  id="password"
                  class="form-input"
                  placeholder="******"
                  required
                />
                <button
                  type="button"
                  id="togglePassword"
                  class="toggle-password"
                  aria-label="Toggle password visibility"
                >
                  <i class="fas fa-eye"></i>
                </button>
              </div>
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

    // ===== 1. TOGGLE PASSWORD (DI LUAR SUBMIT) =====
    const passwordInput = document.getElementById('password');
    const toggleBtn = document.getElementById('togglePassword');

    if (passwordInput && toggleBtn) {
      const icon = toggleBtn.querySelector('i');

      toggleBtn.addEventListener('click', () => {
        const isHidden = passwordInput.type === 'password';

        passwordInput.type = isHidden ? 'text' : 'password';
        icon.classList.toggle('fa-eye');
        icon.classList.toggle('fa-eye-slash');
      });
    }

    // ===== 2. SUBMIT LOGIN =====
    if (loginForm) {
      loginForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const username = document.getElementById('username').value;
        const password = passwordInput.value;

        if (username && password) {
          DataManager.login(username);

          Swal.fire({
            icon: 'success',
            title: 'Login Berhasil!',
            text: `Selamat datang kembali, ${username}!`,
            timer: 1500,
            showConfirmButton: false,
            confirmButtonColor: '#005baa',
          }).then(() => {
            window.location.hash = '/';
            window.location.reload();
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Username dan Password wajib diisi!',
            confirmButtonColor: '#d33',
          });
        }
      });
    }
  },
};

export default Login;
