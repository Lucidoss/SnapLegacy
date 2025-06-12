/**
 * SnapLegacy - Main JavaScript
 * 
 * This file contains all the JavaScript functionality for the SnapLegacy website
 * including animations, preloader, navigation, slider, counters, and scroll effects.
 */

// Wait for the document to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    
    // ================================
    // PRELOADER
    // ================================
    function initPreloader() {
        // Show preloader
        const preloader = document.querySelector('.preloader');
        
        // Hide preloader after animations complete (minimum 2 seconds)
        setTimeout(() => {
            preloader.classList.add('fade-out');
            
            // Enable page scrolling
            document.body.style.overflow = 'auto';
            
            // Start initial animations for visible elements
            startScrollAnimations();
        }, 2000);
    }
    
    // ================================
    // HEADER & NAVIGATION
    // ================================
    function initNavigation() {
        const header = document.querySelector('.header');
        const menuToggle = document.querySelector('.menu-toggle');
        const navigation = document.querySelector('.navigation');
        const navLinks = document.querySelectorAll('.nav-link');
        
        // Toggle mobile menu
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            navigation.classList.toggle('active');
        });
        
        // Close menu when clicking a link (on mobile)
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 768) {
                    menuToggle.classList.remove('active');
                    navigation.classList.remove('active');
                }
            });
        });
        
        // Header scroll effect
        window.addEventListener('scroll', () => {
            const scrollPosition = window.scrollY;
            
            if (scrollPosition > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
            
            // Update active menu item based on scroll position
            updateActiveNavLink();
        });
    }
    
    // Update active navigation link based on scroll position
    function updateActiveNavLink() {
        const scrollPosition = window.scrollY;
        const sections = document.querySelectorAll('section');
        const navLinks = document.querySelectorAll('.nav-link');
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                // Remove active class from all links
                navLinks.forEach(link => {
                    link.classList.remove('active');
                });
                
                // Add active class to current section link
                const activeLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            }
        });
    }
    
    // ================================
    // SCROLL ANIMATIONS
    // ================================
    function initScrollAnimations() {
        // Detect elements to animate when they come into view
        const animationElements = document.querySelectorAll('.reveal-text, .reveal-element');
        
        // Create intersection observer
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.15
        });
        
        // Observe all animation elements
        animationElements.forEach(element => {
            observer.observe(element);
        });
    }
    
    // Start animations for elements in the viewport on page load
    function startScrollAnimations() {
        const animationElements = document.querySelectorAll('.reveal-text, .reveal-element');
        
        animationElements.forEach(element => {
            const position = element.getBoundingClientRect();
            
            // If element is in viewport
            if (position.top < window.innerHeight) {
                element.classList.add('visible');
            }
        });
    }
      // ================================
    // TESTIMONIAL SLIDER
    // ================================
    function initTestimonialSlider() {
        const testimonialWrapper = document.querySelector('.testimonial-wrapper');
        const testimonialItems = document.querySelectorAll('.testimonial-item');
        const dotsContainer = document.querySelector('.testimonial-dots');
        const prevButton = document.querySelector('.testimonial-prev');
        const nextButton = document.querySelector('.testimonial-next');
        
        if (!testimonialWrapper || testimonialItems.length === 0) {
            console.warn('Testimonial slider elements not found');
            return;
        }
        
        let currentIndex = 0;
        const itemsCount = testimonialItems.length;
        
        // Create dots based on number of testimonials
        testimonialItems.forEach((_, index) => {
            const dot = document.createElement('span');
            dot.classList.add('testimonial-dot');
            if (index === 0) dot.classList.add('active');
            
            dot.addEventListener('click', () => {
                showTestimonial(index);
            });
            
            dotsContainer.appendChild(dot);
        });
        
        const dots = document.querySelectorAll('.testimonial-dot');
        
        // Show specific testimonial by sliding the wrapper
        function showTestimonial(index) {
            if (index < 0) index = itemsCount - 1;
            if (index >= itemsCount) index = 0;
            
            // Update current index
            currentIndex = index;
            
            // Calculate translation distance based on the index
            const slideDistance = -currentIndex * 100 + '%';
            
            // Apply the transform to slide the wrapper
            testimonialWrapper.style.transform = `translateX(${slideDistance})`;
            
            // Update active states for accessibility
            testimonialItems.forEach((item, i) => {
                // Set aria attributes for accessibility
                item.setAttribute('aria-hidden', i !== currentIndex);
            });
            
            // Update dots
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === currentIndex);
            });
        }
        
        // Previous testimonial
        prevButton.addEventListener('click', () => {
            showTestimonial(currentIndex - 1);
        });
        
        // Next testimonial
        nextButton.addEventListener('click', () => {
            showTestimonial(currentIndex + 1);
        });
        
        // Add touch swipe support
        let touchStartX = 0;
        let touchEndX = 0;
        
        testimonialWrapper.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        });
        
        testimonialWrapper.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        });
        
        function handleSwipe() {
            const swipeThreshold = 50; // Minimum distance to consider as swipe
            const swipeDistance = touchEndX - touchStartX;
            
            // Detect direction with threshold to avoid accidental swipes
            if (swipeDistance < -swipeThreshold) {
                // Swipe left - show next
                showTestimonial(currentIndex + 1);
            } else if (swipeDistance > swipeThreshold) {
                // Swipe right - show previous
                showTestimonial(currentIndex - 1);
            }
        }
        
        // Auto slide change
        const autoSlideInterval = setInterval(() => {
            showTestimonial(currentIndex + 1);
        }, 5000);
        
        // Pause auto-slide when hovering over the testimonials
        testimonialWrapper.addEventListener('mouseenter', () => {
            clearInterval(autoSlideInterval);
        });
        
        // Initialize first slide
        showTestimonial(0);
    }
    
    // ================================
    // COUNTER ANIMATION
    // ================================
    function initCounters() {
        const counters = document.querySelectorAll('.counter-value');
        const counterSection = document.querySelector('.counter');
        let started = false;
        
        function startCounting() {
            if (started) return;
            started = true;
            
            counters.forEach(counter => {
                const target = parseInt(counter.getAttribute('data-target'));
                const duration = 2000; // 2 seconds
                const increment = target / duration * 20; // Update every 20ms
                
                let current = 0;
                const timer = setInterval(() => {
                    current += increment;
                    
                    // Stop at target value
                    if (current >= target) {
                        counter.textContent = target;
                        clearInterval(timer);
                    } else {
                        counter.textContent = Math.floor(current);
                    }
                }, 20);
            });
        }
        
        // Start counter when section comes into view
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                startCounting();
            }
        }, { threshold: 0.3 });
        
        observer.observe(counterSection);
    }
    
    // ================================
    // SMOOTH SCROLL
    // ================================
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;
                
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    const offset = 80; // Offset for fixed header
                    const targetPosition = targetElement.offsetTop - offset;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
    
    // ================================
    // INITIALIZE EVERYTHING
    // ================================
    function init() {
        // Initial page setup
        document.body.style.overflow = 'hidden'; // Prevent scrolling during preloader
        
        // Initialize components
        initPreloader();
        initNavigation();
        initScrollAnimations();
        initTestimonialSlider();
        initCounters();
        initSmoothScroll();
    }
    
    // Start initialization
    init();
});
