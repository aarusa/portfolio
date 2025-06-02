// Navigation functionality
const header = document.querySelector('.header');
const navToggle = document.querySelector('#navToggle');
const nav = document.querySelector('.nav');
const navLinks = document.querySelectorAll('.nav-link');

let lastScroll = 0;

// Handle scroll behavior
window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    // Toggle header visibility on scroll
    if (currentScroll > lastScroll && currentScroll > 100) {
        header.classList.add('scroll-down');
        header.classList.remove('scroll-up');
    } else {
        header.classList.remove('scroll-down');
        header.classList.add('scroll-up');
    }
    lastScroll = currentScroll;
});

// Mobile menu toggle
navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    nav.classList.toggle('active');
});

// Close mobile menu when clicking a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        nav.classList.remove('active');
    });
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Project filtering
const filterButtons = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Update active button
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        const category = button.dataset.category;

        // Filter projects
        projectCards.forEach(card => {
            if (category === 'all' || card.dataset.category === category) {
                card.style.display = 'block';
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, 100);
            } else {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    card.style.display = 'none';
                }, 300);
            }
        });
    });
});

// Intersection Observer for scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
        }
    });
}, observerOptions);

// Observe all project cards and sections
document.querySelectorAll('.project-card, section').forEach(element => {
    observer.observe(element);
});

// Parallax effect for floating elements
const floatingElements = document.querySelectorAll('.float-item');

window.addEventListener('mousemove', (e) => {
    const { clientX, clientY } = e;
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    floatingElements.forEach(element => {
        const rect = element.getBoundingClientRect();
        const elementCenterX = rect.left + rect.width / 2;
        const elementCenterY = rect.top + rect.height / 2;

        const deltaX = (clientX - centerX) * 0.02;
        const deltaY = (clientY - centerY) * 0.02;

        element.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
    });
});

// Reset floating elements position on mouse leave
document.querySelector('.hero').addEventListener('mouseleave', () => {
    floatingElements.forEach(element => {
        element.style.transform = 'translate(0, 0)';
    });
});

// Active nav link on scroll
const handleActiveNavLink = () => {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');

    const navObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const currentId = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.toggle('active', link.getAttribute('href') === `#${currentId}`);
                });
            }
        });
    }, {
        threshold: 0.5,
        rootMargin: '-80px 0px 0px 0px'
    });

    sections.forEach(section => {
        if (section.getAttribute('id')) {
            navObserver.observe(section);
        }
    });
};

// Initialize all functions when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    handleActiveNavLink();
    
    // Trigger initial project animation
    setTimeout(() => {
        document.querySelector('.filter-btn[data-category="all"]').click();
    }, 100);
});

// Scroll Indicator Visibility
const scrollIndicator = document.querySelector('.scroll-indicator');
let lastScrollTop = 0;
let isNearBottom = false;
let scrollTimeout;

function handleScroll() {
    const st = window.pageYOffset || document.documentElement.scrollTop;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const scrollPosition = windowHeight + window.scrollY;
    const distanceFromBottom = documentHeight - scrollPosition;
    
    // Clear any existing timeout
    clearTimeout(scrollTimeout);

    // Calculate scroll percentage
    const scrollPercentage = (distanceFromBottom / windowHeight) * 100;
    
    if (distanceFromBottom < 200) { // Start transition earlier
        const intensity = Math.max(0, Math.min(1, distanceFromBottom / 200));
        scrollIndicator.style.setProperty('--scroll-intensity', intensity);
        scrollIndicator.classList.add('near-bottom');
        
        if (distanceFromBottom < 50) { // Final hide threshold
            scrollIndicator.classList.add('hide-indicator');
            isNearBottom = true;
        }
    } else {
        scrollIndicator.classList.remove('near-bottom', 'hide-indicator');
        scrollIndicator.style.removeProperty('--scroll-intensity');
        isNearBottom = false;
    }

    // Add a slight delay before removing classes when scrolling up
    if (!isNearBottom && scrollPosition < documentHeight - 250) {
        scrollTimeout = setTimeout(() => {
            scrollIndicator.classList.remove('near-bottom', 'hide-indicator');
            scrollIndicator.style.removeProperty('--scroll-intensity');
        }, 150);
    }

    lastScrollTop = st <= 0 ? 0 : st;
}

window.addEventListener('scroll', handleScroll);