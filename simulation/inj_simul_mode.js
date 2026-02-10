const cards = document.querySelectorAll(".mode-card");

cards.forEach(card => {
    card.addEventListener("click", () => {

        // 기존 선택 제거
        cards.forEach(c => c.classList.remove("selected"));

        // 현재 카드 선택 표시
        card.classList.add("selected");

        // 페이지 이동
        const link = card.dataset.link;
        setTimeout(() => {
    window.location.href = link;
}, 200);
    });
});
