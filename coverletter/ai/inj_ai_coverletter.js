const btn = document.getElementById("analyzeBtn");
const loading = document.getElementById("loadingBox");
const result = document.getElementById("resultArea");

btn.addEventListener("click", () => {

    loading.style.display = "block";
    result.style.display = "none";

    setTimeout(() => {

        loading.style.display = "none";
        result.style.display = "block";

        // 예시 데이터
        document.getElementById("scoreText").innerText = 87;

        const list = document.getElementById("feedbackList");
        list.innerHTML = `
            <li>문단 구조가 명확합니다</li>
            <li>지원 동기를 더 구체적으로 작성하면 좋습니다</li>
            <li>성과 수치를 추가하면 설득력이 높아집니다</li>
        `;

    },1500);

});
