// Enhanced form validation and handling with better UX
document.addEventListener('DOMContentLoaded', function() {
    // Check if user was redirected back after successful form submission
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('sent') === 'true') {
        showSuccessMessage();
        // Remove the parameter from the URL without reloading the page
        window.history.replaceState({}, document.title, window.location.pathname);
    }
    
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        // Real-time validation on blur
        const inputs = contactForm.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => validateField(input));
            input.addEventListener('input', () => {
                // Clear error on input
                if (input.parentElement.classList.contains('error')) {
                    clearError(input);
                }
            });
        });
        
        contactForm.addEventListener('submit', function(e) {
            // Validate all fields before submission
            let isValid = true;
            inputs.forEach(input => {
                if (input.hasAttribute('required') && !validateField(input)) {
                    isValid = false;
                }
            });
            
            if (!isValid) {
                e.preventDefault();
                // Scroll to first error
                const firstError = contactForm.querySelector('.error');
                if (firstError) {
                    firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
                return;
            }
            
            // Show loading state
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            submitBtn.style.opacity = '0.6';
            
            // Let the form submit to Formspree naturally
            // The success/error handling will be done via URL parameters or Formspree's redirect
        });
    }
    
    function validateField(field) {
        const value = field.value.trim();
        
        // Clear previous error
        clearError(field);
        
        // Required field validation
        if (field.hasAttribute('required') && !value) {
            showError(field, 'This field is required');
            return false;
        }
        
        // Email validation
        if (field.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                showError(field, 'Please enter a valid email address');
                return false;
            }
        }
        
        // Phone validation (optional but if provided, must be valid)
        if (field.type === 'tel' && value) {
            const phoneRegex = /^[\d\s\-\(\)\+]+$/;
            if (!phoneRegex.test(value) || value.replace(/\D/g, '').length < 10) {
                showError(field, 'Please enter a valid phone number (at least 10 digits)');
                return false;
            }
        }
        
        // Select validation
        if (field.tagName === 'SELECT' && field.hasAttribute('required') && !value) {
            showError(field, 'Please select an option');
            return false;
        }
        
        return true;
    }
    
    function showError(field, message) {
        const formGroup = field.closest('.form-group');
        if (!formGroup) return;
        
        formGroup.classList.add('error');
        
        let errorMsg = formGroup.querySelector('.error-message');
        if (!errorMsg) {
            errorMsg = document.createElement('span');
            errorMsg.className = 'error-message';
            errorMsg.setAttribute('role', 'alert');
            errorMsg.setAttribute('aria-live', 'polite');
            formGroup.appendChild(errorMsg);
        }
        
        errorMsg.textContent = message;
        field.setAttribute('aria-invalid', 'true');
        field.setAttribute('aria-describedby', errorMsg.id || 'error-' + field.id);
    }
    
    function clearError(field) {
        const formGroup = field.closest('.form-group');
        if (!formGroup) return;
        
        formGroup.classList.remove('error');
        const errorMsg = formGroup.querySelector('.error-message');
        if (errorMsg) {
            errorMsg.textContent = '';
        }
        field.removeAttribute('aria-invalid');
        field.removeAttribute('aria-describedby');
    }
    
    function showSuccessMessage() {
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.setAttribute('role', 'status');
        successDiv.setAttribute('aria-live', 'polite');
        successDiv.innerHTML = `
            <div class="success-icon">✓</div>
            <div class="success-content">
                <h3>Thank you for your inquiry!</h3>
                <p>Your message has been received. The practice will respond within 24-48 business hours.</p>
                <p class="success-note">Please check your email (including spam folder) for our response.</p>
            </div>
        `;
        
        const contactForm = document.getElementById('contactForm');
        const formContainer = contactForm ? contactForm.parentElement : document.querySelector('.contact-form');
        if (formContainer) {
            formContainer.insertBefore(successDiv, formContainer.firstChild);
            
            // Scroll to success message
            successDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        
        // Remove after 15 seconds
        setTimeout(() => {
            successDiv.style.opacity = '0';
            successDiv.style.transition = 'opacity 0.5s ease';
            setTimeout(() => successDiv.remove(), 500);
        }, 15000);
    }
});
