// FAQ Accordion Functionality
document.addEventListener('DOMContentLoaded', function() {
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            const faqItem = this.parentElement;
            const answer = faqItem.querySelector('.faq-answer');
            const icon = this.querySelector('.faq-icon');
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            
            // Close all other FAQs
            document.querySelectorAll('.faq-item').forEach(item => {
                if (item !== faqItem) {
                    item.classList.remove('active');
                    const otherQuestion = item.querySelector('.faq-question');
                    const otherAnswer = item.querySelector('.faq-answer');
                    const otherIcon = otherQuestion.querySelector('.faq-icon');
                    
                    otherQuestion.setAttribute('aria-expanded', 'false');
                    otherAnswer.style.maxHeight = null;
                    otherIcon.textContent = '+';
                }
            });
            
            // Toggle current FAQ
            if (isExpanded) {
                // Close
                this.setAttribute('aria-expanded', 'false');
                faqItem.classList.remove('active');
                answer.style.maxHeight = null;
                icon.textContent = '+';
            } else {
                // Open
                this.setAttribute('aria-expanded', 'true');
                faqItem.classList.add('active');
                answer.style.maxHeight = answer.scrollHeight + 'px';
                icon.textContent = '−';
            }
        });
    });
    
    // Optional: Open first FAQ by default
    if (faqQuestions.length > 0) {
        // faqQuestions[0].click();
    }
});
