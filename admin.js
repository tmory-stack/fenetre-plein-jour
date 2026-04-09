document.addEventListener('DOMContentLoaded', () => {

    const PASSWORD = 'admin2025';

    const loginScreen = document.getElementById('loginScreen');
    const adminApp = document.getElementById('adminApp');
    const loginForm = document.getElementById('loginForm');
    const loginPassword = document.getElementById('loginPassword');
    const loginError = document.getElementById('loginError');
    const logoutBtn = document.getElementById('logoutBtn');
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebar = document.getElementById('sidebar');
    const pageTitle = document.getElementById('pageTitle');
    const adminModal = document.getElementById('adminModal');
    const modalClose = document.getElementById('modalClose');
    const modalCancel = document.getElementById('modalCancel');
    const btnAddRealisation = document.getElementById('btnAddRealisation');

    // Check session
    if (sessionStorage.getItem('admin_auth') === 'true') {
        showAdmin();
    }

    // Login
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (loginPassword.value === PASSWORD) {
            sessionStorage.setItem('admin_auth', 'true');
            loginError.classList.remove('show');
            showAdmin();
        } else {
            loginError.classList.add('show');
            loginPassword.value = '';
            loginPassword.focus();
        }
    });

    // Logout
    logoutBtn.addEventListener('click', () => {
        sessionStorage.removeItem('admin_auth');
        adminApp.classList.remove('active');
        loginScreen.style.display = 'flex';
        loginPassword.value = '';
    });

    function showAdmin() {
        loginScreen.style.display = 'none';
        adminApp.classList.add('active');
    }

    // Sidebar navigation
    const sidebarLinks = document.querySelectorAll('.sidebar-link[data-section]');
    const sections = document.querySelectorAll('.admin-section');

    const sectionTitles = {
        dashboard: 'Tableau de bord',
        realisations: 'Réalisations',
        avis: 'Avis clients',
        devis: 'Demandes de devis',
        parametres: 'Paramètres'
    };

    sidebarLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const sectionId = link.dataset.section;

            sidebarLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');

            sections.forEach(s => s.classList.remove('active'));
            document.getElementById('sec-' + sectionId).classList.add('active');

            pageTitle.textContent = sectionTitles[sectionId] || '';

            // Close mobile sidebar
            sidebar.classList.remove('open');
        });
    });

    // Sidebar toggle (mobile)
    sidebarToggle.addEventListener('click', () => {
        sidebar.classList.toggle('open');
    });

    // Modal
    function openModal(title) {
        document.getElementById('modalTitle').textContent = title || 'Ajouter';
        adminModal.classList.add('open');
    }

    function closeModal() {
        adminModal.classList.remove('open');
    }

    modalClose.addEventListener('click', closeModal);
    modalCancel.addEventListener('click', closeModal);
    adminModal.querySelector('.admin-modal-backdrop').addEventListener('click', closeModal);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && adminModal.classList.contains('open')) closeModal();
    });

    // Add realisation button
    if (btnAddRealisation) {
        btnAddRealisation.addEventListener('click', () => openModal('Ajouter une réalisation'));
    }

    // Filter buttons (cosmetic toggle)
    document.querySelectorAll('.card-filters').forEach(group => {
        group.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                group.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });
    });

    // "Enregistrer" buttons - show brief feedback
    document.querySelectorAll('.admin-form .btn-admin-primary').forEach(btn => {
        btn.addEventListener('click', () => {
            const original = btn.textContent;
            btn.textContent = 'Enregistré !';
            btn.style.background = '#22c55e';
            setTimeout(() => {
                btn.textContent = original;
                btn.style.background = '';
            }, 1500);
        });
    });

});
