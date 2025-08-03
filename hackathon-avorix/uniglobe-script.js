// Uniglobe High School Website JavaScript
class UniglobeWebsite {
    constructor() {
        this.currentTheme = localStorage.getItem('theme') || 'light';
        this.init();
    }

    init() {
        this.setupTheme();
        this.setupNavigation();
        this.setupScrollAnimations();
        this.setupMISLogin();
        this.setupSmoothScrolling();
        this.setupFormValidation();
        this.setupInteractiveElements();
        this.setupLoadingAnimations();
    }

    // Theme Management
    setupTheme() {
        const themeToggle = document.getElementById('theme-toggle');
        const body = document.body;

        // Apply saved theme
        if (this.currentTheme === 'dark') {
            body.setAttribute('data-theme', 'dark');
            themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        } else {
            body.removeAttribute('data-theme');
            themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        }

        // Theme toggle functionality
        themeToggle.addEventListener('click', () => {
            if (this.currentTheme === 'light') {
                this.currentTheme = 'dark';
                body.setAttribute('data-theme', 'dark');
                themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
                this.animateThemeChange();
            } else {
                this.currentTheme = 'light';
                body.removeAttribute('data-theme');
                themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
                this.animateThemeChange();
            }
            localStorage.setItem('theme', this.currentTheme);
        });
    }

    animateThemeChange() {
        document.body.style.transition = 'all 0.3s ease';
        setTimeout(() => {
            document.body.style.transition = '';
        }, 300);
    }

