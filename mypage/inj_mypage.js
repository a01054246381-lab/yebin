const editBtn = document.getElementById("editBtn");
const inputs = document.querySelectorAll(".profile-box input");

let isEditing = false;

editBtn.addEventListener("click", () => {
    isEditing = !isEditing;

    inputs.forEach(input => {
        input.disabled = !isEditing;
    });

    editBtn.innerText = isEditing ? "저장" : "변경";
});
