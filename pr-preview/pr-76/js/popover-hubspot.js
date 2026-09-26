(() => {
  let isLoaded = false;

  // Configure l'écouteur du popover HubSpot
  const setupPopoverListener = (popover) => {
    popover.addEventListener('toggle', (event) => {
      if (event.newState === 'open' && !isLoaded) {
        isLoaded = true;

        const container = document.getElementById("hubspot-form-container");
        if (container && !container.hasChildNodes()) {
          container.innerHTML = `
            <div style="text-align: center; padding: 2rem; color: #cbd5e0; font-size: 0.95rem;">
              <div style="display: inline-block; width: 32px; height: 32px; border: 3px solid rgba(0,255,135,0.2); border-top-color: #00ff87; border-radius: 50%; animation: hubspotSpin 0.8s linear infinite; margin-bottom: 0.75rem;"></div>
              <div>Chargement du formulaire sécurisé...</div>
              <style>@keyframes hubspotSpin { to { transform: rotate(360deg); } }</style>
            </div>
          `;
        }

        const script = document.createElement("script");
        script.src = "https://js-eu1.hsforms.net/forms/embed/v2.js";
        script.async = true;

        script.onload = () => {
          setTimeout(() => {
            if (window.hbspt && window.hbspt.forms) {
              if (container) container.innerHTML = "";
              window.hbspt.forms.create({
                portalId: "147700205",
                formId: "1a00f0a3-c33c-47e3-9614-b56fdc4a8586",
                region: "eu1",
                target: "#hubspot-form-container",
                onFormSubmitted: () => {
                  if (container) {
                    container.innerHTML = `
                      <div style="text-align: center; padding: 2rem 1rem; color: #fff;">
                        <div style="font-size: 3rem; margin-bottom: 1rem;">🚀</div>
                        <h4 style="font-family: 'Bangers', cursive; font-size: 2rem; color: #00ff87; margin-bottom: 0.5rem;">C'EST DANS LA BOÎTE !</h4>
                        <p style="color: #cbd5e0; line-height: 1.5; font-size: 0.95rem;">
                          Ton programme de formation a été envoyé directement à ton adresse e-mail. Vérifie ta boîte de réception (et tes spams) !
                        </p>
                      </div>
                    `;
                  }
                }
              });
            } else {
              console.error("window.hbspt n'est pas défini");
              if (container) {
                container.innerHTML = `<p style="color: #fca5a5; text-align: center; padding: 1rem;">Impossible de charger le formulaire. Veuillez réessayer plus tard ou nous contacter à contact@noseumcode.fr.</p>`;
              }
            }
          }, 50);
        };

        script.onerror = () => {
          console.error("Chargement du script HubSpot bloqué");
          if (container) {
            container.innerHTML = `<p style="color: #fca5a5; text-align: center; padding: 1rem;">Le chargement du formulaire a été bloqué. Vérifiez vos paramètres ou contactez-nous à contact@noseumcode.fr.</p>`;
          }
        };

        document.body.appendChild(script);
      }
    });
  };

  const popover = document.getElementById('hubspot-popover');
  if (popover) {
    setupPopoverListener(popover);
  } else {
    const observer = new MutationObserver((mutations, obs) => {
      const targetPopover = document.getElementById('hubspot-popover');
      if (targetPopover) {
        setupPopoverListener(targetPopover);
        obs.disconnect();
      }
    });

    observer.observe(document.documentElement, {
      childList: true,
      subtree: true
    });
  }
})();
