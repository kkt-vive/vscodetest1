(function () {
  window.IntroGen = window.IntroGen || {};
  const { normSpace } = window.IntroGen.shared;

  const requiredIds = [
    "name",
    "situation",
    "purpose",
    "interest",
    "strengths",
    "experience",
    "effort",
    "goal",
    "keywords",
  ];

  const labelMap = {
    name: "이름",
    situation: "현재 상황",
    purpose: "자기소개 목적",
    interest: "관심 분야",
    strengths: "나의 강점 3가지",
    experience: "기억에 남는 경험",
    effort: "내가 노력한 점",
    goal: "앞으로의 목표",
    keywords: "나를 표현하는 키워드 3개",
  };

  function validateRequired(data) {
    const missing = [];
    for (const id of requiredIds) {
      const value = normSpace(data[id]);
      if (!value) missing.push(id);
    }
    if (!missing.length) return { ok: true, message: "" };
    const names = missing.map((m) => labelMap[m] || m);
    return { ok: false, message: `필수 항목을 확인해주세요: ${names.join(", ")}` };
  }

  window.IntroGen.validation = { validateRequired };
})();

