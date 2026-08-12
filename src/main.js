/**
 * Riya Ladwa - Professional Portfolio Interactivity
 */

// Import CSS (Vite processes this)
import './style.css';

document.addEventListener('DOMContentLoaded', () => {
  initStickyHeader();
  initMobileNav();
  initScrollSpy();
  initContactForm();
  initScrollReveal();
});

/**
 * 1. Sticky Header scroll height adjustment
 */
function initStickyHeader() {
  const header = document.getElementById('site-header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  // Run on load and scroll
  handleScroll();
  window.addEventListener('scroll', handleScroll, { passive: true });
}

/**
 * 2. Mobile Nav Drawer open, close & overlay interaction
 */
function initMobileNav() {
  const toggleBtn = document.getElementById('mobile-nav-toggle');
  const drawer = document.getElementById('mobile-nav-drawer');
  const overlay = document.getElementById('mobile-nav-overlay');
  const links = document.querySelectorAll('.mobile-nav-link');
  
  if (!toggleBtn || !drawer || !overlay) return;

  const hamburgerIcon = toggleBtn.querySelector('.hamburger-icon');
  const closeIcon = toggleBtn.querySelector('.close-icon');

  const openDrawer = () => {
    drawer.classList.add('open');
    drawer.setAttribute('aria-hidden', 'false');
    toggleBtn.setAttribute('aria-expanded', 'true');
    if (hamburgerIcon) hamburgerIcon.style.display = 'none';
    if (closeIcon) closeIcon.style.display = 'block';
    document.body.style.overflow = 'hidden'; // Stop background scrolling
  };

  const closeDrawer = () => {
    drawer.classList.remove('open');
    drawer.setAttribute('aria-hidden', 'true');
    toggleBtn.setAttribute('aria-expanded', 'false');
    if (hamburgerIcon) hamburgerIcon.style.display = 'block';
    if (closeIcon) closeIcon.style.display = 'none';
    document.body.style.overflow = '';
  };

  toggleBtn.addEventListener('click', () => {
    const isOpen = drawer.classList.contains('open');
    if (isOpen) {
      closeDrawer();
    } else {
      openDrawer();
    }
  });

  overlay.addEventListener('click', closeDrawer);
  
  // Close drawer when mobile nav links are clicked
  links.forEach(link => {
    link.addEventListener('click', closeDrawer);
  });

  // Handle escape key to dismiss mobile drawer
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('open')) {
      closeDrawer();
    }
  });
}

/**
 * 3. Scroll Spy for active navigation link styling
 */
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  const onScroll = () => {
    const scrollPos = window.scrollY + 180; // offset header height

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        // Desktop nav update
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });

        // Mobile nav update
        mobileNavLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  };

  window.addEventListener('scroll', onScroll, { passive: true });
}

/**
 * 4. Custom Contact Form Interactivity & Validation
 */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const toast = document.getElementById('feedback-toast');
  const toastClose = document.getElementById('toast-close');
  
  if (!form || !toast) return;

  const fields = [
    { id: 'contact-name', errorId: 'name-error', check: val => val.trim().length > 0 },
    { id: 'contact-email', errorId: 'email-error', check: val => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim()) },
    { id: 'contact-message', errorId: 'message-error', check: val => val.trim().length > 0 }
  ];

  // Helper to validate a specific group/field
  const validateField = (field, showFeedback = true) => {
    const input = document.getElementById(field.id);
    const errorMsg = document.getElementById(field.errorId);
    if (!input || !errorMsg) return true;

    const isValid = field.check(input.value);
    const group = input.closest('.form-group');

    if (!isValid && showFeedback) {
      group.classList.add('invalid-state');
    } else {
      group.classList.remove('invalid-state');
    }

    return isValid;
  };

  // Real-time validation after the user leaves the field
  fields.forEach(field => {
    const input = document.getElementById(field.id);
    if (input) {
      input.addEventListener('blur', () => validateField(field, true));
      input.addEventListener('input', () => {
        // If field already has error state, validate in real-time
        const group = input.closest('.form-group');
        if (group.classList.contains('invalid-state')) {
          validateField(field, false);
        }
      });
    }
  });

  // Submit flow
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    let formIsValid = true;
    fields.forEach(field => {
      const isValid = validateField(field, true);
      if (!isValid) formIsValid = false;
    });

    if (!formIsValid) return;

    const submitBtn = form.querySelector('button[type="submit"]');
    const submitBtnText = submitBtn.querySelector('span');
    const originalText = submitBtnText.textContent;

    // Show loading state
    submitBtn.disabled = true;
    submitBtnText.textContent = 'Sending...';

    // Get input values
    const nameVal = document.getElementById('contact-name').value;
    const emailVal = document.getElementById('contact-email').value;
    const messageVal = document.getElementById('contact-message').value;

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: nameVal,
          email: emailVal,
          message: messageVal
        })
      });

      const result = await response.json();

      if (response.ok && result.success) {
        // Trigger Success UI Toast
        showToast('Message Sent!', 'Thank you for reaching out. Riya will get back to you shortly.', true);
        form.reset();
      } else {
        showToast('Error', result.error || 'Failed to send message.', false);
      }
    } catch (err) {
      console.error('[API Error] Submission failed:', err);
      showToast('Connection Error', 'Failed to reach backend server. Please try again.', false);
    } finally {
      // Restore submit button
      submitBtn.disabled = false;
      submitBtnText.textContent = originalText;
    }
  });

  const showToast = (title, message, isSuccess) => {
    const toastTitle = toast.querySelector('strong');
    const toastSpan = toast.querySelector('span');
    const toastIconBox = toast.querySelector('.toast-icon-success');

    if (toastTitle) toastTitle.textContent = title;
    if (toastSpan) toastSpan.textContent = message;

    if (isSuccess) {
      toast.style.borderColor = 'var(--success)';
      if (toastIconBox) {
        toastIconBox.style.color = 'var(--success)';
        toastIconBox.style.backgroundColor = 'var(--success-soft)';
        toastIconBox.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>';
      }
    } else {
      toast.style.borderColor = 'var(--error)';
      if (toastIconBox) {
        toastIconBox.style.color = 'var(--error)';
        toastIconBox.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
        toastIconBox.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>';
      }
    }

    toast.classList.add('show');
    toast.setAttribute('aria-hidden', 'false');

    // Auto dismiss after 5 seconds
    setTimeout(closeToast, 5000);
  };

  const closeToast = () => {
    toast.classList.remove('show');
    toast.setAttribute('aria-hidden', 'true');
  };

  if (toastClose) {
    toastClose.addEventListener('click', closeToast);
  }
}

/**
 * 5. JS Fallback for scroll reveals where CSS animation-timeline is unsupported
 */
function initScrollReveal() {
  // Only use JS observer if native CSS scroll timelines are unsupported
  const supportsCssTimeline = CSS.supports('(animation-timeline: view())');
  if (supportsCssTimeline) return;

  const reveals = document.querySelectorAll('.scroll-reveal');
  
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal-visible');
        observer.unobserve(entry.target); // Reveal only once
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -50px 0px'
  });

  reveals.forEach(reveal => {
    revealObserver.observe(reveal);
  });
}

