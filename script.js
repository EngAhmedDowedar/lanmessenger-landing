/* =========================================================
   LAN Messenger — Premium SaaS Architecture JS
   (Localization & High Performance Included)
   ========================================================= */

const App = {
    translations: {},
    currentLang: localStorage.getItem('app_lang') || 'en',

    init() {
        this.initNavbar();
        this.initMobileMenu();
        this.initScrollReveal();
        this.initCounters();
        this.initSpotlightCards();
        this.initAccordion();
        this.initLocalization();
    },

    // 1. Localization (i18n)
    async initLocalization() {
        try {
            // جلب بيانات الترجمة من ملف JSON الخارجي
            const response = await fetch('translations.json');
            this.translations = await response.json();

            const langToggleBtn = document.getElementById('lang-toggle');
            
            // تعيين اللغة الافتراضية عند فتح الموقع
            this.setLanguage(this.currentLang);

            // تفعيل زر التبديل بين اللغتين
            if (langToggleBtn) {
                langToggleBtn.addEventListener('click', () => {
                    this.currentLang = this.currentLang === 'en' ? 'ar' : 'en';
                    this.setLanguage(this.currentLang);
                });
            }
        } catch (error) {
            console.error("Error loading translations. Make sure you run this on a Live Server:", error);
        }
    },

    setLanguage(lang) {
        // تغيير اتجاه الصفحة بناءً على اللغة
        document.documentElement.setAttribute('lang', lang);
        document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
        
        // حفظ اختيار المستخدم
        localStorage.setItem('app_lang', lang);

        // تحديث جميع النصوص التي تحتوي على خاصية data-i18n
        const elements = document.querySelectorAll('[data-i18n]');
        elements.forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (this.translations[lang] && this.translations[lang][key]) {
                el.innerHTML = this.translations[lang][key];
            }
        });
    },

    // 2. Smart Navbar
    initNavbar() {
        const navbar = document.getElementById('navbar');
        if (!navbar) return;

        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    if (window.scrollY > 20) {
                        navbar.classList.add('scrolled');
                    } else {
                        navbar.classList.remove('scrolled');
                    }
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });
    },

    // 3. Mobile Menu
    initMobileMenu() {
        const hamburger = document.getElementById('hamburger');
        const navLinks = document.getElementById('nav-links');
        
        if (!hamburger || !navLinks) return;

        hamburger.addEventListener('click', () => {
            const isExpanded = hamburger.getAttribute('aria-expanded') === 'true';
            hamburger.setAttribute('aria-expanded', !isExpanded);
            hamburger.classList.toggle('open');
            navLinks.classList.toggle('mobile-active');
        });

        navLinks.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.setAttribute('aria-expanded', 'false');
                hamburger.classList.remove('open');
                navLinks.classList.remove('mobile-active');
            });
        });
    },

    // 4. Scroll Animations (Intersection Observer)
    initScrollReveal() {
        const revealElements = document.querySelectorAll('.fade-up, .fade-in');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-revealed');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        revealElements.forEach(el => observer.observe(el));
    },

    // 5. Counters Animation
    initCounters() {
        const counters = document.querySelectorAll('[data-count]');
        
        const animateCounter = (el) => {
            const target = +el.getAttribute('data-count');
            const duration = 1500;
            const startTime = performance.now();

            // معادلة EaseOut رياضية لحركة ناعمة
            const easeOutExpo = (t) => t === 1 ? 1 : 1 - Math.pow(2, -10 * t);

            const update = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                el.innerText = Math.floor(easeOutExpo(progress) * target);

                if (progress < 1) {
                    requestAnimationFrame(update);
                } else {
                    el.innerText = target;
                }
            };

            requestAnimationFrame(update);
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(counter => observer.observe(counter));
    },

    // 6. Spotlight Effect
    initSpotlightCards() {
        const cards = document.querySelectorAll('.spotlight-card');
        
        cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                card.style.setProperty('--mouse-x', `${x}px`);
                card.style.setProperty('--mouse-y', `${y}px`);
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.setProperty('--mouse-x', `-100%`);
                card.style.setProperty('--mouse-y', `-100%`);
            });
        });
    },

    // 7. FAQ Accordion
    initAccordion() {
        const questions = document.querySelectorAll('.faq-question');

        questions.forEach(question => {
            question.addEventListener('click', () => {
                const isExpanded = question.getAttribute('aria-expanded') === 'true';
                const answer = question.nextElementSibling;
                
                // إغلاق باقي الأسئلة عند فتح سؤال جديد
                questions.forEach(q => {
                    q.setAttribute('aria-expanded', 'false');
                    q.nextElementSibling.style.maxHeight = null;
                });

                if (!isExpanded) {
                    question.setAttribute('aria-expanded', 'true');
                    answer.style.maxHeight = answer.scrollHeight + "px";
                } else {
                    question.setAttribute('aria-expanded', 'false');
                    answer.style.maxHeight = null;
                }
            });
        });
    }
};

// بدء تشغيل التطبيق عند اكتمال تحميل الـ DOM
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});