    // Navigation Management
    setupNavigation() {
        const hamburger = document.getElementById('hamburger');
        const navMenu = document.querySelector('.nav-menu');
        const navLinks = document.querySelectorAll('.nav-link');

        // Mobile menu toggle
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close mobile menu when clicking on a link
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });

        // Navbar scroll effect
        window.addEventListener('scroll', () => {
            const navbar = document.querySelector('.navbar');
            if (window.scrollY > 100) {
                navbar.style.background = this.currentTheme === 'dark' ? 
                    '#01172ed0' : '#d4af37de';
                navbar.style.backdropFilter = 'blur(10px)';
                navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.2)';
            } else {
                navbar.style.background = this.currentTheme === 'dark' ? 
                    '#01172ed0' : '#d4af37de';
                navbar.style.backdropFilter = 'none';
                navbar.style.boxShadow = '0 2px 20px var(--shadow-color)';
            }
        });

        // Active section highlighting
        this.setupActiveNavigation();
    }

    setupActiveNavigation() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link[href^="#"]');

        window.addEventListener('scroll', () => {
            let current = '';
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                if (window.pageYOffset >= sectionTop - 200) {
                    current = section.getAttribute('id');
                }
            });

            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add('active');
                }
            });
        });
    }

    // Scroll Animations
    setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    
                    // Animate stats counters
                    if (entry.target.classList.contains('stat-item')) {
                        this.animateCounter(entry.target);
                    }
                    
                    // Stagger animations for grids
                    if (entry.target.classList.contains('programs-grid') || 
                        entry.target.classList.contains('team-grid') ||
                        entry.target.classList.contains('facility-grid')) {
                        this.staggerGridAnimation(entry.target);
                    }
                }
            });
        }, observerOptions);

        // Observe elements for animation
        const animatedElements = document.querySelectorAll(`
            .section-title, .about-content, .program-card, .team-member, 
            .admin-member, .facility-card, .sport-item, .login-panel,
            .stat-item, .programs-grid, .team-grid, .facility-grid
        `);

        animatedElements.forEach(el => {
            el.classList.add('fade-in');
            observer.observe(el);
        });
    }

    animateCounter(statItem) {
        const number = statItem.querySelector('h4');
        const target = parseInt(number.textContent.replace(/\D/g, ''));
        const suffix = number.textContent.replace(/[0-9]/g, '');
        let current = 0;
        const increment = target / 50;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                number.textContent = target + suffix;
                clearInterval(timer);
            } else {
                number.textContent = Math.floor(current) + suffix;
            }
        }, 40);
    }

    staggerGridAnimation(grid) {
        const items = grid.children;
        Array.from(items).forEach((item, index) => {
            setTimeout(() => {
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }

    // MIS Login System
    setupMISLogin() {
        const loginPanels = document.querySelectorAll('.login-panel');
        const modal = document.getElementById('login-modal');
        const closeBtn = document.querySelector('.close');
        const loginForm = document.getElementById('login-form');
        const modalTitle = document.getElementById('modal-title');
        let currentRole = '';

        // Open login modal
        loginPanels.forEach(panel => {
            panel.addEventListener('click', () => {
                currentRole = panel.getAttribute('data-role');
                modalTitle.textContent = `${this.capitalizeFirst(currentRole)} Login`;
                modal.style.display = 'block';
                document.body.style.overflow = 'hidden';
                
                // Add entrance animation
                setTimeout(() => {
                    modal.querySelector('.modal-content').style.transform = 'scale(1)';
                    modal.querySelector('.modal-content').style.opacity = '1';
                }, 10);
            });
        });

        // Close modal
        closeBtn.addEventListener('click', () => {
            this.closeModal(modal);
        });

        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeModal(modal);
            }
        });

        // Handle login form submission
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin(currentRole);
        });

        // Add enter key support
        modal.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeModal(modal);
            }
        });
    }

    closeModal(modal) {
        const modalContent = modal.querySelector('.modal-content');
        modalContent.style.transform = 'scale(0.8)';
        modalContent.style.opacity = '0';
        
        setTimeout(() => {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
            this.resetForm();
        }, 300);
    }

    handleLogin(role) {
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const submitBtn = document.querySelector('#login-form .btn');
        
        // Show loading state
        submitBtn.innerHTML = '<span class="loading"></span> Logging in...';
        submitBtn.disabled = true;

        // Simulate login process
        setTimeout(() => {
            if (this.validateCredentials(username, password, role)) {
                this.showSuccessMessage(`Welcome ${this.capitalizeFirst(role)}!`);
                this.closeModal(document.getElementById('login-modal'));
                
                // Redirect based on role (in a real app, this would redirect to actual dashboards)
                setTimeout(() => {
                    alert(`Redirecting to ${role} dashboard...`);
                }, 1000);
            } else {
                this.showErrorMessage('Invalid credentials. Please try again.');
            }
            
            // Reset button
            submitBtn.innerHTML = 'Login';
            submitBtn.disabled = false;
        }, 2000);
    }

    validateCredentials(username, password, role) {
        // Demo credentials (in a real app, this would be server-side validation)
        const credentials = {
            students: { username: 'student', password: 'student123' },
            teachers: { username: 'teacher', password: 'teacher123' },
            admin: { username: 'admin', password: 'admin123' }
        };

        return credentials[role] && 
               credentials[role].username === username && 
               credentials[role].password === password;
    }

    showSuccessMessage(message) {
        this.showNotification(message, 'success');
    }

    showErrorMessage(message) {
        this.showNotification(message, 'error');
    }

    showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
            <span>${message}</span>
        `;
        
        // Add notification styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? 'var(--primary-green)' : '#e74c3c'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 10px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.3);
            z-index: 3000;
            display: flex;
            align-items: center;
            gap: 10px;
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;

        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    resetForm() {
        document.getElementById('login-form').reset();
    }

    // Smooth Scrolling
    setupSmoothScrolling() {
        const links = document.querySelectorAll('a[href^="#"]');
        
        links.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    const offsetTop = targetSection.offsetTop - 80; // Account for fixed navbar
                    
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    // Form Validation
    setupFormValidation() {
        const inputs = document.querySelectorAll('input[required]');
        
        inputs.forEach(input => {
            input.addEventListener('blur', () => {
                this.validateInput(input);
            });
            
            input.addEventListener('input', () => {
                if (input.classList.contains('error')) {
                    this.validateInput(input);
                }
            });
        });
    }

    validateInput(input) {
        const value = input.value.trim();
        const isValid = value.length > 0;
        
        if (isValid) {
            input.classList.remove('error');
            input.style.borderColor = 'var(--primary-green)';
        } else {
            input.classList.add('error');
            input.style.borderColor = '#e74c3c';
        }
        
        return isValid;
    }

    // Interactive Elements
    setupInteractiveElements() {
        // Add hover effects to cards
        const cards = document.querySelectorAll('.program-card, .team-member, .facility-card, .login-panel');
        
        cards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-10px) scale(1.02)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0) scale(1)';
            });
        });

        // Add click effects to buttons
        const buttons = document.querySelectorAll('.btn, .login-btn');
        
        buttons.forEach(button => {
            button.addEventListener('click', (e) => {
                const ripple = document.createElement('span');
                const rect = button.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;
                
                ripple.style.cssText = `
                    position: absolute;
                    width: ${size}px;
                    height: ${size}px;
                    left: ${x}px;
                    top: ${y}px;
                    background: rgba(255, 255, 255, 0.3);
                    border-radius: 50%;
                    transform: scale(0);
                    animation: ripple 0.6s linear;
                    pointer-events: none;
                `;
                
                button.style.position = 'relative';
                button.style.overflow = 'hidden';
                button.appendChild(ripple);
                
                setTimeout(() => {
                    ripple.remove();
                }, 600);
            });
        });

        // Add CSS for ripple animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes ripple {
                to {
                    transform: scale(4);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }

    // Loading Animations
    setupLoadingAnimations() {
        // Simulate page loading
        window.addEventListener('load', () => {
            document.body.classList.add('loaded');
            
            // Animate hero elements
            const heroElements = document.querySelectorAll('.hero-title, .hero-subtitle, .hero-buttons');
            heroElements.forEach((el, index) => {
                setTimeout(() => {
                    el.style.opacity = '1';
                    el.style.transform = 'translateY(0)';
                }, index * 200);
            });
        });

        // Add loading screen (optional)
        this.createLoadingScreen();
    }

    
    createLoadingScreen() {
        const loader = document.createElement('div');
        loader.id = 'page-loader';
        loader.innerHTML = `
            <div class="loader-content">
                <div class="loader-logo">
                    <div class="logo-circle"></div>
                    <span>Uniglobe</span>
                </div>
                <div class="loader-spinner"></div>
            </div>
        `;
        
        loader.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, var(--primary-green), var(--secondary-blue));
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
            transition: opacity 0.5s ease;
        `;

        const style = document.createElement('style');
        style.textContent = `
            .loader-content {
                text-align: center;
                color: white;
            }
            .loader-logo {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 15px;
                margin-bottom: 30px;
                font-size: 2rem;
                font-weight: bold;
            }
            .logo-circle {
                width: 50px;
                height: 50px;
                background: white;
                border-radius: 50%;
                animation: pulse 2s infinite;
            }
            .loader-spinner {
                width: 50px;
                height: 50px;
                border: 4px solid rgba(255, 255, 255, 0.3);
                border-top: 4px solid white;
                border-radius: 50%;
                animation: spin 1s linear infinite;
                margin: 0 auto;
            }
            @keyframes pulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.1); }
            }
        `;
        document.head.appendChild(style);
        document.body.appendChild(loader);

        // Remove loader after page loads
        window.addEventListener('load', () => {
            setTimeout(() => {
                loader.style.opacity = '0';
                setTimeout(() => {
                    document.body.removeChild(loader);
                }, 500);
            }, 1000);
        });
    }

    // Utility Functions
    capitalizeFirst(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    

    // Parallax Effect for Hero Section
    setupParallax() {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const hero = document.querySelector('.hero');
            const heroContent = document.querySelector('.hero-content');
            
            if (hero) {
                hero.style.transform = `translateY(${scrolled * 0.5}px)`;
                heroContent.style.transform = `translateY(${scrolled * 0.3}px)`;
            }
        });
    }

    // Search Functionality (for future enhancement)
    setupSearch() {
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                const query = e.target.value.toLowerCase();
                this.performSearch(query);
            });
        }
    }

    performSearch(query) {
        const searchableElements = document.querySelectorAll('[data-searchable]');
        searchableElements.forEach(element => {
            const text = element.textContent.toLowerCase();
            if (text.includes(query)) {
                element.style.display = 'block';
                element.classList.add('search-highlight');
            } else {
                element.style.display = 'none';
                element.classList.remove('search-highlight');
            }
        });
    }
}
   
        // Animation for facility cards
        document.addEventListener('DOMContentLoaded', function() {
            const facilityCards = document.querySelectorAll('.facility-card');
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                    }
                });
            }, { threshold: 0.1 });
            
            facilityCards.forEach(card => {
                observer.observe(card);
            });
            
            // Add hover effect for touch devices
            facilityCards.forEach(card => {
                card.addEventListener('touchstart', function() {
                    this.classList.add('hover-effect');
                });
                
                card.addEventListener('touchend', function() {
                    setTimeout(() => {
                        this.classList.remove('hover-effect');
                    }, 500);
                });
            });
        });
    

