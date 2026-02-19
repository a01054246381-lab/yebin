/* =========================
   DOM
========================= */
const calendar = document.getElementById("calendar");
const monthTitle = document.getElementById("monthTitle");
const modal = document.getElementById("modal");

const eventText = document.getElementById("eventText");
const eventColor = document.getElementById("eventColor");
const startDateInput = document.getElementById("startDate");
const endDateInput = document.getElementById("endDate");

const modalTitle = document.getElementById("dayTitle");
const dayEventsList = document.getElementById("dayEventList");
const modalForm = document.getElementById("dayAddForm");




/* ========================= */
let today = new Date();
let currentYear = today.getFullYear();
let currentMonth = today.getMonth();
let selectedDate = null;
let selectedIndex = null;

/* ========================= 저장 ======================== */
function getEvents(){
  return JSON.parse(localStorage.getItem("events") || "{}");
}
function saveEvents(data){
  localStorage.setItem("events", JSON.stringify(data));
}

/* ========================= 날짜 유틸 ======================== */
function normalize(date){
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}
function dateKeyToFull(dateKey){
  const [y,m,d] = dateKey.split("-");
  return `${y}-${String(+m+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
}

/* ========================= 달력 ======================== */
function renderCalendar(){

  calendar.innerHTML="";

  const firstDay=new Date(currentYear,currentMonth,1).getDay();
  const lastDate=new Date(currentYear,currentMonth+1,0).getDate();

  monthTitle.textContent=`${currentYear}년 ${currentMonth+1}월`;

  for(let i=0;i<firstDay;i++){
    calendar.innerHTML+=`<div class="day empty"></div>`;
  }

  for(let d=1; d<=lastDate; d++){

    const key=`${currentYear}-${currentMonth}-${d}`;

    const dayDiv=document.createElement("div");
    dayDiv.className="day";
    dayDiv.dataset.date=d;

    /* ⭐⭐⭐ 오늘 날짜 표시 ⭐⭐⭐ */
    const cellDate = new Date(currentYear, currentMonth, d);
    if(
      cellDate.getFullYear() === today.getFullYear() &&
      cellDate.getMonth() === today.getMonth() &&
      cellDate.getDate() === today.getDate()
    ){
      dayDiv.classList.add("today");
    }

    dayDiv.innerHTML=`<div class="date">${d}</div>`;
    dayDiv.onclick=()=>openDayView(key);

    calendar.appendChild(dayDiv);
  }

  drawEventBars();
}


/* ========================= 기간 bar ======================== */
function drawEventBars(){

  const events=getEvents();
  const allEvents=Object.values(events).flat();
  const dayCells=[...calendar.querySelectorAll(".day:not(.empty)")];
  if(!dayCells.length) return;

  const barHeight=25;
  const gap=4;

  const visibleStart=new Date(currentYear,currentMonth,1);
  const visibleEnd=new Date(currentYear,currentMonth+1,0);

  const weeks={};

  allEvents.forEach(ev=>{

    const start=normalize(new Date(ev.start));
    const end=normalize(new Date(ev.end));

    if(end<visibleStart || start>visibleEnd) return;

    const drawStart=start<visibleStart?visibleStart:start;
    const drawEnd=end>visibleEnd?visibleEnd:end;

    let cur=new Date(drawStart);

    while(cur<=drawEnd){

      const dayIndex=dayCells.findIndex(
        c=>parseInt(c.dataset.date)===cur.getDate()
      );

      if(dayIndex===-1){
        cur.setDate(cur.getDate()+1);
        continue;
      }

      const week=Math.floor(dayIndex/7);
      const weekEnd=week*7+6;

      let endIndex=dayIndex;

      while(endIndex<=weekEnd){
        const d=parseInt(dayCells[endIndex]?.dataset.date);
        if(!d) break;
        const test=new Date(currentYear,currentMonth,d);
        if(test>drawEnd) break;
        endIndex++;
      }
      endIndex--;

      if(!weeks[week]) weeks[week]=[];
      weeks[week].push({start:dayIndex,end:endIndex,ev});

      cur.setDate(cur.getDate()+(endIndex-dayIndex+1));
    }
  });

  Object.keys(weeks).forEach(week=>{

    const segs=weeks[week];
    segs.sort((a,b)=>a.start-b.start);

    const lanes=[];

    segs.forEach(seg=>{
      let level=0;
      while(true){
        if(!lanes[level]){ lanes[level]=[]; break; }
        const overlap=lanes[level].some(l=>
          !(seg.end<l.start || seg.start>l.end)
        );
        if(!overlap) break;
        level++;
      }
      lanes[level].push(seg);
      seg.level=level;
    });

    segs.forEach(seg=>{

      const s=dayCells[seg.start];
      const e=dayCells[seg.end];

      const calRect=calendar.getBoundingClientRect();
      const sRect=s.getBoundingClientRect();
      const eRect=e.getBoundingClientRect();

      const bar=document.createElement("div");
      bar.className="event-bar";
      bar.textContent=seg.ev.text;
      bar.style.background=seg.ev.color;
      /* ⭐ 하루 일정이면 왼쪽 정렬 */
      if(seg.ev.start === seg.ev.end){
        bar.classList.add("single-day");
      }

      bar.style.left=sRect.left-calRect.left+"px";
      bar.style.width=eRect.right-sRect.left+"px";

      const dateHeight=s.querySelector(".date").offsetHeight;

      bar.style.top=
        s.offsetTop+
        dateHeight+8+
        seg.level*(barHeight+gap)+"px";

      /* ⭐ 이벤트 클릭 → 수정 */
      bar.onclick=(e)=>{
        e.stopPropagation();
        openEditFromEvent(seg.ev);
      };

      calendar.appendChild(bar);
    });
  });
}

/* ========================= 이벤트 클릭 → 수정 ======================== */
function openEditFromEvent(target){

  const events=getEvents();

  for(const key in events){
    const idx=events[key].findIndex(ev=>
      ev.start===target.start &&
      ev.end===target.end &&
      ev.text===target.text
    );
    if(idx!==-1){
      openEdit(key,idx);
      return;
    }
  }
}

/* ========================= 날짜 클릭 ======================== */
function openDayView(dateKey){

  selectedDate=dateKey;
  selectedIndex=null;

  modalTitle.textContent="오늘 하루 일정";
  modalForm.style.display="none";

  const events=getEvents();
  const full=dateKeyToFull(dateKey);

  dayEventsList.innerHTML="";

  Object.values(events).flat().forEach(ev=>{
    if(full>=ev.start && full<=ev.end){
      const div=document.createElement("div");
      div.className="day-events-item";
      div.style.background=ev.color;
      div.textContent=ev.text;
      div.onclick=()=>openEditFromEvent(ev);
      dayEventsList.appendChild(div);
    }
  });

  if(!dayEventsList.innerHTML){
    dayEventsList.innerHTML="<p>일정 없음</p>";
  }

  modal.style.display="flex";
}

/* ========================= + 일정 추가 ======================== */
function openAddForm(){

  modalTitle.textContent="일정 추가";
  modalForm.style.display="block";

  selectedIndex = null;   // ⭐ 추가 (중요)

  const full=dateKeyToFull(selectedDate);

  eventText.value="";
  eventColor.value="#818cf8";
  startDateInput.value=full;
  endDateInput.value=full;
}



/* ========================= 수정 열기 ======================== */
function openEdit(date,index){

  openAddForm();
  selectedDate=date;
  selectedIndex=index;

  const ev=getEvents()[date][index];

  eventText.value=ev.text;
  eventColor.value=ev.color;
  startDateInput.value=ev.start;
  endDateInput.value=ev.end;

  modal.style.display="flex";   // ⭐ 추가
}


/* ========================= 저장 ======================== */
function saveEvent(){

  const events=getEvents();

  const eventData={
    text:eventText.value,
    color:eventColor.value,
    start:startDateInput.value,
    end:endDateInput.value
  };

  if(selectedIndex!==null){
    events[selectedDate][selectedIndex]=eventData;
  }else{
    if(!events[selectedDate]) events[selectedDate]=[];
    events[selectedDate].push(eventData);
  }

  saveEvents(events);
  closeDayDetail();
  renderCalendar();
}

/* ========================= 닫기 ======================== */
function closeDayDetail(){
  modal.style.display="none";
}

/* ========================= 이동 ======================== */
function prevMonth(){ currentMonth--; if(currentMonth<0){currentMonth=11;currentYear--;} renderCalendar(); }
function nextMonth(){ currentMonth++; if(currentMonth>11){currentMonth=0;currentYear++;} renderCalendar(); }
function goToday(){ currentYear=today.getFullYear(); currentMonth=today.getMonth(); renderCalendar(); }

startDateInput.onchange=()=> endDateInput.value=startDateInput.value;

renderCalendar();
function deleteEvent(){

  if(selectedIndex === null) return;

  const events = getEvents();

  events[selectedDate].splice(selectedIndex,1);

  if(events[selectedDate].length === 0){
    delete events[selectedDate];
  }

  saveEvents(events);
  closeDayDetail();
  renderCalendar();
}
function closeAddForm(){
  modalForm.style.display="none";
}



