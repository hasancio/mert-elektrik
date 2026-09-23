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

  // 3. Galeri Filtreleme
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Aktif buton sınıfını güncelle
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      galleryItems.forEach(item => {
        const itemCategory = item.getAttribute('data-category');
        if (filterValue === 'all' || itemCategory === filterValue) {
          item.style.display = 'block';
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
          }, 50);
        } else {
          item.style.opacity = '0';
          item.style.transform = 'scale(0.95)';
          setTimeout(() => {
            item.style.display = 'none';
          }, 300);
        }
      });
    });
  });

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
      const phone = document.getElementById('wizardPhone')?.value.trim() || 'Belirtilmedi';
      const service = document.getElementById('wizardService')?.value || 'Elektrik Hizmeti';
      const address = document.getElementById('wizardAddress')?.value.trim() || 'Merzifon';
      const note = document.getElementById('wizardNote')?.value.trim() || 'Acil bilgi ve fiyat teklifi rica ediyorum.';

      // WhatsApp formatlı mesaj metni
      const message = `Merhaba Mehmet Usta (Mert Elektrik Sistemleri),\n\nWeb siteniz üzerinden servis/fiyat teklifi talebinde bulunuyorum:\n\n👤 *Ad Soyad:* ${name}\n📞 *Telefon:* ${phone}\n⚡ *Talep Edilen Hizmet:* ${service}\n📍 *Bölge/Adres:* ${address}\n📝 *Not/Açıklama:* ${note}\n\nEn kısa sürede dönüşünüzü rica ederim.`;

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
});
