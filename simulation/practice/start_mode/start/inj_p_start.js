let steps;
let current = 0;

document.addEventListener("DOMContentLoaded", () => {

  /* =========================
     면접관 표시
  ========================= */
  const list = document.getElementById("interviewerList");
  const nameEl = document.getElementById("interviewerName");
  const roleEl = document.getElementById("interviewerRole");

  const saved = JSON.parse(localStorage.getItem("selectedInterviewers"));

  if (!saved || saved.length === 0) {
      nameEl.textContent = "면접관 없음";
  } else {
    saved.forEach((person, index) => {

      const img = document.createElement("img");
      img.src = person.img;
      img.className = "avatar";

      if (index === 0) {
          img.classList.add("active");
          nameEl.textContent = person.name;
          roleEl.textContent = person.role;
      }

      img.addEventListener("click", () => {
          document.querySelectorAll(".avatar")
            .forEach(a => a.classList.remove("active"));

          img.classList.add("active");
          nameEl.textContent = person.name;
          roleEl.textContent = person.role;
      });

      list.appendChild(img);
    });
  }


  /* =========================
     PSAR 초기화
  ========================= */
  steps = document.querySelectorAll(".step");
  updateProgress();

  const content = document.getElementById("psarContent");

  const psarText = [
    "1. 문제를 정의하세요.",
    "2. 해결 전략을 선택하세요.",
    "3. 실행을 진행합니다.",
    "4. 결과를 평가하세요."
  ];

  window.nextPSAR = function(){
    if(current < steps.length - 1){
      steps[current].classList.remove("active");
      steps[current].classList.add("done");

      current++;
      steps[current].classList.add("active");

      content.textContent = psarText[current];
    }
    updateProgress();
  }


  /* =========================
     PSAR 표시
  ========================= */
  window.togglePSAR = function(){
    document.querySelector(".psar-container").classList.toggle("show");
  }

  window.focusPSAR = function(){
    const psar = document.querySelector(".psar-container");
    psar.classList.add("show");

    psar.scrollIntoView({
      behavior:"smooth",
      block:"center"
    });
  }


  /* =========================
     Wingman 모달
  ========================= */
  window.openWingman = function(){
    document.getElementById("wingmanModal").style.display="flex";
  }

  window.closeWingman = function(){
    document.getElementById("wingmanModal").style.display="none";
  }

});


/* =========================
   진행률 계산
========================= */
function updateProgress(){
  const percent = (current / (steps.length - 0.6)) * 100;
  document.getElementById("psarProgress").style.width = percent + "%";
}