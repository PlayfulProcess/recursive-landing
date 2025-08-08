// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// Mobile menu toggle (if needed in future)
function toggleMobileMenu() {
    const menu = document.getElementById('mobile-menu');
    if (menu) {
        menu.classList.toggle('hidden');
    }
}

// Dropdown functionality
document.addEventListener('DOMContentLoaded', function() {
    const dropdowns = document.querySelectorAll('.dropdown');
    
    dropdowns.forEach(dropdown => {
        const trigger = dropdown.querySelector('.dropdown-trigger');
        const menu = dropdown.querySelector('.dropdown-menu');
        const arrow = dropdown.querySelector('.dropdown-arrow');
        
        let isOpen = false;
        
        // Toggle dropdown
        trigger.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            // Close other dropdowns first
            dropdowns.forEach(otherDropdown => {
                if (otherDropdown !== dropdown) {
                    const otherMenu = otherDropdown.querySelector('.dropdown-menu');
                    const otherArrow = otherDropdown.querySelector('.dropdown-arrow');
                    otherMenu.classList.add('opacity-0', 'invisible');
                    otherArrow.classList.remove('rotate-180');
                }
            });
            
            // Toggle current dropdown
            isOpen = !isOpen;
            if (isOpen) {
                menu.classList.remove('opacity-0', 'invisible');
                arrow.classList.add('rotate-180');
            } else {
                menu.classList.add('opacity-0', 'invisible');
                arrow.classList.remove('rotate-180');
            }
        });
    });
    
    // Close dropdowns when clicking outside
    document.addEventListener('click', function() {
        dropdowns.forEach(dropdown => {
            const menu = dropdown.querySelector('.dropdown-menu');
            const arrow = dropdown.querySelector('.dropdown-arrow');
            menu.classList.add('opacity-0', 'invisible');
            arrow.classList.remove('rotate-180');
        });
    });
    
    // Close dropdowns on menu item click
    document.querySelectorAll('.dropdown-menu a').forEach(link => {
        link.addEventListener('click', function() {
            dropdowns.forEach(dropdown => {
                const menu = dropdown.querySelector('.dropdown-menu');
                const arrow = dropdown.querySelector('.dropdown-arrow');
                menu.classList.add('opacity-0', 'invisible');
                arrow.classList.remove('rotate-180');
            });
        });
    });
});