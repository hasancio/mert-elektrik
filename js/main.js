/**
 * MERT ELEKTRİK SİSTEMLERİ - Resmî Web Sitesi Etkileşim Scripti
 * Yetkili: Mehmet Baş (Elektrik Teknisyeni / Yetkili Fen Adamı)
 * İletişim: 0551 530 92 05 - Merzifon / AMASYA
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Yapışkan Menü (Sticky Header)
  const header = document.querySelector('.site-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // 2. Mobil Hamburger Menü
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const navMenu = document.getElementById('navMenu');

  if (mobileMenuBtn && navMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      navMenu.classList.toggle('open');
      const isOpen = navMenu.classList.contains('open');
      mobileMenuBtn.setAttribute('aria-expanded', isOpen);
    });

    // Menü bağlantısına tıklandığında menüyü kapat
    navMenu.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
      });
    });
  }

  // 3. Galeri Slider & Filtreleme Sistemi (Minimalist & Kaydırılabilir)
  const gallerySlider = document.getElementById('gallerySlider');
  const galleryPrevBtn = document.getElementById('galleryPrevBtn');
  const galleryNextBtn = document.getElementById('galleryNextBtn');
  const galleryDotsContainer = document.getElementById('gallerySliderDots');
  const galleryFilterBtns = document.querySelectorAll('.gallery-filters .filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-slider .gallery-item');

  if (gallerySlider && galleryItems.length > 0) {
    let galleryAutoSlide = null;
    let isGalleryInteracting = false;
    let galleryResumeTimer = null;

    function getVisibleItems() {
      return Array.from(galleryItems).filter(item => item.style.display !== 'none');
    }

    function renderGalleryDots() {
      if (!galleryDotsContainer) return;
      galleryDotsContainer.innerHTML = '';
      const visible = getVisibleItems();
      if (visible.length <= 1) {
        galleryDotsContainer.style.display = 'none';
        return;
      }
      galleryDotsContainer.style.display = 'flex';

      visible.forEach((item, idx) => {
        const dot = document.createElement('button');
        dot.className = `slider-dot ${idx === 0 ? 'active' : ''}`;
        dot.setAttribute('type', 'button');
        dot.setAttribute('aria-label', `${idx + 1}. Proje Görseli`);
        dot.addEventListener('click', () => {
          pauseGalleryAuto();
          scrollToGalleryIndex(idx);
        });
        galleryDotsContainer.appendChild(dot);
      });
    }

    function getActiveGalleryIndex() {
      const visible = getVisibleItems();
      if (visible.length === 0) return 0;
      const scrollPos = gallerySlider.scrollLeft;
      let minDiff = Infinity;
      let activeIdx = 0;

      visible.forEach((item, idx) => {
        const itemLeft = item.offsetLeft - gallerySlider.offsetLeft;
        const diff = Math.abs(itemLeft - scrollPos);
        if (diff < minDiff) {
          minDiff = diff;
          activeIdx = idx;
        }
      });
      return activeIdx;
    }

    function setActiveGalleryDot(idx) {
      if (!galleryDotsContainer) return;
      const dots = galleryDotsContainer.querySelectorAll('.slider-dot');
      dots.forEach((dot, dIdx) => {
        dot.classList.toggle('active', dIdx === idx);
      });
    }

    function updateNavButtons() {
      if (!galleryPrevBtn || !galleryNextBtn) return;
      const scrollLeft = gallerySlider.scrollLeft;
      const maxScroll = gallerySlider.scrollWidth - gallerySlider.clientWidth;

      if (maxScroll <= 10) {
        galleryPrevBtn.style.opacity = '0.35';
        galleryPrevBtn.style.pointerEvents = 'none';
        galleryNextBtn.style.opacity = '0.35';
        galleryNextBtn.style.pointerEvents = 'none';
        return;
      }
      galleryPrevBtn.style.opacity = scrollLeft <= 10 ? '0.35' : '1';
      galleryPrevBtn.style.pointerEvents = scrollLeft <= 10 ? 'none' : 'auto';
      galleryNextBtn.style.opacity = scrollLeft >= maxScroll - 10 ? '0.35' : '1';
      galleryNextBtn.style.pointerEvents = scrollLeft >= maxScroll - 10 ? 'none' : 'auto';
    }

    function scrollToGalleryIndex(idx) {
      const visible = getVisibleItems();
      if (idx >= 0 && idx < visible.length) {
        const target = visible[idx];
        const targetScroll = target.offsetLeft - gallerySlider.offsetLeft;
        gallerySlider.scrollTo({
          left: Math.max(0, targetScroll),
          behavior: 'smooth'
        });
        setActiveGalleryDot(idx);
      }
    }

    function scrollByStep(direction) {
      const visible = getVisibleItems();
      const cardWidth = visible[0] ? (visible[0].offsetWidth + 20) : 300;
      gallerySlider.scrollBy({
        left: direction * cardWidth,
        behavior: 'smooth'
      });
    }

    if (galleryPrevBtn) {
      galleryPrevBtn.addEventListener('click', () => {
        pauseGalleryAuto();
        scrollByStep(-1);
      });
    }

    if (galleryNextBtn) {
      galleryNextBtn.addEventListener('click', () => {
        pauseGalleryAuto();
        scrollByStep(1);
      });
    }

    // Scroll dinleyicisi: aktif nokta ve buton durumunu güncelle
    let gScrollDebounce;
    gallerySlider.addEventListener('scroll', () => {
      clearTimeout(gScrollDebounce);
      gScrollDebounce = setTimeout(() => {
        setActiveGalleryDot(getActiveGalleryIndex());
        updateNavButtons();
      }, 50);
    }, { passive: true });

    function pauseGalleryAuto() {
      isGalleryInteracting = true;
      if (galleryAutoSlide) clearInterval(galleryAutoSlide);
      clearTimeout(galleryResumeTimer);
      galleryResumeTimer = setTimeout(() => {
        isGalleryInteracting = false;
        startGalleryAutoSlide();
      }, 5000);
    }

    function startGalleryAutoSlide() {
      if (galleryAutoSlide) clearInterval(galleryAutoSlide);
      if (window.innerWidth <= 768) {
        galleryAutoSlide = setInterval(() => {
          if (isGalleryInteracting) return;
          const visible = getVisibleItems();
          if (visible.length <= 1) return;
          const currentIdx = getActiveGalleryIndex();
          const nextIdx = (currentIdx + 1) % visible.length;
          scrollToGalleryIndex(nextIdx);
        }, 4000);
      }
    }

    gallerySlider.addEventListener('touchstart', pauseGalleryAuto, { passive: true });
    gallerySlider.addEventListener('mouseenter', () => {
      isGalleryInteracting = true;
      if (galleryAutoSlide) clearInterval(galleryAutoSlide);
    });
    gallerySlider.addEventListener('mouseleave', () => {
      isGalleryInteracting = false;
      startGalleryAutoSlide();
    });

    // Kategori Filtreleme
    galleryFilterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        galleryFilterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filterValue = btn.getAttribute('data-filter');

        galleryItems.forEach(item => {
          const itemCategory = item.getAttribute('data-category');
          if (filterValue === 'all' || itemCategory === filterValue) {
            item.style.display = 'flex';
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
          } else {
            item.style.display = 'none';
            item.style.opacity = '0';
          }
        });

        gallerySlider.scrollTo({ left: 0, behavior: 'smooth' });
        renderGalleryDots();
        setTimeout(updateNavButtons, 200);
      });
    });

    // İlk kurulum
    renderGalleryDots();
    updateNavButtons();
    startGalleryAutoSlide();

    window.addEventListener('resize', () => {
      updateNavButtons();
      if (window.innerWidth <= 768) {
        startGalleryAutoSlide();
      } else if (galleryAutoSlide) {
        clearInterval(galleryAutoSlide);
      }
    });
  }

  // 4. Hizmet Seçim Butonları (Kartlardaki "Teklif / Bilgi Al" butonları formu otomatik doldurur)
  window.selectServiceAndScroll = function(serviceName) {
    const serviceSelect = document.getElementById('wizardService');
    const wizardSection = document.getElementById('teklif-al');

    if (serviceSelect) {
      serviceSelect.value = serviceName;
    }
    if (wizardSection) {
      wizardSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // 5. Hızlı Teklif / WhatsApp Mesaj Oluşturucu Formu
  const quoteForm = document.getElementById('quoteForm');
  if (quoteForm) {
    quoteForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('wizardName')?.value.trim() || 'Değerli Müşteri';
      const service = document.getElementById('wizardService')?.value || 'Elektrik Hizmeti';
      const address = document.getElementById('wizardAddress')?.value.trim() || 'Merzifon';
      const note = document.getElementById('wizardNote')?.value.trim() || 'Acil bilgi ve fiyat teklifi rica ediyorum.';

      // WhatsApp formatlı mesaj metni (Telefon zaten WhatsApp sohbetinde otomatik görünüyor)
      const message = `Merhaba Mehmet Usta (Mert Elektrik Sistemleri),\n\nWeb siteniz üzerinden servis/fiyat teklifi talebinde bulunuyorum:\n\n👤 *Ad Soyad:* ${name}\n⚡ *Talep Edilen Hizmet:* ${service}\n📍 *Bölge/Adres:* ${address}\n📝 *Not/Açıklama:* ${note}\n\nEn kısa sürede dönüşünüzü rica ederim.`;

      const encodedMessage = encodeURIComponent(message);
      const whatsappUrl = `https://wa.me/905515309205?text=${encodedMessage}`;

      showToast(`Talebiniz hazırlandı! WhatsApp üzerinden Mehmet Baş'a iletiliyor...`);

      setTimeout(() => {
        window.open(whatsappUrl, '_blank');
      }, 1000);
    });
  }

  // 6. İletişim Formu Bildirimi (İletişim Alanı)
  const contactForm = document.getElementById('directContactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const cName = document.getElementById('cName')?.value.trim();
      const cPhone = document.getElementById('cPhone')?.value.trim();
      const cMsg = document.getElementById('cMessage')?.value.trim();

      const text = `Merhaba Mert Elektrik,\n\nBen *${cName}* (${cPhone}).\nMesajım: ${cMsg}`;
      const url = `https://wa.me/905515309205?text=${encodeURIComponent(text)}`;

      showToast('Mesajınız WhatsApp iletimine yönlendiriliyor...');
      setTimeout(() => {
        window.open(url, '_blank');
      }, 1000);
    });
  }

  // 7. Toast Bildirim Fonksiyonu
  function showToast(message) {
    let toast = document.querySelector('.toast-notice');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'toast-notice';
      toast.innerHTML = `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#00D2FF" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
        <span class="toast-text">${message}</span>
      `;
      document.body.appendChild(toast);
    } else {
      toast.querySelector('.toast-text').textContent = message;
    }

    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 4500);
  }

  // 8. Navigasyon Aktif Link Takibi (IntersectionObserver)
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-menu .nav-link');
  const tabItems = document.querySelectorAll('.mobile-bottom-tabbar .tab-item');

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 140;
      const sectionHeight = section.offsetHeight;
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });

    tabItems.forEach(tab => {
      const href = tab.getAttribute('href');
      if (href && href.startsWith('#')) {
        tab.classList.toggle('active', href === `#${current}`);
      }
    });
  }, { passive: true });

  // 9. Hizmetler Otomatik Kayan Slider (Mobil)
  const servicesGrid = document.getElementById('servicesGrid');
  const sliderDots = document.querySelectorAll('#servicesSliderDots .slider-dot');

  if (servicesGrid && sliderDots.length > 0) {
    const cards = servicesGrid.querySelectorAll('.service-card');
    let autoSlideInterval = null;
    let isInteracting = false;
    let resumeTimer = null;

    function getActiveIndex() {
      const scrollPos = servicesGrid.scrollLeft;
      let minDiff = Infinity;
      let activeIdx = 0;

      cards.forEach((card, idx) => {
        const cardCenter = card.offsetLeft - servicesGrid.offsetLeft;
        const diff = Math.abs(cardCenter - scrollPos);
        if (diff < minDiff) {
          minDiff = diff;
          activeIdx = idx;
        }
      });
      return activeIdx;
    }

    function setActiveDot(index) {
      sliderDots.forEach((dot, idx) => {
        dot.classList.toggle('active', idx === index);
      });
    }

    function scrollToCard(index) {
      if (index >= 0 && index < cards.length) {
        const card = cards[index];
        const targetScroll = card.offsetLeft - servicesGrid.offsetLeft - 16;
        servicesGrid.scrollTo({
          left: Math.max(0, targetScroll),
          behavior: 'smooth'
        });
        setActiveDot(index);
      }
    }

    function advanceSlide() {
      if (window.innerWidth > 768 || isInteracting) return;
      const currentIdx = getActiveIndex();
      const nextIdx = (currentIdx + 1) % cards.length;
      scrollToCard(nextIdx);
    }

    function startAutoSlide() {
      stopAutoSlide();
      if (window.innerWidth <= 768) {
        autoSlideInterval = setInterval(advanceSlide, 3500);
      }
    }

    function stopAutoSlide() {
      if (autoSlideInterval) {
        clearInterval(autoSlideInterval);
        autoSlideInterval = null;
      }
    }

    function pauseAndResume() {
      isInteracting = true;
      stopAutoSlide();
      clearTimeout(resumeTimer);
      resumeTimer = setTimeout(() => {
        isInteracting = false;
        startAutoSlide();
      }, 4000);
    }

    // Scroll olduğunda aktif noktayı anlık güncelle
    let scrollDebounce;
    servicesGrid.addEventListener('scroll', () => {
      clearTimeout(scrollDebounce);
      scrollDebounce = setTimeout(() => {
        setActiveDot(getActiveIndex());
      }, 70);
    }, { passive: true });

    // Kullanıcı dokunma ve fare etkileşimleri
    servicesGrid.addEventListener('touchstart', pauseAndResume, { passive: true });
    servicesGrid.addEventListener('touchmove', pauseAndResume, { passive: true });
    servicesGrid.addEventListener('mouseenter', () => {
      isInteracting = true;
      stopAutoSlide();
    });
    servicesGrid.addEventListener('mouseleave', () => {
      isInteracting = false;
      startAutoSlide();
    });

    // Noktalara tıklayarak istenen karta gitme
    sliderDots.forEach((dot, idx) => {
      dot.addEventListener('click', () => {
        pauseAndResume();
        scrollToCard(idx);
      });
    });

    // Sayfa açıldığında başlat
    startAutoSlide();

    window.addEventListener('resize', () => {
      if (window.innerWidth <= 768) {
        startAutoSlide();
      } else {
        stopAutoSlide();
      }
    });
  }

  // ==================== YUKARI ÇIK BUTONU (SCROLL TO TOP) ====================
  const scrollTopBtn = document.getElementById('scrollTopBtn');
  if (scrollTopBtn) {
    const handleScrollTopVisibility = () => {
      // 300px aşağı inildiğinde veya sayfa altına yaklaşıldığında butonu göster
      if (window.scrollY > 300) {
        scrollTopBtn.classList.add('visible');
      } else {
        scrollTopBtn.classList.remove('visible');
      }
    };

    window.addEventListener('scroll', handleScrollTopVisibility, { passive: true });
    handleScrollTopVisibility();

    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
});
