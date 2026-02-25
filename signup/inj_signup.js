document.addEventListener("DOMContentLoaded", function () {

    const form = document.getElementById("signupForm");
    const userId = document.getElementById("userId");
    const password = document.getElementById("password");
    const passwordCheck = document.getElementById("passwordCheck");
    const userName = document.getElementById("userName");
    const gender = document.getElementById("gender");
    const birth = document.getElementById("birth");
    const phone = document.getElementById("phone");
    const email = document.getElementById("email");

   document.addEventListener("DOMContentLoaded", function () {

    const form = document.getElementById("signupForm");
    const userId = document.getElementById("userId");
    const password = document.getElementById("password");
    const passwordCheck = document.getElementById("passwordCheck");
    const userName = document.getElementById("userName");
    const gender = document.getElementById("gender");
    const birth = document.getElementById("birth");
    const phone = document.getElementById("phone");
    const email = document.getElementById("email");

   document.addEventListener("DOMContentLoaded", function () {

    const form = document.getElementById("signupForm");
    const userId = document.getElementById("userId");
    const password = document.getElementById("password");
    const passwordCheck = document.getElementById("passwordCheck");
    const userName = document.getElementById("userName");
    const gender = document.getElementById("gender");
    const birth = document.getElementById("birth");
    const phone = document.getElementById("phone");
    const email = document.getElementById("email");

    form.addEventListener("submit", async function (e) {

        e.preventDefault(); // 기본 제출 막기

        // =========================
        // ⭐ 여기 검증 코드 넣기
        // =========================

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

        // 5. 성별 검사
        if (gender.value === "") {
            alert("성별을 선택하세요");
            gender.focus();
            return;
        }

        // 6. 생년월일 검사
        if (birth.value === "") {
            alert("생년월일을 입력하세요");
            birth.focus();
            return;
        }

        // 7. 전화번호 검사
        if (phone.value.trim() === "") {
            alert("전화번호를 입력하세요");
            phone.focus();
            return;
        }

        // 8. 이메일 검사
        if (email.value.trim() === "") {
            alert("이메일을 입력하세요");
            email.focus();
            return;
        }

        // =========================
        // ⭐ 검증 통과 → 서버 전송
        // =========================

        const payload = {
            user_id: userId.value,
            password: password.value,
            name: userName.value,
            gender: gender.value,
            birth: birth.value,
            phone: phone.value,
            email: email.value
        };

        try {

            const res = await fetch("/api/users/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.message);

            alert("회원가입 완료!");
            window.location.href = "/interview001/login/in_login.html";

        } catch (err) {
            alert("회원가입 실패: " + err.message);
        }

    });

});

phone.addEventListener("input", function () {
    let v = this.value.replace(/\D/g, "");

    if (v.length <= 3) this.value = v;
    else if (v.length <= 7) this.value = v.slice(0,3) + "-" + v.slice(3);
    else this.value = v.slice(0,3) + "-" + v.slice(3,7) + "-" + v.slice(7,11);
});

document.querySelectorAll(".toggle").forEach(btn => {

  btn.addEventListener("click", () => {

    const input = btn.previousElementSibling;

    input.type = input.type === "password" ? "text" : "password";

  });

});


