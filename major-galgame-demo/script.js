const routes = {
  intro: {
    speaker: "旁白",
    text: "夏末的午后，哈工深的实验平台被光照得发亮。五位学姐同时向你伸出手：选专业不是选择一条铁轨，而是选择你想怎样理解未来。",
    choices: [
      ["cs", "⌨", "计算机科学与技术", "Computer Science"],
      ["ee", "⚡", "电气工程及其自动化", "Electrical Engineering"],
      ["auto", "⚙", "自动化", "Automation"],
      ["ic", "▣", "集成电路设计与集成系统", "Integrated Circuit"],
      ["comm", "⌁", "通信工程", "Communication Engineering"]
    ]
  },
  cs: {
    speaker: "洛泠",
    focus: "cs",
    text: "洛泠把终端窗口推到你面前，屏幕上是一段还没跑通的校园导览 AI。她笑着说：如果你喜欢把混乱的问题拆成清晰的模型，计算机会很适合你。代码不是魔法，是一次次把想法落到可运行的世界里。",
    score: { logic: 2, passion: 1, team: 0 },
    choices: [
      ["csLab", "⌨", "进入算法实验", "帮她修好导览 AI"],
      ["intro", "↺", "回到选择界面", "再听听别的方向"]
    ]
  },
  ee: {
    speaker: "栖禾",
    focus: "ee",
    text: "栖禾站在电力电子平台旁，示波器的波形像潮汐一样起伏。她说：电气的浪漫在于看不见的能量被你驯服。电机、电网、电力电子，都在把真实世界推向更高效率。",
    score: { logic: 1, passion: 2, team: 0 },
    choices: [
      ["eeLab", "⚡", "参与能源调度", "让实验楼稳定供能"],
      ["intro", "↺", "回到选择界面", "再听听别的方向"]
    ]
  },
  auto: {
    speaker: "青岚",
    focus: "auto",
    text: "青岚蹲在移动机器人旁边，轻轻敲了敲还在校准的激光雷达。她说：自动化介于硬件、软件和控制之间。你会让机器人知道自己在哪里，也让系统在变化中保持稳定。",
    score: { logic: 1, passion: 1, team: 1 },
    choices: [
      ["autoLab", "⚙", "进入控制实验室", "让机器真正动起来"],
      ["intro", "↺", "回到选择界面", "再听听别的方向"]
    ]
  },
  ic: {
    speaker: "微澜",
    focus: "ic",
    text: "微澜把一张版图投到空中，密密麻麻的走线像一座夜晚发亮的城市。她说：芯片像一座被压缩到纳米尺度的城市。选择集成电路，就是选择在最底层的物理限制里建造秩序。",
    score: { logic: 2, passion: 0, team: 1 },
    choices: [
      ["icLab", "▣", "查看芯片路线", "从版图到系统"],
      ["intro", "↺", "回到选择界面", "再听听别的方向"]
    ]
  },
  comm: {
    speaker: "星遥",
    focus: "comm",
    text: "星遥站在天线阵列下，抬头看向被晚霞染亮的楼顶。她说：通信工程研究连接本身。信号、网络、卫星、6G，所有远方都需要有人先把路径设计出来。",
    score: { logic: 1, passion: 1, team: 2 },
    choices: [
      ["commLab", "⌁", "仰望通信天线", "让信息抵达远处"],
      ["intro", "↺", "回到选择界面", "再听听别的方向"]
    ]
  },
  csLab: {
    speaker: "洛泠",
    focus: "cs",
    text: "你们把问题拆成图搜索、推荐排序和异常处理三层。模型第一次给出正确路线时，洛泠把咖啡推给你：看见了吗？计算机最迷人的地方，是它能把一个大胆念头变成可以反复验证的系统。",
    score: { logic: 2, passion: 1, team: 1 },
    choices: [
      ["csDeep", "AI", "完成系统展示", "把算法交给真实用户"],
      ["intro", "↺", "重新选择", "换一条路线看看"]
    ]
  },
  eeLab: {
    speaker: "栖禾",
    focus: "ee",
    text: "傍晚突降暴雨，实验楼负载波动。你和栖禾一起调整储能策略，让光伏、电池和电网像乐队一样重新合拍。她说，电气不是只和电打交道，它关心城市怎样安静、可靠、持续地运转。",
    score: { logic: 1, passion: 2, team: 1 },
    choices: [
      ["eeDeep", "⚡", "提交调度方案", "把能量送到需要的地方"],
      ["intro", "↺", "重新选择", "换一条路线看看"]
    ]
  },
  autoLab: {
    speaker: "青岚",
    focus: "auto",
    text: "机器人在拐角前犹豫了半秒。你们重新调 PID，融合 IMU 和视觉定位，最后它稳稳停在目标点前。青岚眨眨眼：自动化最有成就感的瞬间，就是世界很复杂，但系统依然听得懂你的意图。",
    score: { logic: 1, passion: 1, team: 2 },
    choices: [
      ["autoDeep", "⚙", "完成机器人路演", "让控制闭环跑起来"],
      ["intro", "↺", "重新选择", "换一条路线看看"]
    ]
  },
  icLab: {
    speaker: "微澜",
    focus: "ic",
    text: "一次时序违例让全组沉默。微澜没有急，她带你从 RTL 追到综合报告，再回到版图约束。凌晨两点，红色告警终于消失。她轻声说，芯片设计是在最小的地方，做最硬核的决定。",
    score: { logic: 2, passion: 1, team: 1 },
    choices: [
      ["icDeep", "▣", "点亮验证板", "让硅片回答问题"],
      ["intro", "↺", "重新选择", "换一条路线看看"]
    ]
  },
  commLab: {
    speaker: "星遥",
    focus: "comm",
    text: "你们把无人车的视频流接入临时网络。信号被楼体反射，吞吐忽高忽低，星遥带你调制、编码、切换链路。画面重新稳定时，她说，通信的意义不是炫目的速度，而是关键时刻不断线。",
    score: { logic: 1, passion: 1, team: 2 },
    choices: [
      ["commDeep", "⌁", "完成远程联调", "让信息跨过距离"],
      ["intro", "↺", "重新选择", "换一条路线看看"]
    ]
  },
  csDeep: {
    speaker: "洛泠",
    focus: "cs",
    text: "结局倾向：算法架构师。你适合在数据结构、系统、AI 与工程实现之间建立自己的工具箱。洛泠把项目仓库权限交给你：下一次，不只是修好一个功能，而是由你设计它的骨架。",
    ending: true
  },
  eeDeep: {
    speaker: "栖禾",
    focus: "ee",
    text: "结局倾向：能源系统工程师。你适合把电力电子、新能源和控制技术连成可落地的方案。栖禾关掉示波器，窗外的灯一盏盏亮起，像是在确认你的选择。",
    ending: true
  },
  autoDeep: {
    speaker: "青岚",
    focus: "auto",
    text: "结局倾向：机器人控制工程师。你适合在传感、控制、嵌入式和机械系统之间来回穿梭。青岚把新的任务地图发到你手机上：明天开始，我们让它去更远的地方。",
    ending: true
  },
  icDeep: {
    speaker: "微澜",
    focus: "ic",
    text: "结局倾向：芯片设计工程师。你适合深入数字逻辑、EDA、体系结构和半导体工艺。微澜把验证板递给你，板上的指示灯微微发亮，像一座城市正式通电。",
    ending: true
  },
  commDeep: {
    speaker: "星遥",
    focus: "comm",
    text: "结局倾向：未来网络研究员。你适合研究无线通信、网络协议、卫星互联网和信息安全。星遥把天线指向夜空：未来有很多远方，第一条稳定链路就从这里开始。",
    ending: true
  }
};

