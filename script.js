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

// Authentication state management
let currentUser = null;
let isSignUpMode = false;

// Check if user is already logged in (from localStorage)
document.addEventListener('DOMContentLoaded', function() {
    const storedUser = localStorage.getItem('jongu_user');
    if (storedUser) {
        try {
            currentUser = JSON.parse(storedUser);
            updateAuthUI();
        } catch (e) {
            localStorage.removeItem('jongu_user');
        }
    }
});

function updateAuthUI() {
    const authButton = document.getElementById('authButton');
    const authButtonText = document.getElementById('authButtonText');
    
    if (currentUser) {
        authButtonText.textContent = currentUser.name || currentUser.email || 'Profile';
        authButton.classList.remove('bg-green-600', 'hover:bg-green-700');
        authButton.classList.add('bg-blue-600', 'hover:bg-blue-700');
    } else {
        authButtonText.textContent = 'Sign In';
        authButton.classList.remove('bg-blue-600', 'hover:bg-blue-700');
        authButton.classList.add('bg-green-600', 'hover:bg-green-700');
    }
}

function toggleAuth() {
    if (currentUser) {
        // User is logged in, show profile options or logout
        if (confirm('Would you like to sign out?')) {
            signOut();
        }
    } else {
        // User is not logged in, show auth modal
        openAuthModal();
    }
}

function openAuthModal() {
    const modal = document.getElementById('authModal');
    modal.classList.remove('hidden');
    isSignUpMode = false;
    updateAuthModalMode();
}

function closeAuthModal() {
    const modal = document.getElementById('authModal');
    modal.classList.add('hidden');
    // Clear form
    document.getElementById('authEmail').value = '';
    document.getElementById('authPassword').value = '';
}

function toggleAuthMode() {
    isSignUpMode = !isSignUpMode;
    updateAuthModalMode();
}

function updateAuthModalMode() {
    const title = document.getElementById('authModalTitle');
    const submitBtn = document.getElementById('authSubmitBtn');
    const toggleText = document.querySelector('[onclick="toggleAuthMode()"]');
    
    if (isSignUpMode) {
        title.textContent = 'Join the Jongu Community';
        submitBtn.textContent = 'Create Account';
        toggleText.innerHTML = 'Already have an account? <span class="text-blue-600 hover:text-blue-800 font-medium">Sign In</span>';
    } else {
        title.textContent = 'Welcome Back to Jongu';
        submitBtn.textContent = 'Sign In';
        toggleText.innerHTML = 'Don\'t have an account? <span class="text-blue-600 hover:text-blue-800 font-medium">Sign Up</span>';
    }
}

async function handleAuth() {
    const email = document.getElementById('authEmail').value;
    const password = document.getElementById('authPassword').value;
    const submitBtn = document.getElementById('authSubmitBtn');
    
    if (!email || !password) {
        alert('Please fill in all fields');
        return;
    }
    
    submitBtn.disabled = true;
    submitBtn.textContent = isSignUpMode ? 'Creating Account...' : 'Signing In...';
    
    try {
        // For demo purposes, we'll simulate authentication
        // In a real implementation, you'd integrate with Supabase or another auth service
        await simulateAuth(email, password);
        
        // Create user object
        currentUser = {
            email: email,
            name: email.split('@')[0], // Use email prefix as name
            joinedAt: new Date().toISOString()
        };
        
        // Store in localStorage
        localStorage.setItem('jongu_user', JSON.stringify(currentUser));
        
        // Update UI
        updateAuthUI();
        closeAuthModal();
        
        // Show welcome message
        if (isSignUpMode) {
            alert(`🎉 Welcome to Jongu, ${currentUser.name}! Your account has been created successfully.`);
        } else {
            alert(`👋 Welcome back, ${currentUser.name}!`);
        }
        
    } catch (error) {
        alert(error.message || 'Authentication failed. Please try again.');
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = isSignUpMode ? 'Create Account' : 'Sign In';
    }
}

function simulateAuth(email, password) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // Simple validation
            if (email.includes('@') && password.length >= 6) {
                resolve();
            } else {
                reject(new Error('Invalid email or password (minimum 6 characters)'));
            }
        }, 1000); // Simulate network delay
    });
}

function signOut() {
    currentUser = null;
    localStorage.removeItem('jongu_user');
    updateAuthUI();
    alert('👋 You have been signed out successfully.');
}

// Mobile menu toggle (if needed in future)
function toggleMobileMenu() {
    const menu = document.getElementById('mobile-menu');
    if (menu) {
        menu.classList.toggle('hidden');
    }
}

// Close modal when clicking outside
document.addEventListener('click', function(event) {
    const modal = document.getElementById('authModal');
    if (event.target === modal) {
        closeAuthModal();
    }
});

// Handle Enter key in auth form
document.addEventListener('keypress', function(event) {
    if (event.key === 'Enter' && !document.getElementById('authModal').classList.contains('hidden')) {
        handleAuth();
    }
});