(function () {
  window.IntroGen = window.IntroGen || {};

  function setList(el, items) {
    el.innerHTML = "";
    for (const item of items) {
      const li = document.createElement("li");
      li.textContent = item;
      el.appendChild(li);
    }
  }

  function createResultApi(els) {
    const {
      resultArea,
      resultTitle,
      outOneLine,
      outDraft,
      outStrengthSummary,
      outTalkPoints,
      outImprovePoints,
      btnCopy,
      btnSave,
    } = els;

    function setResultEmpty() {
      resultTitle.textContent = "결과 미리보기";
      outOneLine.textContent = "아직 생성된 결과가 없습니다. 왼쪽 입력을 채우고 생성해보세요.";
      outDraft.textContent = "결과가 생성되면 여기에 문단형 자기소개가 표시됩니다.";
      outOneLine.classList.add("muted");
      outDraft.classList.add("muted");
      setList(outStrengthSummary, ["강점 요약은 생성 후 표시됩니다."]);
      setList(outTalkPoints, ["참고 포인트는 생성 후 표시됩니다."]);
      setList(outImprovePoints, ["보완 포인트는 생성 후 표시됩니다."]);
      outStrengthSummary.classList.add("muted");
      outTalkPoints.classList.add("muted");
      outImprovePoints.classList.add("muted");
      btnCopy.disabled = true;
      btnSave.disabled = true;
      delete resultArea.dataset.generated;
      delete resultArea.dataset.fullText;
    }

    function scrollToResult() {
      resultArea.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    function applyResult(result) {
      resultTitle.textContent = `${result.name}님의 자기소개 결과`;
      outOneLine.textContent = result.oneLine;
      outDraft.textContent = result.draft;

      outOneLine.classList.remove("muted");
      outDraft.classList.remove("muted");
      outStrengthSummary.classList.remove("muted");
      outTalkPoints.classList.remove("muted");
      outImprovePoints.classList.remove("muted");

      setList(outStrengthSummary, result.strengthBullets);
      setList(outTalkPoints, result.talkBullets);
      setList(outImprovePoints, result.improveBullets);

      btnCopy.disabled = false;
      btnSave.disabled = false;
      resultArea.dataset.generated = "1";
      resultArea.dataset.fullText = result.fullText;
    }

    function getFullText() {
      return resultArea.dataset.fullText || "";
    }

    return { setResultEmpty, applyResult, scrollToResult, getFullText };
  }

  window.IntroGen.result = { createResultApi };
})();

