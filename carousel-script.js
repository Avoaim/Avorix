// Facilities Carousel Functionality
class FacilitiesCarousel {
    constructor() {
        this.currentSlide = 0;
        this.totalSlides = document.querySelectorAll('.carousel-card').length;
        this.isAnimating = false;
        this.autoPlayInterval = null;
        this.autoPlayDelay = 5000; // 5 seconds
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.startAutoPlay();
        this.updateIndicators();
    }
    
    bindEvents() {
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        const indicators = document.querySelectorAll('.indicator');
        
        if (prevBtn) {
            prevBtn.addEventListener('click', () => this.prevSlide());
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => this.nextSlide());
        }
        
        indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => this.goToSlide(index));
        });
        
        // Pause auto-play on hover
        const carouselContainer = document.querySelector('.carousel-container');
        if (carouselContainer) {
            carouselContainer.addEventListener('mouseenter', () => this.stopAutoPlay());
            carouselContainer.addEventListener('mouseleave', () => this.startAutoPlay());
        }
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                this.prevSlide();
            } else if (e.key === 'ArrowRight') {
                this.nextSlide();
            }
        });
        
        // Touch/swipe support
        this.addTouchSupport();
    }
    
    addTouchSupport() {
        const carouselTrack = document.getElementById('carouselTrack');
        if (!carouselTrack) return;
        
        let startX = 0;
        let startY = 0;
        let currentX = 0;
        let isDragging = false;
        let startTransform = 0;
        let minSwipeDistance = 50;
        let maxDragDistance = 100;
        
        // Touch events
        carouselTrack.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
            currentX = startX;
            isDragging = true;
            startTransform = -this.currentSlide * 100;
            carouselTrack.classList.add('dragging');
            this.stopAutoPlay();
        }, { passive: false });
        
        carouselTrack.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            
            currentX = e.touches[0].clientX;
            const deltaX = currentX - startX;
            const deltaY = e.touches[0].clientY - startY;
            
            // Prevent vertical scrolling if horizontal swipe is detected
            if (Math.abs(deltaX) > Math.abs(deltaY)) {
                e.preventDefault();
            }
            
            // Calculate drag percentage
            const dragPercentage = (deltaX / carouselTrack.offsetWidth) * 100;
            const clampedDrag = Math.max(-maxDragDistance, Math.min(maxDragDistance, dragPercentage));
            
            // Apply transform with drag effect
            const newTransform = startTransform + clampedDrag;
            carouselTrack.style.transform = `translateX(${newTransform}%)`;
        }, { passive: false });
        
        carouselTrack.addEventListener('touchend', (e) => {
            if (!isDragging) return;
            
            const endX = e.changedTouches[0].clientX;
            const deltaX = endX - startX;
            
            carouselTrack.classList.remove('dragging');
            isDragging = false;
            
            // Determine if swipe was significant enough
            if (Math.abs(deltaX) > minSwipeDistance) {
                if (deltaX > 0) {
                    this.prevSlide();
                } else {
                    this.nextSlide();
                }
            } else {
                // Snap back to current slide
                this.updateCarousel();
            }
            
            this.startAutoPlay();
        }, { passive: true });
        
        // Mouse events for desktop drag
        let isMouseDown = false;
        
        carouselTrack.addEventListener('mousedown', (e) => {
            startX = e.clientX;
            currentX = startX;
            isMouseDown = true;
            isDragging = true;
            startTransform = -this.currentSlide * 100;
            carouselTrack.classList.add('dragging');
            this.stopAutoPlay();
            e.preventDefault();
        });
        
        document.addEventListener('mousemove', (e) => {
            if (!isMouseDown || !isDragging) return;
            
            currentX = e.clientX;
            const deltaX = currentX - startX;
            
            // Calculate drag percentage
            const dragPercentage = (deltaX / carouselTrack.offsetWidth) * 100;
            const clampedDrag = Math.max(-maxDragDistance, Math.min(maxDragDistance, dragPercentage));
            
            // Apply transform with drag effect
            const newTransform = startTransform + clampedDrag;
            carouselTrack.style.transform = `translateX(${newTransform}%)`;
        });
        
        document.addEventListener('mouseup', (e) => {
            if (!isMouseDown) return;
            
            const endX = e.clientX;
            const deltaX = endX - startX;
            
            carouselTrack.classList.remove('dragging');
            isMouseDown = false;
            isDragging = false;
            
            // Determine if drag was significant enough
            if (Math.abs(deltaX) > minSwipeDistance) {
                if (deltaX > 0) {
                    this.prevSlide();
                } else {
                    this.nextSlide();
                }
            } else {
                // Snap back to current slide
                this.updateCarousel();
            }
            
            this.startAutoPlay();
        });
        
        // Prevent context menu on long press
        carouselTrack.addEventListener('contextmenu', (e) => {
            e.preventDefault();
        });
    }
    
    nextSlide() {
        if (this.isAnimating) return;
        
        this.currentSlide = (this.currentSlide + 1) % this.totalSlides;
        this.updateCarousel();
    }
    
    prevSlide() {
        if (this.isAnimating) return;
        
        this.currentSlide = (this.currentSlide - 1 + this.totalSlides) % this.totalSlides;
        this.updateCarousel();
    }
    
    goToSlide(index) {
        if (this.isAnimating || index === this.currentSlide) return;
        
        this.currentSlide = index;
        this.updateCarousel();
    }
    
    updateCarousel() {
        const carouselTrack = document.getElementById('carouselTrack');
        if (!carouselTrack) return;
        
        this.isAnimating = true;
        
        const translateX = -this.currentSlide * 100;
        carouselTrack.style.transform = `translateX(${translateX}%)`;
        
        this.updateIndicators();
        
        // Reset animation flag after transition
        setTimeout(() => {
            this.isAnimating = false;
        }, 600);
    }
    
    updateIndicators() {
        const indicators = document.querySelectorAll('.indicator');
        indicators.forEach((indicator, index) => {
            if (index === this.currentSlide) {
                indicator.classList.add('active');
            } else {
                indicator.classList.remove('active');
            }
        });
    }
    
    startAutoPlay() {
        this.stopAutoPlay(); // Clear any existing interval
        this.autoPlayInterval = setInterval(() => {
            this.nextSlide();
        }, this.autoPlayDelay);
    }
    
    stopAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
    }
    
    // Method to handle visibility change (pause when tab is not active)
    handleVisibilityChange() {
        if (document.hidden) {
            this.stopAutoPlay();
        } else {
            this.startAutoPlay();
        }
    }
}

