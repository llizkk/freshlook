// Main Application Class
class FreshLookApp {
    constructor() {
        this.components = {};
        this.init();
    }

    init() {
        // Initialize all components
        this.components.preloader = new Preloader();
        this.components.header = new Header();
        this.components.animations = new ScrollAnimations();
        this.components.counter = new Counter();
        this.components.portfolio = new InteractivePortfolio();
        this.components.form = new FormHandler();
        this.components.scroll = new SmoothScroll();
        this.components.magnetic = new MagneticEffects();
        this.components.process = new ModernProcess();
        
        // Initialize after DOM is ready
        document.addEventListener('DOMContentLoaded', () => {
            this.components.backToTop = new BackToTop();
            this.components.serviceCards = new ServiceCards();
        });
    }
}

// Preloader
class Preloader {
    constructor() {
        this.preloader = document.querySelector('.preloader');
        this.progressBar = document.querySelector('.progress-bar');
        this.progressContainer = document.querySelector('.loader-progress');
        this.percentage = document.querySelector('.loader-percentage');
        this.init();
    }

    init() {
        this.createPercentage();
        this.animateProgress();
        window.addEventListener('load', () => {
            setTimeout(() => this.hide(), 2000);
        });
    }

    createPercentage() {
        this.percentage = document.createElement('div');
        this.percentage.className = 'loader-percentage';
        this.percentage.textContent = '0%';
        this.progressContainer.appendChild(this.percentage);
        this.progressContainer.classList.add('loading');
    }

    animateProgress() {
        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 8 + 2;
            if (progress >= 100) {
                progress = 100;
                clearInterval(interval);
                this.percentage.textContent = '100%';
                setTimeout(() => {
                    this.percentage.style.opacity = '0';
                }, 500);
            } else {
                this.percentage.textContent = `${Math.floor(progress)}%`;
            }
            this.progressBar.style.width = `${progress}%`;
        }, 100);
    }

    hide() {
        this.preloader.classList.add('fade-out');
        setTimeout(() => {
            this.preloader.remove();
            document.body.classList.add('loaded');
        }, 800);
    }
}

// Header - ИСПРАВЛЕННЫЙ КЛАСС
class Header {
    constructor() {
        this.header = document.querySelector('.header');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.mobileToggle = document.querySelector('.mobile-toggle');
        this.mobileNav = document.querySelector('.mobile-nav');
        this.init();
    }

    init() {
        this.setupScroll();
        this.setupActiveLinks();
        this.setupMobileMenu();
        this.setupClickOutside();
        
        // Добавляем обработчик клика для навигационных ссылок
        this.setupNavLinksClick();
    }

    setupScroll() {
        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;
            
            if (scrollY > 100) {
                this.header.classList.add('scrolled');
            } else {
                this.header.classList.remove('scrolled');
            }
        });
    }

    setupActiveLinks() {
        const observerOptions = {
            threshold: 0.3,
            rootMargin: '-100px 0px -100px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    this.updateActiveLinks(id);
                }
            });
        }, observerOptions);

        document.querySelectorAll('section[id]').forEach(section => {
            observer.observe(section);
        });
    }

    updateActiveLinks(activeId) {
        this.navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            // Убираем # из href для сравнения
            if (href && href.replace('#', '') === activeId) {
                link.classList.add('active');
            }
        });

        document.querySelectorAll('.mobile-nav-link').forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            if (href && href.replace('#', '') === activeId) {
                link.classList.add('active');
            }
        });
    }

    setupNavLinksClick() {
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').replace('#', '');
                const targetSection = document.getElementById(targetId);
                
                if (targetSection) {
                    // Плавная прокрутка к секции
                    targetSection.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                    
                    // Обновляем активные ссылки
                    this.updateActiveLinks(targetId);
                }
            });
        });
    }

    setupMobileMenu() {
        this.mobileToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleMobileMenu();
        });

        document.querySelectorAll('.mobile-nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').replace('#', '');
                const targetSection = document.getElementById(targetId);
                
                if (targetSection) {
                    targetSection.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                    
                    this.updateActiveLinks(targetId);
                    this.closeMobileMenu();
                }
            });
        });
    }

    toggleMobileMenu() {
        this.mobileToggle.classList.toggle('active');
        this.mobileNav.classList.toggle('active');
        document.body.style.overflow = this.mobileNav.classList.contains('active') ? 'hidden' : '';
    }

    closeMobileMenu() {
        this.mobileToggle.classList.remove('active');
        this.mobileNav.classList.remove('active');
        document.body.style.overflow = '';
    }

    setupClickOutside() {
        document.addEventListener('click', (e) => {
            if (!this.header.contains(e.target) && this.mobileNav.classList.contains('active')) {
                this.closeMobileMenu();
            }
        });
    }
}

