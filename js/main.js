// ==========================================================================
//  MAIN.JS — Luxury Invitation Interactions
//  Gate reveal, music player, scroll progress, RSVP form, Lightbox modal
// ==========================================================================
'use strict';

document.addEventListener('DOMContentLoaded', () => {
  initScrollProgress();
  initGate();
  initMusicToggle();
  initLightbox();
  initRSVPForm();
});

/* ---- Scroll Progress Indicator ---- */
function initScrollProgress() {
  const progressBar = document.getElementById('scrollProgressBar');
  if (!progressBar) return;

  window.addEventListener('scroll', () => {
    const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    progressBar.style.width = scrolled + '%';
  });
}

/* ---- Opening Gate Cover ---- */
function initGate() {
  const gate = document.getElementById('gate');
  const enterBtn = document.getElementById('gate-enter');
  if (!gate || !enterBtn) return;

  let opened = false;

  function openGate() {
    if (opened) return;
    opened = true;

    gate.classList.add('gate-opened');
    document.body.classList.remove('gate-active');
    document.body.classList.add('page-loaded');

    // Auto-start music on user interaction
    const music = document.getElementById('bgMusic');
    const musicBtn = document.getElementById('musicToggle');
    if (music && musicBtn) {
      music.volume = 0.5;
      music.play()
        .then(() => musicBtn.classList.add('is-playing'))
        .catch(() => {});
    }

    setTimeout(() => {
      gate.style.display = 'none';
    }, 1400);
  }

  enterBtn.addEventListener('click', openGate);
  enterBtn.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openGate();
    }
  });
}

/* ---- Music Toggle ---- */
function initMusicToggle() {
  const btn = document.getElementById('musicToggle');
  const music = document.getElementById('bgMusic');
  if (!btn || !music) return;

  btn.addEventListener('click', () => {
    if (music.paused) {
      music.play()
        .then(() => btn.classList.add('is-playing'))
        .catch(() => {});
      btn.setAttribute('aria-label', 'Pause background music');
    } else {
      music.pause();
      btn.classList.remove('is-playing');
      btn.setAttribute('aria-label', 'Play background music');
    }
  });
}

/* ---- RSVP Form Handling ---- */
function initRSVPForm() {
  const form = document.getElementById('rsvp-form');
  const popup = document.getElementById('rsvpPopup');
  const closeBtn = document.getElementById('rsvpPopupClose');

  if (!form || !popup) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Simple validation check
    const name = document.getElementById('rsvp-name').value;
    const mobile = document.getElementById('rsvp-mobile').value;
    if (!name || !mobile) {
      alert('Please enter your name and mobile number.');
      return;
    }

    popup.classList.add('active');
    popup.setAttribute('aria-hidden', 'false');
    form.reset();
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      popup.classList.remove('active');
      popup.setAttribute('aria-hidden', 'true');
    });
  }
}

/* ---- Fullscreen Gallery Lightbox ---- */
function initLightbox() {
  const lightbox = document.getElementById('lightbox');
  const img = document.getElementById('lightboxImg');
  const caption = document.getElementById('lightboxCaption');
  const closeBtn = document.getElementById('lightboxClose');
  const prevBtn = document.getElementById('lightboxPrev');
  const nextBtn = document.getElementById('lightboxNext');
  
  if (!lightbox || !img) return;

  let currentIndex = 0;
  const galleryItems = Array.from(document.querySelectorAll('.gallery-item'));

  galleryItems.forEach((item, index) => {
    item.addEventListener('click', () => {
      currentIndex = index;
      const imageEl = item.querySelector('img');
      const src = imageEl ? (imageEl.src || imageEl.dataset.src) : '';
      const altText = imageEl ? (imageEl.alt || 'Sneha & Jeffin') : 'Sneha & Jeffin';
      openLightbox(src, altText);
    });
  });

  function openLightbox(src, text) {
    img.src = src;
    if (caption) caption.textContent = text;
    lightbox.classList.add('active');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    lightbox.setAttribute('aria-hidden', 'true');
    if (!document.body.classList.contains('gate-active')) {
      document.body.style.overflow = '';
    }
  }

  function showNext() {
    if (!galleryItems.length) return;
    currentIndex = (currentIndex + 1) % galleryItems.length;
    const item = galleryItems[currentIndex];
    const imageEl = item.querySelector('img');
    if (imageEl) {
      img.src = imageEl.src || imageEl.dataset.src;
      if (caption) caption.textContent = imageEl.alt || 'Sneha & Jeffin';
    }
  }

  function showPrev() {
    if (!galleryItems.length) return;
    currentIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
    const item = galleryItems[currentIndex];
    const imageEl = item.querySelector('img');
    if (imageEl) {
      img.src = imageEl.src || imageEl.dataset.src;
      if (caption) caption.textContent = imageEl.alt || 'Sneha & Jeffin';
    }
  }

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') showNext();
    if (e.key === 'ArrowLeft') showPrev();
  });

  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  if (prevBtn) prevBtn.addEventListener('click', showPrev);
  if (nextBtn) nextBtn.addEventListener('click', showNext);

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox || e.target.classList.contains('lightbox-container')) {
      closeLightbox();
    }
  });
}
