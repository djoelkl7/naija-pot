// ===========================================
// BUKKA — Premium Nigerian Cuisine
// Shared JavaScript
// ===========================================

(function() {
  'use strict';

  // ----- Header scroll effect -----
  const header = document.querySelector('.header');
  if (header) {
    const onScroll = () => {
      if (window.scrollY > 50) header.classList.add('scrolled');
      else header.classList.remove('scrolled');
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // ----- Mobile menu toggle -----
  const menuToggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav');
  if (menuToggle && nav) {
    menuToggle.addEventListener('click', () => {
      nav.classList.toggle('open');
    });
    nav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => nav.classList.remove('open'));
    });
  }

  // ----- Reveal-on-scroll -----
  const reveals = document.querySelectorAll('.reveal, .reveal-stagger');
  if ('IntersectionObserver' in window && reveals.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

    reveals.forEach(el => observer.observe(el));
  } else {
    reveals.forEach(el => el.classList.add('in-view'));
  }

  // ----- Tab switcher (featured dishes) -----
  const tabs = document.querySelectorAll('.tab');
  const dishGroups = document.querySelectorAll('[data-dish-group]');
  if (tabs.length && dishGroups.length) {
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const target = tab.dataset.tab;
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        dishGroups.forEach(group => {
          if (group.dataset.dishGroup === target) {
            group.style.display = 'grid';
          } else {
            group.style.display = 'none';
          }
        });
      });
    });
  }

  // ----- Menu page filter (pills + mobile dropdown) -----
  const filterBtns = document.querySelectorAll('.filter-btn');
  const filterSelect = document.querySelector('.menu-filter-select');
  const menuSections = document.querySelectorAll('[data-menu-section]');
  if ((filterBtns.length || filterSelect) && menuSections.length) {
    function applyFilter(target, doScroll) {
      filterBtns.forEach(b => b.classList.toggle('active', b.dataset.filter === target));
      if (filterSelect) filterSelect.value = target;

      if (target === 'all') {
        menuSections.forEach(s => s.style.display = 'block');
      } else {
        menuSections.forEach(s => {
          s.style.display = (s.dataset.menuSection === target) ? 'block' : 'none';
        });
      }

      if (doScroll && target !== 'all') {
        const visible = document.querySelector(`[data-menu-section="${target}"]`);
        if (visible) {
          const offset = window.innerWidth <= 600 ? 130 : 180;
          window.scrollTo({ top: visible.offsetTop - offset, behavior: 'smooth' });
        }
      }
    }

    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => applyFilter(btn.dataset.filter, true));
    });
    if (filterSelect) {
      filterSelect.addEventListener('change', () => applyFilter(filterSelect.value, true));
    }
  }

  // ----- Contact form (WhatsApp redirect) -----
  const contactForm = document.querySelector('#contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = contactForm.querySelector('[name="name"]').value.trim();
      const email = contactForm.querySelector('[name="email"]').value.trim();
      const phone = contactForm.querySelector('[name="phone"]').value.trim();
      const message = contactForm.querySelector('[name="message"]').value.trim();

      const text = `Hello BUKKA! 👋%0A%0A*Name:* ${encodeURIComponent(name)}%0A*Email:* ${encodeURIComponent(email)}%0A*Phone:* ${encodeURIComponent(phone)}%0A%0A*Message:*%0A${encodeURIComponent(message)}`;
      window.open(`https://wa.me/447501087091?text=${text}`, '_blank');
    });
  }

  // ----- Subtle parallax on hero image -----
  const heroImage = document.querySelector('.hero-image-circle');
  if (heroImage && window.innerWidth > 900) {
    window.addEventListener('mousemove', (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 20;
      const y = (e.clientY / window.innerHeight - 0.5) * 20;
      heroImage.style.transform = `translate(${x}px, ${y}px)`;
    }, { passive: true });
  }



  // ----- Interactive Solid Dish modal -----
  const solidModal = document.querySelector('#solid-modal');
  if (solidModal) {
    const modalImg = solidModal.querySelector('.solid-modal-head img');
    const modalTitle = solidModal.querySelector('.solid-modal-title');
    const modalPrice = solidModal.querySelector('.solid-modal-price');
    const orderBtn = solidModal.querySelector('.solid-modal-order');
    const hint = solidModal.querySelector('.solid-modal-hint');
    let currentDish = '';
    let selectedSoup = '';
    let selectedProtein = '';
    let selectedExtra = 'none';

    const soupChips = solidModal.querySelectorAll('[data-soup]');
    const proteinChips = solidModal.querySelectorAll('[data-protein]');
    const extraChips = solidModal.querySelectorAll('[data-extra]');

    function currentPrice() {
      return selectedExtra !== 'none' ? 21 : 18;
    }

    function refreshState() {
      modalPrice.textContent = '£' + currentPrice();
      if (selectedSoup && selectedProtein) {
        orderBtn.disabled = false;
        hint.style.display = 'none';
      } else {
        orderBtn.disabled = true;
        hint.style.display = 'block';
      }
    }

    function openModal(dishName, imgSrc) {
      currentDish = dishName;
      selectedSoup = '';
      selectedProtein = '';
      selectedExtra = 'none';
      modalTitle.textContent = dishName;
      modalImg.src = imgSrc;
      modalImg.alt = dishName;
      soupChips.forEach(c => c.classList.remove('selected'));
      proteinChips.forEach(c => c.classList.remove('selected'));
      // reset extra -> "No Extra" selected by default
      extraChips.forEach(c => c.classList.toggle('selected', c.dataset.extra === 'none'));
      refreshState();
      solidModal.classList.add('open');
      document.body.style.overflow = 'hidden';
    }

    function closeModal() {
      solidModal.classList.remove('open');
      document.body.style.overflow = '';
    }

    // Wire up the solid dish cards
    document.querySelectorAll('[data-solid-dish]').forEach(card => {
      card.addEventListener('click', () => {
        openModal(card.dataset.solidDish, card.dataset.solidImg);
      });
    });

    // Step 1 - soup (single-select, required)
    soupChips.forEach(chip => {
      chip.addEventListener('click', () => {
        soupChips.forEach(c => c.classList.remove('selected'));
        chip.classList.add('selected');
        selectedSoup = chip.dataset.soup;
        refreshState();
      });
    });

    // Step 2 - protein (single-select, required)
    proteinChips.forEach(chip => {
      chip.addEventListener('click', () => {
        proteinChips.forEach(c => c.classList.remove('selected'));
        chip.classList.add('selected');
        selectedProtein = chip.dataset.protein;
        refreshState();
      });
    });

    // Step 3 - extra (single-select, optional; "No Extra" default; extra = +£3)
    extraChips.forEach(chip => {
      chip.addEventListener('click', () => {
        extraChips.forEach(c => c.classList.remove('selected'));
        chip.classList.add('selected');
        selectedExtra = chip.dataset.extra;
        refreshState();
      });
    });

    // Order button -> WhatsApp
    orderBtn.addEventListener('click', () => {
      if (!selectedSoup || !selectedProtein) return;
      let msg = `Hello BUKKA! 👋%0A%0AI'd like to order:%0A*${encodeURIComponent(currentDish)}* — £${currentPrice()}%0A%0A*Soup:* ${encodeURIComponent(selectedSoup)}%0A*Protein:* ${encodeURIComponent(selectedProtein)}`;
      if (selectedExtra !== 'none') {
        msg += `%0A*Extra:* ${encodeURIComponent(selectedExtra)} (+£3)`;
      }
      window.open(`https://wa.me/447366343643?text=${msg}`, '_blank');
    });

    // Close handlers
    solidModal.querySelector('.solid-modal-close').addEventListener('click', closeModal);
    solidModal.addEventListener('click', (e) => {
      if (e.target === solidModal) closeModal();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && solidModal.classList.contains('open')) closeModal();
    });
  }

})();
