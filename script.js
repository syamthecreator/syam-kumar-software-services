/**
 * Syam Kumar Software Services - Main JavaScript
 * Production-ready, accessible, zero-dependency client interactions
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // --- 1. Sticky Header & Scroll Effects ---
  const header = document.querySelector('.site-header');
  const handleScroll = () => {
    if (window.scrollY > 20) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // --- 2. Mobile Navigation Drawer ---
  const mobileToggleBtn = document.querySelector('.mobile-menu-btn');
  const navDrawer = document.querySelector('.nav-menu-container');
  const backdrop = document.querySelector('.menu-backdrop');
  const navLinks = document.querySelectorAll('.nav-link');

  const openMenu = () => {
    mobileToggleBtn?.classList.add('active');
    mobileToggleBtn?.setAttribute('aria-expanded', 'true');
    navDrawer?.classList.add('open');
    backdrop?.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  const closeMenu = () => {
    mobileToggleBtn?.classList.remove('active');
    mobileToggleBtn?.setAttribute('aria-expanded', 'false');
    navDrawer?.classList.remove('open');
    backdrop?.classList.remove('open');
    document.body.style.overflow = '';
  };

  if (mobileToggleBtn) {
    mobileToggleBtn.addEventListener('click', () => {
      const isOpen = navDrawer?.classList.contains('open');
      if (isOpen) {
        closeMenu();
      } else {
        openMenu();
      }
    });
  }

  if (backdrop) {
    backdrop.addEventListener('click', closeMenu);
  }

  // Close on nav link click
  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 991) {
        closeMenu();
      }
    });
  });

  // Close drawer on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navDrawer?.classList.contains('open')) {
      closeMenu();
    }
  });

  // --- 3. Active Link Scroll Spy ---
  const sections = document.querySelectorAll('section[id]');
  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -70% 0px',
    threshold: 0
  };

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach((link) => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach((sec) => navObserver.observe(sec));

  // --- 4. Technology Tabs Filtering ---
  const techTabBtns = document.querySelectorAll('.tech-tab-btn');
  const techCards = document.querySelectorAll('.tech-card');

  if (techTabBtns.length > 0 && techCards.length > 0) {
    techTabBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        techTabBtns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.getAttribute('data-filter') || 'all';

        techCards.forEach((card) => {
          const category = card.getAttribute('data-category');
          if (filter === 'all' || category === filter) {
            card.style.display = 'flex';
            card.classList.add('fade-in');
          } else {
            card.style.display = 'none';
            card.classList.remove('fade-in');
          }
        });
      });
    });
  }

  // --- 5. Copy to Clipboard Utility ---
  const copyBtns = document.querySelectorAll('[data-copy-target]');
  copyBtns.forEach((btn) => {
    btn.addEventListener('click', async () => {
      const targetText = btn.getAttribute('data-copy-target');
      if (!targetText) return;

      try {
        await navigator.clipboard.writeText(targetText);
        const originalText = btn.innerHTML;
        btn.innerHTML = `
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle;margin-right:4px;">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg> Copied!
        `;
        btn.style.borderColor = '#10B981';
        btn.style.color = '#A7F3D0';

        setTimeout(() => {
          btn.innerHTML = originalText;
          btn.style.borderColor = '';
          btn.style.color = '';
        }, 2200);
      } catch (err) {
        console.error('Failed to copy to clipboard', err);
      }
    });
  });

  // --- 6. Contact Form Frontend Validation & Handling ---
  const contactForm = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');

  if (contactForm) {
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phone');
    const serviceSelect = document.getElementById('service');
    const messageInput = document.getElementById('message');

    // Email validation regex (RFC 5322 compatible simplified)
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+$/;
    // Optional phone regex (allows international codes, digits, hyphens, spaces)
    const phoneRegex = /^(\+?\d{1,4}[\s-]?)?\(?\d{2,5}\)?[\s-]?\d{3,5}[\s-]?\d{3,5}$/;

    const setFieldError = (input, errorId, message) => {
      input.classList.add('error');
      const errEl = document.getElementById(errorId);
      if (errEl) {
        errEl.textContent = message;
        errEl.classList.add('active');
      }
    };

    const clearFieldError = (input, errorId) => {
      input.classList.remove('error');
      const errEl = document.getElementById(errorId);
      if (errEl) {
        errEl.textContent = '';
        errEl.classList.remove('active');
      }
    };

    // Real-time clearance of errors on input
    [nameInput, emailInput, phoneInput, messageInput].forEach((input) => {
      if (!input) return;
      input.addEventListener('input', () => {
        const errorId = `${input.id}-error`;
        clearFieldError(input, errorId);
        if (formStatus) {
          formStatus.className = 'form-status-alert';
          formStatus.innerHTML = '';
        }
      });
    });

    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;

      // 1. Validate Name
      const nameVal = nameInput.value.trim();
      if (!nameVal || nameVal.length < 2) {
        setFieldError(nameInput, 'name-error', 'Please enter your full name (minimum 2 characters).');
        isValid = false;
      } else {
        clearFieldError(nameInput, 'name-error');
      }

      // 2. Validate Email
      const emailVal = emailInput.value.trim();
      if (!emailVal || !emailRegex.test(emailVal)) {
        setFieldError(emailInput, 'email-error', 'Please enter a valid email address.');
        isValid = false;
      } else {
        clearFieldError(emailInput, 'email-error');
      }

      // 3. Validate Phone (Optional, but if filled, must be valid)
      const phoneVal = phoneInput.value.trim();
      if (phoneVal && !phoneRegex.test(phoneVal)) {
        setFieldError(phoneInput, 'phone-error', 'Please enter a valid phone number or leave blank.');
        isValid = false;
      } else {
        clearFieldError(phoneInput, 'phone-error');
      }

      // 4. Validate Message
      const messageVal = messageInput.value.trim();
      if (!messageVal || messageVal.length < 10) {
        setFieldError(messageInput, 'message-error', 'Please describe your project or inquiry (at least 10 characters).');
        isValid = false;
      } else {
        clearFieldError(messageInput, 'message-error');
      }

      if (!isValid) {
        // Focus first invalid input
        const firstError = contactForm.querySelector('.form-control.error');
        if (firstError) firstError.focus();
        return;
      }

      // Prepare mailto payload and WhatsApp fallback for instant engagement
      const serviceChosen = serviceSelect ? serviceSelect.options[serviceSelect.selectedIndex].text : 'General Inquiry';
      const subject = encodeURIComponent(`Project Inquiry: ${serviceChosen} - ${nameVal}`);
      const bodyLines = [
        `Name: ${nameVal}`,
        `Email: ${emailVal}`,
        phoneVal ? `Phone: ${phoneVal}` : '',
        `Service Needed: ${serviceChosen}`,
        '',
        'Project Details:',
        messageVal
      ].filter(Boolean).join('\n');

      const mailtoUrl = `mailto:syamthecreator@gmail.com?subject=${subject}&body=${encodeURIComponent(bodyLines)}`;
      const waText = encodeURIComponent(`Hello Syam Kumar Software Services,\n\nI am ${nameVal}.\nInterested in: ${serviceChosen}.\n\nDetails: ${messageVal}\n\nEmail: ${emailVal}`);
      const waUrl = `https://wa.me/918137922114?text=${waText}`;

      // Show professional confirmation banner with direct fallback actions
      if (formStatus) {
        formStatus.className = 'form-status-alert success';
        formStatus.innerHTML = `
          <strong>Thank you, ${escapeHtml(nameVal)}!</strong> Your message has been prepared.
          <p style="margin: 8px 0 12px 0; color: #E2E8F0;">
            Since this website operates without external database trackers, you can dispatch your message directly through your email client or WhatsApp:
          </p>
          <div style="display: flex; flex-wrap: wrap; gap: 10px; margin-top: 10px;">
            <a href="${mailtoUrl}" class="btn btn-sm btn-primary" style="text-decoration:none;">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg> Send via Email
            </a>
            <a href="${waUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-sm btn-secondary" style="text-decoration:none; border-color:#10B981; color:#A7F3D0;">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
              </svg> Chat on WhatsApp
            </a>
          </div>
        `;
        formStatus.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }

      // Reset form fields
      contactForm.reset();
    });
  }

  // Simple HTML Escaper for XSS protection
  function escapeHtml(str) {
    return str.replace(/[&<>'"]/g, 
      tag => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;'
      }[tag] || tag)
    );
  }

  // --- 7. Back-to-Top Button Smooth Scroll ---
  const backToTopBtn = document.getElementById('back-to-top');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
});
