// ==========================================================================
// LUXE SALON & SPA — Interactive Client-Side Engine
// Pure Vanilla JavaScript (ES6+)
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  // Init Lucide Icons
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // Set default appointment date to tomorrow
  const dateInput = document.getElementById('b-date');
  if (dateInput) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    dateInput.value = tomorrow.toISOString().split('T')[0];
    dateInput.min = tomorrow.toISOString().split('T')[0];
  }
});

// Mobile Navigation Toggle
function toggleMobileMenu() {
  const navMenu = document.getElementById('nav-menu');
  if (navMenu) {
    navMenu.classList.toggle('active');
  }
}

// Close mobile menu when clicking a link
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    const navMenu = document.getElementById('nav-menu');
    if (navMenu) {
      navMenu.classList.remove('active');
    }
  });
});

// Booking Modal Controls
function openBookingModal(serviceName = '', price = 0) {
  const modal = document.getElementById('booking-modal');
  const serviceSelect = document.getElementById('b-service');
  const modalTitle = document.getElementById('modal-service-title');

  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  if (serviceName && serviceSelect) {
    // Attempt matching option
    for (let opt of serviceSelect.options) {
      if (opt.text.toLowerCase().includes(serviceName.toLowerCase())) {
        opt.selected = true;
        break;
      }
    }
    if (modalTitle) {
      modalTitle.textContent = `Reserve: ${serviceName}`;
    }
  } else if (modalTitle) {
    modalTitle.textContent = 'Book Your Appointment';
  }
}

function closeBookingModal() {
  const modal = document.getElementById('booking-modal');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

// Close modal on outside backdrop click
window.addEventListener('click', (e) => {
  const modal = document.getElementById('booking-modal');
  if (e.target === modal) {
    closeBookingModal();
  }
});

// Gallery Filter
function filterGallery(category) {
  const buttons = document.querySelectorAll('.gallery-filter-btn');
  buttons.forEach(btn => btn.classList.remove('active'));

  if (event && event.target) {
    event.target.classList.add('active');
  }

  const items = document.querySelectorAll('.gallery-item');
  items.forEach(item => {
    if (category === 'all' || item.dataset.category === category) {
      item.style.display = 'block';
    } else {
      item.style.display = 'none';
    }
  });
}

// Handle Booking Form Submit
function handleBookingSubmit(e) {
  e.preventDefault();
  const service = document.getElementById('b-service').value;
  const stylist = document.getElementById('b-stylist').value;
  const date = document.getElementById('b-date').value;
  const time = document.getElementById('b-time').value;
  const name = document.getElementById('b-name').value;

  alert(`🎉 Thank you, ${name}! Your appointment for "${service}" with ${stylist} on ${date} at ${time} has been reserved! A confirmation SMS and email has been sent.`);
  
  closeBookingModal();
  e.target.reset();
}

// Handle Contact Form Submit
function handleContactSubmit(e) {
  e.preventDefault();
  const name = document.getElementById('c-name').value;
  alert(`✨ Thank you, ${name}! Your inquiry has been received. Our concierge team will reach out within 2-4 hours.`);
  e.target.reset();
}
