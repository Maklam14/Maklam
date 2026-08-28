const track = document.querySelector(".carousel-track");

if (track) {
    const originalSlides = Array.from(track.querySelectorAll("img"));

    originalSlides.forEach((slide) => {
        const clone = slide.cloneNode(true);
        clone.setAttribute("aria-hidden", "true");
        track.appendChild(clone);
    });

    let index = 0;
    let isResetting = false;
    let autoplay;

    function getGap() {
        const styles = window.getComputedStyle(track);
        return parseFloat(styles.columnGap || styles.gap || 0);
    }

    function getStep() {
        const firstSlide = track.querySelector("img");
        if (!firstSlide) return 0;
        return firstSlide.getBoundingClientRect().width + getGap();
    }

    function updateCarousel(withTransition = true) {
        track.style.transition = withTransition ? "transform 0.6s ease" : "none";
        track.style.transform = `translateX(-${index * getStep()}px)`;
    }

    function nextSlide() {
        if (isResetting) return;

        index += 1;
        updateCarousel(true);

        if (index >= originalSlides.length) {
            isResetting = true;
        }
    }

    track.addEventListener("transitionend", () => {
        if (isResetting) {
            index = 0;
            updateCarousel(false);

            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    isResetting = false;
                    track.style.transition = "transform 0.6s ease";
                });
            });
        }
    });

    function startAutoplay() {
        stopAutoplay();
        autoplay = setInterval(nextSlide, 2200);
    }

    function stopAutoplay() {
        if (autoplay) clearInterval(autoplay);
    }

    window.addEventListener("resize", () => {
        updateCarousel(false);
    });

    track.addEventListener("mouseenter", stopAutoplay);
    track.addEventListener("mouseleave", startAutoplay);

    updateCarousel(false);
    startAutoplay();
}