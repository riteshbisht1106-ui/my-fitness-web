// Initialize GSAP and ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// ==================== HERO ANIMATIONS ====================
const timeline = gsap.timeline();

timeline
    .from('.hero-content h1', {
        duration: 0.8,
        opacity: 0,
        y: 50,
        ease: 'power2.out'
    })
    .from('.hero-content p', {
        duration: 0.8,
        opacity: 0,
        y: 30,
        ease: 'power2.out'
    }, '-=0.4')
    .from('.hero-content .btn', {
        duration: 0.6,
        opacity: 0,
        y: 20,
        ease: 'power2.out',
        stagger: 0.2
    }, '-=0.3');

// ==================== PARALLAX EFFECT ====================
gsap.to('.hero-bg', {
    scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: true,
        markers: false
    },
    y: 100,
    ease: 'none'
});

// ==================== COUNTERS ANIMATION ====================
const counters = document.querySelectorAll('.stat-number');
counters.forEach(counter => {
    // Get the original HTML to preserve <sup>+</sup> tags
    const originalHTML = counter.innerHTML;
    // Regex to split into: prefix, number, suffix
    const match = originalHTML.match(/^(.*?)(\d+)(.*)$/);

    if (match) {
        const prefix = match[1];
        const targetValue = parseInt(match[2]);
        const suffix = match[3];

        // Create a proxy object for animation
        const obj = { value: 0 };

        gsap.to(obj, {
            scrollTrigger: {
                trigger: counter,
                start: 'top 90%',
                toggleActions: 'play none none none'
            },
            duration: 1.5,
            value: targetValue,
            snap: { value: 1 },
            onUpdate() {
                counter.innerHTML = prefix + Math.ceil(obj.value) + suffix;
            },
            ease: 'power2.out'
        });
    }
});

// ==================== CARDS REVEAL ANIMATIONS ====================
const cards = document.querySelectorAll('.stat-card, .skill-card');
cards.forEach((card, index) => {
    gsap.from(card, {
        scrollTrigger: {
            trigger: card,
            start: 'top 90%',
            toggleActions: 'play none none none'
        },
        duration: 0.5,
        opacity: 0,
        y: 30,
        delay: index * 0.05,
        ease: 'power2.out'
    });
});

// ==================== NAVBAR SCROLL EFFECT ====================
let lastScrollTop = 0;
const nav = document.querySelector('nav');
let scrollTimeout;

window.addEventListener('scroll', () => {
    clearTimeout(scrollTimeout);
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if (scrollTop > 50) {
        nav.style.borderBottomColor = 'rgba(255, 107, 53, 0.4)';
        nav.style.boxShadow = '0 5px 20px rgba(255, 107, 53, 0.1)';
    } else {
        nav.style.borderBottomColor = 'rgba(255, 107, 53, 0.1)';
        nav.style.boxShadow = 'none';
    }

    lastScrollTop = scrollTop;
}, false);

// ==================== SCROLL SPY ====================
const sectionsArr = document.querySelectorAll('section[id]');
const navLinksArr = document.querySelectorAll('nav a');

sectionsArr.forEach(section => {
    ScrollTrigger.create({
        trigger: section,
        start: 'top 100px', // Adjust offset to match sticky nav height
        end: 'bottom 100px',
        onToggle: self => {
            if (self.isActive) {
                const id = section.getAttribute('id');
                navLinksArr.forEach(link => {
                    link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
                });
            }
        }
    });
});

// ==================== SMOOTH SCROLL ====================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            gsap.to(window, {
                duration: 0.3,
                scrollTo: {
                    y: target,
                    offsetY: 70
                },
                ease: 'power1.out'
            });
        }
    });
});

// ==================== FORM SUBMISSION ====================
const form = document.querySelector('form');
if (form) {
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const formData = new FormData(form);
        const name = form.querySelector('input[type="text"]').value;

        // Add visual feedback
        const btn = form.querySelector('button[type="submit"]');
        const originalText = btn.textContent;
        btn.textContent = '✅ Message Sent!';
        btn.style.background = 'linear-gradient(135deg, #00ff88, #00cc66)';

        // Reset after 2 seconds
        setTimeout(() => {
            form.reset();
            btn.textContent = originalText;
            btn.style.background = '';
        }, 2000);
    });
}

// ==================== SECTION FADE-IN ON SCROLL ====================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
        }
    });
}, observerOptions);

document.querySelectorAll('section').forEach(section => {
    section.classList.add('fade-in-section');
    observer.observe(section);
});

// ==================== BUTTON RIPPLE EFFECT ====================
document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('mousedown', function (e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');

        this.appendChild(ripple);

        setTimeout(() => ripple.remove(), 600);
    });
});

// ==================== LAZY IMAGE LOADING ====================
const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            if (img.dataset.src) {
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        }
    });
});

