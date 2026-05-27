// Portfolio Custom Animations & Interactive Micro-transactions

document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // 1. CUSTOM CURSOR TRACKING
    // ==========================================
    const cursor = document.getElementById('custom-cursor');
    
    if (cursor) {
        let mouseX = 0;
        let mouseY = 0;
        let posX = 0;
        let posY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        // Smooth cursor motion using requestAnimationFrame (lerping coordinates)
        function updateCursor() {
            posX += (mouseX - posX) * 0.15;
            posY += (mouseY - posY) * 0.15;
            
            cursor.style.left = `${posX}px`;
            cursor.style.top = `${posY}px`;
            
            requestAnimationFrame(updateCursor);
        }
        updateCursor();

        // Hover expansions on interactive elements
        const hoverables = document.querySelectorAll('a, button, .contact-method-card, .project-card, .logo, .social-btn');
        hoverables.forEach(item => {
            item.addEventListener('mouseenter', () => {
                cursor.classList.add('hovered');
            });
            item.addEventListener('mouseleave', () => {
                cursor.classList.remove('hovered');
            });
        });
    }

    // ==========================================
    // 2. SCROLL REVEAL (INTERSECTION OBSERVER)
    // ==========================================
    const revealElements = document.querySelectorAll('.reveal-element');
    
    if (revealElements.length > 0) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    // Stop observing once revealed to prevent repeatedly fading
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.12,
            rootMargin: '0px 0px -40px 0px' // Trigger slightly before element enters view полностью
        });

        revealElements.forEach(el => {
            revealObserver.observe(el);
        });
    }

    // ==========================================
    // 3. SCROLLED NAVBAR STYLING
    // ==========================================
    const navbar = document.getElementById('navbar');
    
    if (navbar) {
        const toggleNavbarState = () => {
            if (window.scrollY > 40) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        };

        window.addEventListener('scroll', toggleNavbarState);
        toggleNavbarState(); // Initial run on page load
    }

    // ==========================================
    // 4. MAGNETIC HOVER EFFECT ON BUTTONS & ICONS
    // ==========================================
    const magneticElements = document.querySelectorAll('.btn, .social-btn, .logo, .contact-method-card .method-icon');
    
    magneticElements.forEach(element => {
        element.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            // Calculate cursor offset relative to center of element
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            // Pull element towards cursor slightly (18% of distance)
            this.style.transform = `translate(${x * 0.18}px, ${y * 0.18}px)`;
            this.style.transition = 'none'; // Disable transition during drag for responsiveness
        });

        element.addEventListener('mouseleave', function() {
            // Smoothly ease back to original position
            this.style.transform = 'translate(0px, 0px)';
            this.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
        });
    });

    // ==========================================
    // 5. EMAIL COPY TO CLIPBOARD
    // ==========================================
    const emailCard = document.getElementById('email-copy-card');
    const copyIcon = document.getElementById('email-copy-icon');
    const emailTextElement = document.getElementById('email-text');

    if (emailCard && copyIcon && emailTextElement) {
        emailCard.addEventListener('click', () => {
            const emailAddress = emailTextElement.textContent.trim();
            
            navigator.clipboard.writeText(emailAddress).then(() => {
                // Success visual indicator: change icon to a checkmark
                copyIcon.className = 'ph ph-check';
                copyIcon.style.color = 'var(--accent-green)';
                
                // Reset indicator back to copy icon after 2 seconds
                setTimeout(() => {
                    copyIcon.className = 'ph ph-copy';
                    copyIcon.style.color = '';
                }, 2200);
            }).catch(err => {
                console.error('Could not copy email to clipboard: ', err);
            });
        });
    }

    // ==========================================
    // 6. CONTACT FORM FUNCTIONALITY (mailto fallback)
    // ==========================================
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const name = document.getElementById('form-name').value.trim();
            const email = document.getElementById('form-email').value.trim();
            const message = document.getElementById('form-message').value.trim();
            
            if (!name || !email || !message) return;
            
            // Construct pre-filled mailto link (zero setup client-side email trigger)
            const mailtoEmail = "vikalpchaudhary2007@gmail.com";
            const subject = encodeURIComponent(`Portfolio Message from ${name}`);
            const body = encodeURIComponent(`Sender Name: ${name}\nSender Email: ${email}\n\nMessage:\n${message}`);
            
            window.location.href = `mailto:${mailtoEmail}?subject=${subject}&body=${body}`;
        });
    }
});
