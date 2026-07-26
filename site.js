(() => {
  const carousel = document.querySelector(".stories-carousel");
  const previous = document.querySelector('[aria-label="Ver sinopses anteriores"]');
  const next = document.querySelector('[aria-label="Ver próximas sinopses"]');

  const moveCarousel = (direction) => {
    if (!carousel) return;
    const step = Math.min(carousel.clientWidth * 0.88, 980);
    carousel.scrollBy({ left: direction * step, behavior: "smooth" });
  };

  previous?.addEventListener("click", () => moveCarousel(-1));
  next?.addEventListener("click", () => moveCarousel(1));

  const audio = document.querySelector(".soundtrack-player audio");
  const toggle = document.querySelector(".soundtrack-toggle");
  const action = document.querySelector(".soundtrack-action");
  const volume = document.querySelector(".soundtrack-volume input");

  if (audio && toggle) {
    audio.volume = Number(volume?.value || 0.32);
    toggle.addEventListener("click", async () => {
      if (audio.paused) {
        try {
          await audio.play();
        } catch {
          return;
        }
      } else {
        audio.pause();
      }
    });

    audio.addEventListener("play", () => {
      toggle.setAttribute("aria-pressed", "true");
      toggle.setAttribute("aria-label", "Pausar O Legado do Vale");
      if (action) action.textContent = "Ⅱ";
    });

    audio.addEventListener("pause", () => {
      toggle.setAttribute("aria-pressed", "false");
      toggle.setAttribute("aria-label", "Ouvir O Legado do Vale");
      if (action) action.textContent = "▶";
    });

    volume?.addEventListener("input", (event) => {
      audio.volume = Number(event.target.value);
    });
  }
})();