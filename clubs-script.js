// Clubs Page JavaScript
class ClubsManager {
    constructor() {
        this.filterButtons = document.querySelectorAll('.filter-btn');
        this.clubCards = document.querySelectorAll('.club-card');
        this.joinButtons = document.querySelectorAll('.join-btn');
        
        this.init();
    }
    
    init() {
        this.bindFilterEvents();
        this.bindJoinEvents();
        this.setupScrollAnimations();
        this.setupCardAnimations();
    }
    
    bindFilterEvents() {
        this.filterButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const filter = e.target.dataset.filter;
                this.filterClubs(filter);
                this.updateActiveFilter(e.target);
            });
        });
    }
    
    filterClubs(filter) {
        this.clubCards.forEach(card => {
            const category = card.dataset.category;
            
            if (filter === 'all' || category === filter) {
                this.showCard(card);
            } else {
                this.hideCard(card);
            }
        });
    }
    
    showCard(card) {
        card.classList.remove('hidden');
        card.classList.add('visible');
        card.style.display = 'block';
        
        // Animate in
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'scale(1) translateY(0)';
        }, 50);
    }
    
    hideCard(card) {
        card.classList.add('hidden');
        card.classList.remove('visible');
        card.style.opacity = '0';
        card.style.transform = 'scale(0.8) translateY(20px)';
        
        // Hide after animation
        setTimeout(() => {
            card.style.display = 'none';
        }, 300);
    }
    
    updateActiveFilter(activeButton) {
        this.filterButtons.forEach(button => {
            button.classList.remove('active');
        });
        activeButton.classList.add('active');
    }
    
    bindJoinEvents() {
        this.joinButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const clubCard = e.target.closest('.club-card');
                const clubName = clubCard.querySelector('.club-name').textContent;
                this.handleJoinClub(clubName, button);
            });
        });
    }
    
    handleJoinClub(clubName, button) {
        // Add loading state
        const originalText = button.innerHTML;
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Joining...';
        button.disabled = true;
        
        // Simulate joining process
        setTimeout(() => {
            // Show success state
            button.innerHTML = '<i class="fas fa-check"></i> Joined!';
            button.style.background = 'linear-gradient(135deg, #10b981, #059669)';
            
            // Show notification
            this.showNotification(`Successfully joined ${clubName}!`, 'success');
            
            // Reset button after delay
            setTimeout(() => {
                button.innerHTML = originalText;
                button.disabled = false;
                button.style.background = '';
            }, 3000);
        }, 1500);
    }
    
    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-info-circle'}"></i>
                <span>${message}</span>
                <button class="notification-close">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#10b981' : '#3b82f6'};
            color: white;
            padding: 15px 20px;
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
            z-index: 1000;
            transform: translateX(400px);
            transition: transform 0.3s ease;
            max-width: 350px;
        `;
        
        notification.querySelector('.notification-content').style.cssText = `
            display: flex;
            align-items: center;
            gap: 10px;
        `;
        
        notification.querySelector('.notification-close').style.cssText = `
            background: none;
            border: none;
            color: white;
            cursor: pointer;
            font-size: 1rem;
            margin-left: auto;
        `;
        
        // Add to page
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Auto remove
        setTimeout(() => {
            this.removeNotification(notification);
        }, 5000);
        
        // Close button
        notification.querySelector('.notification-close').addEventListener('click', () => {
            this.removeNotification(notification);
        });
    }
    
    removeNotification(notification) {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }
    
    setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);
        
        // Observe club cards
        this.clubCards.forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(card);
        });
        
        // Observe other elements
        const animatedElements = document.querySelectorAll('.club-filters, .join-info');
        animatedElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });
    }
    
    setupCardAnimations() {
        this.clubCards.forEach((card, index) => {
            // Stagger animation delays
            card.style.animationDelay = `${index * 0.1}s`;
            
            // Add hover sound effect (optional)
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-10px) scale(1.02)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0) scale(1)';
            });
        });
    }
    
    // Search functionality
    setupSearch() {
        const searchInput = document.createElement('input');
        searchInput.type = 'text';
        searchInput.placeholder = 'Search clubs...';
        searchInput.className = 'club-search';
        
        searchInput.style.cssText = `
            width: 100%;
            max-width: 400px;
            padding: 12px 20px;
            border: 2px solid var(--border-color);
            border-radius: 25px;
            font-size: 1rem;
            margin-bottom: 20px;
            background: var(--card-background);
            color: var(--text-primary);
            transition: all 0.3s ease;
        `;
        
        // Add search to filters section
        const filtersSection = document.querySelector('.club-filters');
        filtersSection.insertBefore(searchInput, filtersSection.querySelector('h3').nextSibling);
        
        // Search functionality
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            this.searchClubs(searchTerm);
        });
    }
    
    searchClubs(searchTerm) {
        this.clubCards.forEach(card => {
            const clubName = card.querySelector('.club-name').textContent.toLowerCase();
            const clubDescription = card.querySelector('.club-description').textContent.toLowerCase();
            const tags = Array.from(card.querySelectorAll('.tag')).map(tag => tag.textContent.toLowerCase());
            
            const isMatch = clubName.includes(searchTerm) || 
                          clubDescription.includes(searchTerm) || 
                          tags.some(tag => tag.includes(searchTerm));
            
            if (isMatch || searchTerm === '') {
                this.showCard(card);
            } else {
                this.hideCard(card);
            }
        });
    }
}

// Statistics counter animation
class StatsCounter {
    constructor() {
        this.statsElements = document.querySelectorAll('.stat');
        this.init();
    }
    
    init() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateStats(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        this.statsElements.forEach(stat => {
            observer.observe(stat);
        });
    }
    
    animateStats(statElement) {
        const text = statElement.textContent;
        const numberMatch = text.match(/(\d+)/);
        
        if (numberMatch) {
            const finalNumber = parseInt(numberMatch[1]);
            const duration = 2000;
            const steps = 60;
            const increment = finalNumber / steps;
            let current = 0;
            
            const timer = setInterval(() => {
                current += increment;
                if (current >= finalNumber) {
                    current = finalNumber;
                    clearInterval(timer);
                }
                
                statElement.textContent = text.replace(/\d+/, Math.floor(current));
            }, duration / steps);
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const clubsManager = new ClubsManager();
    const statsCounter = new StatsCounter();
    
    // Add search functionality
    clubsManager.setupSearch();
    
    // Add smooth scrolling for internal links
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
    
    // Add keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            // Close any open notifications
            const notifications = document.querySelectorAll('.notification');
            notifications.forEach(notification => {
                clubsManager.removeNotification(notification);
            });
        }
    });
    
    // Performance optimization: Lazy load images if any
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
});
