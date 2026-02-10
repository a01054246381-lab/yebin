document.addEventListener("DOMContentLoaded", () => {
    const editBtn = document.getElementById("editBtn");
    const saveBtn = document.getElementById("saveBtn");
    const inputs = document.querySelectorAll(".profile-box input");

    // 🔹 변경 버튼 클릭
    editBtn.addEventListener("click", () => {
        inputs.forEach(input => {
            input.disabled = false;
            input.classList.add("editing"); // 테두리 강조
        });

        editBtn.style.display = "none";
        saveBtn.style.display = "inline-block";
    });

    // 🔹 저장 버튼 클릭
    saveBtn.addEventListener("click", () => {
        inputs.forEach(input => {
            input.disabled = true;
            input.classList.remove("editing"); // 강조 제거
        });

        saveBtn.style.display = "none";
        editBtn.style.display = "inline-block";

        alert("정보가 변경되었습니다.");
    });
});
