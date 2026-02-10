const startBtn = document.getElementById("startBtn");

startBtn.addEventListener("click", () => {
    const checked = document.querySelectorAll(
        'input[name="interviewer"]:checked'
    );

    if (checked.length === 0) {
        alert("면접관을 최소 1명 선택하세요");
        return;
    }

    // 통과 시 이동
    window.location.href = "/interview001/simulation/practice/start_mode/start/in_p_start.html";
});