// Initialize carousel when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Check if we're on a page with the carousel
    const carouselContainers = document.querySelectorAll('.facilities-carousel-section');
    carouselContainers.forEach(carouselContainer => {
        const carousel = new FacilitiesCarousel();
        
        // Handle page visibility changes
        document.addEventListener('visibilitychange', () => {
            carousel.handleVisibilityChange();
        });
        
        // Add smooth scroll to carousel when linked
        const facilitiesLinks = document.querySelectorAll('a[href*="facilities"]');
        facilitiesLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                if (link.getAttribute('href').includes('#facilities')) {
                    e.preventDefault();
                    carouselContainer.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    });
});

// Add loading animation for images
document.addEventListener('DOMContentLoaded', () => {
    const carouselImages = document.querySelectorAll('.carousel-card img');
    
    carouselImages.forEach(img => {
        img.addEventListener('load', () => {
            img.style.opacity = '1';
        });
        
        // Add loading placeholder
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.3s ease';
    });
});

// Intersection Observer for animation on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
        }
    });
}, observerOptions);

// Observe carousel elements
document.addEventListener('DOMContentLoaded', () => {
    const carouselElements = document.querySelectorAll('.carousel-card, .carousel-title, .carousel-description');
    carouselElements.forEach(el => observer.observe(el));
});
