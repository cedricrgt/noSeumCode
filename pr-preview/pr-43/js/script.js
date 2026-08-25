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

document.addEventListener("DOMContentLoaded", () => {
  const cards = document.querySelectorAll(".card");
  const sections = document.querySelectorAll("section");

  cards.forEach((card) => observer.observe(card));
  sections.forEach((section) => observer.observe(section));
});







const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const buttons = document.querySelectorAll(".button");

if (!prefersReducedMotion) {
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
}

const sliderTrack = document.querySelector(".slider__track");

if (sliderTrack && !prefersReducedMotion) {
  sliderTrack.addEventListener("mouseenter", () => {
    sliderTrack.style.animationPlayState = "paused";
  });

  sliderTrack.addEventListener("mouseleave", () => {
    sliderTrack.style.animationPlayState = "running";
  });
}

// Card 3D Tilt with requestAnimationFrame throttling
if (!prefersReducedMotion) {
  const tiltCards = document.querySelectorAll(".card");

  tiltCards.forEach((card) => {
    let ticking = false;

    card.addEventListener("mousemove", (e) => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const rect = card.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;

          const centerX = rect.width / 2;
          const centerY = rect.height / 2;

          const rotateX = (y - centerY) / 25;
          const rotateY = (centerX - x) / 25;

          card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
          ticking = false;
        });
        ticking = true;
      }
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "perspective(1000px) rotateX(0) rotateY(0) translateY(0)";
    });
  });
}

const gradientTexts = document.querySelectorAll(".gradient-text");

gradientTexts.forEach((text) => {
  text.style.backgroundSize = "200% 200%";
});

const scrollToTopBtn = document.createElement("button");
scrollToTopBtn.innerHTML = "↑";
scrollToTopBtn.className = "scroll-to-top";
scrollToTopBtn.setAttribute("aria-label", "Retour en haut de la page");
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
    font-weight: bold;
    cursor: pointer;
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.3s ease, visibility 0.3s ease, transform 0.2s ease;
    z-index: 1000;
    box-shadow: 0 4px 16px rgba(0, 255, 135, 0.3);
`;

document.body.appendChild(scrollToTopBtn);

window.addEventListener(
  "scroll",
  () => {
    if (window.scrollY > 300) {
      scrollToTopBtn.style.opacity = "1";
      scrollToTopBtn.style.visibility = "visible";
    } else {
      scrollToTopBtn.style.opacity = "0";
      scrollToTopBtn.style.visibility = "hidden";
    }
  },
  { passive: true }
);

scrollToTopBtn.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: prefersReducedMotion ? "auto" : "smooth",
  });
});

scrollToTopBtn.addEventListener("mouseenter", () => {
  if (!prefersReducedMotion) {
    scrollToTopBtn.style.transform = "scale(1.1)";
  }
});

scrollToTopBtn.addEventListener("mouseleave", () => {
  if (!prefersReducedMotion) {
    scrollToTopBtn.style.transform = "scale(1)";
  }
});






console.log(
  "%c🚀 NoSeumCode - Code ton avenir!",
  "color: #00FF87; font-size: 20px; font-weight: bold;",
);
console.log(
  "%cSite développé avec ❤️ et beaucoup de code",
  "color: #00D9FF; font-size: 14px;",
);
