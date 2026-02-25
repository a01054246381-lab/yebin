const eduList = document.getElementById("eduList");
    const expList = document.getElementById("expList");
    const certList = document.getElementById("certList");

    const addEduBtn = document.getElementById("addEduBtn");
    const addExpBtn = document.getElementById("addExpBtn");
    const addCertBtn = document.getElementById("addCertBtn");

    const saveBtn = document.getElementById("saveBtn");
    const eduStatus = document.getElementById("eduStatus");
const expStatus = document.getElementById("expStatus");
const certStatus = document.getElementById("certStatus");
    const MAX_ITEMS = 5;
    function setStatus(target, msg, type = ""){
  if(!target) return;   // 안전장치

  target.textContent = msg || "";
  target.className = "status" + (type ? ` ${type}` : "");
}

    function createItem(templateId, target) {
      const tpl = document.getElementById(templateId);
      const node = tpl.content.firstElementChild.cloneNode(true);
      node.querySelector(".remove-item").addEventListener("click", () => node.remove());
      target.appendChild(node);
      return node;
    }

    function readItems(containerSelector) {
      const items = Array.from(document.querySelectorAll(containerSelector));
      return items.map((item) => {
        const obj = {};
        item.querySelectorAll("[data-k]").forEach((el) => {
          const key = el.dataset.k;
          let val;

          /* =========================
         checkbox 처리 ⭐ 추가
      ========================= */
      if (el.type === "checkbox") {
        val = el.checked ? 1 : 0;   // DB용 (boolean이면 true/false도 가능)
      } else {
        val = el.value;
        if (val === "") val = null;
      }

      /* =========================
         숫자 변환
      ========================= */
      if (["display_order", "career_month"].includes(key)) {
        val = val === null ? 0 : Number(val);
      }

      if (["gpa", "gpa_scale"].includes(key)) {
        val = val === null ? null : Number(val);
      }

      obj[key] = val;
    });

    return obj;
  });
}

    function seedDefaultData() {
      // 학력 기본 2개
      const e1 = createItem("eduTemplate", eduList);
      e1.querySelector('[data-k="school_name"]').value = "서울고등학교";
      e1.querySelector('[data-k="degree_level"]').value = "고등학교";
      e1.querySelector('[data-k="start_date"]').value = "2013-03-01";
      e1.querySelector('[data-k="end_date"]').value = "2016-02-29";
      e1.querySelector('[data-k="is_current"]').checked = false;
      e1.querySelector('[data-k="last_edu"]').checked = false;
      e1.querySelector('[data-k="display_order"]').value = "1";

      const e2 = createItem("eduTemplate", eduList);
      e2.querySelector('[data-k="school_name"]').value = "서울대학교";
      e2.querySelector('[data-k="degree_level"]').value = "학사";
      e2.querySelector('[data-k="major"]').value = "컴퓨터공학";
      e2.querySelector('[data-k="gpa"]').value = "3.5";
      e2.querySelector('[data-k="gpa_scale"]').value = "4.5";
      e2.querySelector('[data-k="start_date"]').value = "2018-03-01";
      e2.querySelector('[data-k="end_date"]').value = "2022-02-28";
      e1.querySelector('[data-k="is_current"]').checked = false;
      e2.querySelector('[data-k="last_edu"]').value = "1";
      e2.querySelector('[data-k="display_order"]').value = "2";

      // 경력 기본 1개
      const x1 = createItem("expTemplate", expList);
      x1.querySelector('[data-k="company_name"]').value = "삼성";
      x1.querySelector('[data-k="position"]').value = "인턴";
      x1.querySelector('[data-k="start_date"]').value = "2025-04-01";
      x1.querySelector('[data-k="end_date"]').value = "2025-07-01";
      x1.querySelector('[data-k="career_month"]').value = "3";
      e1.querySelector('[data-k="is_current"]').checked = false;
      x1.querySelector('[data-k="location"]').value = "서울";
      x1.querySelector('[data-k="display_order"]').value = "1";

      // 자격증 기본 1개
      const c1 = createItem("certTemplate", certList);
      c1.querySelector('[data-k="cert_name"]').value = "컴활";
      c1.querySelector('[data-k="issued_date"]').value = "2024-07-12";
      c1.querySelector('[data-k="credential_id"]').value = "1234";
    }

  addEduBtn.addEventListener("click", () => {
  if(canAdd(eduList, "학력", eduStatus)){
    createItem("eduTemplate", eduList);
  }
});

addExpBtn.addEventListener("click", () => {
  if(canAdd(expList, "경력", expStatus)){
    createItem("expTemplate", expList);
  }
});

addCertBtn.addEventListener("click", () => {
  if(canAdd(certList, "자격증", certStatus)){
    createItem("certTemplate", certList);
  }
});

    saveBtn.addEventListener("click", async () => {
      const userId = Number(document.getElementById("userId").value);
      const cover = document.getElementById("cover").value.trim();

      if (!userId || userId < 1) {
        setStatus("아이디를 올바르게 입력하세요.", "err");
        return;
      }
      if (!cover) {
        setStatus("자기소개서를 입력하세요.", "err");
        return;
      }

      const payload = {
        user_id: userId,
        cover,
        edu_list: readItems(".edu-item"),
        exp_list: readItems(".exp-item"),
        cert_list: readItems(".cert-item")
      };

      try {
        saveBtn.disabled = true;
        setStatus("저장 중입니다...");

        const res = await fetch("/api/resumes/full", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });

        const raw = await res.text();
        let data = {};
        try { data = raw ? JSON.parse(raw) : {}; } catch { data = { message: raw }; }

        if (!res.ok) {
          throw new Error(data.message || "저장 실패");
        }

        setStatus(`저장 완료: resume_id=${data.resume_id}`, "ok");
      } catch (err) {
        setStatus(`저장 오류: ${err.message}`, "err");
      } finally {
        saveBtn.disabled = false;
      }
    });

    seedDefaultData();

    function canAdd(container, label, statusEl){
  const count = container.children.length;

  if(count >= MAX_ITEMS){
    setStatus(statusEl, `${label}은 최대 ${MAX_ITEMS}개까지 추가 가능합니다.`, "err");
    return false;
  }

  setStatus(statusEl, "");
  return true;
}