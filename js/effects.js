(() => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion) return;

  document.documentElement.classList.add("has-motion");

  const revealNodes = document.querySelectorAll(".reveal, .section-head, .benefits-grid article, .tile, .story, .pack-card, .delivery-card");
  revealNodes.forEach((node) => node.classList.add("reveal"));

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.16, rootMargin: "0px 0px -8% 0px" }
  );
  revealNodes.forEach((node) => io.observe(node));

  const parallaxImgs = document.querySelectorAll(".parallax-media img, .hero-img, .lookbook-grid img, .story-media img, .manifesto-media img");
  const onScroll = () => {
    const vh = window.innerHeight;
    parallaxImgs.forEach((img) => {
      const rect = img.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > vh) return;
      const progress = (vh - rect.top) / (vh + rect.height);
      const shift = (progress - 0.5) * 28;
      img.style.transform = `translate3d(0, ${shift.toFixed(2)}px, 0) scale(1.08)`;
    });

    const cinema = document.querySelector(".cinema");
    if (cinema) {
      const rect = cinema.getBoundingClientRect();
      const total = rect.height - vh;
      let p = 0;
      if (total > 0) {
        p = Math.min(1, Math.max(0, -rect.top / total));
      }
      cinema.style.setProperty("--p", p.toFixed(4));
      cinema.querySelectorAll(".cinema-line").forEach((line) => {
        const peak = Number(line.dataset.peak || 0.5);
        const opacity = Math.max(0, 1 - Math.abs(p - peak) * 4.2);
        const y = (peak - p) * 42;
        line.style.opacity = opacity.toFixed(3);
        line.style.transform = `translateY(${y.toFixed(2)}px)`;
      });
    }
  };

  let ticking = false;
  window.addEventListener(
    "scroll",
    () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        onScroll();
        ticking = false;
      });
    },
    { passive: true }
  );
  onScroll();

  document.querySelectorAll(".btn, .nav-cta, .chip, .filter-chip").forEach((el) => {
    el.addEventListener("pointermove", (event) => {
      const rect = el.getBoundingClientRect();
      const x = event.clientX - rect.left - rect.width / 2;
      const y = event.clientY - rect.top - rect.height / 2;
      el.style.transform = `translate(${x * 0.08}px, ${y * 0.12}px)`;
    });
    el.addEventListener("pointerleave", () => {
      el.style.transform = "";
    });
  });
})();
