document.addEventListener("DOMContentLoaded", () => {
  const carousel = document.querySelector("[data-carousel]");
  if (!carousel) return;

  const track = carousel.querySelector(".carousel__track");
  const originalSlides = Array.from(track.children);
  const prev = carousel.querySelector("[data-carousel-prev]");
  const next = carousel.querySelector("[data-carousel-next]");
  const total = originalSlides.length;
  if (total <= 1) return;

  const firstClone = originalSlides[0].cloneNode(true);
  const lastClone = originalSlides[total - 1].cloneNode(true);
  track.insertBefore(lastClone, originalSlides[0]);
  track.appendChild(firstClone);

  const slides = Array.from(track.children);
  let index = 1;
  let isTransitioning = false;

  function setPosition(animate = true) {
    track.style.transition = animate ? "transform 0.35s ease" : "none";
    track.style.transform = `translateX(-${index * 100}%)`;
  }

  function moveTo(newIndex) {
    if (isTransitioning) return;
    isTransitioning = true;
    index = newIndex;
    setPosition(true);
  }

  track.addEventListener("transitionend", () => {
    isTransitioning = false;
    if (index === slides.length - 1) {
      index = 1;
      setPosition(false);
    }
    if (index === 0) {
      index = slides.length - 2;
      setPosition(false);
    }
  });

  prev?.addEventListener("click", () => moveTo(index - 1));
  next?.addEventListener("click", () => moveTo(index + 1));

  let startX = 0;
  let deltaX = 0;
  carousel.addEventListener("touchstart", (e) => {
    startX = e.touches[0].clientX;
    deltaX = 0;
  }, {passive: true});

  carousel.addEventListener("touchmove", (e) => {
    deltaX = e.touches[0].clientX - startX;
  }, {passive: true});

  carousel.addEventListener("touchend", () => {
    if (Math.abs(deltaX) > 40) {
      if (deltaX < 0) moveTo(index + 1);
      else moveTo(index - 1);
    }
  });

  setPosition(false);
});