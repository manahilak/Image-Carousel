function animateAsync(element, keyframes, options) {
  return new Promise((res) => {
    const anim = element.animate(keyframes, options);
    setTimeout(res, options.duration || 0);
  });
}

function createImageSlider(
  images,
  {
    currentSlideIndex = 0,
    duration = 750,
    easing = "cubic-bezier(0.250, 0.460, 0.450, 0.940)",
    slideShowInterval = 4000,
  } = {}
) {
  const slider = document.createElement("div");
  slider.className = "slider";
  slider.innerHTML =
    '<div class="slides-wrapper"></div>' +
    '<div class="slide-indicators"></div>' +
    '<button type="button" class="prev-button"></button>' +
    '<button type="button" class="next-button"></button>';
  const [wrapper, indicators, prevBtn, nextBtn] = slider.children;
  const fill = "forwards";
  let animating = false;
  let timer = null;

  images.forEach((img, idx) => {
    const slide = document.createElement("div");
    const btn = document.createElement("button");
    const image = document.createElement("img");
    const activeCls = idx === currentSlideIndex ? "active" : "";
    slide.className = `slide ${activeCls}`;
    btn.className = activeCls;
    image.src = img;

    btn.style.transitionDuration = `${duration}ms`;
    btn.addEventListener("click", () => slideTo(idx));

    slide.appendChild(image);
    wrapper.appendChild(slide);
    indicators.appendChild(btn);
  });

  function autoSlide() {
    timer = setTimeout(
      () =>
        slideTo(
          currentSlideIndex === images.length - 1 ? 0 : currentSlideIndex + 1
        ),
      slideShowInterval
    );
  }

  function slideTo(index) {
    if (index === currentSlideIndex || animating) {
      return;
    }

    animating = true;

    clearTimeout(timer);
    const currentSlide = wrapper.children[currentSlideIndex];
    const nextSlide = wrapper.children[index];

    indicators.children[currentSlideIndex].classList.remove("active");
    indicators.children[index].classList.add("active");
    const pos = index > currentSlideIndex ? "-100%" : "100%";

    Promise.all([
      animateAsync(
        nextSlide,
        [
          { transform: `translate(${parseInt(pos, 10) * -1}%, 0)` },
          { transform: "translate(0, 0)" },
        ],
        { duration, fill, easing }
      ),
      animateAsync(
        currentSlide,
        [
          { transform: "translate(0, 0)" },
          { transform: `translate(${pos}, 0)` },
        ],
        { duration, fill, easing }
      ),
    ]).then(() => {
      currentSlideIndex = index;
      currentSlide.classList.remove("active");
      nextSlide.classList.add("active");
      animating = false;

      autoSlide();
    });
  }

  nextBtn.addEventListener("click", () =>
    slideTo(Math.min(currentSlideIndex + 1, images.length - 1))
  );
  prevBtn.addEventListener("click", () =>
    slideTo(Math.max(0, currentSlideIndex - 1))
  );

  autoSlide();

  return slider;
}

document.body.appendChild(
  createImageSlider([
    "https://images.pexels.com/photos/210126/pexels-photo-210126.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    "https://images.pexels.com/photos/802024/pexels-photo-802024.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    "https://images.pexels.com/photos/1133957/pexels-photo-1133957.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    "https://i.pinimg.com/originals/48/42/9f/48429f10ab5d153eaefdd696bd62549d.jpg",
    "https://images.pexels.com/photos/159760/computer-pc-workplace-home-office-159760.jpeg",
    "https://c4.wallpaperflare.com/wallpaper/899/936/977/3-316-16-9-aspect-ratio-s-sfw-wallpaper-preview.jpg",
  ])
);
