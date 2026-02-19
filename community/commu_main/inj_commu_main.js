import { API_ENDPOINTS } from '../common/config.js'; // config.js에서 API URL 불러오기

document.addEventListener("DOMContentLoaded", () => {
    const editBtn = document.getElementById("editBtn");
    const saveBtn = document.getElementById("saveBtn");
    const inputs = document.querySelectorAll(".profile-box input");

    // 🔹 편집 버튼 클릭
    editBtn.addEventListener("click", () => {
        inputs.forEach(input => {
            input.disabled = false;
            input.classList.add("editing"); // 테두리 강조
        });
        editBtn.style.display = "none";
        saveBtn.style.display = "inline-block";
    });

    // 🔹 저장 버튼 클릭
    saveBtn.addEventListener("click", async () => {
        // 입력값 가져오기
        const formData = {};
        inputs.forEach(input => {
            formData[input.name] = input.value;
        });

        try {
            const token = localStorage.getItem('token'); // 로그인 토큰
            const response = await fetch(API_ENDPOINTS.resume, {
                method: 'POST', // 혹은 PUT, 백엔드에 맞게
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (!response.ok || data.success === false) {
                throw new Error(data.message || '저장 실패');
            }

            // UI 상태 원복
            inputs.forEach(input => {
                input.disabled = true;
                input.classList.remove("editing");
            });

            saveBtn.style.display = "none";
            editBtn.style.display = "inline-block";

            alert("정보가 성공적으로 저장되었습니다.");
        } catch (err) {
            console.error("프로필 저장 오류:", err);
            alert("정보 저장 중 오류가 발생했습니다.");
        }
    });
});
