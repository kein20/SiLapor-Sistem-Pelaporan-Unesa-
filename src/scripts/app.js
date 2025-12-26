import routes from './routes';
import DataManager from './data/data-manager';

class App {
    constructor({ button, drawer, content }) {
        this._button = button;
        this._drawer = drawer;
        this._content = content;
        this._initialAppShell();
    }

    _initialAppShell() {
        // Tombol Hamburger
        this._button.addEventListener('click', (event) => {
            event.stopPropagation();
            this._drawer.classList.toggle('open');
        });

        // Tutup Drawer saat klik konten
        document.body.addEventListener('click', (event) => {
            if (!this._drawer.contains(event.target) && !this._button.contains(event.target)) {
                this._drawer.classList.remove('open');
            }
        });

        // Update tombol Login/Logout
        this._updateAuthButton();
    }

    _updateAuthButton() {
        const authBtn = document.getElementById('authButton');
        if (!authBtn) return;

        if (DataManager.isLoggedIn()) {
            authBtn.textContent = 'Logout';
            authBtn.href = '#';
            authBtn.style.backgroundColor = '#dc3545'; // Merah
            authBtn.style.color = '#fff';

            // Hapus listener lama (cloning node) biar gak numpuk
            const newBtn = authBtn.cloneNode(true);
            authBtn.parentNode.replaceChild(newBtn, authBtn);

            newBtn.addEventListener('click', (e) => {
                e.preventDefault();

                // [UPDATED] Menggunakan SweetAlert Confirm
                Swal.fire({
                    title: 'Konfirmasi Logout',
                    text: "Apakah Anda yakin ingin keluar dari aplikasi?",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#d33',
                    cancelButtonColor: '#3085d6',
                    confirmButtonText: 'Ya, Keluar',
                    cancelButtonText: 'Batal'
                }).then((result) => {
                    if (result.isConfirmed) {
                        DataManager.logout();

                        // Pesan sukses logout sebelum reload
                        Swal.fire({
                            icon: 'success',
                            title: 'Berhasil Logout',
                            text: 'Sampai jumpa lagi!',
                            timer: 1500,
                            showConfirmButton: false
                        }).then(() => {
                            location.reload();
                        });
                    }
                });
            });
        }
    }

    async renderPage() {
        const url = window.location.hash.slice(1).toLowerCase() || '/';

        // Logika Routing Sederhana
        let page = routes[url];

        // Handle Dynamic Route (Detail)
        if (url.includes('/detail/')) {
            page = routes['/detail/:id'];
        }

        // Fallback ke Home jika halaman tidak ditemukan
        if (!page) {
            page = routes['/'];
        }

        try {
            this._content.innerHTML = await page.render();
            await page.afterRender();
        } catch (error) {
            console.error("Gagal merender halaman:", error);
            this._content.innerHTML = `<h2>Error: Halaman tidak dapat ditampilkan.</h2><p>${error.message}</p>`;
        }

        this._updateActiveNav(url);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    _updateActiveNav(url) {
        document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));

        if (url === '/' || url === '') {
            const link = document.querySelector('a[href="#/"]');
            if (link) link.classList.add('active');
        } else if (url.includes('/lapor')) {
            const link = document.querySelector('a[href="#/lapor"]');
            if (link) link.classList.add('active');
        }
    }
}

export default App;