const state = {
  current: "intro",
  logic: 0,
  passion: 0,
  team: 0,
  speed: 22,
  typingTimer: null
};

const speakerEl = document.querySelector("#speaker");
const dialogueEl = document.querySelector("#dialogueText");
const choicesEl = document.querySelector("#choices");
const logicEl = document.querySelector("#logicScore");
const passionEl = document.querySelector("#passionScore");
const teamEl = document.querySelector("#teamScore");
const configDialog = document.querySelector("#configDialog");
const speedRange = document.querySelector("#speedRange");
const ambientToggle = document.querySelector("#ambientToggle");
const labTableEl = document.querySelector(".lab-table");
const heroCards = document.querySelectorAll(".hero-card");

function typeText(text) {
  clearInterval(state.typingTimer);
  dialogueEl.textContent = "";
  let index = 0;
  state.typingTimer = setInterval(() => {
    dialogueEl.textContent += text[index] ?? "";
    index += 1;
    if (index >= text.length) clearInterval(state.typingTimer);
  }, state.speed);
}

function updateScores() {
  logicEl.textContent = state.logic;
  passionEl.textContent = state.passion;
  teamEl.textContent = state.team;
}

function applyScore(score) {
  if (!score) return;
  state.logic += score.logic ?? 0;
  state.passion += score.passion ?? 0;
  state.team += score.team ?? 0;
}

