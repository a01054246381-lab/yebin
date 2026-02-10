let time = 60;
let timerInterval = null;
let isRunning = false;

const timerEl = document.querySelector(".timer");
const startBtn = document.querySelector(".control-btn.primary");
const recordingEl = document.querySelector(".recording");

const modal = document.getElementById("timerModal");
//const modalConfirm = document.getElementById("modalConfirm");

const practiceModal = document.getElementById("practiceStartModal");

/* 상태 변경 : “지금 답변 중이다”라는 화면 상태를 한 번에 바꾸는 함수 */
function setAnsweringState() {
  startBtn.textContent = "답변 중";
  startBtn.disabled = true;
  startBtn.classList.add("answering");

  recordingEl.textContent = "● 답변 중";
  recordingEl.className = "recording recording-on";
}

function setAnswerDoneState() {
  startBtn.textContent = "답변 완료";
  startBtn.classList.remove("answering");
  startBtn.classList.add("done");

  recordingEl.textContent = "● 답변 완료";
  recordingEl.className = "recording recording-done";
}

/* 타이머 표시 함수 : 숫자(time)를 사람이 보는 시계 형식으로 바꿔서 화면에 보여줌*/
function updateTimer() {
  const minutes = String(Math.floor(time / 60)).padStart(2, "0");
  const seconds = String(time % 60).padStart(2, "0");
  timerEl.textContent = `⏱ ${minutes}:${seconds}`;
//경고 처리
  if (time <= 5) {
    timerEl.classList.add("warning");
  }
}

/* 타이머 시작 로직 (핵심) */
function startTimer() {
  if (isRunning) return;
//타이머 시작 로직 (핵심)
  isRunning = true;
  setAnsweringState();

  timerInterval = setInterval(() => {
    if (time <= 0) {
      clearInterval(timerInterval);
      isRunning = false;

      setAnswerDoneState();
      onTimeEnd();              // ⭐ 추가
      showTimerEndModal();      // ⭐ 추가
      return;
    }

    time--;
    updateTimer();
  }, 1000);
}

//모달 전부 닫는 함수
function closeAllModals() {
  document.querySelectorAll(".modal-overlay").forEach(m => {
    m.classList.remove("active");
  });
}
//버튼 이벤트 연결 : 버튼 누르면 startTimer() 실행
startBtn.addEventListener("click", startTimer);



/* 초기 */
updateTimer();

//페이지 처음 로드될 때 실행되는 코드 : HTML이 전부 로딩된 후 실행
document.addEventListener("DOMContentLoaded", () => {
    const modalConfirm = document.getElementById("modalConfirm");

  modalConfirm.addEventListener("click", () => {
  location.href = "/interview001/simulation/practice/start_mode/result/in_p_result.html";
});
  closeAllModals(); // ⭐ 기존 모달 다 닫고

  const startModal = document.getElementById("practiceStartModal");
  startModal.style.display = "flex";

  let count = 3;
  const countdownEl = document.querySelector("#practiceStartModal .countdown");

  const timer = setInterval(() => {
    count--;
    countdownEl.textContent = count;

    if (count === 0) {
      clearInterval(timer);
      startModal.style.display = "none";
      // 0 되면 모달 닫고 실전 시작
    }
  }, 1000);
});

function showTimerEndModal() {
  closeAllModals();
  modal.classList.add("active");
}

/*
function onTimeEnd() {
  const actionBar = document.getElementById("actionBar");
  if (!actionBar) return;

  // 중복 생성 방지
  if (document.getElementById("resultBtn")) return;

  const btn = document.createElement("button");
  btn.id = "resultBtn";
  btn.className = "main";
  btn.textContent = "결과 보기 →";

  btn.onclick = () => {
    location.href = "/interview001/practice/result.html";
  };

  actionBar.appendChild(btn);
}
*/
