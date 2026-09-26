/**
 * workshops.js — NoSeumCode
 * Gestion interactive de la page des Ateliers Découvertes Toussaint
 * Jauge stricte de 6 participants max par session & synchronisation compte étudiant
 */

(function () {
  "use strict";

  const FALLBACK_WORKSHOPS = [
    {
      id: "w1000000-0000-0000-0000-000000000001",
      title: "HTML & CSS — Crée ta première page Web en direct",
      theme: "HTML & CSS",
      description: "Découvre les balises sémantiques, le style moderne avec Flexbox, et construis ta première page web responsive guidé pas à pas par ton mentor. Zéro prérequis.",
      maxParticipants: 6,
      registeredCount: 3,
      remainingSeats: 3,
      isFull: false,
      isUserRegistered: false,
      startDate: "2026-10-26T10:00:00",
      endDate: "2026-10-26T12:00:00"
    },
    {
      id: "w1000000-0000-0000-0000-000000000002",
      title: "JavaScript — Donne vie à ton code & anime le DOM",
      theme: "JavaScript",
      description: "Passe à l'action avec JavaScript : variables, fonctions, événements et manipulation dynamique du DOM pour créer une application interactive et réactive.",
      maxParticipants: 6,
      registeredCount: 4,
      remainingSeats: 2,
      isFull: false,
      isUserRegistered: false,
      startDate: "2026-10-27T10:00:00",
      endDate: "2026-10-27T12:00:00"
    },
    {
      id: "w1000000-0000-0000-0000-000000000003",
      title: "Git & GitHub — Maîtrise le versioning comme un pro",
      theme: "Git & GitHub",
      description: "Apprends à utiliser Git comme les développeurs en entreprise : commits propres, branches, gestion des conflits et hébergement de ton code sur GitHub.",
      maxParticipants: 6,
      registeredCount: 2,
      remainingSeats: 4,
      isFull: false,
      isUserRegistered: false,
      startDate: "2026-10-28T10:00:00",
      endDate: "2026-10-28T12:00:00"
    },
    {
      id: "w1000000-0000-0000-0000-000000000004",
      title: "Mini-Projet Guidé — Code ton premier portfolio interactif",
      theme: "Mini-Projet Guidé",
      description: "Mets en pratique toutes les compétences acquises lors d'un atelier immersif de 2h : construis et personnalise ton portfolio en direct avec retours instantanés du mentor.",
      maxParticipants: 6,
      registeredCount: 5,
      remainingSeats: 1,
      isFull: false,
      isUserRegistered: false,
      startDate: "2026-10-29T10:00:00",
      endDate: "2026-10-29T12:00:00"
    }
  ];

  function formatDate(isoString) {
    if (!isoString) return "";
    try {
      const d = new Date(isoString);
      const days = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];
      const months = ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Août", "Sep", "Oct", "Nov", "Déc"];
      const dayName = days[d.getDay()];
      const dayNum = String(d.getDate()).padStart(2, "0");
      const monthName = months[d.getMonth()];
      const hours = String(d.getHours()).padStart(2, "0");
      const mins = String(d.getMinutes()).padStart(2, "0");
      return `${dayName} ${dayNum} ${monthName} • ${hours}h${mins === "00" ? "" : mins}`;
    } catch (_) {
      return isoString;
    }
  }

  function getAuthHeaders() {
    const token = localStorage.getItem("noseum_token");
    const headers = { "Content-Type": "application/json" };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    return headers;
  }

  function showToast(message, type = "success") {
    let container = document.getElementById("workshops-toast");
    if (!container) {
      container = document.createElement("div");
      container.id = "workshops-toast";
      container.style.position = "fixed";
      container.style.bottom = "24px";
      container.style.right = "24px";
      container.style.zIndex = "9999";
      container.style.maxWidth = "420px";
      container.style.padding = "1rem 1.25rem";
      container.style.borderRadius = "12px";
      container.style.fontFamily = "inherit";
      container.style.fontSize = "0.95rem";
      container.style.fontWeight = "600";
      container.style.boxShadow = "0 10px 30px rgba(0,0,0,0.5)";
      container.style.transition = "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)";
      document.body.appendChild(container);
    }

    if (type === "success") {
      container.style.background = "#064e3b";
      container.style.color = "#a7f3d0";
      container.style.border = "1px solid #10b981";
    } else if (type === "error") {
      container.style.background = "#7f1d1d";
      container.style.color = "#fecaca";
      container.style.border = "1px solid #ef4444";
    } else {
      container.style.background = "#1e293b";
      container.style.color = "#e2e8f0";
      container.style.border = "1px solid #475569";
    }

    container.innerHTML = message;
    container.style.display = "block";
    container.style.opacity = "1";
    container.style.transform = "translateY(0)";

    setTimeout(() => {
      container.style.opacity = "0";
      container.style.transform = "translateY(10px)";
      setTimeout(() => {
        container.style.display = "none";
      }, 300);
    }, 4500);
  }

  async function fetchWorkshops() {
    const grid = document.getElementById("workshops-grid");
    if (!grid) return;

    try {
      const response = await fetch(`${window.API_BASE_URL}/api/workshops/upcoming`, {
        headers: getAuthHeaders()
      });

      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data) && data.length > 0) {
          renderWorkshops(data);
          return;
        }
      }
      renderWorkshops(FALLBACK_WORKSHOPS);
    } catch (err) {
      console.warn("API workshops inaccessible, utilisation du catalogue de secours Toussaint", err);
      renderWorkshops(FALLBACK_WORKSHOPS);
    }
  }

  function renderWorkshops(workshops) {
    const grid = document.getElementById("workshops-grid");
    if (!grid) return;

    grid.innerHTML = "";

    workshops.forEach((ws) => {
      const max = ws.maxParticipants || 6;
      const registered = ws.registeredCount || 0;
      const remaining = ws.remainingSeats !== undefined ? ws.remainingSeats : Math.max(0, max - registered);
      const isFull = ws.isFull || remaining <= 0;
      const isRegistered = Boolean(ws.isUserRegistered);

      const percent = Math.min(100, Math.round((registered / max) * 100));

      let gaugeClass = "workshop-jauge__progress";
      let seatClass = "workshop-jauge__seats--available";
      let statusText = `🔥 Plus que ${remaining} place${remaining > 1 ? "s" : ""} disponible${remaining > 1 ? "s" : ""}`;

      if (isFull) {
        gaugeClass += " workshop-jauge__progress--full";
        seatClass = "workshop-jauge__seats--full";
        statusText = "⛔ Atelier complet (jauge de 6 atteinte)";
      } else if (remaining <= 2) {
        gaugeClass += " workshop-jauge__progress--limited";
        seatClass = "workshop-jauge__seats--limited";
        statusText = `⚡ Dernières places ! (plus que ${remaining})`;
      }

      const card = document.createElement("article");
      card.className = "workshop-card";
      card.setAttribute("data-workshop-id", ws.id);

      card.innerHTML = `
        <div class="workshop-card__top">
          <span class="workshop-card__theme-badge">${escapeHtml(ws.theme || "Web")}</span>
          <span class="workshop-card__date-pill">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
            ${escapeHtml(formatDate(ws.startDate))}
          </span>
        </div>

        <h3 class="workshop-card__title">${escapeHtml(ws.title)}</h3>
        <p class="workshop-card__description">${escapeHtml(ws.description || "")}</p>

        <div class="workshop-jauge" aria-label="Jauge de places disponibles">
          <div class="workshop-jauge__header">
            <span class="workshop-jauge__label">Jauge session (Google Meet)</span>
            <span class="workshop-jauge__seats ${seatClass}">
              <strong>${registered}</strong> / ${max} inscrits
            </span>
          </div>
          <div class="workshop-jauge__bar" role="progressbar" aria-valuenow="${registered}" aria-valuemin="0" aria-valuemax="${max}">
            <div class="${gaugeClass}" style="width: ${percent}%;"></div>
          </div>
          <div class="workshop-jauge__caption">
            <span>${statusText}</span>
            <span>Accompagnement individuel</span>
          </div>
        </div>

        <div class="workshop-card__action">
          ${renderActionButton(ws, isRegistered, isFull)}
        </div>
      `;

      grid.appendChild(card);
    });
  }

  function renderActionButton(ws, isRegistered, isFull) {
    if (isRegistered) {
      return `
        <button class="workshop-btn workshop-btn--registered" disabled>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          Tu es inscrit(e) !
        </button>
        <button type="button" class="workshop-unregister-link" onclick="window.unregisterFromWorkshop('${ws.id}')">
          Annuler ma réservation (libérer ma place)
        </button>
      `;
    }

    if (isFull) {
      return `
        <button class="workshop-btn workshop-btn--full" disabled>
          Complet (6/6 élèves)
        </button>
      `;
    }

    return `
      <button class="workshop-btn workshop-btn--register bangers-regular" onclick="window.registerToWorkshop('${ws.id}')">
        Réserver ma place gratuite
      </button>
    `;
  }

  async function registerToWorkshop(workshopId) {
    const token = localStorage.getItem("noseum_token");

    if (!token) {
      sessionStorage.setItem("noseum_pending_workshop_id", workshopId);
      showToast("👋 Connecte-toi ou crée ton compte pour confirmer ta place gratuite !", "info");
      if (typeof window.openGlobalAuthModal === "function") {
        window.openGlobalAuthModal("register", true);
      }
      return;
    }

    try {
      const response = await fetch(`${window.API_BASE_URL}/api/user-workshops/${workshopId}`, {
        method: "POST",
        headers: getAuthHeaders()
      });

      if (response.ok) {
        showToast("🎉 Félicitations ! Ta place est réservée. Retrouve ton atelier dans ton espace.", "success");
        await fetchWorkshops();
      } else {
        const errData = await response.json().catch(() => ({}));
        const msg = errData.message || "Impossible de réserver cette place.";
        showToast(`❌ ${msg}`, "error");
        await fetchWorkshops();
      }
    } catch (err) {
      console.error("Erreur lors de la réservation de l'atelier:", err);
      showToast("❌ Erreur de communication avec le serveur. Veuillez réessayer.", "error");
    }
  }

  async function unregisterFromWorkshop(workshopId) {
    if (!confirm("Souhaites-tu vraiment libérer ta place pour cet atelier ?")) {
      return;
    }

    try {
      const response = await fetch(`${window.API_BASE_URL}/api/user-workshops/workshop/${workshopId}`, {
        method: "DELETE",
        headers: getAuthHeaders()
      });

      if (response.ok || response.status === 204) {
        showToast("✅ Ta réservation a été annulée. La place a été libérée.", "info");
        await fetchWorkshops();
      } else {
        showToast("❌ Impossible d'annuler cette réservation.", "error");
      }
    } catch (err) {
      console.error("Erreur lors de l'annulation de l'atelier:", err);
      showToast("❌ Erreur de communication avec le serveur.", "error");
    }
  }

  function escapeHtml(str) {
    if (!str) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  // Vérification de réservation différée après connexion
  async function checkPendingWorkshopRegistration() {
    const pendingId = sessionStorage.getItem("noseum_pending_workshop_id");
    const token = localStorage.getItem("noseum_token");

    if (pendingId && token) {
      sessionStorage.removeItem("noseum_pending_workshop_id");
      showToast("⏳ Validation de ta réservation en cours...", "info");
      await registerToWorkshop(pendingId);
    }
  }

  // Expose global methods
  window.registerToWorkshop = registerToWorkshop;
  window.unregisterFromWorkshop = unregisterFromWorkshop;
  window.refreshWorkshops = fetchWorkshops;

  document.addEventListener("DOMContentLoaded", async () => {
    await fetchWorkshops();
    await checkPendingWorkshopRegistration();
  });
})();
