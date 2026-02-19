document.addEventListener("DOMContentLoaded", () => {

  const slider = document.querySelector(".result-layout");
  if (!slider) return;

  slider.addEventListener("wheel", (e) => {
    e.preventDefault();
    slider.scrollLeft += e.deltaY;
  }, { passive:false });

});
