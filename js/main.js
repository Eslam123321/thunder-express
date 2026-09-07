/**
 * ==============================================================================
 * Thunder Express - Interactive Logic & User Experience Engine
 * Handles Calculator, Tracking Simulator, WhatsApp Dispatcher, Modals & Navigation
 * ==============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Current Year Footer Update
  const currentYearEl = document.getElementById('currentYear');
  if (currentYearEl) {
    currentYearEl.textContent = new Date().getFullYear();
  }

  // 2. Fixed Floating Navbar & High-Precision ScrollSpy
  const navbar = document.getElementById('navbar');
  const scrollTopBtn = document.getElementById('scrollTopBtn');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = Array.from(document.querySelectorAll('section[id]'));

  function updateScrollSpy() {
    const scrollPos = window.scrollY;

    // Scrolled navbar styling
    if (navbar) {
      if (scrollPos > 30) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }

    // Back to top button visibility
    if (scrollTopBtn) {
      if (scrollPos > 400) {
        scrollTopBtn.classList.add('visible');
      } else {
        scrollTopBtn.classList.remove('visible');
      }
    }

    // Only run section scrollspy on pages that have multiple in-page hash links
    const isSinglePageApp = Array.from(navLinks).some(link => (link.getAttribute('href') || '').startsWith('#'));
    if (!isSinglePageApp) return;

    // Bottom of page check -> activate contact if present
    if ((window.innerHeight + window.scrollY) >= (document.documentElement.scrollHeight - 50)) {
      const contactLink = document.querySelector('.nav-link[href="#contact"]');
      if (contactLink) {
        navLinks.forEach(link => link.classList.remove('active'));
        contactLink.classList.add('active');
        return;
      }
    }

    // Find current section in view
    const triggerPoint = scrollPos + 180;
    let currentId = '';

    for (let i = sections.length - 1; i >= 0; i--) {
      const section = sections[i];
      const sectionTop = section.offsetTop;
      if (triggerPoint >= sectionTop) {
        currentId = section.getAttribute('id');
        break;
      }
    }

    if (!currentId && sections.length > 0) {
      currentId = sections[0].getAttribute('id');
    }

    if (currentId) {
      navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === `#${currentId}`) {
          link.classList.add('active');
        } else if (href && href.startsWith('#')) {
          link.classList.remove('active');
        }
      });
    }
  }

  window.addEventListener('scroll', updateScrollSpy, { passive: true });
  window.addEventListener('resize', updateScrollSpy, { passive: true });
  updateScrollSpy();

  // Smooth scroll offset for nav links
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (targetId && targetId.startsWith('#')) {
        const targetSection = document.querySelector(targetId);
        if (targetSection) {
          e.preventDefault();
          const targetOffset = targetSection.offsetTop - 80;
          window.scrollTo({
            top: targetOffset,
            behavior: 'smooth'
          });
          navLinks.forEach(l => l.classList.remove('active'));
          link.classList.add('active');
        }
      }
    });
  });

  // Scroll to top action
  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // 3. Mobile Navigation Menu Toggle
  const mobileMenuToggle = document.getElementById('mobileMenuToggle');
  const navMenu = document.getElementById('navMenu');

  if (mobileMenuToggle && navMenu) {
    mobileMenuToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      mobileMenuToggle.classList.toggle('active');
      navMenu.classList.toggle('active');
    });

    // Close menu when clicking on nav link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenuToggle.classList.remove('active');
        navMenu.classList.remove('active');
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!navMenu.contains(e.target) && !mobileMenuToggle.contains(e.target) && navMenu.classList.contains('active')) {
        mobileMenuToggle.classList.remove('active');
        navMenu.classList.remove('active');
      }
    });
  }

  // 4. Interactive Shipping Request Form
  const calcName = document.getElementById('calcName');
  const calcGov = document.getElementById('calcGov');
  const calcWeight = document.getElementById('calcWeight');
  const calcService = document.getElementById('calcService');
  const calcPhone = document.getElementById('calcPhone');
  const calcCodAmount = document.getElementById('calcCodAmount');
  const calcNotes = document.getElementById('calcNotes');
  const resDeliveryTime = document.getElementById('resDeliveryTime');
  const resEstimatedPrice = document.getElementById('resEstimatedPrice');
  const sendCalcToWhatsappBtn = document.getElementById('sendCalcToWhatsappBtn');

  function calculateShipping() {
    if (!calcGov || !calcWeight || !calcService) return;

    const selectedGovOption = calcGov.options[calcGov.selectedIndex];
    const basePrice = parseFloat(selectedGovOption.getAttribute('data-base') || 45);
    const deliveryTime = selectedGovOption.getAttribute('data-time') || '24 - 48 ساعة';

    const selectedWeightOption = calcWeight.options[calcWeight.selectedIndex];
    const weightExtra = parseFloat(selectedWeightOption.getAttribute('data-extra') || 0);

    const selectedServiceOption = calcService.options[calcService.selectedIndex];
    const serviceFee = parseFloat(selectedServiceOption.getAttribute('data-fee') || 0);

    const totalPrice = basePrice + weightExtra + serviceFee;

    // Update UI
    if (resDeliveryTime) resDeliveryTime.textContent = deliveryTime;
    if (resEstimatedPrice) resEstimatedPrice.textContent = totalPrice;

    const nameVal = (calcName && calcName.value.trim()) ? calcName.value.trim() : 'غير محدد';
    const phoneVal = (calcPhone && calcPhone.value.trim()) ? calcPhone.value.trim() : 'غير محدد';
    const notesVal = (calcNotes && calcNotes.value.trim()) ? calcNotes.value.trim() : 'لا توجد ملاحظات إضافية';

    return {
      name: nameVal,
      gov: selectedGovOption.text,
      time: deliveryTime,
      weight: selectedWeightOption.text,
      service: selectedServiceOption.text,
      phone: phoneVal,
      codAmount: (calcCodAmount && calcCodAmount.value) ? `${calcCodAmount.value} ج.م` : 'بدون تحصيل',
      notes: notesVal,
      price: totalPrice
    };
  }

  // Attach change listeners to calculator elements
  if (calcName) calcName.addEventListener('input', calculateShipping);
  if (calcGov) calcGov.addEventListener('change', calculateShipping);
  if (calcWeight) calcWeight.addEventListener('change', calculateShipping);
  if (calcService) calcService.addEventListener('change', calculateShipping);
  if (calcPhone) calcPhone.addEventListener('input', calculateShipping);
  if (calcCodAmount) calcCodAmount.addEventListener('input', calculateShipping);
  if (calcNotes) calcNotes.addEventListener('input', calculateShipping);

  // Initialize calculator on page load
  calculateShipping();

  // Send calculated quote to WhatsApp
  if (sendCalcToWhatsappBtn) {
    sendCalcToWhatsappBtn.addEventListener('click', () => {
      const data = calculateShipping();
      const whatsappNumber = '201041878806';
      
      const message = 
`⚡ *طلب حجز شحنة جديدة | Thunder Express*
----------------------------------
👤 *الاسم / المتجر:* ${data.name}
📞 *رقم الموبايل للتواصل:* ${data.phone}
📍 *محافظة الوجهة:* ${data.gov}
⏱️ *مدة التوصيل المتوقعة:* ${data.time}
📦 *وزن الطرد:* ${data.weight}
🛠️ *نوع الخدمة:* ${data.service}
💰 *مبلغ التحصيل (COD):* ${data.codAmount}
📝 *تفاصيل إضافية:* ${data.notes}
----------------------------------
برجاء تأكيد حجز المندوب واستلام الشحنة.`;

      const encodedMsg = encodeURIComponent(message);
      const url = `https://wa.me/${whatsappNumber}?text=${encodedMsg}`;
      window.open(url, '_blank');
      showToast('جاري تحويلك إلى واتساب لتأكيد الشحنة ⚡', 'success');
    });
  }

  // 5. Zone Cards Quick Action (Selects zone in order form or modal)
  const selectZoneBtns = document.querySelectorAll('.select-zone-btn');
  selectZoneBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const zoneType = e.currentTarget.getAttribute('data-zone');
      
      // Select appropriate option in shipping request form
      if (calcGov) {
        for (let i = 0; i < calcGov.options.length; i++) {
          if (calcGov.options[i].getAttribute('data-zone') === zoneType) {
            calcGov.selectedIndex = i;
            calculateShipping();
            break;
          }
        }
      }

      // Smooth scroll to shipping request section
      const calcSection = document.getElementById('calculator');
      if (calcSection) {
        calcSection.scrollIntoView({ behavior: 'smooth' });
        showToast('تم تحديد المنطقة في نموذج طلب الشحن ⚡', 'info');
      }
    });
  });

  // 6. Order Booking Modal & Form
  const orderModal = document.getElementById('orderModal');
  const openOrderModalBtn = document.getElementById('openOrderModalBtn');
  const heroOrderBtn = document.getElementById('heroOrderBtn');
  const whyOrderBtn = document.getElementById('whyOrderBtn');
  const ctaOrderModalBtn = document.getElementById('ctaOrderModalBtn');
  const calcOrderModalTrigger = document.getElementById('calcOrderModalTrigger');
  const closeOrderModalBtn = document.getElementById('closeOrderModalBtn');
  const cancelOrderModalBtn = document.getElementById('cancelOrderModalBtn');
  const orderForm = document.getElementById('orderForm');

  function openModal() {
    if (orderModal) {
      orderModal.classList.add('active');
      document.body.classList.add('no-scroll');
    }
  }

  function closeModal() {
    if (orderModal) {
      orderModal.classList.remove('active');
      document.body.classList.remove('no-scroll');
    }
  }

  if (openOrderModalBtn) openOrderModalBtn.addEventListener('click', openModal);
  if (heroOrderBtn) heroOrderBtn.addEventListener('click', openModal);
  if (whyOrderBtn) whyOrderBtn.addEventListener('click', openModal);
  if (ctaOrderModalBtn) ctaOrderModalBtn.addEventListener('click', openModal);
  if (calcOrderModalTrigger) calcOrderModalTrigger.addEventListener('click', openModal);

  if (closeOrderModalBtn) closeOrderModalBtn.addEventListener('click', closeModal);
  if (cancelOrderModalBtn) cancelOrderModalBtn.addEventListener('click', closeModal);

  if (orderModal) {
    orderModal.addEventListener('click', (e) => {
      if (e.target === orderModal) {
        closeModal();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && orderModal.classList.contains('active')) {
        closeModal();
      }
    });
  }

  // Handle Order Form Submission via WhatsApp
  if (orderForm) {
    orderForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const senderName = document.getElementById('modalSenderName')?.value || '';
      const senderPhone = document.getElementById('modalSenderPhone')?.value || '';
      const pickupAddress = document.getElementById('modalPickupAddress')?.value || '';
      const destGov = document.getElementById('modalDestGov')?.value || '';
      const cod = document.getElementById('modalCod')?.value || 'لا يوجد (مدفوع مسبقاً)';
      const notes = document.getElementById('modalNotes')?.value || 'لا توجد ملاحظات إضافية';

      const whatsappNumber = '201041878806';
      const orderMessage = 
`⚡ *طلب مندوب استلام جديد | Thunder Express*
===============================
👤 *اسم الراسل/المتجر:* ${senderName}
📞 *هاتف الراسل:* ${senderPhone}
📍 *عنوان استلام الطرد:* ${pickupAddress}
🚚 *محافظة وجهة التسليم:* ${destGov}
💵 *مبلغ التحصيل (COD):* ${cod}
📝 *ملاحظات الطرد:* ${notes}
===============================
برجاء إرسال المندوب في أقرب موعد.`;

      const encodedUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(orderMessage)}`;
      window.open(encodedUrl, '_blank');

      closeModal();
      orderForm.reset();
      showToast('تم إرسال طلب الشحن بنجاح! جاري التواصل معك عبر واتساب ⚡', 'success');
    });
  }

  // 8. FAQ Accordion Logic
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    if (question) {
      question.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        
        // Close all other FAQ items
        faqItems.forEach(otherItem => {
          otherItem.classList.remove('active');
          const qBtn = otherItem.querySelector('.faq-question');
          if (qBtn) qBtn.setAttribute('aria-expanded', 'false');
        });

        // Toggle clicked item
        if (!isActive) {
          item.classList.add('active');
          question.setAttribute('aria-expanded', 'true');
        }
      });
    }
  });

  // 9. Toast Notification System
  function showToast(message, type = 'info') {
    const toastContainer = document.getElementById('toastContainer');
    if (!toastContainer) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    
    let iconHtml = '<i class="fa-solid fa-bolt text-primary"></i>';
    if (type === 'success') iconHtml = '<i class="fa-solid fa-circle-check text-success"></i>';
    if (type === 'error') iconHtml = '<i class="fa-solid fa-triangle-exclamation text-warning"></i>';

    toast.innerHTML = `
      ${iconHtml}
      <span>${message}</span>
    `;

    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(50px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => {
        toast.remove();
      }, 300);
    }, 4000);
  }

  // Global access to showToast for other interactions if needed
  window.showToast = showToast;

  // 10. Hero Dynamic Background Carousel Engine
  const heroBgSlides = document.querySelectorAll('.hero-bg-slide');
  const heroSliderDots = document.querySelectorAll('.hero-slider-dot');
  let currentHeroSlide = 0;
  let heroSlideInterval = null;

  function setHeroSlide(index) {
    if (!heroBgSlides.length) return;
    
    // Normalize index
    currentHeroSlide = (index + heroBgSlides.length) % heroBgSlides.length;

    heroBgSlides.forEach((slide, i) => {
      if (i === currentHeroSlide) {
        slide.classList.add('active');
      } else {
        slide.classList.remove('active');
      }
    });

    heroSliderDots.forEach((dot, i) => {
      if (i === currentHeroSlide) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
  }

  function startHeroSliderAutoPlay() {
    if (heroSlideInterval) clearInterval(heroSlideInterval);
    heroSlideInterval = setInterval(() => {
      setHeroSlide(currentHeroSlide + 1);
    }, 3000);
  }

  if (heroBgSlides.length > 0) {
    startHeroSliderAutoPlay();

    heroSliderDots.forEach((dot) => {
      dot.addEventListener('click', (e) => {
        const slideIndex = parseInt(e.currentTarget.getAttribute('data-slide'), 10);
        setHeroSlide(slideIndex);
        startHeroSliderAutoPlay(); // Reset timer on manual interaction
      });
    });

    // Pause on hover over hero section
    const heroSection = document.getElementById('hero');
    if (heroSection) {
      heroSection.addEventListener('mouseenter', () => {
        if (heroSlideInterval) clearInterval(heroSlideInterval);
      });
      heroSection.addEventListener('mouseleave', () => {
        startHeroSliderAutoPlay();
      });
    }
  }
});

