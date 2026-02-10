document.addEventListener("DOMContentLoaded", function () {

    const form = document.getElementById("signupForm");
    const userId = document.getElementById("userId");
    const password = document.getElementById("password");
    const passwordCheck = document.getElementById("passwordCheck");
    const userName = document.getElementById("userName");

    form.addEventListener("submit", function (e) {
        e.preventDefault(); // ⭐ 기본 이동 막기

        // 1. 아이디 검사
        if (userId.value.trim() === "") {
            alert("아이디를 입력하세요");
            userId.focus();
            return;
        }

        // 2. 비밀번호 검사
        if (password.value.trim() === "") {
            alert("비밀번호를 입력하세요");
            password.focus();
            return;
        }

        // 3. 비밀번호 확인
        if (password.value !== passwordCheck.value) {
            alert("비밀번호가 일치하지 않습니다");
            passwordCheck.focus();
            return;
        }

        // 4. 이름 검사
        if (userName.value.trim() === "") {
            alert("이름을 입력하세요");
            userName.focus();
            return;
        }

        // ✅ 모든 검증 통과
        alert("회원가입 완료!");

        // 🔥 여기서 이동
        window.location.href = "/interview001/login/in_login.html";
    });
});
