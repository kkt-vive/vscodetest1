(function () {
  window.IntroGen = window.IntroGen || {};

  const { persistDraft, restoreDraft, clearDraft, fileSafeName } = window.IntroGen.shared;
  const { createToastApi } = window.IntroGen.toast;
  const { createResultApi } = window.IntroGen.result;
  const { buildResult } = window.IntroGen.generator;
  const { validateRequired } = window.IntroGen.validation;

  function copyToClipboard(text) {
    if (!text) return Promise.resolve(false);
    return navigator.clipboard
      .writeText(text)
      .then(() => true)
      .catch(() => {
        try {
          const ta = document.createElement("textarea");
          ta.value = text;
          ta.setAttribute("readonly", "true");
          ta.style.position = "fixed";
          ta.style.left = "-9999px";
          ta.style.top = "0";
          document.body.appendChild(ta);
          ta.select();
          const ok = document.execCommand("copy");
          document.body.removeChild(ta);
          return ok;
        } catch {
          return false;
        }
      });
  }

  function saveTxt(filename, text) {
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function init() {
    const form = document.getElementById("introForm");
    const errorBox = document.getElementById("errorBox");
    const btnCopy = document.getElementById("btnCopy");
    const btnSave = document.getElementById("btnSave");
    const btnReset = document.getElementById("btnReset");

    const resultApi = createResultApi({
      resultArea: document.getElementById("resultArea"),
      resultTitle: document.getElementById("resultTitle"),
      outOneLine: document.getElementById("oneLine"),
      outDraft: document.getElementById("draft"),
      outStrengthSummary: document.getElementById("strengthSummary"),
      outTalkPoints: document.getElementById("talkPoints"),
      outImprovePoints: document.getElementById("improvePoints"),
      btnCopy,
      btnSave,
    });

    const toastApi = createToastApi(document.getElementById("toast"));

    function setError(message) {
      const msg = window.IntroGen.shared.normSpace(message);
      if (!msg) {
        errorBox.textContent = "";
        errorBox.classList.remove("show");
        return;
      }
      errorBox.textContent = msg;
      errorBox.classList.add("show");
    }

    function getFormData() {
      const fd = new FormData(form);
      const data = Object.fromEntries(fd.entries());
      for (const k of Object.keys(data)) data[k] = String(data[k] || "");
      return data;
    }

    // Restore
    restoreDraft(form);
    resultApi.setResultEmpty();

    // Persist
    form.addEventListener("input", () => {
      persistDraft(form);
      setError("");
    });
    form.addEventListener("change", () => {
      persistDraft(form);
      setError("");
    });

    // Generate
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const data = getFormData();
      const v = validateRequired(data);
      if (!v.ok) {
        setError(v.message);
        toastApi.showToast("필수 항목을 확인해주세요");
        return;
      }

      const result = buildResult(data);
      resultApi.applyResult(result);
      toastApi.showToast("자기소개 초안 생성 완료");
      resultApi.scrollToResult();
    });

    // Reset
    btnReset.addEventListener("click", () => {
      form.reset();
      clearDraft();
      setError("");
      resultApi.setResultEmpty();
      toastApi.showToast("초기화 완료");
    });

    // Copy
    btnCopy.addEventListener("click", async () => {
      const text = resultApi.getFullText();
      if (!text) return;
      const ok = await copyToClipboard(text);
      toastApi.showToast(ok ? "복사 완료" : "복사에 실패했어요");
    });

    // Save
    btnSave.addEventListener("click", () => {
      const text = resultApi.getFullText();
      if (!text) return;
      const name = fileSafeName(document.getElementById("name").value);
      const filename = `${name}_자기소개.txt`;
      saveTxt(filename, text);
      toastApi.showToast("TXT 저장 완료");
    });
  }

  document.addEventListener("DOMContentLoaded", init);
})();

