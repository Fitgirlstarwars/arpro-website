// ===================================
// ARPRO - Clean Minimalist Design
// Inspired by eddie.eco aesthetic
// ===================================

// ===================================
// Smooth Page Load
// ===================================
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// ===================================
// Intersection Observer for Scroll Animations
// ===================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observe all elements with fade-in and reveal animation classes
const animatedElements = document.querySelectorAll('.fade-in, .reveal, .services-image img, .service-photo');
animatedElements.forEach(el => observer.observe(el));

// ===================================
// Navigation Scroll Effect
// ===================================
const nav = document.querySelector('.c-main-navigation');

// ===================================
// Debounce function for performance
// ===================================
function debounce(func, wait = 10) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ===================================
// Throttle function for scroll performance
// ===================================
function throttle(func, limit = 16) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// ===================================
// Mobile Menu Toggle
// ===================================
const mobileToggle = document.querySelector('.mobile-toggle');
const navMenu = document.querySelector('.nav-menu');

if (mobileToggle) {
    mobileToggle.addEventListener('click', () => {
        const isExpanded = mobileToggle.getAttribute('aria-expanded') === 'true';

        mobileToggle.classList.toggle('active');
        navMenu.classList.toggle('active');

        // Update ARIA attribute
        mobileToggle.setAttribute('aria-expanded', !isExpanded);

        // Animate hamburger icon
        const spans = mobileToggle.querySelectorAll('span');
        if (mobileToggle.classList.contains('active')) {
            spans[0].style.transform = 'rotate(45deg) translateY(8px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translateY(-8px)';
        } else {
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    });
}

// ===================================
// Smooth Scrolling for Anchor Links
// ===================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');

        // Skip if it's just "#" or empty
        if (href === '#' || href === '') return;

        e.preventDefault();
        const target = document.querySelector(href);

        if (target) {
            const navHeight = nav ? nav.offsetHeight : 0;
            const targetPosition = target.offsetTop - navHeight;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });

            // Close mobile menu if open
            if (mobileToggle && mobileToggle.classList.contains('active')) {
                mobileToggle.click();
            }
        }
    });
});

// ===================================
// Consolidated Scroll Handler (Optimized)
// ===================================
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');
const scrollIndicator = document.querySelector('.scroll-indicator');

function handleScroll() {
    const currentScroll = window.pageYOffset;

    // Navigation shadow effect
    if (nav) {
        if (currentScroll > 50) {
            nav.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
        } else {
            nav.style.boxShadow = 'none';
        }
    }

    // Active navigation link
    const scrollPosition = currentScroll + 150;
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });

    // Scroll indicator fade
    if (scrollIndicator) {
        if (currentScroll > 300) {
            scrollIndicator.style.opacity = '0';
        } else {
            scrollIndicator.style.opacity = '1';
        }
    }
}

// Attach single throttled scroll handler
window.addEventListener('scroll', throttle(handleScroll, 16));

// ===================================
// Contact Form Handling with Enhanced Security
// ===================================
const contactForm = document.querySelector('#contact-form');

// Rate limiting
const formSubmissions = {
    count: 0,
    firstSubmission: null,
    MAX_SUBMISSIONS: 3,
    TIME_WINDOW: 3600000 // 1 hour
};

// Clear error messages
function clearErrors() {
    document.querySelectorAll('.error-message').forEach(msg => {
        msg.textContent = '';
        msg.classList.remove('visible');
    });
    document.querySelectorAll('.form-group').forEach(group => {
        group.classList.remove('has-error');
    });
}

// Show error message
function showError(fieldId, message) {
    const errorElement = document.getElementById(`${fieldId}-error`);
    const formGroup = document.getElementById(fieldId).closest('.form-group');

    if (errorElement) {
        errorElement.textContent = message;
        errorElement.classList.add('visible');
    }
    if (formGroup) {
        formGroup.classList.add('has-error');
    }
}

// Sanitize input to prevent XSS
function sanitizeInput(input) {
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
}

