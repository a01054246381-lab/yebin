document.addEventListener("DOMContentLoaded", init);

/* =========================
   초기 실행
========================= */
function init(){

    const addBtn = document.getElementById("addCardBtn");
    const container = document.getElementById("cardContainer");

    if(!addBtn){
        console.error("추가 버튼 없음");
        return;
    }

    if(!container){
        console.error("카드 컨테이너 없음");
        return;
    }

    /* 카드 추가 버튼 */
    addBtn.addEventListener("click", () => createCard());

    /* 저장된 카드 복원 */
    loadSavedCards();
}

/* =========================
   카드 저장 / 불러오기
========================= */
function getCards(){
    return JSON.parse(localStorage.getItem("interviewCards") || "[]");
}

function saveCards(cards){
    localStorage.setItem("interviewCards", JSON.stringify(cards));
}

/* =========================
   캘린더 이벤트
========================= */
function getEvents(){
    return JSON.parse(localStorage.getItem("events") || "{}");
}

function saveEvents(data){
    localStorage.setItem("events", JSON.stringify(data));
}

/* =========================
   D-day 계산
========================= */
function getDDay(dateStr){

    const today = new Date();
    const target = new Date(dateStr);

    today.setHours(0,0,0,0);
    target.setHours(0,0,0,0);

    const diff = Math.ceil((target - today) / (1000*60*60*24));

    if(diff > 0) return `D-${diff}`;
    if(diff === 0) return "D-DAY";
    return `D+${Math.abs(diff)}`;
}

/* =========================
   카드 생성
========================= */
function createCard(data = null){

    const wrapper = document.getElementById("cardContainer");
    const id = data?.id || Date.now();

    const card = document.createElement("form");
    card.className = "interview-card";
    card.dataset.id = id;

    card.innerHTML = `
        <div class="card-header">
            <h3>면접 일정</h3>
            <span class="dday">${data?.date ? getDDay(data.date) : ""}</span>
        </div>

        <div class="form-group">
            <label>기업명</label>
            <input type="text" name="company" value="${data?.company || ""}" required>
        </div>

        <div class="form-group">
            <label>지원 직무</label>
            <input type="text" name="position" value="${data?.position || ""}" required>
        </div>

        <div class="form-group">
            <label>면접 날짜</label>
            <input type="date" name="date" value="${data?.date || ""}" required>
        </div>

        <div class="form-group">
            <label>면접 시간</label>
            <input type="time" name="time" value="${data?.time || ""}" required>
        </div>

        <div class="form-group">
            <label>장소</label>
            <input type="text" name="place" value="${data?.place || ""}">
        </div>

        <div class="form-group">
            <label>메모</label>
            <textarea name="memo">${data?.memo || ""}</textarea>
        </div>

        <div style="display:flex; gap:10px;">
            <button type="submit" class="save-btn">저장</button>
            <button type="button" class="delete-card">삭제</button>
        </div>
    `;

    wrapper.appendChild(card);

    /* 날짜 변경 → Dday 갱신 */
    const dateInput = card.querySelector("input[name='date']");
    const ddayEl = card.querySelector(".dday");

    dateInput.onchange = () => {
        ddayEl.textContent = getDDay(dateInput.value);
    };

    /* 저장 */
    card.onsubmit = function(e){
        e.preventDefault();

        const formData = new FormData(card);

        const cardData = {
            id,
            company: formData.get("company"),
            position: formData.get("position"),
            date: formData.get("date"),
            time: formData.get("time"),
            place: formData.get("place"),
            memo: formData.get("memo")
        };

        const cards = getCards();
        const idx = cards.findIndex(c => c.id == id);

        if(idx !== -1) cards[idx] = cardData;
        else cards.push(cardData);

        saveCards(cards);

        /* 캘린더 저장 */
        const title = `${cardData.company} - ${cardData.position}`;
        const d = new Date(cardData.date);
        const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;

        const events = getEvents();
        if(!events[key]) events[key] = [];

        events[key].push({
            text: title,
            start: cardData.date,
            end: cardData.date,
            color:"#6366f1"
        });

        saveEvents(events);

        alert("저장 완료");
    };

    /* 삭제 */
    card.querySelector(".delete-card").onclick = () => {

        const cards = getCards().filter(c => c.id != id);
        saveCards(cards);

        card.remove();
    };
}

/* =========================
   저장된 카드 복원
========================= */
function loadSavedCards(){
    const cards = getCards();
    cards.forEach(card => createCard(card));
}
