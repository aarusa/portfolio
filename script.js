// Cache DOM elements
const header = document.querySelector('.header');
const navToggle = document.querySelector('#navToggle');
const nav = document.querySelector('.nav');
const navLinks = document.querySelectorAll('.nav-link');
const filterButtons = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');
const sections = document.querySelectorAll('section');
const scrollIndicator = document.querySelector('.scroll-indicator');

// State variables
let lastScroll = 0;
let isAnimating = false;
let lastScrollTime = Date.now();
const SCROLL_THROTTLE = 16; // ~60fps

// Scroll Handling
function handleScroll() {
    const currentScroll = window.pageYOffset;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const scrollPosition = windowHeight + currentScroll;
    const distanceFromBottom = documentHeight - scrollPosition;
    
    // Header visibility
    if (currentScroll > lastScroll && currentScroll > 100) {
        header.classList.add('scroll-down');
        header.classList.remove('scroll-up');
    } else {
        header.classList.remove('scroll-down');
        header.classList.add('scroll-up');
    }
    
    // Scroll indicator
    if (distanceFromBottom < 200) {
        const intensity = Math.max(0, Math.min(1, distanceFromBottom / 200));
        scrollIndicator.style.setProperty('--scroll-intensity', intensity);
        scrollIndicator.classList.add('near-bottom');
        
        if (distanceFromBottom < 50) {
            scrollIndicator.classList.add('hide-indicator');
        }
    } else {
        scrollIndicator.classList.remove('near-bottom', 'hide-indicator');
        scrollIndicator.style.removeProperty('--scroll-intensity');
    }
    
    lastScroll = currentScroll <= 0 ? 0 : currentScroll;
}

// Mobile menu handlers
function toggleMobileMenu() {
    navToggle.classList.toggle('active');
    nav.classList.toggle('active');
}

function closeMobileMenu() {
    navToggle.classList.remove('active');
    nav.classList.remove('active');
}

// Optimized project filtering
function filterProjects(category) {
    if (isAnimating) return;
    isAnimating = true;

    // Update active button state
    filterButtons.forEach(btn => btn.classList.remove('active'));
    filterButtons.forEach(btn => {
        if (btn.dataset.category === category) {
            btn.classList.add('active');
        }
    });

    // Batch DOM operations
    requestAnimationFrame(() => {
        const fragment = document.createDocumentFragment();
        const projectContainer = document.querySelector('.project-grid');
        
        projectCards.forEach(card => {
            const shouldShow = category === 'all' || card.dataset.category === category;
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            
            if (shouldShow) {
                card.classList.remove('hidden');
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, 50);
            } else {
                setTimeout(() => {
                    card.classList.add('hidden');
                }, 300);
            }
            
            fragment.appendChild(card);
        });

        // Single DOM update
        projectContainer.innerHTML = '';
        projectContainer.appendChild(fragment);
        
        setTimeout(() => {
            isAnimating = false;
        }, 350);
    });
}

// Optimized intersection observer
const observerCallback = (entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
            observer.unobserve(entry.target); // Stop observing after animation
        }
    });
};

const observer = new IntersectionObserver(observerCallback, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
});

// Event Listeners with delegation where possible
window.addEventListener('scroll', handleScroll, { passive: true });

navToggle.addEventListener('click', toggleMobileMenu);

nav.addEventListener('click', (e) => {
    if (e.target.classList.contains('nav-link')) {
        closeMobileMenu();
    }
});

// Direct scroll for anchor links
document.addEventListener('click', (e) => {
    if (e.target.matches('a[href^="#"]')) {
        e.preventDefault();
        const target = document.querySelector(e.target.getAttribute('href'));
        if (target) {
            target.scrollIntoView();
            closeMobileMenu();
        }
    }
});

// Project filtering event delegation
document.querySelector('.work-filters').addEventListener('click', (e) => {
    if (e.target.classList.contains('filter-btn')) {
        const category = e.target.dataset.category;
        filterProjects(category);
    }
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Initialize animations
    document.querySelectorAll('.project-card, section').forEach(element => {
        observer.observe(element);
    });

    // Set initial active filter
    filterProjects('all');
}, { once: true });