// Check rate limiting
function checkRateLimit() {
    const now = Date.now();

    if (!formSubmissions.firstSubmission) {
        formSubmissions.firstSubmission = now;
        formSubmissions.count = 1;
        return true;
    }

    if (now - formSubmissions.firstSubmission > formSubmissions.TIME_WINDOW) {
        formSubmissions.firstSubmission = now;
        formSubmissions.count = 1;
        return true;
    }

    if (formSubmissions.count >= formSubmissions.MAX_SUBMISSIONS) {
        return false;
    }

    formSubmissions.count++;
    return true;
}

if (contactForm) {
    // Real-time validation
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phone');

    if (emailInput) {
        emailInput.addEventListener('blur', function() {
            const email = this.value.trim();
            if (email && !validateEmail(email)) {
                showError('email', 'Please enter a valid email address');
            }
        });

        emailInput.addEventListener('input', function() {
            const errorElement = document.getElementById('email-error');
            if (errorElement && errorElement.classList.contains('visible')) {
                if (validateEmail(this.value.trim())) {
                    errorElement.classList.remove('visible');
                    this.closest('.form-group').classList.remove('has-error');
                }
            }
        });
    }

    if (phoneInput) {
        phoneInput.addEventListener('blur', function() {
            const phone = this.value.trim();
            if (phone && !validatePhone(phone)) {
                showError('phone', 'Please enter a valid phone number');
            }
        });
    }

    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        // Clear previous errors and status
        clearErrors();
        const formStatus = document.getElementById('form-status');
        formStatus.className = '';
        formStatus.textContent = '';

        // Get form values
        const formData = new FormData(contactForm);
        const name = formData.get('name').trim();
        const email = formData.get('email').trim();
        const phone = formData.get('phone').trim();
        const service = formData.get('service');
        const message = formData.get('message').trim();
        const honeypot = formData.get('website');

        // Honeypot check (spam prevention)
        if (honeypot) {
            formStatus.className = 'error';
            formStatus.textContent = 'Form submission failed. Please try again.';
            return;
        }

        // Rate limiting check
        if (!checkRateLimit()) {
            formStatus.className = 'error';
            formStatus.textContent = 'Too many submission attempts. Please try again later.';
            return;
        }

        let hasErrors = false;

        // Validate required fields
        if (!name) {
            showError('name', 'Name is required');
            hasErrors = true;
        } else if (name.length < 2) {
            showError('name', 'Name must be at least 2 characters');
            hasErrors = true;
        } else if (name.length > 100) {
            showError('name', 'Name is too long');
            hasErrors = true;
        }

        if (!email) {
            showError('email', 'Email is required');
            hasErrors = true;
        } else if (!validateEmail(email)) {
            showError('email', 'Please enter a valid email address');
            hasErrors = true;
        }

        if (phone && !validatePhone(phone)) {
            showError('phone', 'Please enter a valid phone number');
            hasErrors = true;
        }

        if (!message) {
            showError('message', 'Message is required');
            hasErrors = true;
        } else if (message.length < 10) {
            showError('message', 'Message must be at least 10 characters');
            hasErrors = true;
        } else if (message.length > 1000) {
            showError('message', 'Message is too long (max 1000 characters)');
            hasErrors = true;
        }

        if (hasErrors) {
            formStatus.className = 'error';
            formStatus.textContent = 'Please correct the errors above';
            return;
        }

        // Sanitize inputs
        const sanitizedData = {
            name: sanitizeInput(name),
            email: sanitizeInput(email),
            phone: sanitizeInput(phone),
            service: sanitizeInput(service),
            message: sanitizeInput(message)
        };

        // Disable submit button
        const submitButton = contactForm.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.innerHTML;
        submitButton.disabled = true;
        submitButton.innerHTML = '<span>Sending...</span>';

        try {
            // In real implementation, this would send to backend
            // Example: await fetch('/api/contact', { method: 'POST', body: JSON.stringify(sanitizedData) })

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Success
            formStatus.className = 'success';
            formStatus.textContent = `Thank you for contacting ARPRO, ${sanitizedData.name}! We'll get back to you shortly at ${sanitizedData.email}.`;

            // Reset form
            contactForm.reset();

            // Focus on success message for screen readers
            formStatus.focus();

        } catch (error) {
            // Error
            formStatus.className = 'error';
            formStatus.textContent = 'There was an error sending your message. Please try again later or contact us directly.';
            console.error('Form submission error:', error);
        } finally {
            // Re-enable submit button
            submitButton.disabled = false;
            submitButton.innerHTML = originalButtonText;
        }
    });
}

