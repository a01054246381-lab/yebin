document.addEventListener("DOMContentLoaded", () => {

    const startBtn = document.getElementById("startBtn");
    const panel = document.getElementById("previewPanel");
    const inputs = document.querySelectorAll(".option input");

    const data = {
        hr: {
            name: "과장 (실무형)",
            role: "기술 · 실무 평가",
            img: "/interview001/interviewer1.png"
        },
        manager: {
            name: "차장 (검증형)",
            role: "논리 · 판단 평가",
            img: "/interview001/interviewer2.png"
        },
        leader: {
            name: "팀장 (균형형)",
            role: "인성 · 리더십 평가",
            img: "/interview001/interviewer3.png"
        },
        executive: {
            name: "임원 (최종형)",
            role: "비전 · 태도 평가",
            img: "/interview001/interviewer4.png"
        }
    };

    // =========================
    // 선택 변경 이벤트
    // =========================
    inputs.forEach(input => {
        input.addEventListener("change", () => {

            const selected = [...document.querySelectorAll(".option input:checked")];

            // 버튼 활성 / 비활성
            startBtn.disabled = selected.length === 0;

            // 미리보기 렌더링
            renderPreview(selected);
        });
    });


    // =========================
    // 시작 버튼 클릭
    // =========================
    startBtn.addEventListener("click", () => {

        const selected = [...document.querySelectorAll(".option input:checked")];

        // ⭐ data 객체 기준으로 저장 (핵심 수정)
        const selectedInterviewers = selected.map(el => ({
            value: el.value,
            name: data[el.value].name,
            role: data[el.value].role,
            img: data[el.value].img
        }));

        localStorage.setItem(
            "selectedInterviewers",
            JSON.stringify(selectedInterviewers)
        );

        window.location.href =
        "/interview001/simulation/practice/start_mode/start/in_p_start.html";
    });


    // =========================
    // 미리보기 렌더링
    // =========================
    function renderPreview(selected){

        if(selected.length === 0){
            panel.innerHTML = `<p class="empty">면접관을 선택하세요</p>`;
            return;
        }

        panel.innerHTML = "";

        selected.forEach(el=>{
            const d = data[el.value];

            panel.innerHTML += `
                <div class="preview-card">
                    <img src="${d.img}">
                    <div>
                        <div class="name">${d.name}</div>
                        <div class="role">${d.role}</div>
                    </div>
                </div>
            `;
        });
    }

});