// Scroll Animations
class ScrollAnimations {
    constructor() {
        this.animatedElements = document.querySelectorAll('.service-card, .portfolio-item, .process-step');
        this.init();
    }

    init() {
        this.setupObserver();
    }

    setupObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateElement(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.2,
            rootMargin: '0px 0px -50px 0px'
        });

        this.animatedElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });
    }

    animateElement(element) {
        setTimeout(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
            element.classList.add('visible');
        }, 100);
    }
}

// Counter
class Counter {
    constructor() {
        this.counters = document.querySelectorAll('.stat-number');
        this.init();
    }

    init() {
        this.setupObserver();
    }

    setupObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        this.counters.forEach(counter => observer.observe(counter));
    }

    animateCounter(counter) {
        const target = parseInt(counter.getAttribute('data-count'));
        const duration = 2000;
        const startTime = performance.now();
        const startValue = 0;

        const updateCounter = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const current = Math.floor(startValue + (target - startValue) * easeOutQuart);
            
            counter.textContent = current.toLocaleString();

            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target.toLocaleString();
            }
        };

        requestAnimationFrame(updateCounter);
    }
}

// Interactive Portfolio Gallery
class InteractivePortfolio {
    constructor() {
        this.currentIndex = 0;
        this.projects = document.querySelectorAll('.showcase-project');
        this.thumbs = document.querySelectorAll('.project-thumb');
        this.details = document.querySelectorAll('.detail-card');
        this.init();
    }

    init() {
        this.setupThumbnailClicks();
        this.setupKeyboardNavigation();
        this.setupSwipe();
        this.updateActiveProject(0);
    }

    setupThumbnailClicks() {
        this.thumbs.forEach((thumb, index) => {
            thumb.addEventListener('click', () => {
                this.updateActiveProject(index);
            });
        });
    }

    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                this.previousProject();
            } else if (e.key === 'ArrowRight') {
                this.nextProject();
            }
        });
    }

    setupSwipe() {
        let startX = 0;
        let endX = 0;

        const container = document.querySelector('.showcase-container');

        container.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
        });

        container.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].clientX;
            const diffX = startX - endX;

            if (Math.abs(diffX) > 50) {
                if (diffX > 0) {
                    this.nextProject();
                } else {
                    this.previousProject();
                }
            }
        });
    }

    previousProject() {
        const newIndex = this.currentIndex > 0 ? this.currentIndex - 1 : this.projects.length - 1;
        this.updateActiveProject(newIndex);
    }

    nextProject() {
        const newIndex = this.currentIndex < this.projects.length - 1 ? this.currentIndex + 1 : 0;
        this.updateActiveProject(newIndex);
    }

    updateActiveProject(index) {
        // Update projects
        this.projects.forEach(project => project.classList.remove('active'));
        this.projects[index].classList.add('active');

        // Update thumbnails
        this.thumbs.forEach(thumb => thumb.classList.remove('active'));
        this.thumbs[index].classList.add('active');

        // Update details
        this.details.forEach(detail => detail.classList.remove('active'));
        this.details[index].classList.add('active');

        this.currentIndex = index;
    }
}

// Form Handler
class FormHandler {
    constructor() {
        this.form = document.querySelector('.form');
        this.init();
    }

    init() {
        this.setupInputAnimations();
        this.form.addEventListener('submit', this.handleSubmit.bind(this));
    }

    setupInputAnimations() {
        const inputs = this.form.querySelectorAll('input, textarea');
        
        inputs.forEach(input => {
            input.addEventListener('focus', () => {
                input.parentElement.classList.add('focused');
            });

            input.addEventListener('blur', () => {
                if (!input.value) {
                    input.parentElement.classList.remove('focused');
                }
            });

            // Initialize based on existing values
            if (input.value) {
                input.parentElement.classList.add('focused');
            }
        });
    }

    async handleSubmit(e) {
        e.preventDefault();
        
        const submitBtn = this.form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Отправка...';
        submitBtn.disabled = true;

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            submitBtn.innerHTML = '<i class="fas fa-check"></i> Отправлено!';
            submitBtn.style.background = '#16a34a';
            
            setTimeout(() => {
                this.form.reset();
                submitBtn.innerHTML = originalText;
                submitBtn.style.background = '';
                submitBtn.disabled = false;
                
                this.form.querySelectorAll('.input-wrapper').forEach(wrapper => {
                    wrapper.classList.remove('focused');
                });
            }, 3000);
            
        } catch (error) {
            submitBtn.innerHTML = '<i class="fas fa-exclamation-circle"></i> Ошибка';
            submitBtn.style.background = '#dc2626';
            
            setTimeout(() => {
                submitBtn.innerHTML = originalText;
                submitBtn.style.background = '';
                submitBtn.disabled = false;
            }, 3000);
        }
    }
}