// ===================================
// Form Validation Helpers
// ===================================
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePhone(phone) {
    // Supports various formats including +61 Australian numbers
    const re = /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,4}[-\s\.]?[0-9]{1,9}$/;
    return re.test(phone.replace(/\s/g, ''));
}

// ===================================
// Service Card Hover Effects
// ===================================
const serviceCards = document.querySelectorAll('.service-card');
serviceCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-4px)';
    });

    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
    });
});

// Scroll Indicator is now handled in consolidated scroll handler above

// ===================================
// Lazy Loading Images
// ===================================
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            }
        });
    });

    const lazyImages = document.querySelectorAll('img[data-src]');
    lazyImages.forEach(img => imageObserver.observe(img));
}

// ===================================
// Image Error Handling & Fallback
// ===================================
document.addEventListener('DOMContentLoaded', () => {
    // Handle image loading errors gracefully
    const allImages = document.querySelectorAll('img');

    allImages.forEach(img => {
        // Error handler for missing images
        img.addEventListener('error', function(e) {
            console.warn(`Image failed to load: ${this.src}`);

            // Add error class for styling
            this.classList.add('image-load-error');

            // Try to show a placeholder or keep trying with fallback
            if (!this.dataset.fallbackAttempted) {
                this.dataset.fallbackAttempted = 'true';

                // If it's a service photo, ensure it still maintains layout
                if (this.classList.contains('service-photo')) {
                    // Keep the space but show a subtle placeholder
                    this.style.backgroundColor = 'var(--color-Pampas)';
                    this.style.minHeight = '400px';
                }
            }
        });

        // Success handler
        img.addEventListener('load', function() {
            this.classList.add('image-loaded');
            this.classList.remove('image-load-error');
        });
    });

    // Handle picture source errors (AVIF/WebP might not exist yet)
    const allPictures = document.querySelectorAll('picture');

    allPictures.forEach(picture => {
        const sources = picture.querySelectorAll('source');
        const img = picture.querySelector('img');

        if (sources.length > 0 && img) {
            // Log when falling back to default img src
            img.addEventListener('load', function() {
                console.log(`✅ Image loaded successfully: ${this.currentSrc || this.src}`);
            });
        }
    });
});

// ===================================
// Accessibility: Keyboard Navigation
// ===================================
document.addEventListener('keydown', (e) => {
    // Show focus outline only when using keyboard
    if (e.key === 'Tab') {
        document.body.classList.add('keyboard-nav');
    }
});

document.addEventListener('mousedown', () => {
    document.body.classList.remove('keyboard-nav');
});

// ===================================
// Console Message
// ===================================
console.log('%c🏢 ARPRO Elevators & Lifts', 'font-size: 18px; font-weight: 600; color: #1a1a1a;');
console.log('%cProfessional Lift & Escalator Services', 'font-size: 12px; color: #666;');
console.log('%cinfo@arpro.com.au | +61 (0)427 661 175', 'font-size: 11px; color: #999;');

// ===================================
// Reduce Motion Support
// ===================================
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

if (prefersReducedMotion.matches) {
    // Disable animations for users who prefer reduced motion
    document.querySelectorAll('.fade-in, .reveal, .services-image img').forEach(el => {
        el.style.animation = 'none';
        el.style.opacity = '1';
        el.style.transform = 'none';
        el.classList.add('visible');
    });
}

// ===================================
// Print Styles Helper
// ===================================
window.addEventListener('beforeprint', () => {
    // Ensure all content is visible when printing
    document.querySelectorAll('.fade-in, .reveal, .services-image img').forEach(el => {
        el.style.opacity = '1';
        el.style.transform = 'none';
    });

    // Hide floating logo when printing
    const floatingLogo = document.getElementById('floatingLogo');
    if (floatingLogo) {
        floatingLogo.style.display = 'none';
    }
});