document.querySelectorAll('img[data-src]').forEach(img => {
    imageObserver.observe(img);
});

// ==================== MOBILE TOUCH GESTURES ====================
let touchStartX = 0;
let touchEndX = 0;

function handleGesture() {
    if (touchEndX < touchStartX - 50) {
        // Swiped left - next section
    }
    if (touchEndX > touchStartX + 50) {
        // Swiped right - prev section
    }
}

document.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
}, false);

document.addEventListener('touchend', e => {
    touchEndX = e.changedTouches[0].screenX;
    handleGesture();
}, false);

// ==================== PERFORMANCE: REQUEST ANIMATION FRAME ====================
let ticking = false;
let lastKnownScrollPosition = 0;

function updateScroll(scrollPos) {
    // Update any scroll-dependent animations here
    ticking = false;
}

window.addEventListener('scroll', () => {
    lastKnownScrollPosition = window.scrollY;
    if (!ticking) {
        window.requestAnimationFrame(() => updateScroll(lastKnownScrollPosition));
        ticking = true;
    }
}, { passive: true });

// ==================== PAGE LOAD EVENT ====================
window.addEventListener('load', () => {
    document.body.style.opacity = '1';
});

// ==================== SCROLL TO TOP ON PAGE REFRESH ====================
if ('scrollRestoration' in window.history) {
    window.history.scrollRestoration = 'manual';
}

// ==================== KEYBOARD NAVIGATION ====================
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown') {
        window.scrollBy(0, 100);
    } else if (e.key === 'ArrowUp') {
        window.scrollBy(0, -100);
    }
});

// ==================== DARK MODE PREFERENCE ====================
if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.documentElement.style.colorScheme = 'dark';
}

console.log('✅ All animations and interactions loaded successfully!');

// ==================== PAYMENT MODAL LOGIC ====================
const modal = document.getElementById('paymentModal');
const enrollBtns = document.querySelectorAll('.enroll-btn');
const closeModal = document.querySelector('.close-modal');
const payNowBtn = document.getElementById('payNowBtn');
const paymentMethods = document.querySelectorAll('.payment-method');
const paymentFeedback = document.getElementById('paymentFeedback');

// Open Modal
enrollBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const plan = btn.getAttribute('data-plan');
        const price = btn.getAttribute('data-price');
        const duration = btn.getAttribute('data-duration');

        document.getElementById('modalPlanName').textContent = `${plan} Program`;
        document.getElementById('modalPlanPrice').textContent = `₹${price}`;
        document.getElementById('modalPlanDuration').textContent = `${duration}s`;
        document.getElementById('btnPrice').textContent = price;

        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scroll
    });
});

// Close Modal
const closePaymentModal = () => {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
    paymentFeedback.classList.add('hidden');
    payNowBtn.classList.remove('hidden');
};

closeModal.addEventListener('click', closePaymentModal);
window.addEventListener('click', (e) => {
    if (e.target === modal) closePaymentModal();
});

// Payment Method Selection
paymentMethods.forEach(method => {
    method.addEventListener('click', () => {
        paymentMethods.forEach(m => m.classList.remove('active'));
        method.classList.add('active');
    });
});

// Simulate Payment Process
payNowBtn.addEventListener('click', () => {
    const selectedMethod = document.querySelector('.payment-method.active').getAttribute('data-method');
    const planName = document.getElementById('modalPlanName').textContent;
    const amount = document.getElementById('btnPrice').textContent;

    // YOUR PHONEPE / UPI ID HERE
    const myUpiId = '9389833171@axl'; // Replace with your actual ID

    payNowBtn.classList.add('hidden');
    paymentFeedback.classList.remove('hidden');

    // Simulate network delay for premium feel
    setTimeout(() => {
        paymentFeedback.innerHTML = `
            <i class="fas fa-check-circle" style="font-size: 3rem; color: #00ff88;"></i>
            <p style="margin-top: 1rem; text-align: center;">Opening ${selectedMethod.toUpperCase()} App...</p>
        `;

        // Generate UPI deep link
        const upiLink = `upi://pay?pa=${myUpiId}&pn=Ritesh%20Fitness&am=${amount}&cu=INR&tn=Training%20Program%20-${planName}`;

        setTimeout(() => {
            // Attempt to open UPI app
            window.location.href = upiLink;

            // Fallback for desktop users
            setTimeout(() => {
                alert(`📱 UPI Intent Sent!\n\nIf you are on mobile, your PhonePe/UPI app should open automatically.\n\nIf on Desktop, please pay ₹${amount} to: ${myUpiId}\n\nPlan: ${planName}`);
                closePaymentModal();
                // Reset feedback for next time
                paymentFeedback.innerHTML = '<div class="spinner"></div><p>Securing connection...</p>';
            }, 1000);
        }, 1500);
    }, 2000);
});