// Magnetic Effects
class MagneticEffects {
    constructor() {
        this.magneticElements = document.querySelectorAll('.magnetic-btn');
        this.init();
    }

    init() {
        this.magneticElements.forEach(element => {
            element.addEventListener('mousemove', this.handleMouseMove.bind(this));
            element.addEventListener('mouseleave', this.handleMouseLeave.bind(this));
        });
    }

    handleMouseMove(e) {
        const element = e.currentTarget;
        const rect = element.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const deltaX = (x - centerX) / centerX * 10;
        const deltaY = (y - centerY) / centerY * 10;
        
        element.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(1.05)`;
    }

    handleMouseLeave(e) {
        const element = e.currentTarget;
        element.style.transform = 'translate(0, 0) scale(1)';
    }
}

// Smooth Scroll
class SmoothScroll {
    constructor() {
        this.init();
    }

    init() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    this.scrollToElement(target);
                }
            });
        });
    }

    scrollToElement(element) {
        const targetPosition = element.offsetTop - 80;
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        const duration = 1000;
        let start = null;

        const animation = (currentTime) => {
            if (start === null) start = currentTime;
            const timeElapsed = currentTime - startTime;
            const run = this.ease(timeElapsed, startPosition, distance, duration);
            window.scrollTo(0, run);
            if (timeElapsed < duration) requestAnimationFrame(animation);
        };

        requestAnimationFrame(animation);
    }

    ease(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t + b;
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
    }
}

// Back to Top
class BackToTop {
    constructor() {
        this.button = document.querySelector('.back-to-top');
        this.init();
    }

    init() {
        window.addEventListener('scroll', this.toggleVisibility.bind(this));
        this.button.addEventListener('click', this.scrollToTop.bind(this));
    }

    toggleVisibility() {
        if (window.pageYOffset > 300) {
            this.button.classList.add('visible');
        } else {
            this.button.classList.remove('visible');
        }
    }

    scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
}

// Modern Process Animation
class ModernProcess {
    constructor() {
        this.steps = document.querySelectorAll('.process-step');
        this.init();
    }

    init() {
        this.setupIntersectionObserver();
        this.setupScrollAnimations();
    }

    setupIntersectionObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                }
            });
        }, {
            threshold: 0.4,
            rootMargin: '-100px 0px -100px 0px'
        });

        this.steps.forEach(step => observer.observe(step));
    }

    setupScrollAnimations() {
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateStats();
                    statsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        const statsSection = document.querySelector('.process-stats');
        if (statsSection) {
            statsObserver.observe(statsSection);
        }
    }

    animateStats() {
        const counters = document.querySelectorAll('.stat-number');
        
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-count'));
            const duration = 2000;
            const startTime = performance.now();
            const startValue = 0;

            const updateCounter = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                const easeOutQuart = 1 - Math.pow(1 - progress, 4);
                const current = Math.floor(startValue + (target - startValue) * easeOutQuart);
                
                counter.textContent = current;

                if (progress < 1) {
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target;
                }
            };

            requestAnimationFrame(updateCounter);
        });
    }
}

// Service Cards Flip Animation
class ServiceCards {
    constructor() {
        this.cards = document.querySelectorAll('.service-card');
        this.init();
    }

    init() {
        this.cards.forEach(card => {
            card.addEventListener('click', () => {
                card.classList.toggle('flipped');
            });

            // Auto-flip back on mouse leave
            card.addEventListener('mouseleave', () => {
                setTimeout(() => {
                    if (card.classList.contains('flipped')) {
                        card.classList.remove('flipped');
                    }
                }, 3000);
            });
        });
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const app = new FreshLookApp();
    
    // Initialize additional components
    const serviceCards = new ServiceCards();
    
    // Add resize handler for responsive adjustments
    window.addEventListener('resize', () => {
        // Re-initialize if needed for responsive layout changes
    });

    // Add loaded class to body for transition effects
    document.body.classList.add('loaded');

    // Export for global access if needed
    window.FreshLookApp = app;
});

// Performance optimization
class PerformanceOptimizer {
    constructor() {
        this.init();
    }

    init() {
        this.setupIntersectionObserverForLazyLoading();
        this.optimizeAnimations();
    }

    setupIntersectionObserverForLazyLoading() {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    observer.unobserve(img);
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }

    optimizeAnimations() {
        // Reduce animation frequency on low-power devices
        if (this.isLowPowerDevice()) {
            document.documentElement.style.setProperty('--transition', 'all 0.3s ease');
            document.documentElement.style.setProperty('--transition-slow', 'all 0.4s ease');
        }
    }

    isLowPowerDevice() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) &&
               navigator.hardwareConcurrency < 4;
    }
}

// Initialize performance optimizations
const performanceOptimizer = new PerformanceOptimizer();