const characterData = window.characterData || {};
const profiles = Object.fromEntries(
  Object.entries(characterData).map(([id, character]) => [id, character.profile])
);
const characterRoutes = Object.values(characterData).reduce((allRoutes, character) => {
  Object.assign(allRoutes, character.routes);
  return allRoutes;
}, {});

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
  ...characterRoutes
};

const state = {
  current: "intro",
  logic: 0,
  passion: 0,
  team: 0,
  speed: 22,
  typingTimer: null,
  scoredRoutes: []
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
const profilePanel = document.querySelector("#profilePanel");
const profileMajor = document.querySelector("#profileMajor");
const profileRole = document.querySelector("#profileRole");
const profileName = document.querySelector("#profileName");
const profileBio = document.querySelector("#profileBio");
const profileFacts = document.querySelector("#profileFacts");
const miniGame = document.querySelector("#miniGame");
const miniGameTag = document.querySelector("#miniGameTag");
const miniGameTitle = document.querySelector("#miniGameTitle");
const miniGameBrief = document.querySelector("#miniGameBrief");
const miniGameBoard = document.querySelector("#miniGameBoard");
const miniGameActions = document.querySelector("#miniGameActions");
const miniGameFeedback = document.querySelector("#miniGameFeedback");

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

function applyScore(routeId, score) {
  if (!score || state.scoredRoutes.includes(routeId)) return;
  state.logic += score.logic ?? 0;
  state.passion += score.passion ?? 0;
  state.team += score.team ?? 0;
  state.scoredRoutes.push(routeId);
}

function updateCharacterFocus(focus) {
  labTableEl.classList.toggle("has-focus", Boolean(focus));
  heroCards.forEach((card) => {
    card.classList.toggle("active", card.dataset.route === focus);
  });
}

function renderProfile(focus) {
  const profile = profiles[focus];
  profilePanel.hidden = !profile;
  if (!profile) return;

  profileMajor.textContent = profile.major;
  profileRole.textContent = profile.role;
  profileName.textContent = profile.name;
  profileBio.textContent = profile.bio;
  profileFacts.innerHTML = profile.facts
    .map(([label, value]) => `<div><dt>${label}</dt><dd>${value}</dd></div>`)
    .join("");
}

function hideMiniGame() {
  miniGame.hidden = true;
  miniGameBoard.innerHTML = "";
  miniGameActions.innerHTML = "";
  miniGameFeedback.textContent = "";
}

function completeMiniGame(nextRoute, message) {
  miniGameFeedback.textContent = message;
  miniGameActions.innerHTML = "";
  const button = document.createElement("button");
  button.type = "button";
  button.textContent = "继续剧情";
  button.addEventListener("click", () => render(nextRoute));
  miniGameActions.appendChild(button);
}

function renderCsGame(route) {
  const game = route.game;
  const target = game.target;
  const answer = target
    .split("")
    .map((char) => char.charCodeAt(0).toString(2).padStart(8, "0"))
    .join(" ");
  const bits = answer.replaceAll(" ", "").split("");
  let cursor = 0;
  miniGameTag.textContent = game.tag;
  miniGameTitle.textContent = game.title;
  miniGameBrief.textContent = `目标字符：${target}。${game.intro} ${answer}`;
  miniGameBoard.innerHTML = `
    <div class="binary-console">
      <span>ASCII</span>
      <strong>${target}</strong>
      <code id="binaryInput"></code>
    </div>
  `;
  miniGameActions.innerHTML = "";

  ["0", "1"].forEach((bit) => {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = bit;
    button.addEventListener("click", () => {
      const input = document.querySelector("#binaryInput");
      if (bit !== bits[cursor]) {
        cursor = 0;
        input.textContent = "";
        miniGameFeedback.textContent = game.wrong;
        return;
      }
      cursor += 1;
      input.textContent = bits
        .slice(0, cursor)
        .join("")
        .replace(/(.{8})/g, "$1 ")
        .trim();
      miniGameFeedback.textContent = cursor === bits.length ? "" : game.progress;
      if (cursor === bits.length) completeMiniGame(route.next, game.success);
    });
    miniGameActions.appendChild(button);
  });

  const resetButton = document.createElement("button");
  resetButton.type = "button";
  resetButton.textContent = "重置";
  resetButton.addEventListener("click", () => {
    cursor = 0;
    document.querySelector("#binaryInput").textContent = "";
    miniGameFeedback.textContent = game.reset;
  });
  miniGameActions.appendChild(resetButton);
  miniGameFeedback.textContent = game.hint;
}

function renderEeGame(route) {
  const game = route.game;
  const load = game.load;
  const values = { ...game.values };
  miniGameTag.textContent = game.tag;
  miniGameTitle.textContent = game.title;
  miniGameBrief.textContent = game.brief;

  function draw() {
    const total = values.光伏 + values.电池 + values.电网;
    miniGameBoard.innerHTML = `
      <div class="meter-grid">
        <span>目标负载</span><strong>${load} kW</strong>
        <span>当前供给</span><strong>${total} kW</strong>
      </div>
    `;
    miniGameActions.innerHTML = "";
    Object.keys(values).forEach((name) => {
      const row = document.createElement("div");
      row.className = "stepper-row";
      row.innerHTML = `<span>${name}</span><strong>${values[name]} kW</strong>`;
      ["-", "+"].forEach((label) => {
        const button = document.createElement("button");
        button.type = "button";
        button.textContent = label;
        button.addEventListener("click", () => {
          values[name] = Math.max(0, values[name] + (label === "+" ? 1 : -1));
          draw();
        });
        row.appendChild(button);
      });
      miniGameActions.appendChild(row);
    });
    const ok = total === load && values.电池 >= 2 && values.电池 <= 4 && values.电网 <= 5;
    miniGameFeedback.textContent = ok ? "" : game.hint;
    if (ok) completeMiniGame(route.next, game.success);
  }

  draw();
}

function renderAutoGame(route) {
  const game = route.game;
  const size = game.size;
  const target = game.target;
  const blocks = game.blocks;
  const bot = { ...game.start };
  miniGameTag.textContent = game.tag;
  miniGameTitle.textContent = game.title;
  miniGameBrief.textContent = game.brief;

  function draw() {
    miniGameBoard.innerHTML = `<div class="robot-grid"></div>`;
    const grid = miniGameBoard.querySelector(".robot-grid");
    for (let y = 0; y < size; y += 1) {
      for (let x = 0; x < size; x += 1) {
        const cell = document.createElement("span");
        const key = `${x}-${y}`;
        cell.className = blocks.includes(key) ? "blocked" : "";
        cell.textContent = bot.x === x && bot.y === y ? "R" : target.x === x && target.y === y ? "T" : "";
        grid.appendChild(cell);
      }
    }
  }

  function move(dx, dy) {
    const next = { x: bot.x + dx, y: bot.y + dy };
    const key = `${next.x}-${next.y}`;
    if (next.x < 0 || next.y < 0 || next.x >= size || next.y >= size || blocks.includes(key)) {
      miniGameFeedback.textContent = game.blocked;
      return;
    }
    bot.x = next.x;
    bot.y = next.y;
    draw();
    if (bot.x === target.x && bot.y === target.y) {
      completeMiniGame(route.next, game.success);
    } else {
      miniGameFeedback.textContent = game.progress;
    }
  }

  miniGameActions.innerHTML = "";
  [
    ["↑", 0, -1],
    ["←", -1, 0],
    ["→", 1, 0],
    ["↓", 0, 1]
  ].forEach(([label, dx, dy]) => {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = label;
    button.addEventListener("click", () => move(dx, dy));
    miniGameActions.appendChild(button);
  });
  draw();
  miniGameFeedback.textContent = game.hint;
}

function renderIcGame(route) {
  const game = route.game;
  const size = game.size;
  const source = game.source;
  const sink = game.sink;
  const blocks = game.blocks;
  let path = [source];
  let completed = false;
  miniGameTag.textContent = game.tag;
  miniGameTitle.textContent = game.title;
  miniGameBrief.textContent = game.brief;

  function toPoint(key) {
    const [x, y] = key.split("-").map(Number);
    return { x, y };
  }

  function isNeighbor(a, b) {
    const first = toPoint(a);
    const second = toPoint(b);
    return Math.abs(first.x - second.x) + Math.abs(first.y - second.y) === 1;
  }

  function draw() {
    miniGameBoard.innerHTML = `<div class="layout-grid"></div>`;
    const grid = miniGameBoard.querySelector(".layout-grid");

    for (let y = 0; y < size; y += 1) {
      for (let x = 0; x < size; x += 1) {
        const key = `${x}-${y}`;
        const cell = document.createElement("button");
        cell.type = "button";
        cell.dataset.key = key;

        if (key === source) {
          cell.className = "source";
          cell.textContent = "PAD";
        } else if (key === sink) {
          cell.className = "sink";
          cell.textContent = "CORE";
        } else if (blocks.includes(key)) {
          cell.className = "macro";
          cell.textContent = "IP";
        } else if (path.includes(key)) {
          cell.className = key === path[path.length - 1] ? "wire current" : "wire";
          cell.textContent = "M1";
        }

        cell.addEventListener("click", () => placeWire(key));
        grid.appendChild(cell);
      }
    }
  }

  function placeWire(key) {
    if (completed) return;
    const last = path[path.length - 1];
    if (key === sink && isNeighbor(last, key)) {
      path.push(key);
      draw();
      completed = true;
      completeMiniGame(route.next, game.success);
      return;
    }
    if (key === source || key === sink || blocks.includes(key) || path.includes(key)) {
      miniGameFeedback.textContent = game.invalid;
      return;
    }
    if (!isNeighbor(last, key)) {
      miniGameFeedback.textContent = game.disconnected;
      return;
    }
    path.push(key);
    draw();
    miniGameFeedback.textContent = `已铺设 ${path.length - 1} 段金属线，${game.progress}`;
  }

  function resetPath() {
    path = [source];
    completed = false;
    draw();
    miniGameFeedback.textContent = game.reset;
  }

  miniGameActions.innerHTML = "";
  [
    ["撤销一步", () => {
      if (path.length > 1) {
        path.pop();
        draw();
        miniGameFeedback.textContent = game.undo;
        return;
      }
      miniGameFeedback.textContent = game.undoBlocked;
    }],
    ["重新布线", resetPath]
  ].forEach(([label, action]) => {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = label;
    button.addEventListener("click", action);
    miniGameActions.appendChild(button);
  });

  draw();
  miniGameFeedback.textContent = game.hint;
}

function renderCommGame(route) {
  const game = route.game;
  const picks = {};
  const groups = game.groups;
  const answer = game.answer;
  miniGameTag.textContent = game.tag;
  miniGameTitle.textContent = game.title;
  miniGameBrief.textContent = game.brief;
  miniGameBoard.innerHTML = `<div class="link-status">${game.waiting}</div>`;
  miniGameActions.innerHTML = "";

  Object.entries(groups).forEach(([group, options]) => {
    const row = document.createElement("div");
    row.className = "option-row";
    row.innerHTML = `<span>${group}</span>`;
    options.forEach((option) => {
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = option;
      button.addEventListener("click", () => {
        picks[group] = option;
        row.querySelectorAll("button").forEach((item) => item.classList.toggle("selected", item === button));
        const ready = Object.keys(answer).every((key) => picks[key]);
        miniGameBoard.querySelector(".link-status").textContent = ready
          ? Object.entries(picks).map(([key, value]) => `${key}:${value}`).join(" / ")
          : game.choosing;
        if (!ready) return;
        const ok = Object.keys(answer).every((key) => picks[key] === answer[key]);
        if (ok) {
          completeMiniGame(route.next, game.success);
        } else {
          miniGameFeedback.textContent = game.wrong;
        }
      });
      row.appendChild(button);
    });
    miniGameActions.appendChild(row);
  });
}

const gameRenderers = {
  binary: renderCsGame,
  energy: renderEeGame,
  robot: renderAutoGame,
  layout: renderIcGame,
  link: renderCommGame
};

function renderMiniGame(route) {
  if (!route.game) {
    hideMiniGame();
    return;
  }
  miniGame.hidden = false;
  miniGameFeedback.textContent = "";
  const renderer = gameRenderers[route.game.type];
  if (!renderer) {
    miniGameFeedback.textContent = "这个小游戏类型还没有对应的渲染器。";
    return;
  }
  renderer(route);
}

function render(routeId, shouldScore = true) {
  const route = routes[routeId];
  if (!route) return;

  state.current = routeId;
  if (routeId === "intro" && shouldScore) {
    state.logic = 0;
    state.passion = 0;
    state.team = 0;
    state.scoredRoutes = [];
  }
  if (shouldScore) applyScore(routeId, route.score);
  updateScores();
  updateCharacterFocus(route.focus);
  renderProfile(route.focus);
  renderMiniGame(route);

  speakerEl.textContent = route.speaker;
  typeText(route.text);
  choicesEl.innerHTML = "";

  const choices = route.ending
    ? [["intro", "↺", "重新选择", "回到五个专业"], ["save", "✓", "保存倾向", "记录当前结局"]]
    : route.game
      ? [["intro", "↺", "回到选择界面", "先看看其他方向"]]
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
  const snapshot = {
    current: state.current,
    logic: state.logic,
    passion: state.passion,
    team: state.team,
    speed: state.speed,
    scoredRoutes: state.scoredRoutes
  };
  localStorage.setItem("majorGalgameDemo", JSON.stringify(snapshot));
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
