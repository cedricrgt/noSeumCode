



async function loadHeader() {
  const headerPlaceholder = document.getElementById("header-placeholder");
  if (!headerPlaceholder) return;

  try {

    const headerResponse = await fetch("partials/header.html");
    if (!headerResponse.ok) throw new Error("Failed to load header");
    const headerHTML = await headerResponse.text();
    headerPlaceholder.innerHTML = headerHTML;

    await updatePromoBanner();

    const popoversPlaceholder = document.getElementById("popovers-placeholder");
    if (popoversPlaceholder) {
      const popoversResponse = await fetch("partials/popovers-shared.html");
      if (popoversResponse.ok) {
        const popoversHTML = await popoversResponse.text();
        popoversPlaceholder.innerHTML = popoversHTML;

        await loadSchedule();
      }
    }

    setActiveNavLink();

    initPromoPopup();

  } catch (error) {
    console.error("Error loading header:", error);
  }
}

async function loadFooter() {
  const footerPlaceholder = document.getElementById("footer-placeholder");
  if (!footerPlaceholder) return;

  try {
    const response = await fetch("partials/footer.html");
    if (!response.ok) throw new Error("Failed to load footer");
    const footerHTML = await response.text();
    footerPlaceholder.innerHTML = footerHTML;
  } catch (error) {
    console.error("Error loading footer:", error);
  }
}

// ========================================
// ACTIVE NAV LINK DETECTION
// ========================================
function setActiveNavLink() {
  const navLinks = document.querySelectorAll(".navbar__link");
  const currentPath = window.location.pathname;

  navLinks.forEach((link) => {
    const anchor = link.querySelector("a");
    if (!anchor) return;

    const href = anchor.getAttribute("href");

    const isHomePage =
      currentPath.endsWith("/") ||
      currentPath.endsWith("/index.html") ||
      currentPath.endsWith("index.html");

    if (isHomePage && (href === "index.html" || href === "/")) {
      link.classList.add("active");
    } else if (!isHomePage && currentPath.includes("article") && href === "index.html") {


    } else if (!isHomePage && currentPath.includes("thanks") && href === "index.html") {

    }
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.forEach((l) => l.classList.remove("active"));
      link.classList.add("active");
    });
  });
}



function initPromoPopup() {
  const promoPopup = document.getElementById("promo-popup");
  if (!promoPopup) return;

  setTimeout(() => {
    if (typeof promoPopup.showPopover === "function" && !promoPopup.matches(":popover-open")) {
      promoPopup.showPopover();
    }
  }, 2000);

  promoPopup.addEventListener("click", (e) => {
    if (e.target === promoPopup) {
      promoPopup.hidePopover();
    }
  });
}



function initScrollEffect() {
  const header = document.querySelector(".header");
  if (!header) return;

  window.addEventListener("scroll", () => {
    const currentScroll = window.pageYOffset;
    if (currentScroll > 100) {
      header.style.boxShadow = "0 4px 20px rgba(0, 0, 0, 0.1)";
    } else {
      header.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.08)";
    }
  });
}



document.addEventListener("DOMContentLoaded", async () => {
  await loadHeader();
  await loadFooter();
  initScrollEffect();
});
