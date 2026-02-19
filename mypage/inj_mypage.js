const editBtn = document.getElementById("editBtn");
const saveBtn = document.getElementById("saveBtn");
const inputs = document.querySelectorAll(".form-grid input");
const toast = document.getElementById("toast");

let isEditing = false;

/* =======================
   수정 버튼 클릭
======================= */
editBtn.addEventListener("click", () => {

    isEditing = true;

    inputs.forEach(input => {
        input.disabled = false;
        input.classList.add("editing");
    });

    editBtn.style.display = "none";
    saveBtn.style.display = "inline-block";
});

/* =======================
   저장 버튼 클릭
======================= */
saveBtn.addEventListener("click", () => {

    isEditing = false;

    inputs.forEach(input => {
        input.disabled = true;
        input.classList.remove("editing");
    });

    saveBtn.style.display = "none";
    editBtn.style.display = "inline-block";

    showToast();
});

/* =======================
   Toast
======================= */
function showToast() {
    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 2000);
}