function updateCharacterFocus(focus) {
  labTableEl.classList.toggle("has-focus", Boolean(focus));
  heroCards.forEach((card) => {
    card.classList.toggle("active", card.dataset.route === focus);
  });
}

function render(routeId, shouldScore = true) {
  const route = routes[routeId];
  if (!route) return;

  state.current = routeId;
  if (routeId === "intro" && shouldScore) {
    state.logic = 0;
    state.passion = 0;
    state.team = 0;
  }
  if (shouldScore) applyScore(route.score);
  updateScores();
  updateCharacterFocus(route.focus);

  speakerEl.textContent = route.speaker;
  typeText(route.text);
  choicesEl.innerHTML = "";

  const choices = route.ending
    ? [["intro", "↺", "重新选择", "回到五个专业"], ["save", "✓", "保存倾向", "记录当前结局"]]
    : route.choices;

  choices.forEach((choice) => {
    const [target, icon, title, subtitle] = choice;
    const button = document.createElement("button");
    button.type = "button";
    button.innerHTML = `
      <span class="choice-icon">${icon}</span>
      <span class="choice-title">${title}</span>
      <span class="choice-subtitle">${subtitle}</span>
    `;
    button.addEventListener("click", () => {
      if (target === "save") {
        saveGame();
        return;
      }
      render(target);
    });
    choicesEl.appendChild(button);
  });
}

function saveGame() {
  localStorage.setItem("majorGalgameDemo", JSON.stringify(state));
  speakerEl.textContent = "系统";
  typeText("进度已保存。等你再次回到实验平台，我们会从这里继续。");
}

function loadGame() {
  const saved = localStorage.getItem("majorGalgameDemo");
  if (!saved) {
    speakerEl.textContent = "系统";
    typeText("还没有找到存档。先做一次选择吧。");
    return;
  }
  const parsed = JSON.parse(saved);
  Object.assign(state, parsed);
  render(state.current, false);
}

document.querySelector("#saveBtn").addEventListener("click", saveGame);
document.querySelector("#loadBtn").addEventListener("click", loadGame);
document.querySelector("#configBtn").addEventListener("click", () => configDialog.showModal());

speedRange.addEventListener("input", (event) => {
  state.speed = Number(event.target.value);
});

ambientToggle.addEventListener("change", (event) => {
  document.body.classList.toggle("paused", !event.target.checked);
});

document.querySelectorAll(".hero-card").forEach((card) => {
  card.addEventListener("click", () => render(card.dataset.route));
});

render("intro", false);
