(function () {
  window.IntroGen = window.IntroGen || {};

  const {
    normSpace,
    safeSentence,
    splitList,
    isStudent,
    pickTone,
    tonePhrases,
    lengthConfig,
    toBullets,
  } = window.IntroGen.shared;

  function buildResult(data) {
    const name = normSpace(data.name);
    const situation = normSpace(data.situation);
    const purpose = normSpace(data.purpose);
    const interest = normSpace(data.interest);
    const strengths = splitList(data.strengths, 3);
    const keywords = splitList(data.keywords, 3);
    const experience = normSpace(data.experience);
    const effort = normSpace(data.effort);
    const goal = normSpace(data.goal);
    const desiredPath = normSpace(data.desiredPath);
    const targetOrg = normSpace(data.targetOrg);

    const tone = pickTone(data.tone, situation, purpose);
    const phrases = tonePhrases(tone);
    const len = lengthConfig(data.length);

    const purposeTail = purpose && purpose !== "기타" ? `${purpose}에 필요한 역량을` : "나의 경험을";

    const student = isStudent(situation);
    const purposeIsJob = ["면접 준비", "취업 자기소개", "포트폴리오 소개"].includes(purpose);
    const jobLike = purposeIsJob || situation === "취업준비생" || situation === "구직청년" || situation === "직장인";

    const situationPhrase = situation ? `${situation} ${name}` : name;
    const interestPhrase = student ? `${interest}에 관심을 가지고 꾸준히 탐구해온` : `${interest} 분야에 관심을 두고 실천을 이어온`;

    const orgPhrase = targetOrg ? ` ${targetOrg}에` : "";
    const pathPhrase = desiredPath ? ` ${desiredPath}를 목표로` : "";

    // One-line
    const oneLineParts = [];
    oneLineParts.push(`${interest}에 관심 있는 ${situation || ""} ${name}`.replace(/\s+/g, " ").trim());
    if (strengths.length) oneLineParts.push(`(${strengths.join("·")})`);
    const oneLine = oneLineParts.join(" ");

    // Paragraph 1
    const p1a = `${phrases.greet} 저는 ${interestPhrase} ${situationPhrase}입니다.`;
    const p1b = jobLike ? `배움과 실행을 바탕으로 ${purposeTail} 탄탄하게 정리하고자 합니다.` : `관심 분야를 더 깊게 이해하기 위해 작은 실천을 계속해왔습니다.`;
    const p1c = orgPhrase
      ? `${orgPhrase} 지원을 준비하며, 제가 쌓아온 경험을 정리해 전달하고자 합니다.`
      : `이번 자기소개에서는 제가 어떤 사람인지 핵심을 중심으로 소개드리겠습니다.`;

    // Paragraph 2
    const s1 = strengths[0] || "성실함";
    const s2 = strengths[1] || "끈기";
    const s3 = strengths[2] || "협업";
    const p2a = `저의 강점은 ${s1}, ${s2}, ${s3}입니다. 단순히 장점으로 끝나는 것이 아니라, 목표를 세우면 끝까지 해내는 태도로 이어집니다.`;
    const p2b = jobLike
      ? `업무나 과제에서 기준을 세우고, 필요한 정보를 빠르게 정리해 실행 가능한 계획으로 바꾸는 데 익숙합니다.`
      : `수업이나 활동에서 맡은 역할을 책임지고, 궁금한 점을 스스로 찾아보며 배움을 넓혀왔습니다.`;
    const p2c =
      len.extra >= 2 ? `또한 결과를 만드는 과정에서 기록과 피드백을 중요하게 생각하며, 다음 시도에서 더 나아지도록 습관을 만들었습니다.` : "";

    // Paragraph 3
    const p3a = `가장 기억에 남는 경험은 ${safeSentence(experience)} 이 과정에서 저는 ${safeSentence(effort)}`;
    const p3b = student
      ? `그 경험을 통해 ‘끝까지 해보는 힘’과 ‘함께할 때 더 멀리 갈 수 있다’는 점을 배웠습니다.`
      : `그 경험을 통해 문제를 쪼개어 접근하는 방식과, 함께 일할 때의 소통 기준이 얼마나 중요한지 체감했습니다.`;
    const p3c =
      len.detail >= 2 ? `특히 진행 중 막히는 구간이 생겼을 때는 정보를 다시 찾아 정리하고, 필요한 경우 주변의 피드백을 받아 방향을 조정했습니다.` : "";

    // Paragraph 4
    const goalBase = safeSentence(goal);
    const p4a = `앞으로는 ${goalBase}`.trim();
    const p4b = desiredPath
      ? `${pathPhrase} 필요한 역량을 체계적으로 쌓아, 배운 것을 결과로 연결하는 사람으로 성장하고 싶습니다.`
      : `관심 분야를 더 깊게 탐구하며, 배운 것을 실제 결과로 연결하는 사람으로 성장하고 싶습니다.`;
    const p4c = jobLike
      ? `${orgPhrase} 저는 성실함과 실행력을 바탕으로 팀에 도움이 되는 구성원이 되겠습니다. ${phrases.closer}`
      : `이번 ${purpose || "활동"}을 통해 배운 내용을 정리하고, 다음 도전으로 이어가겠습니다. ${phrases.closer}`;

    const paragraphs = [
      [p1a, p1b, len.extra ? p1c : ""].filter(Boolean).join(" "),
      [p2a, p2b, p2c].filter(Boolean).join(" "),
      [p3a, p3b, p3c].filter(Boolean).join(" "),
      [p4a, p4b, p4c].filter(Boolean).join(" "),
    ];

    const draft = paragraphs.join("\n\n");

    // Strength summary
    const strengthBullets = [];
    strengthBullets.push(`${s1}: 맡은 일의 기준을 세우고 끝까지 마무리합니다.`);
    strengthBullets.push(`${s2}: 어려움이 있어도 과정을 쌓아 해결합니다.`);
    strengthBullets.push(`${s3}: 역할을 나누고 소통하며 함께 결과를 만듭니다.`);
    if (keywords.length) strengthBullets.push(`키워드: ${keywords.join(", ")}`);

    // Talk points
    const talkBullets = [];
    talkBullets.push(`경험 한 줄 요약: ${normSpace(experience)}`);
    talkBullets.push(`내 역할/노력: ${normSpace(effort)}`);
    talkBullets.push(`배운 점: 다음 시도에 어떻게 반영했는지 설명`);
    if (targetOrg) talkBullets.push(`지원 동기 연결: 왜 ${targetOrg}인지 1~2문장으로 정리`);
    if (desiredPath) talkBullets.push(`목표 연결: ${desiredPath}를 위해 무엇을 준비 중인지`);

    // Improvements
    const improveBullets = [];
    if (jobLike) {
      improveBullets.push("성과/결과 수치: 가능하면 결과를 숫자(기간, 분량, 횟수)로 보강");
      improveBullets.push("협업 디테일: 소통 방식(회의/문서/피드백) 예시를 1가지 추가");
    } else {
      improveBullets.push("구체성: 활동에서 ‘무엇을’ ‘어떻게’ 했는지 한 문장 더 보강");
      improveBullets.push("성장 연결: 경험 이후 달라진 점(습관/태도/실천)을 덧붙이기");
    }
    improveBullets.push("문장 다듬기: 길게 느껴지는 문장은 두 문장으로 나누기");

    const fullText = [
      `한 줄 소개: ${oneLine}`,
      "",
      "자기소개문 초안",
      draft,
      "",
      "핵심 강점 요약",
      toBullets(strengthBullets).map((b) => `- ${b}`).join("\n"),
      "",
      "면접에서 말할 때 참고할 포인트",
      toBullets(talkBullets).map((b) => `- ${b}`).join("\n"),
      "",
      "보완하면 좋은 부분",
      toBullets(improveBullets).map((b) => `- ${b}`).join("\n"),
      "",
    ].join("\n");

    return { name, oneLine, draft, strengthBullets, talkBullets, improveBullets, fullText };
  }

  window.IntroGen.generator = { buildResult };
})();

