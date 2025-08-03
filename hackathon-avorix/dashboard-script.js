// Dashboard JavaScript Functionality

document.addEventListener('DOMContentLoaded', function() {
    // Initialize the dashboard
    initializeDashboard();
    generateCalendar();
    setupEventListeners();
});

function initializeDashboard() {
    // Set current date
    const now = new Date();
    currentMonth = now.getMonth();
    currentYear = now.getFullYear();
    
    // Update calendar header
    updateCalendarHeader();
}

// Calendar functionality
let currentMonth = 7; // August (0-indexed)
let currentYear = 2022;

const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function generateCalendar() {
    const calendar = document.getElementById('calendar');
    calendar.innerHTML = '';
    
    // Add day headers
    daysOfWeek.forEach(day => {
        const dayHeader = document.createElement('div');
        dayHeader.className = 'calendar-day header';
        dayHeader.textContent = day;
        calendar.appendChild(dayHeader);
    });
    
    // Get first day of month and number of days
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();
    
    // Add empty cells for previous month
    for (let i = firstDay - 1; i >= 0; i--) {
        const dayCell = document.createElement('div');
        dayCell.className = 'calendar-day other-month';
        dayCell.textContent = daysInPrevMonth - i;
        calendar.appendChild(dayCell);
    }
    
    // Add days of current month
    const today = new Date();
    for (let day = 1; day <= daysInMonth; day++) {
        const dayCell = document.createElement('div');
        dayCell.className = 'calendar-day';
        dayCell.textContent = day;
        
        // Highlight today
        if (currentYear === today.getFullYear() && 
            currentMonth === today.getMonth() && 
            day === today.getDate()) {
            dayCell.classList.add('today');
        }
        
        // Add click event
        dayCell.addEventListener('click', function() {
            document.querySelectorAll('.calendar-day.selected').forEach(cell => {
                cell.classList.remove('selected');
            });
            this.classList.add('selected');
        });
        
        calendar.appendChild(dayCell);
    }
    
    // Add remaining cells for next month
    const totalCells = calendar.children.length;
    const remainingCells = 42 - totalCells; // 6 rows × 7 days
    for (let day = 1; day <= remainingCells; day++) {
        const dayCell = document.createElement('div');
        dayCell.className = 'calendar-day other-month';
        dayCell.textContent = day;
        calendar.appendChild(dayCell);
    }
}

function updateCalendarHeader() {
    const calendarHeader = document.querySelector('.calendar-header h2');
    if (calendarHeader) {
        calendarHeader.textContent = `${months[currentMonth]} ${currentYear}`;
    }
}

function setupEventListeners() {
    // Menu toggle
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.querySelector('.main-content');
    
    if (menuToggle && sidebar && mainContent) {
        menuToggle.addEventListener('click', function() {
            sidebar.classList.toggle('collapsed');
            mainContent.classList.toggle('expanded');
        });
    }
    
    // Calendar navigation
    const prevBtn = document.getElementById('prevMonth');
    const nextBtn = document.getElementById('nextMonth');
    
    if (prevBtn) {
        prevBtn.addEventListener('click', function() {
            currentMonth--;
            if (currentMonth < 0) {
                currentMonth = 11;
                currentYear--;
            }
            updateCalendarHeader();
            generateCalendar();
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            currentMonth++;
            if (currentMonth > 11) {
                currentMonth = 0;
                currentYear++;
            }
            updateCalendarHeader();
            generateCalendar();
        });
    }
    
    // Sidebar navigation
    const navLinks = document.querySelectorAll('.nav-menu a');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all items
            document.querySelectorAll('.nav-menu li').forEach(item => {
                item.classList.remove('active');
            });
            
            // Add active class to clicked item
            this.parentElement.classList.add('active');
            
            // Show notification for demo purposes
            showNotification(`Navigated to ${this.querySelector('span').textContent}`);
        });
    });
    
    // Assignment status toggle (demo functionality)
    const assignmentItems = document.querySelectorAll('.assignment-item');
    assignmentItems.forEach(item => {
        item.addEventListener('click', function() {
            const status = this.querySelector('.assignment-status');
            if (status.classList.contains('pending')) {
                status.classList.remove('pending');
                status.classList.add('completed');
                status.textContent = 'Completed';
                showNotification('Assignment marked as completed!');
            } else {
                status.classList.remove('completed');
                status.classList.add('pending');
                status.textContent = 'Pending';
                showNotification('Assignment marked as pending!');
            }
        });
    });
    
    // Teacher contact info toggle
    const teacherItems = document.querySelectorAll('.teacher-item');
    teacherItems.forEach(item => {
        item.addEventListener('click', function() {
            this.classList.toggle('expanded');
        });
    });
    
    // Notice board detail links
    const detailLinks = document.querySelectorAll('.detail-link');
    detailLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const noticeTitle = this.closest('tr').querySelector('td:nth-child(2)').textContent;
            showNotification(`Opening details for: ${noticeTitle}`);
        });
    });
    
    // User profile dropdown (demo)
    const userProfile = document.querySelector('.user-profile');
    if (userProfile) {
        userProfile.addEventListener('click', function() {
            showNotification('User profile menu would open here');
        });
    }
}

// Utility functions
function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    // Add to body
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Hide and remove notification
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Responsive handling
function handleResize() {
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.querySelector('.main-content');
    
    if (window.innerWidth <= 768) {
        sidebar.classList.add('collapsed');
        mainContent.classList.add('expanded');
    } else {
        sidebar.classList.remove('collapsed');
        mainContent.classList.remove('expanded');
    }
}

// Add resize listener
window.addEventListener('resize', handleResize);

// Initial resize check
handleResize();

// Add some demo data loading animation
function loadDashboardData() {
    const widgets = document.querySelectorAll('.widget, .calendar-section, .notice-board');
    widgets.forEach((widget, index) => {
        widget.style.opacity = '0';
        widget.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            widget.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            widget.style.opacity = '1';
            widget.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

// Load data on page load
window.addEventListener('load', loadDashboardData);
