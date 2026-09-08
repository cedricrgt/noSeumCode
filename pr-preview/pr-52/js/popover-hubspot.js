(() => {
  let isLoaded = false;

  // Fonction qui configure l'écouteur une fois le popover trouvé
  const setupPopoverListener = (popover) => {
    popover.addEventListener('toggle', (event) => {
      if (event.newState === 'open' && !isLoaded) {
        isLoaded = true;

        const script = document.createElement("script");
        script.src = "https://js-eu1.hsforms.net/forms/embed/v2.js";
        script.async = true;

        script.onload = () => {
          setTimeout(() => {
            if (window.hbspt && window.hbspt.forms) {
              window.hbspt.forms.create({
                portalId: "147700205",
                formId: "1a00f0a3-c33c-47e3-9614-b56fdc4a8586",
                region: "eu1",
                target: "#hubspot-form-container"
              });
            } else {
              console.error("❌ window.hbspt n'est pas défini !");
            }
          }, 50);
        };

        script.onerror = () => {
          console.error("❌ Chargement du script HubSpot bloqué !");
        };

        document.body.appendChild(script);
      }
    });
  };

  // On cherche le popover immédiatement
  const popover = document.getElementById('hubspot-popover');
  if (popover) {
    setupPopoverListener(popover);
  } else {
    // Si pas trouvé, on observe le DOM en continu jusqu'à ce qu'il apparaisse
    const observer = new MutationObserver((mutations, obs) => {
      const targetPopover = document.getElementById('hubspot-popover');
      if (targetPopover) {
        setupPopoverListener(targetPopover);
        obs.disconnect(); // On arrête d'observer une fois trouvé
      }
    });

    observer.observe(document.documentElement, {
      childList: true,
      subtree: true
    });
  }
})();
