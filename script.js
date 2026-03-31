document.addEventListener('DOMContentLoaded', () => {
    // Waitlist Form integration with /api/waitlist
    const forms = document.querySelectorAll('.waitlist-form');
    forms.forEach(form => {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = form.querySelector('button');
            const input = form.querySelector('input');
            const originalText = btn.textContent;
            
            // Loading State
            btn.textContent = 'Reserving Spot...';
            btn.style.opacity = '0.8';
            btn.style.pointerEvents = 'none';
            input.disabled = true;
            
            try {
                // Actual Network Request
                const res = await fetch('/api/waitlist', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: input.value })
                });

                const data = await res.json();
                
                if (res.ok) {
                    btn.textContent = 'You\'re on the list!';
                    btn.style.background = 'var(--color-pink-deep)';
                    btn.style.opacity = '1';
                    input.value = ''; // clear only on success
                } else {
                    btn.textContent = 'Error: Try Again';
                    console.error('Waitlist Error:', data.error);
                }

            } catch (err) {
                btn.textContent = 'Network Error';
                console.error('Fetch Error:', err);
            } finally {
                // Reset after 3.5 seconds
                setTimeout(() => {
                    btn.textContent = originalText;
                    btn.style.background = '';
                    btn.style.opacity = '1';
                    btn.style.pointerEvents = 'auto';
                    input.disabled = false;
                }, 3500);
            }
        });
    });

    // Scroll reveal animations using Intersection Observer
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -50px 0px',
        threshold: 0.05
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationPlayState = 'running';
                entry.target.style.opacity = '1';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Pause animations initially so they play on scroll
    const animatedElements = document.querySelectorAll('.animate');
    animatedElements.forEach(el => {
        // Only pause if not already in viewport (crude check)
        if (el.getBoundingClientRect().top > window.innerHeight) {
            el.style.animationPlayState = 'paused';
            el.style.opacity = '0';
        }
        observer.observe(el);
    });
});
