// ========================================
// SMOOTH SCROLL & ANIMATIONS
// ========================================

// Intersection Observer for fade-in animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("fade-in");
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

// Observe all cards and sections
document.addEventListener("DOMContentLoaded", () => {
  const cards = document.querySelectorAll(".card");
  const sections = document.querySelectorAll("section");

  cards.forEach((card) => observer.observe(card));
  sections.forEach((section) => observer.observe(section));
});

// ========================================
// NAVBAR SCROLL EFFECT
// ========================================
let lastScroll = 0;
const header = document.querySelector(".header");

window.addEventListener("scroll", () => {
  const currentScroll = window.pageYOffset;

  if (currentScroll > 100) {
    header.style.boxShadow = "0 4px 20px rgba(0, 0, 0, 0.1)";
  } else {
    header.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.08)";
  }

  lastScroll = currentScroll;
});

// ========================================
// ACTIVE NAVIGATION LINK
// ========================================
const navLinks = document.querySelectorAll(".navbar__link");

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.forEach((l) => l.classList.remove("active"));
    link.classList.add("active");
  });
});

// ========================================
// BUTTON RIPPLE EFFECT
// ========================================
const buttons = document.querySelectorAll(".button");

buttons.forEach((button) => {
  button.addEventListener("click", function (e) {
    const ripple = document.createElement("span");
    const rect = this.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    ripple.style.width = ripple.style.height = size + "px";
    ripple.style.left = x + "px";
    ripple.style.top = y + "px";
    ripple.classList.add("ripple");

    this.appendChild(ripple);

    setTimeout(() => ripple.remove(), 600);
  });
});

// Add ripple CSS dynamically
const style = document.createElement("style");
style.textContent = `
    .button {
        position: relative;
        overflow: hidden;
    }
    
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.6);
        transform: scale(0);
        animation: ripple-animation 0.6s ease-out;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ========================================
// SLIDER PAUSE ON HOVER
// ========================================
const sliderTrack = document.querySelector(".slider__track");

if (sliderTrack) {
  sliderTrack.addEventListener("mouseenter", () => {
    sliderTrack.style.animationPlayState = "paused";
  });

  sliderTrack.addEventListener("mouseleave", () => {
    sliderTrack.style.animationPlayState = "running";
  });
}

// ========================================
// CARD TILT EFFECT (3D)
// ========================================
const tiltCards = document.querySelectorAll(".card");

tiltCards.forEach((card) => {
  card.addEventListener("mousemove", (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = (y - centerY) / 20;
    const rotateY = (centerX - x) / 20;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
  });

  card.addEventListener("mouseleave", () => {
    card.style.transform =
      "perspective(1000px) rotateX(0) rotateY(0) translateY(0)";
  });
});

// ========================================
// GRADIENT TEXT ANIMATION
// ========================================
const gradientTexts = document.querySelectorAll(".gradient-text");

gradientTexts.forEach((text) => {
  text.style.backgroundSize = "200% 200%";
});

// ========================================
// SCROLL TO TOP BUTTON
// ========================================
const scrollToTopBtn = document.createElement("button");
scrollToTopBtn.innerHTML = "↑";
scrollToTopBtn.className = "scroll-to-top";
scrollToTopBtn.style.cssText = `
    position: fixed;
    bottom: 30px;
    right: 30px;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background: linear-gradient(135deg, #00FF87, #00D9FF);
    color: #0A1628;
    border: none;
    font-size: 24px;
    cursor: pointer;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
    z-index: 1000;
    box-shadow: 0 4px 16px rgba(0, 255, 135, 0.3);
`;

document.body.appendChild(scrollToTopBtn);

window.addEventListener("scroll", () => {
  if (window.pageYOffset > 300) {
    scrollToTopBtn.style.opacity = "1";
    scrollToTopBtn.style.visibility = "visible";
  } else {
    scrollToTopBtn.style.opacity = "0";
    scrollToTopBtn.style.visibility = "hidden";
  }
});

scrollToTopBtn.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
});

scrollToTopBtn.addEventListener("mouseenter", () => {
  scrollToTopBtn.style.transform = "scale(1.1)";
});

scrollToTopBtn.addEventListener("mouseleave", () => {
  scrollToTopBtn.style.transform = "scale(1)";
});

// ========================================
// PROMO POPUP AUTO-OPEN
// ========================================
function initPromoPopup() {
  const promoPopup = document.getElementById("promo-popup");
  if (!promoPopup) return;

  // Auto-open on every reload (better for testing/visibility)
  setTimeout(() => {
    // Check if the popover is NOT already open before showing
    if (typeof promoPopup.showPopover === "function" && !promoPopup.matches(":popover-open")) {
      promoPopup.showPopover();
    }
  }, 2000); // 2 seconds delay

    // Add listener to close on backdrop click (robustness)
    promoPopup.addEventListener("click", (e) => {
      if (e.target === promoPopup) {
        promoPopup.hidePopover();
      }
  });
}

document.addEventListener("DOMContentLoaded", initPromoPopup);

// ========================================
// CONSOLE MESSAGE
// ========================================
console.log(
  "%c🚀 NoSeumCode - Code ton avenir!",
  "color: #00FF87; font-size: 20px; font-weight: bold;",
);
console.log(
  "%cSite développé avec ❤️ et beaucoup de code",
  "color: #00D9FF; font-size: 14px;",
);
