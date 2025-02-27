function handleNewsletterSubmit(event) {
    event.preventDefault();
    
    const emailInput = document.getElementById('newsletter-email');
    const errorDiv = document.getElementById('newsletter-error');
    const successDiv = document.getElementById('newsletter-success');
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailInput.value)) {
        errorDiv.classList.remove('hidden');
        successDiv.classList.add('hidden');
        return;
    }
    
    // Hide error if previously shown
    errorDiv.classList.add('hidden');
    
    // Here you would typically make an API call to your backend
    // For now, we'll just show the success message
    successDiv.classList.remove('hidden');
    emailInput.value = '';
    
    // Hide success message after 5 seconds
    setTimeout(() => {
        successDiv.classList.add('hidden');
    }, 5000);
}
