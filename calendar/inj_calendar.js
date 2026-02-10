const monthYear = document.getElementById("monthYear");
const calendarDates = document.getElementById("calendarDates");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

let currentDate = new Date();

function renderCalendar() {
    calendarDates.innerHTML = "";

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    monthYear.innerText = `${year}년 ${month + 1}월`;

    const firstDay = new Date(year, month, 1).getDay();
    const lastDate = new Date(year, month + 1, 0).getDate();

    // 빈 칸
    for (let i = 0; i < firstDay; i++) {
        calendarDates.appendChild(document.createElement("div"));
    }

    for (let day = 1; day <= lastDate; day++) {
        const dateDiv = document.createElement("div");
        dateDiv.innerText = day;

        const today = new Date();
        if (
            day === today.getDate() &&
            month === today.getMonth() &&
            year === today.getFullYear()
        ) {
            dateDiv.classList.add("today");
        }

        dateDiv.addEventListener("click", () => {
            document
                .querySelectorAll(".calendar-dates div")
                .forEach(d => d.classList.remove("selected"));

            dateDiv.classList.add("selected");
        });

        calendarDates.appendChild(dateDiv);
    }
}

prevBtn.addEventListener("click", () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar();
});

nextBtn.addEventListener("click", () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar();
});

renderCalendar();
