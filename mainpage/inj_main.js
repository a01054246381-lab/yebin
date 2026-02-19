/* =====================
   사용자 이름
===================== */
const userName = localStorage.getItem("userName") || "양예빈";
const userEl = document.getElementById("userName");
if (userEl) userEl.textContent = userName;


/* =====================
   AI 추천 메시지
===================== */
const messages = [
  "오늘은 자기소개 답변을 1번만 연습해보세요.",
  "최근 점수가 상승 중입니다 🔥 계속 유지하세요.",
  "이번 주 목표까지 2회 남았습니다.",
  "면접관 시선 처리 연습을 추천합니다.",
  "30초 요약 답변 연습을 해보세요."
];

const msgEl = document.getElementById("aiMessage");
if (msgEl) {
  const random = Math.floor(Math.random() * messages.length);
  msgEl.textContent = messages[random];
}


/* =====================
   오늘 날짜 표시 (있을 때만)
===================== */
const todayDateEl = document.getElementById("todayDate");
if (todayDateEl) {
  const today = new Date();
  todayDateEl.textContent =
    today.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "long"
    });
}


/* =====================
   캘린더 시스템
===================== */

const calendarGrid = document.getElementById("calendarGrid");
const monthTitle = document.getElementById("monthTitle");
const selectedDateText = document.getElementById("selectedDateText");
const scheduleList = document.getElementById("scheduleList");
const modal = document.getElementById("modal");
const scheduleInput = document.getElementById("scheduleInput");

let current = new Date();
let selectedDate = null;

// localStorage 저장
let schedules = JSON.parse(localStorage.getItem("schedules") || "{}");


function saveLocal(){
  localStorage.setItem("schedules", JSON.stringify(schedules));
}


function renderCalendar(){
  if (!calendarGrid) return;

  calendarGrid.innerHTML = "";

  const year = current.getFullYear();
  const month = current.getMonth();
    const today = new Date();


  monthTitle.textContent = `${year}년 ${month+1}월`;

  const firstDay = new Date(year, month, 1).getDay();
  const lastDate = new Date(year, month+1, 0).getDate();

  for(let i=0;i<firstDay;i++){
    calendarGrid.appendChild(document.createElement("div"));
  }

  for(let d=1; d<=lastDate; d++){
    const day = document.createElement("div");
    day.className="day";
    day.textContent=d;

    const key = `${year}-${month+1}-${d}`;

    // 오늘 강조 ⭐⭐⭐
    if(
        d === today.getDate() &&
        month === today.getMonth() &&
        year === today.getFullYear()
    ){
        day.classList.add("today");
    }

    if(schedules[key]) day.classList.add("has-event");

    day.onclick=()=>{
        document.querySelectorAll(".day").forEach(x=>x.classList.remove("active"));
        day.classList.add("active");

        selectedDate = key;
        selectedDateText.textContent = selectedDate;
        renderSchedules();
    };

    calendarGrid.appendChild(day);
}

}


function renderSchedules(){
  if (!scheduleList) return;

  scheduleList.innerHTML="";

  const list = schedules[selectedDate] || [];

  if(list.length===0){
    scheduleList.innerHTML='<p class="empty">일정이 없습니다</p>';
    return;
  }

  list.forEach((text,index)=>{
    const item=document.createElement("div");
    item.className="schedule-item";

    item.innerHTML = `
      ${text}
      <button class="del">삭제</button>
    `;

    item.querySelector(".del").onclick=()=>{
      schedules[selectedDate].splice(index,1);
      saveLocal();
      renderSchedules();
      renderCalendar();
    };

    scheduleList.appendChild(item);
  });
}


/* 일정 추가 */
function openAddModal(){
  if(!selectedDate){
    alert("날짜를 먼저 선택하세요");
    return;
  }
  modal.style.display="flex";
}

function closeModal(){
  modal.style.display="none";
  scheduleInput.value="";
}

function saveSchedule(){
  const text=scheduleInput.value.trim();
  if(!text) return;

  if(!schedules[selectedDate]){
    schedules[selectedDate]=[];
  }

  schedules[selectedDate].push(text);

  saveLocal();
  closeModal();
  renderSchedules();
  renderCalendar();
}


/* 월 이동 */
const prevBtn = document.getElementById("prevMonth");
const nextBtn = document.getElementById("nextMonth");

if (prevBtn) {
  prevBtn.onclick=()=>{
    current.setMonth(current.getMonth()-1);
    renderCalendar();
  };
}

if (nextBtn) {
  nextBtn.onclick=()=>{
    current.setMonth(current.getMonth()+1);
    renderCalendar();
  };
}

renderCalendar();


/* =====================
   슬라이드 배너
===================== */

const track = document.querySelector(".mode-track");
const slides = document.querySelectorAll(".mode-banner");
const prevSlide = document.querySelector(".slide-btn.prev");
const nextSlide = document.querySelector(".slide-btn.next");

let index = 0;
let autoSlide;

function moveSlide(i){
  if(!track) return;

  index = i;
  if(index < 0) index = slides.length - 1;
  if(index >= slides.length) index = 0;

  track.style.transform = `translateX(-${index * 100}%)`;
}

function startAuto(){
  autoSlide = setInterval(()=>moveSlide(index + 1), 3000);
}

function stopAuto(){
  clearInterval(autoSlide);
}

if(nextSlide) nextSlide.onclick=()=>moveSlide(index+1);
if(prevSlide) prevSlide.onclick=()=>moveSlide(index-1);

const slider = document.querySelector(".mode-slider");
if(slider){
  slider.addEventListener("mouseenter", stopAuto);
  slider.addEventListener("mouseleave", startAuto);
}

startAuto();


/* =====================
   D-DAY 계산
===================== */

const interviewDate = new Date("2026-03-01");
const now = new Date();

const diff = interviewDate - now;
const dday = Math.ceil(diff / (1000 * 60 * 60 * 24));

const ddayEl = document.getElementById("dday");
if (ddayEl){
  ddayEl.textContent = dday > 0 ? `D-${dday}` : "오늘";
}