// Initialize the website when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const website = new UniglobeWebsite();
    
    // Add some demo credentials info to the page
    const misSection = document.querySelector('#mis .mis-description');
    if (misSection) {
        misSection.innerHTML += `
            <div style="margin-top: 2rem; padding: 1rem; background: var(--bg-light); border-radius: 10px; font-size: 0.9rem;">
                <strong>Demo Credentials:</strong><br>
                Students: username: <code>student</code>, password: <code>student123</code><br>
                Teachers: username: <code>teacher</code>, password: <code>teacher123</code><br>
                Admin: username: <code>admin</code>, password: <code>admin123</code>
            </div>
        `;
    }
});

document.addEventListener('DOMContentLoaded', function() {
    const galleryContainer = document.querySelector('.gallery-container');
    const imageSlices = document.querySelectorAll('.image-slice');
    const overlay = document.querySelector('.gallery-overlay');
    
    // Mouse movement tracking
    let mouseX = 0;
    let mouseY = 0;
    let isExpanded = false;
    let expandedSlice = null;
    
    // Initialize gallery
    function initGallery() {
        // Add mouse movement listeners
        galleryContainer.addEventListener('mousemove', handleMouseMove);
        galleryContainer.addEventListener('mouseenter', handleMouseEnter);
        galleryContainer.addEventListener('mouseleave', handleMouseLeave);
        
        // Add individual slice interactions
        imageSlices.forEach((slice, index) => {
            slice.addEventListener('mouseenter', () => handleSliceHover(slice, index));
            slice.addEventListener('mouseleave', () => handleSliceLeave(slice, index));
            slice.addEventListener('click', () => handleSliceClick(slice, index));
            
            // Add close button functionality
            const closeBtn = slice.querySelector('.close-btn');
            closeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                collapseSlice();
            });
        });
        
        // Add overlay click to close
        overlay.addEventListener('click', collapseSlice);
        
        // Add escape key to close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && isExpanded) {
                collapseSlice();
            }
        });
    }
    
    // Handle mouse movement for parallax effect
    function handleMouseMove(e) {
        if (isExpanded) return; // Disable parallax when expanded
        
        const rect = galleryContainer.getBoundingClientRect();
        mouseX = (e.clientX - rect.left) / rect.width;
        mouseY = (e.clientY - rect.top) / rect.height;
        
        // Apply subtle parallax effect to slices
        imageSlices.forEach((slice, index) => {
            if (slice.classList.contains('collapsed')) return;
            
            const intensity = (index + 1) * 0.5;
            const xOffset = (mouseX - 0.5) * intensity;
            const yOffset = (mouseY - 0.5) * intensity;
            
            slice.style.transform = `translateX(${xOffset}px) translateY(${yOffset}px)`;
        });
    }
    
    // Handle mouse enter
    function handleMouseEnter() {
        galleryContainer.classList.add('mouse-active');
    }
    
    // Handle mouse leave
    function handleMouseLeave() {
        galleryContainer.classList.remove('mouse-active');
        
        // Reset all transformations
        imageSlices.forEach(slice => {
            slice.style.transform = '';
        });
    }
    
    // Handle individual slice hover
    function handleSliceHover(slice, index) {
        if (isExpanded) return; // Disable hover effects when expanded
        
        // Add ripple effect to neighboring slices
        imageSlices.forEach((otherSlice, otherIndex) => {
            const distance = Math.abs(index - otherIndex);
            const scale = Math.max(0.95, 1 - distance * 0.05);
            const brightness = Math.max(0.7, 1 - distance * 0.1);
            
            if (otherIndex !== index) {
                otherSlice.style.transform += ` scale(${scale})`;
                otherSlice.style.filter = `grayscale(0.8) brightness(${brightness})`;
            }
        });
        
        // Highlight current slice
        slice.style.filter = 'grayscale(0) brightness(1.2)';
        slice.style.zIndex = '20';
    }
    
    // Handle slice leave
    function handleSliceLeave(slice, index) {
        if (isExpanded) return; // Disable hover effects when expanded
        
        // Reset all slices
        imageSlices.forEach(otherSlice => {
            otherSlice.style.filter = '';
            otherSlice.style.zIndex = '';
        });
    }
    
    // Handle slice click
    function handleSliceClick(slice, index) {
        if (isExpanded) {
            collapseSlice();
        } else {
            expandSlice(slice, index);
        }
    }
    
    // Expand slice functionality
    function expandSlice(slice, index) {
        if (isExpanded) return;
        
        isExpanded = true;
        expandedSlice = slice;
        
        // Show overlay
        overlay.classList.add('active');
        
        // Collapse other slices
        imageSlices.forEach((otherSlice, otherIndex) => {
            if (otherIndex !== index) {
                otherSlice.classList.add('collapsed');
            }
        });
        
        // Expand current slice
        slice.classList.add('expanded');
        slice.querySelector('.close-btn').style.display = 'flex';
        
        // Disable mouse movement effects
        galleryContainer.classList.remove('mouse-active');
        
        console.log(`Expanded slice ${index + 1}`);
    }
    
    // Collapse slice functionality
    function collapseSlice() {
        if (!isExpanded) return;
        
        isExpanded = false;
        
        // Hide overlay
        overlay.classList.remove('active');
        
        // Reset all slices
        imageSlices.forEach(slice => {
            slice.classList.remove('expanded', 'collapsed');
            slice.querySelector('.close-btn').style.display = 'none';
            slice.style.transform = '';
            slice.style.filter = '';
            slice.style.zIndex = '';
        });
        
        expandedSlice = null;
        
        console.log('Collapsed slice');
    }
    
    // Add floating animation
    function addFloatingAnimation() {
        imageSlices.forEach((slice, index) => {
            const delay = index * 0.2;
            const duration = 3 + Math.random() * 2;
            
            slice.style.animation = `float ${duration}s ease-in-out ${delay}s infinite alternate`;
        });
    }
    
    // CSS animation for floating effect
    const style = document.createElement('style');
    style.textContent = `
        @keyframes float {
            0% {
                transform: translateY(0px) rotate(0deg);
            }
            100% {
                transform: translateY(-10px) rotate(1deg);
            }
        }
        
        @keyframes pulse {
            0%, 100% {
                box-shadow: 0 10px 30px rgba(255, 255, 255, 0.1);
            }
            50% {
                box-shadow: 0 15px 35px rgba(255, 255, 255, 0.2);
            }
        }
        
        .image-slice {
            animation: pulse 4s ease-in-out infinite;
        }
    `;
    document.head.appendChild(style);
    
    // Initialize everything
    initGallery();
    addFloatingAnimation();
    
    // Add keyboard navigation
    document.addEventListener('keydown', function(e) {
        const currentActive = document.querySelector('.image-slice.active') || imageSlices[0];
        const currentIndex = Array.from(imageSlices).indexOf(currentActive);
        
        let newIndex = currentIndex;
        
        switch(e.key) {
            case 'ArrowLeft':
                newIndex = Math.max(0, currentIndex - 1);
                break;
            case 'ArrowRight':
                newIndex = Math.min(imageSlices.length - 1, currentIndex + 1);
                break;
            case 'Enter':
                currentActive.click();
                return;
        }
        
        if (newIndex !== currentIndex) {
            imageSlices.forEach(slice => slice.classList.remove('active'));
            imageSlices[newIndex].classList.add('active');
            imageSlices[newIndex].focus();
        }
    });
    
    // Make slices focusable for accessibility
    imageSlices.forEach((slice, index) => {
        slice.setAttribute('tabindex', '0');
        slice.setAttribute('role', 'button');
        slice.setAttribute('aria-label', `Image slice ${index + 1}`);
    });
});


// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = UniglobeWebsite;
}


