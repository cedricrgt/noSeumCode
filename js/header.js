

function getBasePath() {
  const scripts = document.querySelectorAll('script[src]');
  for (const script of scripts) {
    const src = script.getAttribute('src');
    if (src && src.includes('header.js')) {
      const url = new URL(src, window.location.href);
      return url.href.replace(/js\/header\.js.*$/, '');
    }
  }
  return '/';
}

async function loadHeader() {
  const headerPlaceholder = document.getElementById("header-placeholder");
  if (!headerPlaceholder) return;

  try {

    const headerResponse = await fetch(getBasePath() + "partials/header.html");
    if (!headerResponse.ok) throw new Error("Failed to load header");
    const headerHTML = await headerResponse.text();
    headerPlaceholder.innerHTML = headerHTML;

    await updatePromoBanner();

    const popoversPlaceholder = document.getElementById("popovers-placeholder");
    if (popoversPlaceholder) {
      const popoversResponse = await fetch(getBasePath() + "partials/popovers-shared.html");
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
    const response = await fetch(getBasePath() + "partials/footer.html");
    if (!response.ok) throw new Error("Failed to load footer");
    const footerHTML = await response.text();
    footerPlaceholder.innerHTML = footerHTML;
  } catch (error) {
    console.error("Error loading footer:", error);
  }
}

async function loadSchedule() {
  const tbody = document.getElementById("promo-schedule-body");
  if (!tbody) return;

  try {
    const response = await fetch(getBasePath() + "data/schedule.json");
    if (!response.ok) throw new Error("Failed to load schedule");
    const data = await response.json();

    const popoverTitle = document.querySelector(".promo-popup__title");
    if (popoverTitle && data.title) {
      popoverTitle.textContent = `${data.title} ${data.emoji || ""}`;
    }

    const popoverSubtitle = document.querySelector(".promo-popup__subtitle");
    if (popoverSubtitle && data.subtitle) {
      popoverSubtitle.textContent = data.subtitle;
    }
    
    tbody.innerHTML = "";
    
    if (data.sessions && Array.isArray(data.sessions)) {
      data.sessions.forEach(item => {
      const tr = document.createElement("tr");
      const td1 = document.createElement("td");
      const td2 = document.createElement("td");
      
      td1.textContent = item.date;
      td2.textContent = item.topic;
      
      tr.appendChild(td1);
      tr.appendChild(td2);
        tbody.appendChild(tr);
      });
    }
  } catch (error) {
    console.error("Error loading schedule:", error);
  }
}

async function updatePromoBanner() {
  const track = document.querySelector(".promo-banner__track");
  if (!track) return;

  try {
    const response = await fetch(getBasePath() + "data/schedule.json");
    if (!response.ok) return;
    const data = await response.json();

    if (!data.sessions || !Array.isArray(data.sessions)) return;

    const topics = data.sessions.map(item => item.topic.toUpperCase()).join(", ");
    const datesArr = data.sessions.map(item => {
      const match = item.date.match(/\d{2}\/\d{2}/);
      return match ? match[0] : item.date;
    });

    let datesStr = datesArr.join(", ");
    if (datesArr.length > 1) {
      const last = datesArr.pop();
      datesStr = datesArr.join(", ") + " ET " + last;
    }

    const titleText = data.title || "WORKSHOPS GRATUITS";
    const emoji = data.emoji || "✨";

    const item1HTML = `${emoji} ${titleText} : ${topics} ! <button popovertarget="promo-popup" class="promo-banner__cta bangers-regular">VOIR LE PLANNING</button>`;

    track.innerHTML = `
      <span class="promo-banner__item">${item1HTML}</span>
      <!-- Duplicated for infinite effect -->
      <span class="promo-banner__item">${item1HTML}</span>
    `;
  } catch (error) {
    console.error("Error updating banner:", error);
  }
}



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
