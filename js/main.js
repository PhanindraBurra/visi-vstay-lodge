/* ==========================================================================
   VISIV STAY LODGE & SUITES - BHIMAVARAM
   Interactive JavaScript & Advanced Animation Controller
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // --------------------------------------------------------------------------
    // 1. INTRO SPLASH ANIMATION CONTROLLER
    // --------------------------------------------------------------------------
    const introSplash = document.getElementById('intro-splash');
    const skipIntroBtn = document.getElementById('skip-intro-btn');
    const replayIntroBtn = document.getElementById('replay-intro-btn');

    function hideIntro() {
        if (introSplash) {
            introSplash.classList.add('fade-out');
            setTimeout(() => {
                introSplash.style.display = 'none';
            }, 800);
        }
    }

    function showIntro() {
        if (introSplash) {
            introSplash.style.display = 'flex';
            introSplash.classList.remove('fade-out');
        }
    }

    // Auto-hide intro after 3.2s
    setTimeout(() => {
        hideIntro();
    }, 3200);

    if (skipIntroBtn) skipIntroBtn.addEventListener('click', hideIntro);
    if (replayIntroBtn) {
        replayIntroBtn.addEventListener('click', () => {
            showIntro();
            setTimeout(hideIntro, 3500);
        });
    }

    // --------------------------------------------------------------------------
    // 2. GOLDEN FLOATING PARTICLES CANVAS ANIMATION
    // --------------------------------------------------------------------------
    const canvas = document.getElementById('particles-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        const particleCount = 45;

        function resizeCanvas() {
            canvas.width = canvas.parentElement.clientWidth;
            canvas.height = canvas.parentElement.clientHeight;
        }

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        class Particle {
            constructor() {
                this.reset();
            }

            reset() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2.5 + 1;
                this.speedY = -(Math.random() * 0.8 + 0.2);
                this.speedX = (Math.random() - 0.5) * 0.4;
                this.opacity = Math.random() * 0.6 + 0.2;
            }

            update() {
                this.y += this.speedY;
                this.x += this.speedX;

                if (this.y < -10 || this.x < -10 || this.x > canvas.width + 10) {
                    this.reset();
                    this.y = canvas.height + 5;
                }
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(212, 175, 55, ${this.opacity})`;
                ctx.shadowBlur = 8;
                ctx.shadowColor = '#D4AF37';
                ctx.fill();
            }
        }

        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }

        function animateParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => {
                p.update();
                p.draw();
            });
            requestAnimationFrame(animateParticles);
        }

        animateParticles();
    }

    // --------------------------------------------------------------------------
    // 3. 3D PERSPECTIVE CARD TILT EFFECT
    // --------------------------------------------------------------------------
    const tiltCards = document.querySelectorAll('.tilt-card');

    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = (centerY - y) / 12;
            const rotateY = (x - centerX) / 12;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)`;
        });
    });

    // --------------------------------------------------------------------------
    // 4. ANIMATED COUNTER NUMBERS
    // --------------------------------------------------------------------------
    const counterElements = document.querySelectorAll('.counter-num');
    let countersStarted = false;

    function startCounters() {
        counterElements.forEach(counter => {
            const target = parseFloat(counter.getAttribute('data-target'));
            const suffix = counter.getAttribute('data-suffix') || '';
            const isDecimal = target % 1 !== 0;

            let current = 0;
            const increment = target / 60;
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                counter.textContent = (isDecimal ? current.toFixed(1) : Math.floor(current)) + suffix;
            }, 30);
        });
    }

    const statsSection = document.querySelector('.stats-banner');
    if (statsSection) {
        const statsObserver = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && !countersStarted) {
                countersStarted = true;
                startCounters();
            }
        }, { threshold: 0.3 });
        statsObserver.observe(statsSection);
    }

    // --------------------------------------------------------------------------
    // 5. GALLERY LIGHTBOX MODAL
    // --------------------------------------------------------------------------
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightboxModal = document.getElementById('lightbox-modal');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const lightboxClose = document.getElementById('lightbox-close');
    const lightboxPrev = document.getElementById('lightbox-prev');
    const lightboxNext = document.getElementById('lightbox-next');

    let currentGalleryIndex = 0;

    function openLightbox(index) {
        if (!galleryItems[index]) return;
        currentGalleryIndex = index;

        const item = galleryItems[index];
        const src = item.getAttribute('data-src');
        const caption = item.getAttribute('data-caption');

        lightboxImg.src = src;
        lightboxCaption.textContent = caption;
        lightboxModal.classList.add('open');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightboxModal.classList.remove('open');
        document.body.style.overflow = 'auto';
    }

    galleryItems.forEach((item, idx) => {
        item.addEventListener('click', () => openLightbox(idx));
    });

    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    if (lightboxModal) {
        lightboxModal.addEventListener('click', (e) => {
            if (e.target === lightboxModal) closeLightbox();
        });
    }

    if (lightboxPrev) {
        lightboxPrev.addEventListener('click', () => {
            currentGalleryIndex = (currentGalleryIndex - 1 + galleryItems.length) % galleryItems.length;
            openLightbox(currentGalleryIndex);
        });
    }

    if (lightboxNext) {
        lightboxNext.addEventListener('click', () => {
            currentGalleryIndex = (currentGalleryIndex + 1) % galleryItems.length;
            openLightbox(currentGalleryIndex);
        });
    }

    document.addEventListener('keydown', (e) => {
        if (!lightboxModal.classList.contains('open')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft' && lightboxPrev) lightboxPrev.click();
        if (e.key === 'ArrowRight' && lightboxNext) lightboxNext.click();
    });

    // --------------------------------------------------------------------------
    // 6. TESTIMONIALS AUTO CAROUSEL
    // --------------------------------------------------------------------------
    const reviewTrack = document.getElementById('reviews-track');
    const reviewSlides = document.querySelectorAll('.carousel-slide');
    const reviewPrev = document.getElementById('review-prev');
    const reviewNext = document.getElementById('review-next');
    const reviewDotsContainer = document.getElementById('review-dots');

    let currentSlide = 0;
    let autoSlideInterval;

    if (reviewSlides.length > 0 && reviewDotsContainer) {
        // Build dots
        reviewSlides.forEach((_, idx) => {
            const dot = document.createElement('span');
            dot.className = `dot ${idx === 0 ? 'active' : ''}`;
            dot.addEventListener('click', () => goToSlide(idx));
            reviewDotsContainer.appendChild(dot);
        });

        const dots = reviewDotsContainer.querySelectorAll('.dot');

        function goToSlide(index) {
            currentSlide = (index + reviewSlides.length) % reviewSlides.length;
            if (reviewTrack) {
                reviewTrack.style.transform = `translateX(-${currentSlide * 100}%)`;
            }
            dots.forEach((d, i) => {
                d.classList.toggle('active', i === currentSlide);
            });
        }

        function nextSlide() {
            goToSlide(currentSlide + 1);
        }

        function prevSlide() {
            goToSlide(currentSlide - 1);
        }

        if (reviewNext) reviewNext.addEventListener('click', nextSlide);
        if (reviewPrev) reviewPrev.addEventListener('click', prevSlide);

        function startAutoSlide() {
            autoSlideInterval = setInterval(nextSlide, 4500);
        }

        function stopAutoSlide() {
            clearInterval(autoSlideInterval);
        }

        startAutoSlide();

        const carouselWrapper = document.querySelector('.testimonial-carousel-wrapper');
        if (carouselWrapper) {
            carouselWrapper.addEventListener('mouseenter', stopAutoSlide);
            carouselWrapper.addEventListener('mouseleave', startAutoSlide);
        }
    }

    // --------------------------------------------------------------------------
    // 7. FLOATING QUICK WIDGET CONTROLLER
    // --------------------------------------------------------------------------
    const floatingWidget = document.getElementById('floating-widget');
    const widgetMainBtn = document.getElementById('widget-main-btn');

    if (widgetMainBtn && floatingWidget) {
        widgetMainBtn.addEventListener('click', () => {
            floatingWidget.classList.toggle('open');
        });
    }

    // --------------------------------------------------------------------------
    // 8. MOBILE NAVIGATION DRAWER & STICKY HEADER
    // --------------------------------------------------------------------------
    const mobileToggle = document.getElementById('mobile-toggle');
    const mobileDrawer = document.getElementById('mobile-drawer');
    const closeDrawer = document.getElementById('close-drawer');
    const drawerOverlay = document.getElementById('drawer-overlay');
    const drawerLinks = document.querySelectorAll('.drawer-link');

    function openMobileMenu() {
        mobileDrawer.classList.add('open');
        drawerOverlay.classList.add('open');
        document.body.style.overflow = 'hidden';
    }

    function closeMobileMenu() {
        mobileDrawer.classList.remove('open');
        drawerOverlay.classList.remove('open');
        document.body.style.overflow = 'auto';
    }

    if (mobileToggle) mobileToggle.addEventListener('click', openMobileMenu);
    if (closeDrawer) closeDrawer.addEventListener('click', closeMobileMenu);
    if (drawerOverlay) drawerOverlay.addEventListener('click', closeMobileMenu);

    drawerLinks.forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });

    const mainHeader = document.getElementById('main-header');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 60) {
            mainHeader.classList.add('scrolled');
        } else {
            mainHeader.classList.remove('scrolled');
        }

        let currentSection = '';
        const sections = document.querySelectorAll('section');

        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    });

    // --------------------------------------------------------------------------
    // 9. SCROLL REVEAL OBSERVER
    // --------------------------------------------------------------------------
    const revealElements = document.querySelectorAll('[data-reveal]');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = entry.target.getAttribute('data-delay') || 0;
                setTimeout(() => {
                    entry.target.classList.add('revealed');
                }, delay);
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });

    revealElements.forEach(el => revealObserver.observe(el));

    // --------------------------------------------------------------------------
    // 10. ROOM CATEGORY FILTER TABS
    // --------------------------------------------------------------------------
    const filterBtns = document.querySelectorAll('.filter-btn');
    const roomCards = document.querySelectorAll('.room-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            roomCards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (filterValue === 'all' || category === filterValue) {
                    card.style.display = 'flex';
                    setTimeout(() => card.style.opacity = '1', 50);
                } else {
                    card.style.opacity = '0';
                    card.style.display = 'none';
                }
            });
        });
    });

    // --------------------------------------------------------------------------
    // 11. INTERACTIVE ROOM TARIFF CALCULATOR
    // --------------------------------------------------------------------------
    const calcRoomSelect = document.getElementById('calc-room-select');
    const calcInDate = document.getElementById('calc-in-date');
    const calcOutDate = document.getElementById('calc-out-date');
    const calcNightsInput = document.getElementById('calc-nights');
    const calcExtraBedsSelect = document.getElementById('calc-extra-beds');

    const calcNightsDisplay = document.getElementById('calc-nights-display');
    const calcBaseTotal = document.getElementById('calc-base-total');
    const calcBedTotal = document.getElementById('calc-bed-total');
    const calcTaxTotal = document.getElementById('calc-tax-total');
    const calcGrandTotal = document.getElementById('calc-grand-total');
    const calcBookTrigger = document.getElementById('calc-book-trigger');

    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (calcInDate && calcOutDate) {
        calcInDate.value = today.toISOString().split('T')[0];
        calcOutDate.value = tomorrow.toISOString().split('T')[0];
        calcInDate.min = today.toISOString().split('T')[0];
        calcOutDate.min = tomorrow.toISOString().split('T')[0];
    }

    function updateCalculator() {
        if (!calcRoomSelect || !calcInDate || !calcOutDate) return;

        const roomPrice = parseFloat(calcRoomSelect.value) || 1800;
        const checkIn = new Date(calcInDate.value);
        const checkOut = new Date(calcOutDate.value);

        let diffTime = checkOut - checkIn;
        let nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (isNaN(nights) || nights < 1) nights = 1;

        calcNightsInput.value = nights;
        calcNightsDisplay.textContent = nights;

        const extraBedCostPerNight = parseFloat(calcExtraBedsSelect.value) * 400 || 0;
        const totalExtraBedCost = extraBedCostPerNight * nights;
        const totalBaseRoom = roomPrice * nights;
        const subtotal = totalBaseRoom + totalExtraBedCost;
        const gstTax = Math.round(subtotal * 0.12);
        const grandTotal = subtotal + gstTax;

        calcBaseTotal.textContent = `₹${totalBaseRoom.toLocaleString('en-IN')}`;
        calcBedTotal.textContent = `₹${totalExtraBedCost.toLocaleString('en-IN')}`;
        calcTaxTotal.textContent = `₹${gstTax.toLocaleString('en-IN')}`;
        calcGrandTotal.textContent = `₹${grandTotal.toLocaleString('en-IN')}`;
    }

    if (calcRoomSelect) calcRoomSelect.addEventListener('change', updateCalculator);
    if (calcInDate) calcInDate.addEventListener('change', () => {
        if (new Date(calcOutDate.value) <= new Date(calcInDate.value)) {
            const nextDay = new Date(calcInDate.value);
            nextDay.setDate(nextDay.getDate() + 1);
            calcOutDate.value = nextDay.toISOString().split('T')[0];
        }
        updateCalculator();
    });
    if (calcOutDate) calcOutDate.addEventListener('change', updateCalculator);
    if (calcExtraBedsSelect) calcExtraBedsSelect.addEventListener('change', updateCalculator);

    updateCalculator();

    if (calcBookTrigger) {
        calcBookTrigger.addEventListener('click', () => {
            const selectedOption = calcRoomSelect.options[calcRoomSelect.selectedIndex];
            const roomName = selectedOption ? selectedOption.getAttribute('data-name') : 'Deluxe AC Room';
            const nights = calcNightsInput.value;
            const totalCost = calcGrandTotal.textContent;
            const checkIn = calcInDate.value;
            const checkOut = calcOutDate.value;

            const textMsg = `Hello Visiv Stay Lodge Bhimavaram! I evaluated my stay details on your website:%0A%0A*Room:* ${encodeURIComponent(roomName)}%0A*Check-In:* ${checkIn}%0A*Check-Out:* ${checkOut}%0A*Duration:* ${nights} Night(s)%0A*Estimated Total:* ${encodeURIComponent(totalCost)}%0A%0APlease confirm availability for these dates.`;

            window.open(`https://wa.me/919494588999?text=${textMsg}`, '_blank');
            showToast('Opening WhatsApp with your room calculation quote!', 'success');
        });
    }

    // --------------------------------------------------------------------------
    // 12. BOOKING MODAL & QUICK VIEW CONTROLLER
    // --------------------------------------------------------------------------
    const bookingModal = document.getElementById('booking-modal');
    const openBookingBtns = document.querySelectorAll('.open-booking-btn');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const modalRoomTitle = document.getElementById('modal-room-title');
    const modalRoomNameInput = document.getElementById('modal-room-name-input');
    const modalSelectedRoom = document.getElementById('modal-selected-room');
    const modalCheckin = document.getElementById('modal-checkin');
    const modalCheckout = document.getElementById('modal-checkout');
    const modalBookingForm = document.getElementById('modal-booking-form');

    if (modalCheckin && modalCheckout) {
        modalCheckin.value = today.toISOString().split('T')[0];
        modalCheckout.value = tomorrow.toISOString().split('T')[0];
    }

    function openBookingModal(roomName = 'Deluxe AC Room') {
        if (modalRoomTitle) modalRoomTitle.textContent = roomName;
        if (modalRoomNameInput) modalRoomNameInput.value = roomName;
        if (modalSelectedRoom) modalSelectedRoom.value = roomName;
        bookingModal.classList.add('open');
        document.body.style.overflow = 'hidden';
    }

    function closeBookingModal() {
        bookingModal.classList.remove('open');
        document.body.style.overflow = 'auto';
    }

    openBookingBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const room = btn.getAttribute('data-room') || 'Deluxe AC Room';
            openBookingModal(room);
        });
    });

    if (closeModalBtn) closeModalBtn.addEventListener('click', closeBookingModal);
    if (bookingModal) {
        bookingModal.addEventListener('click', (e) => {
            if (e.target === bookingModal) closeBookingModal();
        });
    }

    if (modalBookingForm) {
        modalBookingForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const roomName = modalSelectedRoom.value;
            const guestName = document.getElementById('modal-guest-name').value;
            const guestPhone = document.getElementById('modal-guest-phone').value;
            const checkIn = modalCheckin.value;
            const checkOut = modalCheckout.value;
            const guests = document.getElementById('modal-guests').value;
            const arrival = document.getElementById('modal-arrival').value;

            const whatsappMessage = `*NEW ROOM RESERVATION REQUEST*%0A------------------------------%0A*Lodge:* Visiv Stay Bhimavaram%0A*Guest Name:* ${encodeURIComponent(guestName)}%0A*Phone:* ${encodeURIComponent(guestPhone)}%0A*Room Type:* ${encodeURIComponent(roomName)}%0A*Check-In Date:* ${checkIn}%0A*Check-Out Date:* ${checkOut}%0A*Total Guests:* ${encodeURIComponent(guests)}%0A*Expected Arrival:* ${encodeURIComponent(arrival)}%0A------------------------------%0A*Please confirm my reservation.*`;

            window.open(`https://wa.me/919494588999?text=${whatsappMessage}`, '_blank');
            closeBookingModal();
            showToast('Reservation request sent! Our desk team will contact you shortly.', 'success');
        });
    }

    // --------------------------------------------------------------------------
    // 13. FAQ ACCORDION
    // --------------------------------------------------------------------------
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const questionBtn = item.querySelector('.faq-question');
        questionBtn.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            faqItems.forEach(fi => fi.classList.remove('active'));
            if (!isActive) item.classList.add('active');
        });
    });

    // --------------------------------------------------------------------------
    // 14. CONTACT FORM SUBMISSION
    // --------------------------------------------------------------------------
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('contact-name').value;
            const phone = document.getElementById('contact-phone').value;
            const message = document.getElementById('contact-message').value;

            const text = `*VISIV STAY WEBSITE CONTACT INQUIRY*%0A*Name:* ${encodeURIComponent(name)}%0A*Phone:* ${encodeURIComponent(phone)}%0A*Message:* ${encodeURIComponent(message)}`;
            window.open(`https://wa.me/919494588999?text=${text}`, '_blank');
            showToast('Thank you! Your message has been sent to our desk.', 'success');
            contactForm.reset();
        });
    }

    // --------------------------------------------------------------------------
    // 15. TOAST NOTIFICATION UTILITY
    // --------------------------------------------------------------------------
    function showToast(message, type = 'info') {
        const toastContainer = document.getElementById('toast-container');
        if (!toastContainer) return;

        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `<i class="fa-solid fa-circle-check gold-icon"></i> <span>${message}</span>`;

        toastContainer.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 300);
        }, 4000);
    }

    window.showToast = showToast;
});
