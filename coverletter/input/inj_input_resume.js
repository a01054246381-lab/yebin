const eduList = document.getElementById("eduList");
    const expList = document.getElementById("expList");
    const certList = document.getElementById("certList");

    const addEduBtn = document.getElementById("addEduBtn");
    const addExpBtn = document.getElementById("addExpBtn");
    const addCertBtn = document.getElementById("addCertBtn");

    const saveBtn = document.getElementById("saveBtn");
    const statusEl = document.getElementById("status");

    function setStatus(msg, type = "") {
      statusEl.textContent = msg || "";
      statusEl.className = "status" + (type ? ` ${type}` : "");
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
          let val = el.value;

          if (val === "") val = null;
          if (key === "is_current" || key === "last_edu" || key === "display_order" || key === "career_month") {
            val = val === null ? 0 : Number(val);
          }
          if (key === "gpa" || key === "gpa_scale") {
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
      e1.querySelector('[data-k="is_current"]').value = "0";
      e1.querySelector('[data-k="last_edu"]').value = "0";
      e1.querySelector('[data-k="display_order"]').value = "1";

      const e2 = createItem("eduTemplate", eduList);
      e2.querySelector('[data-k="school_name"]').value = "서울대학교";
      e2.querySelector('[data-k="degree_level"]').value = "학사";
      e2.querySelector('[data-k="major"]').value = "컴퓨터공학";
      e2.querySelector('[data-k="gpa"]').value = "3.5";
      e2.querySelector('[data-k="gpa_scale"]').value = "4.5";
      e2.querySelector('[data-k="start_date"]').value = "2018-03-01";
      e2.querySelector('[data-k="end_date"]').value = "2022-02-28";
      e2.querySelector('[data-k="is_current"]').value = "0";
      e2.querySelector('[data-k="last_edu"]').value = "1";
      e2.querySelector('[data-k="display_order"]').value = "2";

      // 경력 기본 1개
      const x1 = createItem("expTemplate", expList);
      x1.querySelector('[data-k="company_name"]').value = "삼성";
      x1.querySelector('[data-k="position"]').value = "인턴";
      x1.querySelector('[data-k="start_date"]').value = "2025-04-01";
      x1.querySelector('[data-k="end_date"]').value = "2025-07-01";
      x1.querySelector('[data-k="career_month"]').value = "3";
      x1.querySelector('[data-k="is_current"]').value = "0";
      x1.querySelector('[data-k="location"]').value = "서울";
      x1.querySelector('[data-k="display_order"]').value = "1";

      // 자격증 기본 1개
      const c1 = createItem("certTemplate", certList);
      c1.querySelector('[data-k="cert_name"]').value = "컴활";
      c1.querySelector('[data-k="issued_date"]').value = "2024-07-12";
      c1.querySelector('[data-k="credential_id"]').value = "1234";
    }

    addEduBtn.addEventListener("click", () => createItem("eduTemplate", eduList));
    addExpBtn.addEventListener("click", () => createItem("expTemplate", expList));
    addCertBtn.addEventListener("click", () => createItem("certTemplate", certList));

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