document.addEventListener("DOMContentLoaded", () => {
  let time = 60;
  let timerInterval = null;
  let isRunning = false;

  const timerEl = document.querySelector(".timer");
  const startBtn = document.querySelector(".control-btn.primary");
  const pauseBtn = document.getElementById("pauseBtn");
  const recordingEl = document.querySelector(".recording");

  const startModal = document.getElementById("practiceStartModal");
  const timerModal = document.getElementById("timerModal");
  const modalConfirm = document.getElementById("modalConfirm");

  const video = document.getElementById("webcam");

  // ===== 모달 함수 =====
  function openModal(modal) { modal.classList.add("active"); }
  function closeModal(modal) { modal.classList.remove("active"); }
  function closeAllModals() {
    document.querySelectorAll(".modal-overlay").forEach(m => m.classList.remove("active"));
  }

  // ===== 타이머 표시 =====
  function updateTimer() {
    const minutes = String(Math.floor(time / 60)).padStart(2,"0");
    const seconds = String(time % 60).padStart(2,"0");
    timerEl.textContent = `⏱ ${minutes}:${seconds}`;
    if(time <=5){
      timerEl.classList.add("warning");
    } else {
      timerEl.classList.remove("warning");
    }
  }

  // ===== 상태 표시 =====
  function setAnsweringState() {
    startBtn.textContent = "일시정지";
    startBtn.disabled = false;
    startBtn.classList.add("answering");

    recordingEl.textContent = "● 답변 중";
    recordingEl.className = "recording recording-on";
  }

  function setAnswerPausedState() {
    startBtn.textContent = "재개";
    startBtn.disabled = false;
    startBtn.classList.remove("answering");

    recordingEl.textContent = "● 일시정지";
    recordingEl.className = "recording";
  }

  function setAnswerDoneState() {
    startBtn.textContent = "답변 완료";
    startBtn.classList.remove("answering");
    startBtn.classList.add("done");
    startBtn.disabled = true;
    if(pauseBtn) pauseBtn.disabled = true;

    recordingEl.textContent = "● 답변 완료";
    recordingEl.className = "recording recording-done";
  }

  // ===== 타이머 제어 =====
  function startTimer() {
    if(isRunning) return; // 이미 실행 중이면 무시
    isRunning = true;
    setAnsweringState();

    timerInterval = setInterval(()=>{
      if(time <= 0){
        clearInterval(timerInterval);
        isRunning = false;
        setAnswerDoneState();
        closeAllModals();
        openModal(timerModal);
        return;
      }
      time--;
      updateTimer();
    },1000);
  }

  function pauseTimer() {
    if(!isRunning) return;
    clearInterval(timerInterval);
    isRunning = false;
    setAnswerPausedState();
  }

  function resumeTimer() {
    startTimer(); // isRunning 체크로 중복 실행 방지
  }

  // ===== 버튼 이벤트 =====
// ===== 버튼 이벤트 =====
startBtn.addEventListener("click", () => {
  if (isRunning) {
    // ⏸ 타이머 일시정지
    pauseTimer();

    // 📸 캡쳐 OFF
    fetch("/capture/stop", {
      method: "POST"
    });

  } else {
    // ▶️ 타이머 재개
    resumeTimer();

    // 📸 캡쳐 ON
    fetch("/capture/start", {
      method: "POST"
    });
  }
});

// 일시정지 버튼이 따로 있는 경우
if (pauseBtn) {
  pauseBtn.addEventListener("click", () => {
    pauseTimer();

    // 📸 캡쳐 OFF
    fetch("/capture/stop", {
      method: "POST"
    });
  });
}

// ===== 면접 종료 =====
if (modalConfirm) {
  modalConfirm.addEventListener("click", () => {
    // 🛑 캡쳐 완전 종료
    fetch("/capture/stop", {
      method: "POST"
    }).finally(() => {
      location.href = "/interview001/simulation/practice/start_mode/result/in_p_result.html";
    });
  });
}


  // ===== 시작 모달 카운트다운 =====
  let count = 3;
  const countdownEl = startModal.querySelector(".countdown");
  openModal(startModal);

  const countdown = setInterval(()=>{
    countdownEl.textContent = count;
    count--;
    if(count < 0){
      clearInterval(countdown);
      closeModal(startModal);
    }
  },1000);

  updateTimer();

  // ===== 웹캠 연결 =====
  navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => video.srcObject = stream)
    .catch(err => console.error("웹캠 연결 실패:", err));
});
