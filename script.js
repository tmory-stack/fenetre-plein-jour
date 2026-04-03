document.addEventListener('DOMContentLoaded', () => {

    // ===== HEADER SCROLL EFFECT =====
    const header = document.getElementById('header');
    const hero = document.getElementById('hero');

    // ===== MOBILE MENU =====
    const menuToggle = document.getElementById('menuToggle');
    const nav = document.getElementById('nav');

    menuToggle.addEventListener('click', () => {
        nav.classList.toggle('open');
        menuToggle.classList.toggle('active');
    });

    // Close mobile menu on link click
    nav.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            nav.classList.remove('open');
            menuToggle.classList.remove('active');
        });
    });

    // ===== BAY WINDOW SCROLL ANIMATION =====
    const windowLeft = document.getElementById('windowLeft');
    const windowRight = document.getElementById('windowRight');
    const heroContent = document.getElementById('heroContent');
    const scrollIndicator = document.getElementById('scrollIndicator');
    const heroOverlay = hero.querySelector('::before'); // We'll control via CSS variable

    function updateWindowAnimation() {
        const scrollY = window.scrollY;
        const heroHeight = hero.offsetHeight;

        // Calculate scroll progress within the hero section (0 to 1)
        const progress = Math.min(Math.max(scrollY / (heroHeight * 0.6), 0), 1);

        // Window panels slide open (translate X)
        const slideAmount = progress * 100;
        windowLeft.style.transform = `translateX(-${slideAmount}%)`;
        windowRight.style.transform = `translateX(${slideAmount}%)`;

        // Fade out the dark overlay as window opens
        const overlayOpacity = 0.6 * (1 - progress);
        hero.style.setProperty('--overlay-opacity', overlayOpacity);
        hero.style.cssText += `--overlay-opacity: ${overlayOpacity}`;

        // Apply overlay dynamically using a pseudo-element workaround
        // We'll use an inline style on a dedicated element instead
        updateOverlay(overlayOpacity);

        // Fade out hero content as user scrolls
        const contentFade = 1 - progress * 2; // Fades faster
        heroContent.style.opacity = Math.max(contentFade, 0);
        heroContent.style.transform = `translateY(${progress * -40}px)`;

        // Fade out scroll indicator
        if (scrollIndicator) {
            scrollIndicator.style.opacity = Math.max(1 - progress * 4, 0);
        }

        // Header background
        if (scrollY > 80) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }

    // Create overlay element (replacing pseudo-element for dynamic control)
    const overlayEl = document.createElement('div');
    overlayEl.style.cssText = `
        position: absolute;
        inset: 0;
        background: rgba(26, 26, 26, 0.6);
        z-index: 6;
        pointer-events: none;
        transition: none;
    `;
    hero.appendChild(overlayEl);

    // Remove the CSS pseudo-element overlay
    hero.style.setProperty('--no-pseudo', '1');
    const styleOverride = document.createElement('style');
    styleOverride.textContent = '.hero::before { display: none !important; }';
    document.head.appendChild(styleOverride);

    function updateOverlay(opacity) {
        overlayEl.style.background = `rgba(26, 26, 26, ${opacity})`;
    }

    // Use requestAnimationFrame for smooth scroll handling
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                updateWindowAnimation();
                updateScrollAnimations();
                ticking = false;
            });
            ticking = true;
        }
    });

    // Initial call
    updateWindowAnimation();

    // ===== SCROLL REVEAL ANIMATIONS =====
    const animatedElements = document.querySelectorAll(
        '.service-card, .material-card, .realisation-card, .engagement-card, ' +
        '.testimonial-card, .process-step, .trust-item, .section-header, ' +
        '.zone-text, .zone-map, .contact-info, .contact-map, .cta-content'
    );

    // Add fade-in class to all animated elements
    animatedElements.forEach((el, i) => {
        el.classList.add('fade-in');
        // Stagger within grid siblings
        const siblings = el.parentElement.querySelectorAll('.fade-in');
        const indexInParent = Array.from(siblings).indexOf(el);
        el.style.transitionDelay = `${indexInParent * 0.08}s`;
    });

    function updateScrollAnimations() {
        const windowHeight = window.innerHeight;
        animatedElements.forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.top < windowHeight * 0.88) {
                el.classList.add('visible');
            }
        });
    }

    // Initial check for elements already in view
    updateScrollAnimations();

    // ===== SMOOTH SCROLL FOR ANCHOR LINKS =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const target = document.querySelector(targetId);
            if (target) {
                const headerHeight = header.offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ===== FORM HANDLING =====
    const form = document.getElementById('devisForm');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            // Simple validation visual feedback
            const requiredFields = form.querySelectorAll('[required]');
            let allValid = true;
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    field.style.borderColor = '#ef4444';
                    allValid = false;
                } else {
                    field.style.borderColor = 'rgba(255,255,255,0.2)';
                }
            });

            if (allValid) {
                // Show success message
                const btn = form.querySelector('.btn-submit');
                const originalText = btn.textContent;
                btn.textContent = 'Demande envoyee !';
                btn.style.background = '#22c55e';
                btn.style.borderColor = '#22c55e';
                btn.disabled = true;

                setTimeout(() => {
                    btn.textContent = originalText;
                    btn.style.background = '';
                    btn.style.borderColor = '';
                    btn.disabled = false;
                    form.reset();
                }, 3000);
            }
        });
    }

    // ===== REALISATION LIGHTBOX + CAROUSEL =====
    const projects = [
        {
            title: 'Maison en briques - Douaisis',
            cat: 'Fenêtres aluminium cintrées',
            desc: 'Remplacement complet des menuiseries en aluminium gris anthracite avec cintrage sur mesure pour respecter les arcs en briques. Porte-fenêtre 2 vantaux avec imposte cintrée et fenêtre à petits carreaux. Double vitrage haute performance.',
            images: [
                { type: 'photo', url: 'images/realisations/1.JPG' },
                { type: 'photo', url: 'images/realisations/IMG_3474.JPG' },
                { type: 'photo', url: 'images/realisations/IMG_3475.JPG' }
            ]
        },
        {
            title: 'Maison de maître - Sin-le-Noble',
            cat: 'Rénovation complète',
            desc: 'Remplacement de 12 fenêtres bois avec respect de l\'architecture d\'origine. Vitrage haute performance à isolation renforcée. Quincaillerie laiton assortie au style de la maison. Peinture extérieure RAL sur mesure.',
            images: [
                { type: 'gradient', value: 'linear-gradient(135deg, #b7cfe8, #7da6c4)' },
                { type: 'gradient', value: 'linear-gradient(135deg, #a0b8d4, #6890b0)' },
                { type: 'gradient', value: 'linear-gradient(135deg, #92aac8, #5a82a0)' }
            ]
        },
        {
            title: 'Pavillon - Lambres-lez-Douai',
            cat: 'Porte d\'entrée',
            desc: 'Porte d\'entrée aluminium design avec tierce vitrée et serrure multipoints 5 points. Panneau décoratif avec insert inox brossé. Seuil aluminium à rupture de pont thermique. Barre de tirage inox assorti.',
            images: [
                { type: 'gradient', value: 'linear-gradient(135deg, #d5e8b7, #a6c47d)' },
                { type: 'gradient', value: 'linear-gradient(135deg, #c0d8a0, #90b468)' },
                { type: 'gradient', value: 'linear-gradient(135deg, #b0ca90, #80a458)' }
            ]
        },
        {
            title: 'Appartement - Centre de Douai',
            cat: 'Fenêtres PVC',
            desc: 'Pose de fenêtres PVC blanc avec volets roulants intégrés. Isolation acoustique renforcée pour le centre-ville. Vitrage 4/16/4 argon avec traitement phonique. Motorisation Somfy avec télécommande centralisée.',
            images: [
                { type: 'gradient', value: 'linear-gradient(135deg, #e8b7d5, #c47da6)' },
                { type: 'gradient', value: 'linear-gradient(135deg, #d8a4c4, #b46890)' },
                { type: 'gradient', value: 'linear-gradient(135deg, #ca96b6, #a45a82)' }
            ]
        }
    ];

    const lightbox = document.getElementById('lightbox');
    const lightboxBackdrop = document.getElementById('lightboxBackdrop');
    const lightboxClose = document.getElementById('lightboxClose');
    const carouselTrack = document.getElementById('carouselTrack');
    const carouselDots = document.getElementById('carouselDots');
    const carouselPrev = document.getElementById('carouselPrev');
    const carouselNext = document.getElementById('carouselNext');
    const lightboxCat = document.getElementById('lightboxCat');
    const lightboxTitle = document.getElementById('lightboxTitle');
    const lightboxDesc = document.getElementById('lightboxDesc');

    let currentSlide = 0;
    let currentProject = null;

    function openLightbox(projectIndex) {
        currentProject = projects[projectIndex];
        currentSlide = 0;

        // Set info
        lightboxCat.textContent = currentProject.cat;
        lightboxTitle.textContent = currentProject.title;
        lightboxDesc.textContent = currentProject.desc;

        // Build carousel slides
        carouselTrack.innerHTML = '';
        currentProject.images.forEach((img) => {
            const slide = document.createElement('div');
            if (img.type === 'gradient') {
                slide.className = 'carousel-slide carousel-slide-gradient';
                slide.style.background = img.value;
            } else {
                slide.className = 'carousel-slide';
                slide.innerHTML = `<img src="${img.url}" alt="${currentProject.title}" loading="lazy">`;
            }
            carouselTrack.appendChild(slide);
        });

        // Build dots
        carouselDots.innerHTML = '';
        currentProject.images.forEach((_, i) => {
            const dot = document.createElement('button');
            dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
            dot.setAttribute('aria-label', `Image ${i + 1}`);
            dot.addEventListener('click', () => goToSlide(i));
            carouselDots.appendChild(dot);
        });

        updateCarousel();
        lightbox.classList.add('open');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightbox.classList.remove('open');
        document.body.style.overflow = '';
    }

    function goToSlide(index) {
        const total = currentProject.images.length;
        currentSlide = ((index % total) + total) % total;
        updateCarousel();
    }

    function updateCarousel() {
        carouselTrack.style.transform = `translateX(-${currentSlide * 100}%)`;
        const dots = carouselDots.querySelectorAll('.carousel-dot');
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === currentSlide);
        });
    }

    // Event listeners
    document.querySelectorAll('.realisation-card[data-project]').forEach(card => {
        card.addEventListener('click', () => {
            openLightbox(parseInt(card.dataset.project));
        });
    });

    lightboxClose.addEventListener('click', closeLightbox);
    lightboxBackdrop.addEventListener('click', closeLightbox);
    carouselPrev.addEventListener('click', () => goToSlide(currentSlide - 1));
    carouselNext.addEventListener('click', () => goToSlide(currentSlide + 1));

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('open')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') goToSlide(currentSlide - 1);
        if (e.key === 'ArrowRight') goToSlide(currentSlide + 1);
    });

});
