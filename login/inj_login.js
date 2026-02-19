const form = document.querySelector("form");
const loginBtn = document.querySelector(".login-btn");

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const id = form.querySelector('input[type="text"]').value.trim();
  const pw = form.querySelector('input[type="password"]').value.trim();

  // 입력 체크
  if (!id) {
    showError("아이디를 입력하세요");
    return;
  }

  if (!pw) {
    showError("비밀번호를 입력하세요");
    return;
  }

  // 버튼 로딩 상태
  loginBtn.disabled = true;
  loginBtn.textContent = "로그인 중...";

  // 로그인 처리 시뮬레이션 (서버 통신 자리)
  setTimeout(() => {
    alert(`${id}님 환영합니다 😊`);
    location.href = "/interview001/mainpage/in_main.html";
  }, 600);
});


/* =========================
   에러 표시 함수
========================= */
function showError(message) {
  alert(message);

  // 버튼 흔들림 효과 (선택)
  loginBtn.classList.add("shake");
  setTimeout(() => loginBtn.classList.remove("shake"), 400);
}
