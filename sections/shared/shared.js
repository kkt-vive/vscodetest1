(function () {
  window.IntroGen = window.IntroGen || {};

  const STORAGE_KEY = "intro_generator_draft_v1";

  function normSpace(text) {
    return String(text || "")
      .replace(/\s+/g, " ")
      .trim();
  }

  function safeSentence(text) {
    const t = normSpace(text);
    if (!t) return "";
    const end = /[.!?。]|습니다$|니다$|요$/.test(t) ? "" : ".";
    return t + end;
  }

  function splitList(text, maxItems) {
    const raw = String(text || "");
    const parts = raw
      .split(/[,/，]/g)
      .map((p) => normSpace(p))
      .filter(Boolean);
    const unique = [];
    for (const p of parts) {
      if (!unique.includes(p)) unique.push(p);
      if (unique.length >= maxItems) break;
    }
    return unique;
  }

  function isStudent(situation) {
    return ["중학생", "고등학생", "대학생"].includes(situation);
  }

  function pickTone(toneRaw, situation, purpose) {
    const tone = normSpace(toneRaw);
    const purposeIsJob = ["면접 준비", "취업 자기소개", "포트폴리오 소개"].includes(purpose);
    if (!tone) {
      if (purposeIsJob || situation === "취업준비생" || situation === "구직청년" || situation === "직장인") {
        return "진지하고 성실한 문체";
      }
      return "담백한 문체";
    }
    return tone;
  }

  function tonePhrases(tone) {
    switch (tone) {
      case "밝고 친근한 문체":
        return {
          greet: "안녕하세요!",
          closer: "감사합니다.",
          vibe: "밝고 친근하게",
          assert: "자신 있게 도전해왔습니다",
          honest: "솔직하게 말씀드리면",
        };
      case "자신감 있는 문체":
        return {
          greet: "안녕하세요.",
          closer: "끝까지 책임지고 성장하겠습니다.",
          vibe: "자신감 있게",
          assert: "결과로 증명해왔습니다",
          honest: "핵심은",
        };
      case "면접용 공식 문체":
        return {
          greet: "안녕하십니까.",
          closer: "기여로 보여드리겠습니다.",
          vibe: "공식적으로",
          assert: "지속적으로 역량을 강화해왔습니다",
          honest: "요약하면",
        };
      case "진지하고 성실한 문체":
        return {
          greet: "안녕하세요.",
          closer: "꾸준한 실행으로 성장하겠습니다.",
          vibe: "성실하게",
          assert: "꾸준함으로 쌓아왔습니다",
          honest: "무엇보다",
        };
      case "담백한 문체":
      default:
        return {
          greet: "안녕하세요.",
          closer: "감사합니다.",
          vibe: "담백하게",
          assert: "차근차근 쌓아왔습니다",
          honest: "특히",
        };
    }
  }

  function lengthConfig(lenRaw) {
    const len = normSpace(lenRaw) || "보통";
    if (len === "짧게") return { extra: 0, detail: 0 };
    if (len === "길게") return { extra: 2, detail: 2 };
    return { extra: 1, detail: 1 };
  }

  function toBullets(items) {
    return items.filter(Boolean).map((t) => normSpace(t));
  }

  function fileSafeName(name) {
    const base = normSpace(name) || "자기소개";
    return base.replace(/[\\/:*?"<>|]/g, "_");
  }

  function persistDraft(form) {
    const fd = new FormData(form);
    const data = Object.fromEntries(fd.entries());
    for (const k of Object.keys(data)) data[k] = String(data[k] || "");
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ data, ts: Date.now() }));
    } catch {
      // ignore storage failures
    }
  }

  function restoreDraft(form) {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== "object" || !parsed.data) return;
      for (const [k, v] of Object.entries(parsed.data)) {
        const el = form.elements[k];
        if (!el) continue;
        el.value = String(v || "");
      }
    } catch {
      // ignore
    }
  }

  function clearDraft() {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  }

  window.IntroGen.shared = {
    normSpace,
    safeSentence,
    splitList,
    isStudent,
    pickTone,
    tonePhrases,
    lengthConfig,
    toBullets,
    fileSafeName,
    persistDraft,
    restoreDraft,
    clearDraft,
  };
})();

