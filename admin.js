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

    // ===== TRAFFIC CHART =====
    const trafficData = {
        7: {
            labels: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
            visitors: [38, 52, 45, 61, 55, 28, 19],
            pageviews: [95, 134, 112, 158, 140, 68, 45]
        },
        30: {
            labels: ['01/03','03/03','05/03','07/03','09/03','11/03','13/03','15/03','17/03','19/03','21/03','23/03','25/03','27/03','29/03','31/03','02/04','04/04','06/04','08/04'],
            visitors: [32,28,41,38,55,48,62,58,45,52,68,72,65,78,70,85,82,90,88,95],
            pageviews: [78,65,98,92,130,115,155,140,108,125,168,180,160,195,172,210,205,225,218,240]
        },
        90: {
            labels: ['Jan S1','S2','S3','S4','Fév S1','S2','S3','S4','Mar S1','S2','S3','S4','Avr S1'],
            visitors: [180,210,195,240,260,285,310,295,340,380,420,450,480],
            pageviews: [420,510,480,590,640,700,760,720,840,940,1040,1120,1200]
        }
    };

    let currentRange = 30;

    function drawChart(range) {
        currentRange = range;
        const canvas = document.getElementById('trafficChart');
        if (!canvas) return;

        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.parentElement.getBoundingClientRect();
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        const ctx = canvas.getContext('2d');
        ctx.scale(dpr, dpr);

        const w = rect.width;
        const h = rect.height;
        const data = trafficData[range];
        const padL = 48, padR = 16, padT = 12, padB = 36;
        const chartW = w - padL - padR;
        const chartH = h - padT - padB;

        ctx.clearRect(0, 0, w, h);

        // Find max for scale
        const allVals = [...data.visitors, ...data.pageviews];
        const maxVal = Math.ceil(Math.max(...allVals) * 1.15 / 10) * 10;

        // Grid lines + Y labels
        const gridLines = 5;
        ctx.textAlign = 'right';
        ctx.textBaseline = 'middle';
        ctx.font = '11px Inter, sans-serif';
        for (let i = 0; i <= gridLines; i++) {
            const y = padT + (chartH / gridLines) * i;
            const val = Math.round(maxVal - (maxVal / gridLines) * i);
            ctx.strokeStyle = 'rgba(46, 51, 69, 0.6)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(padL, y);
            ctx.lineTo(w - padR, y);
            ctx.stroke();
            ctx.fillStyle = '#8a8fa8';
            ctx.fillText(val, padL - 8, y);
        }

        // X labels
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        const step = Math.max(1, Math.floor(data.labels.length / 8));
        data.labels.forEach((label, i) => {
            if (i % step === 0 || i === data.labels.length - 1) {
                const x = padL + (chartW / (data.labels.length - 1)) * i;
                ctx.fillStyle = '#8a8fa8';
                ctx.font = '10px Inter, sans-serif';
                ctx.fillText(label, x, h - padB + 10);
            }
        });

        function getPoints(values) {
            return values.map((v, i) => ({
                x: padL + (chartW / (values.length - 1)) * i,
                y: padT + chartH - (v / maxVal) * chartH
            }));
        }

        function drawLine(points, color, fillColor) {
            // Fill area
            ctx.beginPath();
            ctx.moveTo(points[0].x, padT + chartH);
            points.forEach(p => ctx.lineTo(p.x, p.y));
            ctx.lineTo(points[points.length - 1].x, padT + chartH);
            ctx.closePath();
            const grad = ctx.createLinearGradient(0, padT, 0, padT + chartH);
            grad.addColorStop(0, fillColor);
            grad.addColorStop(1, 'transparent');
            ctx.fillStyle = grad;
            ctx.fill();

            // Smooth line
            ctx.beginPath();
            ctx.moveTo(points[0].x, points[0].y);
            for (let i = 0; i < points.length - 1; i++) {
                const cp1x = (points[i].x + points[i + 1].x) / 2;
                const cp1y = points[i].y;
                const cp2x = cp1x;
                const cp2y = points[i + 1].y;
                ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, points[i + 1].x, points[i + 1].y);
            }
            ctx.strokeStyle = color;
            ctx.lineWidth = 2.5;
            ctx.lineJoin = 'round';
            ctx.stroke();

            // Dots
            points.forEach(p => {
                ctx.beginPath();
                ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
                ctx.fillStyle = color;
                ctx.fill();
                ctx.strokeStyle = '#1a1d27';
                ctx.lineWidth = 2;
                ctx.stroke();
            });
        }

        const pvPoints = getPoints(data.pageviews);
        const vPoints = getPoints(data.visitors);
        drawLine(pvPoints, '#FFE500', 'rgba(255,229,0,0.12)');
        drawLine(vPoints, '#3b82f6', 'rgba(59,130,246,0.12)');
    }

    // Initial draw
    setTimeout(() => drawChart(30), 100);

    // Range filter clicks
    document.querySelectorAll('.chart-card .filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.chart-card .filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            drawChart(parseInt(btn.dataset.range));
        });
    });

    // Redraw on resize
    window.addEventListener('resize', () => drawChart(currentRange));

    // Filter buttons (cosmetic toggle)
    document.querySelectorAll('.card-filters:not(.chart-card .card-filters)').forEach(group => {
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
