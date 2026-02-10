const MAX_COUNT = 3;

// ➕ 추가 버튼
document.querySelectorAll(".add-row").forEach(button => {
  button.addEventListener("click", () => {
    const targetId = button.dataset.target;
    const tbody = document.getElementById(targetId);
    const rows = tbody.querySelectorAll("tr");
    const limitMsg = document.querySelector(
      `.limit-msg[data-target="${targetId}"]`
    );

    if (rows.length >= MAX_COUNT) {
      limitMsg.style.display = "block";
      return;
    }

    limitMsg.style.display = "none";

    const newRow = rows[0].cloneNode(true);
    newRow.querySelectorAll("input").forEach(input => input.value = "");

    tbody.appendChild(newRow);
  });
});

// ➖ 삭제 버튼 (이벤트 위임)
document.addEventListener("click", e => {
  if (!e.target.classList.contains("remove-row")) return;

  const tbody = e.target.closest("tbody");
  const rows = tbody.querySelectorAll("tr");

  if (rows.length === 1) {
    alert("최소 1개 이상은 입력해야 합니다.");
    return;
  }

  e.target.closest("tr").remove();

  const targetId = tbody.id;
  const limitMsg = document.querySelector(
    `.limit-msg[data-target="${targetId}"]`
  );
  if (limitMsg) limitMsg.style.display = "none";
});
