document.addEventListener("DOMContentLoaded", () => {

    const list = document.getElementById("interviewerList");
    const nameEl = document.getElementById("interviewerName");
    const roleEl = document.getElementById("interviewerRole");

    const saved = JSON.parse(localStorage.getItem("selectedInterviewers"));

    if (!saved || saved.length === 0) {
        nameEl.textContent = "면접관 없음";
        return;
    }

    saved.forEach((person, index) => {

        const img = document.createElement("img");
        img.src = person.img;
        img.className = "avatar";

        if (index === 0) {
            img.classList.add("active");
            nameEl.textContent = person.name;
            roleEl.textContent = person.role;
        }

        img.addEventListener("click", () => {

            document.querySelectorAll(".avatar")
                .forEach(a => a.classList.remove("active"));

            img.classList.add("active");

            nameEl.textContent = person.name;
            roleEl.textContent = person.role;
        });

        list.appendChild(img);
    });

});
