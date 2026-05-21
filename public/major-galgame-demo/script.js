const characterData = window.characterData || {};
const profiles = Object.fromEntries(
  Object.entries(characterData).map(([id, character]) => [id, character.profile])
);
const characterRoutes = Object.values(characterData).reduce((allRoutes, character) => {
  Object.assign(allRoutes, character.routes);
  return allRoutes;
}, {});

const jointRoutes = {
  jointCsComm: {
    speaker: "洛泠 & 星遥",
    focus: "cs",
    text: "导览 AI 的路线推荐已经能跑，但星遥的链路日志显示，体育馆附近的视频回传总会抖一下。洛泠盯着延迟曲线，星遥蹲在天线旁调中继参数。你把地图图结构和链路质量叠在一起，忽然发现：算法不能只看最短路，通信也不能只看峰值速率。真正可靠的校园智能体，要把路径、信号、拥塞和用户体验一起考虑。星遥笑着朝洛泠挥手：这次不是谁辅助谁，是我们一起把远方接进系统里。",
    score: { logic: 2, passion: 1, team: 2 },
    choices: [
      ["jointCsCommEnd", "AI", "完成智能导览联调", "把算法和网络接成一条稳定路径"],
      ["intro", "↺", "回到选择界面", "继续探索其他专业"]
    ]
  },
  jointCsCommEnd: {
    speaker: "系统",
    focus: "comm",
    text: "跨专业完成：智能导览网络。你理解了计算机与通信的交叉价值：算法负责决策，网络保证抵达，真实系统需要两者同时可靠。隐藏倾向记录：智能网络系统。",
    ending: true
  },
  jointAutoEe: {
    speaker: "青岚 & 栖禾",
    focus: "auto",
    text: "暴雨后的实验楼需要巡检微电网柜，青岚把机器人导航地图传到平板上，栖禾则盯着电池和负载曲线。你们让机器人避开积水区域，在低电量时自动切换巡检顺序，并把关键节点的温度、声音和电流异常回传。青岚说控制策略要稳，栖禾说供能策略也要稳。你突然明白，自动化让设备自己行动，电气让系统持续有能量行动；两者交汇处，就是会自己照看城市的基础设施。",
    score: { logic: 1, passion: 2, team: 2 },
    choices: [
      ["jointAutoEeEnd", "⚙", "完成微电网巡检", "让机器人和能源系统形成闭环"],
      ["intro", "↺", "回到选择界面", "继续探索其他专业"]
    ]
  },
  jointAutoEeEnd: {
    speaker: "系统",
    focus: "ee",
    text: "跨专业事件完成：自主能源巡检。你理解了自动化与电气的交叉价值：控制负责行动，能源负责支撑，稳定系统需要感知、决策、执行和供能共同闭环。隐藏倾向记录：智能能源系统。",
    ending: true
  },
  jointIcCs: {
    speaker: "微澜 & 洛泠",
    focus: "ic",
    text: "洛泠的模型在边缘设备上跑得太慢，微澜把计算图拆成矩阵乘、缓存访问和数据搬运三类。你们从算法瓶颈追到硬件结构，又从芯片面积追回模型压缩。洛泠第一次承认：不是所有优化都能靠代码解决。微澜也轻轻点头：不是所有芯片都应该脱离应用场景设计。你在白板上画出一条从算法需求到 RTL 模块的路径，突然看见软件和硅片之间并没有墙，只有一层又一层可以被理解的抽象。",
    score: { logic: 3, passion: 1, team: 1 },
    choices: [
      ["jointIcCsEnd", "▣", "完成 AI 加速器方案", "让算法需求落到硬件结构"],
      ["intro", "↺", "回到选择界面", "继续探索其他专业"]
    ]
  },
  jointIcCsEnd: {
    speaker: "系统",
    focus: "cs",
    text: "跨专业事件完成：AI 加速芯片方案。你理解了集成电路与计算机的交叉价值：软件定义需求，硬件提供效率，真正高性能的系统往往从两端一起设计。隐藏倾向记录：AI 芯片系统设计。",
    ending: true
  },
  jointCsEe: {
    speaker: "洛泠 & 栖禾",
    focus: "cs",
    text: "低碳校园平台需要预测第二天的用电峰值。洛泠把历史负载、天气和课程表喂进模型，栖禾则逐条检查异常点背后的真实设备状态。你们发现，预测不是为了让曲线好看，而是为了提前安排储能和电网支撑。洛泠负责让模型更准，栖禾负责让调度更稳；数据和电能在同一块屏幕上汇合，像两种语言终于翻译成同一句话。",
    score: { logic: 2, passion: 1, team: 2 },
    choices: [
      ["jointCsEeEnd", "⚡", "完成负载预测平台", "让 AI 参与能源调度"],
      ["intro", "↺", "回到选择界面", "继续探索其他专业"]
    ]
  },
  jointCsEeEnd: {
    speaker: "系统",
    focus: "ee",
    text: "跨专业事件完成：AI 能源调度。你理解了计算机与电气的交叉价值：数据预测帮助系统提前决策，电气约束让算法落到可靠供能。隐藏倾向记录：智慧能源算法。",
    ending: true
  },
  jointCsAuto: {
    speaker: "洛泠 & 青岚",
    focus: "auto",
    text: "巡检机器人能到达目标点，却还不会自己判断哪条路线更值得走。洛泠把走廊地图建成图结构，青岚把速度限制、转弯半径和传感误差写进控制约束。你们一起调试路径规划：最短路线不一定最稳，最稳路线也不能慢到错过任务窗口。算法在屏幕里给出候选路径，机器人在地面上验证每一次选择。青岚看着洛泠：这次你的抽象，真的落地了。",
    score: { logic: 2, passion: 1, team: 2 },
    choices: [
      ["jointCsAutoEnd", "⚙", "完成自主导航升级", "让规划算法进入真实机器人"],
      ["intro", "↺", "回到选择界面", "继续探索其他专业"]
    ]
  },
  jointCsAutoEnd: {
    speaker: "系统",
    focus: "cs",
    text: "跨专业事件完成：自主导航升级。你理解了计算机与自动化的交叉价值：算法提供决策，控制面对现实误差，智能系统需要两者一起闭环。隐藏倾向记录：具身智能工程。",
    ending: true
  },
  jointEeIc: {
    speaker: "栖禾 & 微澜",
    focus: "ic",
    text: "微电网控制板在高负载切换时发热明显，栖禾怀疑功率模块的驱动策略还不够细。微澜把芯片内部的采样、保护和驱动时序画出来，栖禾把真实电流波形叠到上面。你们一点点对齐开关频率、保护阈值和热设计余量。芯片不再只是微小的硅片，它开始承担能源系统里最关键的判断；电气也不再只是宏观电网，它把可靠性压进每一次开关瞬间。",
    score: { logic: 2, passion: 1, team: 2 },
    choices: [
      ["jointEeIcEnd", "▣", "完成智能功率模块", "把电能变换压进芯片级控制"],
      ["intro", "↺", "回到选择界面", "继续探索其他专业"]
    ]
  },
  jointEeIcEnd: {
    speaker: "系统",
    focus: "ee",
    text: "跨专业事件完成：智能功率模块。你理解了电气与集成电路的交叉价值：电能变换需要器件、驱动、保护和芯片控制共同设计。隐藏倾向记录：功率半导体系统。",
    ending: true
  },
  jointEeComm: {
    speaker: "栖禾 & 星遥",
    focus: "comm",
    text: "台风天的微电网监测点开始断续掉线，栖禾担心远端储能柜失去状态回传，星遥则快速切换到更稳的中继链路。你们把供能优先级和通信优先级放在一起排：关键节点不只要有电，也要有信号；告警信息不只要发出，也要被可信地收到。雨声拍着窗，屏幕上的红点一个个恢复在线。星遥笑着说，可靠连接也需要可靠供能；栖禾点头，可靠供能也需要可靠连接。",
    score: { logic: 1, passion: 2, team: 2 },
    choices: [
      ["jointEeCommEnd", "⌁", "完成应急通信供能", "让微电网和通信链路互相守住"],
      ["intro", "↺", "回到选择界面", "继续探索其他专业"]
    ]
  },
  jointEeCommEnd: {
    speaker: "系统",
    focus: "ee",
    text: "跨专业事件完成：应急通信供能。你理解了电气与通信的交叉价值：关键基础设施既要不断电，也要不断联。隐藏倾向记录：韧性基础设施系统。",
    ending: true
  },
  jointAutoIc: {
    speaker: "青岚 & 微澜",
    focus: "auto",
    text: "机器人队想把控制算法部署到更小的边缘控制板上，可现有芯片算力和延迟都卡得很紧。青岚拿出实时控制曲线，微澜则把关键循环拆成可硬化的模块。你们讨论哪些计算必须在一个控制周期内完成，哪些可以交给软件慢慢算。最后，控制板上的延迟降了下来，机器人刹停时不再抖动。青岚轻声说，这次闭环不只在程序里，也在硅片里。",
    score: { logic: 2, passion: 1, team: 2 },
    choices: [
      ["jointAutoIcEnd", "▤", "完成实时控制芯片", "让控制算法贴近硬件"],
      ["intro", "↺", "回到选择界面", "继续探索其他专业"]
    ]
  },
  jointAutoIcEnd: {
    speaker: "系统",
    focus: "ic",
    text: "跨专业事件完成：实时控制芯片。你理解了自动化与集成电路的交叉价值：实时控制需要低延迟硬件，芯片设计也需要真实控制场景定义需求。隐藏倾向记录：嵌入式智能芯片。",
    ending: true
  },
  jointAutoComm: {
    speaker: "青岚 & 星遥",
    focus: "comm",
    text: "无人车远程实验进入最难的环节：车在移动，链路在波动，控制指令却不能乱。星遥负责估计链路时延和丢包率，青岚把这些不确定性写进控制策略。你们把视频、定位和控制指令分成不同优先级，让关键控制包先到，让画面在必要时降低码率。无人车穿过遮挡区后仍然稳稳停在目标点，星遥朝青岚比了个手势：连接稳住了，控制才敢继续往前。",
    score: { logic: 1, passion: 1, team: 3 },
    choices: [
      ["jointAutoCommEnd", "⌁", "完成远程无人车联调", "让控制跨过不稳定链路"],
      ["intro", "↺", "回到选择界面", "继续探索其他专业"]
    ]
  },
  jointAutoCommEnd: {
    speaker: "系统",
    focus: "auto",
    text: "跨专业事件完成：远程无人车联调。你理解了自动化与通信的交叉价值：移动系统需要稳定链路，网络状态也会反过来影响控制策略。隐藏倾向记录：联网机器人系统。",
    ending: true
  },
  jointIcComm: {
    speaker: "微澜 & 星遥",
    focus: "ic",
    text: "星遥的高速链路实验需要更低功耗的信号处理模块，微澜把编码、调制和基带处理拆成硬件流水线。你们从误码率讨论到乘加阵列，从频谱效率讨论到片上缓存。通信系统追求可靠抵达，芯片系统追求高效执行；当两者坐到同一张桌前，每一比特都开始有了物理重量。星遥看着版图上的数据通路，小声说：原来信号抵达远方之前，先要穿过这么精密的一座城。",
    score: { logic: 2, passion: 1, team: 2 },
    choices: [
      ["jointIcCommEnd", "⌁", "完成低功耗基带模块", "让通信算法进入芯片流水线"],
      ["intro", "↺", "回到选择界面", "继续探索其他专业"]
    ]
  },
  jointIcCommEnd: {
    speaker: "系统",
    focus: "comm",
    text: "跨专业事件完成：低功耗基带模块。你理解了集成电路与通信的交叉价值：通信算法需要硬件高效承载，芯片架构也因信号处理需求而改变。隐藏倾向记录：通信芯片设计。",
    ending: true
  }
};

const knowledgeRewardRoutes = {
  knowledgeRewardCs: {
    speaker: "洛泠",
    focus: "cs",
    text: "洛泠看着你点亮的计算机知识卡，难得没有立刻指出哪里还能优化。她把一份隐藏的项目笔记推给你：你已经不只是会问“怎么写代码”了，而是在问“问题怎样被定义，系统怎样被验证”。她轻轻敲了敲屏幕：这份校园 AI 的设计草图，以后也给你一份编辑权限。",
    score: { logic: 2, passion: 1, team: 1 },
    choices: [
      ["cs", "⌨", "回到洛泠线", "继续理解计算机方向"],
      ["intro", "↺", "回到选择界面", "看看其他专业"]
    ]
  },
  knowledgeRewardEe: {
    speaker: "栖禾",
    focus: "ee",
    text: "栖禾把你的知识卡测验记录看完，笑意很浅，却很认真。她说，能把电路、电力电子和微电网连起来理解的人，才会真正尊重每一盏灯背后的系统。她递给你一张低碳校园调研表：下一次现场记录，要不要和我一起去？我负责安全，你负责把问题问细。",
    score: { logic: 1, passion: 2, team: 1 },
    choices: [
      ["ee", "⚡", "回到栖禾线", "继续理解电气方向"],
      ["intro", "↺", "回到选择界面", "看看其他专业"]
    ]
  },
  knowledgeRewardAuto: {
    speaker: "青岚",
    focus: "auto",
    text: "青岚扫了一眼你收集齐的自动化知识卡，点头的幅度很小，但你知道这已经是很高的评价。她说，你现在至少知道闭环不是口号，传感融合也不是把数据堆在一起。她把下一版机器人任务地图发给你：隐藏训练模式开放。别迟到，我只给认真理解系统的人留位置。",
    score: { logic: 1, passion: 1, team: 2 },
    choices: [
      ["auto", "⚙", "回到青岚线", "继续理解自动化方向"],
      ["intro", "↺", "回到选择界面", "看看其他专业"]
    ]
  },
  knowledgeRewardIc: {
    speaker: "微澜",
    focus: "ic",
    text: "微澜把你通过的芯片知识测验整理成一份小小的清单，末尾用细字写着：时序意识合格。她抬起眼，声音还是轻轻的：能耐心看懂约束的人，很适合留在芯片世界久一点。她把隐藏版 RTL 草图递给你：这不是考试，是邀请。下一次 review，你坐我旁边。",
    score: { logic: 2, passion: 1, team: 1 },
    choices: [
      ["ic", "▣", "回到微澜线", "继续理解集成电路方向"],
      ["intro", "↺", "回到选择界面", "看看其他专业"]
    ]
  },
  knowledgeRewardComm: {
    speaker: "星遥",
    focus: "comm",
    text: "星遥看见通信知识卡全部点亮，立刻把耳机分给你一只。她说，你现在已经知道连接不是单纯追求更快，而是在噪声、距离和协作里保持可靠。她在联调表上给你加了一个隐藏频道：以后重要信号优先发给你，记得回应，不然我会以为链路掉线。",
    score: { logic: 1, passion: 2, team: 2 },
    choices: [
      ["comm", "⌁", "回到星遥线", "继续理解通信方向"],
      ["intro", "↺", "回到选择界面", "看看其他专业"]
    ]
  },
  knowledgeFinalArchive: {
    speaker: "系统",
    focus: "cs",
    text: "最终隐藏剧情：全域图鉴。十张知识卡全部被你收藏后，实验平台的资料终端亮起一行新的权限提示：你已经不只是被某一个专业吸引，而是开始理解专业之间怎样共同解释世界。洛泠、栖禾、青岚、微澜和星遥把各自的项目资料合成一份联合档案，封面写着“未来不是单选题”。你获得最终图鉴称号：全域策展人。",
    score: { logic: 2, passion: 2, team: 2 },
    choices: [
      ["intro", "↺", "带着全域图鉴重新选择", "回到五个专业"]
    ],
    ending: true
  },
  interdisciplinaryHidden: {
    speaker: "系统",
    focus: "auto",
    text: "隐藏结局：交叉学科路线。你没有把专业理解成互相隔开的房间，而是在多个方向之间建立了稳定连接。算法、能量、控制、芯片和通信共同构成了你的问题地图：你适合走向智能系统工程师、具身智能研究员、天地一体智能网络或 AI 芯片系统设计这类复合方向。未来不是单点突破，而是把不同工具放到同一张工作台上。",
    score: { logic: 2, passion: 2, team: 3 },
    choices: [
      ["intro", "↺", "带着交叉画像重新选择", "回到五个专业"]
    ],
    ending: true
  },
  epilogueCs: {
    speaker: "洛泠",
    focus: "cs",
    text: "后日谈：一周后的实验室。洛泠把导览 AI 的新版本部署到测试服务器，你负责看日志。第一条真实用户反馈弹出来时，她没有立刻庆祝，只是把椅子往你这边挪了一点：这次不是 demo 了，是我们一起维护的系统。窗外的路灯亮起来，你忽然觉得，选择专业也像部署项目，真正开始是在点击确认之后。",
    ending: true
  },
  epilogueEe: {
    speaker: "栖禾",
    focus: "ee",
    text: "后日谈：联调前夜。栖禾把微电网实验记录摊开，旁边放着给你留的热饮。她说，稳定不是没有波动，而是波动来临时仍然有余量。你们一起检查保护阈值和储能策略，实验楼的灯安静地亮着。她笑着补了一句：明天要早起，所以今晚别一个人硬撑。",
    ending: true
  },
  epilogueAuto: {
    speaker: "青岚",
    focus: "auto",
    text: "后日谈：第一次小组展示。机器人沿着你们调好的路线稳稳穿过障碍，青岚站在一旁，手里还攥着应急遥控器。演示结束后，她只说了两个字：不错。过了几秒，她又把下一张任务地图发给你：下次难度更高，你还来。你看见备注里写着：固定搭档。",
    ending: true
  },
  epilogueIc: {
    speaker: "微澜",
    focus: "ic",
    text: "后日谈：项目答辩当天。微澜把时序报告翻到最后一页，红色告警已经清零。她把演示板交给你，指示灯亮起的瞬间，整间教室安静了一秒。她轻声说，芯片世界很慢，也很值得。然后她在你的笔记本角落写下：下一版，我们一起从需求开始。",
    ending: true
  },
  epilogueComm: {
    speaker: "星遥",
    focus: "comm",
    text: "后日谈：屋顶复测。星遥把天线转到新的角度，链路质量一点点爬升。她把耳机递给你，里面传来无人车端稳定的视频流。她说，连接成功有时候不是因为距离变近，而是因为有人愿意一遍遍调到更稳。风很大，但这次信号没有断。",
    ending: true
  }
};

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
  ...characterRoutes,
  ...jointRoutes,
  ...knowledgeRewardRoutes
};

const jointEvents = [
  {
    id: "cs-comm",
    route: "jointCsComm",
    title: "智能导览网络",
    pair: "计算机科学与技术 × 通信工程",
    summary: "把校园 AI 导览的路径推荐和无线链路质量联合优化。",
    requiredRoutes: ["csLab", "commLab"],
    requiredLabels: ["完成洛泠的导览 AI 实验", "完成星遥的链路配置实验"],
    reward: "隐藏倾向：智能网络系统"
  },
  {
    id: "auto-ee",
    route: "jointAutoEe",
    title: "自主能源巡检",
    pair: "自动化 × 电气工程及其自动化",
    summary: "让巡检机器人参与微电网状态监测，形成控制与供能闭环。",
    requiredRoutes: ["autoLab", "eeLab"],
    requiredLabels: ["完成青岚的机器人导航实验", "完成栖禾的微电网调度实验"],
    reward: "隐藏倾向：智能能源系统"
  },
  {
    id: "ic-cs",
    route: "jointIcCs",
    title: "AI 加速芯片方案",
    pair: "集成电路设计与集成系统 × 计算机科学与技术",
    summary: "从模型瓶颈出发设计硬件加速结构，连接算法、体系结构与芯片实现。",
    requiredRoutes: ["icLab", "csTheoryMore"],
    requiredLabels: ["完成微澜的版图布线实验", "继续追问洛泠的 AI 理论"],
    reward: "隐藏倾向：AI 芯片系统设计"
  },
  {
    id: "cs-ee",
    route: "jointCsEe",
    title: "AI 能源调度",
    pair: "计算机科学与技术 × 电气工程及其自动化",
    summary: "用负载预测和调度算法帮助微电网提前安排储能与电网支撑。",
    requiredRoutes: ["csTheoryMore", "eeLab"],
    requiredLabels: ["继续追问洛泠的 AI 理论", "完成栖禾的微电网调度实验"],
    reward: "隐藏倾向：智慧能源算法"
  },
  {
    id: "cs-auto",
    route: "jointCsAuto",
    title: "自主导航升级",
    pair: "计算机科学与技术 × 自动化",
    summary: "把图搜索、路径规划和真实控制约束结合，让机器人路线更稳。",
    requiredRoutes: ["csLab", "autoLab"],
    requiredLabels: ["完成洛泠的导览 AI 实验", "完成青岚的机器人导航实验"],
    reward: "隐藏倾向：具身智能工程"
  },
  {
    id: "ee-ic",
    route: "jointEeIc",
    title: "智能功率模块",
    pair: "电气工程及其自动化 × 集成电路设计与集成系统",
    summary: "围绕功率器件、驱动保护和芯片级控制设计更可靠的电能变换模块。",
    requiredRoutes: ["eeTheoryMore", "icLab"],
    requiredLabels: ["继续追问栖禾的新能源理论", "完成微澜的版图布线实验"],
    reward: "隐藏倾向：功率半导体系统"
  },
  {
    id: "ee-comm",
    route: "jointEeComm",
    title: "应急通信供能",
    pair: "电气工程及其自动化 × 通信工程",
    summary: "在极端天气下同时守住关键节点供电和远程状态回传。",
    requiredRoutes: ["eeLab", "commLab"],
    requiredLabels: ["完成栖禾的微电网调度实验", "完成星遥的链路配置实验"],
    reward: "隐藏倾向：韧性基础设施系统"
  },
  {
    id: "auto-ic",
    route: "jointAutoIc",
    title: "实时控制芯片",
    pair: "自动化 × 集成电路设计与集成系统",
    summary: "将实时控制中的关键循环硬件化，降低机器人控制延迟。",
    requiredRoutes: ["autoEmbedPromise", "icTheoryMore"],
    requiredLabels: ["选择青岚的嵌入式控制方向", "继续追问微澜的时序理论"],
    reward: "隐藏倾向：嵌入式智能芯片"
  },
  {
    id: "auto-comm",
    route: "jointAutoComm",
    title: "远程无人车联调",
    pair: "自动化 × 通信工程",
    summary: "根据链路时延和丢包率调整远程控制策略，让移动系统不断联也不失控。",
    requiredRoutes: ["autoLab", "commTheoryMore"],
    requiredLabels: ["完成青岚的机器人导航实验", "继续追问星遥的未来网络"],
    reward: "隐藏倾向：联网机器人系统"
  },
  {
    id: "ic-comm",
    route: "jointIcComm",
    title: "低功耗基带模块",
    pair: "集成电路设计与集成系统 × 通信工程",
    summary: "把编码、调制和基带处理映射到低功耗芯片流水线。",
    requiredRoutes: ["icLab", "commTheory"],
    requiredLabels: ["完成微澜的版图布线实验", "和星遥追问信号理论"],
    reward: "隐藏倾向：通信芯片设计"
  }
];

const majorArchive = {
  cs: {
    icon: "⌨",
    color: "cs",
    name: "计算机科学与技术",
    subtitle: "把问题抽象成可运行、可验证、可扩展的系统。",
    tracks: ["算法与数据结构", "操作系统与网络", "数据库与软件工程", "人工智能与机器学习"],
    skills: ["抽象建模", "工程实现", "复杂度分析", "系统调试"],
    paths: ["算法工程师", "后端/系统工程师", "AI 工程师", "科研与平台开发"],
    fit: "喜欢拆解问题、写出可复现方案，并愿意长期和 bug 认真相处的人。",
    advice: [
      ["入门建议", "先把一门语言写熟，再用数据结构和算法训练表达问题的方式。"],
      ["训练路线", "每周做小项目：爬虫、聊天室、校园工具、简单 AI 应用都可以，重点是完整跑通。"],
      ["避坑提醒", "不要只刷题或只调库。理解复杂度、系统边界和工程可维护性，才会越学越稳。"]
    ]
  },
  ee: {
    icon: "⚡",
    color: "ee",
    name: "电气工程及其自动化",
    subtitle: "研究电能的产生、变换、传输、控制与可靠使用。",
    tracks: ["电路与电磁场", "电机与拖动", "电力电子", "电力系统与新能源"],
    skills: ["能量流分析", "系统稳定性判断", "硬件实验", "安全规范意识"],
    paths: ["电力系统工程师", "电力电子工程师", "新能源与储能工程师", "智能电网研发"],
    fit: "关心现实系统是否稳定可靠，也愿意在高压、高功率、高责任场景里保持细心的人。",
    advice: [
      ["入门建议", "电路基础要打牢，先能读懂电压、电流、功率和波形之间的关系。"],
      ["训练路线", "多做仿真和实验记录，把每次异常波形、器件发热、保护动作都写成可复盘笔记。"],
      ["避坑提醒", "不要把电气理解成单纯强电。电力电子、控制、通信和软件工具都会进入真实系统。"]
    ]
  },
  auto: {
    icon: "⚙",
    color: "auto",
    name: "自动化",
    subtitle: "让复杂对象在反馈中感知、决策、执行，并稳定抵达目标。",
    tracks: ["自动控制原理", "现代控制理论", "传感与检测", "机器人与嵌入式系统"],
    skills: ["闭环思维", "建模仿真", "传感融合", "软硬件联调"],
    paths: ["机器人工程师", "控制算法工程师", "嵌入式控制工程师", "智能制造研发"],
    fit: "喜欢真实设备、动态系统和调参现场，愿意把理论落到机器动作上的人。",
    advice: [
      ["入门建议", "把反馈、误差、稳定性这三个词反复吃透，控制理论会清晰很多。"],
      ["训练路线", "从仿真开始，再接触 Arduino、STM32、机器人平台或 ROS，逐步练联调能力。"],
      ["避坑提醒", "不要只看仿真曲线。真实设备里的延迟、噪声、摩擦和接口问题同样是自动化的一部分。"]
    ]
  },
  ic: {
    icon: "▣",
    color: "ic",
    name: "集成电路设计与集成系统",
    subtitle: "在硅片尺度内平衡功能、面积、功耗、性能和工艺约束。",
    tracks: ["数字逻辑", "计算机组成", "半导体器件", "EDA 与芯片验证"],
    skills: ["逻辑严谨性", "时序意识", "工具链能力", "约束下优化"],
    paths: ["数字 IC 设计工程师", "芯片验证工程师", "后端版图工程师", "体系结构研发"],
    fit: "享受底层细节、能耐心阅读波形和报告，并愿意为一处约束反复打磨的人。",
    advice: [
      ["入门建议", "从数字逻辑和计算机组成开始，先理解寄存器、组合逻辑、时钟和流水线。"],
      ["训练路线", "练习 Verilog/SystemVerilog，小模块要写 testbench，养成看波形和查时序报告的习惯。"],
      ["避坑提醒", "不要只追求功能跑通。芯片更在意约束：时序、面积、功耗、工艺规则都会影响成败。"]
    ]
  },
  comm: {
    icon: "⌁",
    color: "comm",
    name: "通信工程",
    subtitle: "让信息在噪声、距离、移动和拥塞中可靠抵达。",
    tracks: ["信号与系统", "通信原理", "信息论与编码", "无线网络与协议"],
    skills: ["频谱与链路分析", "概率统计", "协议设计", "团队联调"],
    paths: ["无线通信工程师", "网络协议工程师", "卫星互联网研发", "网络与信息安全工程师"],
    fit: "喜欢连接、协作和跨层系统，也愿意在不完美信道里寻找稳定方案的人。",
    advice: [
      ["入门建议", "信号与系统、概率统计和线性代数要持续回看，它们会支撑通信原理。"],
      ["训练路线", "用 MATLAB/Python 做调制、编码、信道仿真，再理解协议和网络联调。"],
      ["避坑提醒", "不要只看网速。抗噪、时延、覆盖、安全和多用户协同，才是通信系统的真实难点。"]
    ]
  }
};

const knowledgeCards = [
  {
    id: "cs-complexity",
    major: "cs",
    title: "算法复杂度",
    tag: "计算机科学",
    summary: "复杂度用来估算算法随输入规模增长时的时间或空间代价。选专业时，它能帮助你理解“能跑”和“能大规模跑”之间的差别。",
    terms: ["Big-O", "数据结构", "可扩展性"],
    unlock: { route: "cs", label: "进入洛泠的计算机线" },
    quiz: {
      question: "为什么同样能完成任务的算法，还要比较复杂度？",
      options: ["因为它决定大规模输入下是否还能可用", "因为复杂度越高代码越短", "因为复杂度只影响界面颜色"],
      answer: 0
    }
  },
  {
    id: "cs-os",
    major: "cs",
    title: "操作系统",
    tag: "计算机科学",
    summary: "操作系统管理进程、内存、文件和设备，让应用程序获得稳定的运行环境。它是软件工程走向真实世界的重要底座。",
    terms: ["进程", "内存", "调度"],
    unlock: { route: "csTheory", label: "和洛泠追问算法理论" },
    quiz: {
      question: "操作系统最核心的职责更接近哪一项？",
      options: ["管理软硬件资源并提供运行环境", "替用户自动写完所有代码", "只负责网页排版"],
      answer: 0
    }
  },
  {
    id: "ee-power-electronics",
    major: "ee",
    title: "电力电子",
    tag: "电气工程",
    summary: "电力电子通过开关器件和变换拓扑实现整流、逆变、升降压等能量变换，是新能源、储能和电驱系统的关键技术。",
    terms: ["变换器", "功率器件", "效率"],
    unlock: { route: "ee", label: "进入栖禾的电气线" },
    quiz: {
      question: "电力电子主要解决什么问题？",
      options: ["高效、安全地变换电能形态", "给所有设备换外壳", "只记录用电账单"],
      answer: 0
    }
  },
  {
    id: "ee-microgrid",
    major: "ee",
    title: "微电网",
    tag: "电气工程",
    summary: "微电网把分布式电源、储能和负载组织在一起，可并网也可孤岛运行，重点在稳定供能与灵活调度。",
    terms: ["储能", "负载", "调度"],
    unlock: { route: "eeTheory", label: "和栖禾追问电能理论" },
    quiz: {
      question: "微电网里储能的重要作用是什么？",
      options: ["缓冲发电和负载波动", "让所有电压都变成零", "替代所有电路保护"],
      answer: 0
    }
  },
  {
    id: "auto-closed-loop",
    major: "auto",
    title: "闭环控制",
    tag: "自动化",
    summary: "闭环控制会根据输出反馈修正输入，比单纯下命令更能抵抗扰动。自动化里很多系统稳定性的讨论都从闭环开始。",
    terms: ["反馈", "误差", "稳定性"],
    unlock: { route: "auto", label: "进入青岚的自动化线" },
    quiz: {
      question: "闭环控制比开环控制多了什么关键环节？",
      options: ["根据输出反馈修正输入", "完全不需要传感器", "只把指令发送一次"],
      answer: 0
    }
  },
  {
    id: "auto-sensor-fusion",
    major: "auto",
    title: "传感融合",
    tag: "自动化",
    summary: "传感融合把雷达、摄像头、IMU 等信息合并，降低单一传感器误差，让机器人更可靠地理解环境。",
    terms: ["定位", "估计", "机器人"],
    unlock: { route: "autoTheoryMore", label: "继续问青岚感知融合" },
    quiz: {
      question: "机器人为什么常常需要多传感器融合？",
      options: ["用不同信息互相校正误差", "让机身更重", "减少所有计算"],
      answer: 0
    }
  },
  {
    id: "ic-timing",
    major: "ic",
    title: "时序收敛",
    tag: "集成电路",
    summary: "时序收敛要求信号在时钟约束内稳定到达。频率、门延迟、线延迟和建立保持时间都会影响芯片能否可靠工作。",
    terms: ["时钟", "建立时间", "保持时间"],
    unlock: { route: "icTheory", label: "和微澜追问芯片理论" },
    quiz: {
      question: "提高芯片频率会直接压缩什么？",
      options: ["信号在一个周期内完成传播的时间", "芯片名字长度", "版图文件数量"],
      answer: 0
    }
  },
  {
    id: "ic-rtl-gds",
    major: "ic",
    title: "RTL 到 GDS",
    tag: "集成电路",
    summary: "RTL 描述电路行为，经过综合、布局布线、验证等流程，最终形成可交付制造的版图数据。",
    terms: ["RTL", "综合", "版图"],
    unlock: { route: "icGame", label: "挑战微澜的版图布线" },
    quiz: {
      question: "RTL 到 GDS 流程最终产出更接近什么？",
      options: ["可用于制造的芯片版图数据", "用户登录密码", "校园地图照片"],
      answer: 0
    }
  },
  {
    id: "comm-channel-coding",
    major: "comm",
    title: "信道编码",
    tag: "通信工程",
    summary: "信道编码通过冗余信息提升抗噪能力，让接收端在出错时仍有机会恢复原始信息。",
    terms: ["纠错", "LDPC", "可靠性"],
    unlock: { route: "comm", label: "进入星遥的通信线" },
    quiz: {
      question: "信道编码引入冗余的主要目的是什么？",
      options: ["提升抗噪和纠错能力", "让信号一定变慢", "隐藏所有网络设备"],
      answer: 0
    }
  },
  {
    id: "comm-space-ground",
    major: "comm",
    title: "天地一体网络",
    tag: "通信工程",
    summary: "天地一体网络把地面基站、无人机平台和卫星链路协同起来，面向更广覆盖、更强韧性的未来连接。",
    terms: ["卫星互联网", "移动性", "中继"],
    unlock: { route: "commTheoryMore", label: "继续问星遥未来网络" },
    quiz: {
      question: "天地一体网络强调的连接方式是什么？",
      options: ["地面、空中和卫星节点协同", "只使用一根网线", "关闭所有无线链路"],
      answer: 0
    }
  }
];

const knowledgeRewardRoutesByMajor = {
  cs: "knowledgeRewardCs",
  ee: "knowledgeRewardEe",
  auto: "knowledgeRewardAuto",
  ic: "knowledgeRewardIc",
  comm: "knowledgeRewardComm"
};

const knowledgeReports = {
  cs: {
    summary: "你已经能从抽象、复杂度、系统边界看待计算机问题。下一步可以尝试做一个完整项目，把算法、后端和评测日志串起来。",
    scores: [["抽象建模", 92], ["工程实现", 86], ["系统意识", 88]]
  },
  ee: {
    summary: "你已经理解电能变换、储能调度和可靠供能之间的关系。下一步可以结合仿真与实验记录，训练从波形定位问题的能力。",
    scores: [["电能理解", 90], ["可靠性判断", 88], ["实验安全意识", 86]]
  },
  auto: {
    summary: "你已经抓住反馈、状态估计和真实设备误差这条主线。下一步可以从仿真走向硬件联调，把控制策略放进真实环境。",
    scores: [["闭环思维", 91], ["感知融合", 85], ["联调能力", 89]]
  },
  ic: {
    summary: "你已经理解逻辑、时序和版图约束之间的联系。下一步可以练习 RTL + testbench + 波形分析的小闭环。",
    scores: [["逻辑严谨性", 93], ["时序意识", 90], ["约束优化", 87]]
  },
  comm: {
    summary: "你已经能从噪声、编码、链路和网络协同理解通信系统。下一步可以用仿真观察调制、编码和信道变化的影响。",
    scores: [["信号理解", 89], ["可靠连接", 91], ["网络协同", 88]]
  }
};

const favoriteRewardTiers = [
  { count: 0, title: "初始观察员", advice: "先收藏最让你有感觉的知识卡，观察自己天然会被哪类问题吸引。" },
  { count: 3, title: "专业观察员", advice: "你已经开始形成偏好。试着比较收藏卡之间的共同点：是算法、硬件、系统，还是连接？" },
  { count: 6, title: "图鉴研究员", advice: "你的兴趣开始跨专业扩散。建议优先查看联合事件，寻找能把多个方向串起来的主题。" },
  { count: 10, title: "全域策展人", advice: "你已经收藏完整套知识卡。隐藏建议：不要急着选唯一答案，先定义你想解决的问题，再反推专业组合。" }
];

const aptitudeProfiles = [
  { title: "系统型", match: ({ logic, team }) => logic >= team, desc: "你倾向先搭结构、看边界，再把方案落到可维护系统里。" },
  { title: "创造型", match: ({ passion, logic }) => passion > logic, desc: "你更容易被真实问题和新想法点燃，适合从项目牵引学习。" },
  { title: "协作型", match: ({ team, logic }) => team > logic, desc: "你擅长把不同模块和不同人连接起来，适合复杂系统联调。" },
  { title: "底层型", match: ({ logic, passion }) => logic >= passion + 2, desc: "你愿意深入机制、约束和实现细节，适合系统、芯片或控制底层方向。" },
  { title: "探索型", match: () => true, desc: "你在多个方向之间保持开放，适合继续探索交叉路径。" }
];

const majorRouteMarkers = {
  cs: ["cs", "csTheory", "csTheoryMore", "csGame", "csLab", "csAiPromise", "csSysPromise"],
  ee: ["ee", "eeTheory", "eeTheoryMore", "eeGame", "eeLab", "eeGridPromise", "eePowerPromise"],
  auto: ["auto", "autoTheory", "autoTheoryMore", "autoGame", "autoLab", "autoRobotPromise", "autoEmbedPromise"],
  ic: ["ic", "icTheory", "icTheoryMore", "icGame", "icLab", "icDesignPromise", "icVerifyPromise"],
  comm: ["comm", "commTheory", "commTheoryMore", "commGame", "commLab", "commNetworkPromise", "commSecurePromise"]
};

const epilogueRoutesByMajor = {
  cs: "epilogueCs",
  ee: "epilogueEe",
  auto: "epilogueAuto",
  ic: "epilogueIc",
  comm: "epilogueComm"
};

const trustRouteGain = {
  cs: ["cs", "csTheory", "csTheoryMore", "csGame", "csLab", "csAiPromise", "csSysPromise", "knowledgeRewardCs"],
  ee: ["ee", "eeTheory", "eeTheoryMore", "eeGame", "eeLab", "eeGridPromise", "eePowerPromise", "knowledgeRewardEe"],
  auto: ["auto", "autoTheory", "autoTheoryMore", "autoGame", "autoLab", "autoRobotPromise", "autoEmbedPromise", "knowledgeRewardAuto"],
  ic: ["ic", "icTheory", "icTheoryMore", "icGame", "icLab", "icDesignPromise", "icVerifyPromise", "knowledgeRewardIc"],
  comm: ["comm", "commTheory", "commTheoryMore", "commGame", "commLab", "commNetworkPromise", "commSecurePromise", "knowledgeRewardComm"]
};

const achievementDefinitions = [
  { id: "first-game", title: "第一次实验完成", desc: "完成任意一个专业小游戏。", test: () => ["csLab", "eeLab", "autoLab", "icLab", "commLab"].some(hasVisitedRoute) },
  { id: "major-cards", title: "专业知识收集者", desc: "集齐任意一个专业的知识卡。", test: () => Object.keys(majorArchive).some(isMajorKnowledgeComplete) },
  { id: "all-joints", title: "跨专业联调大师", desc: "完成全部跨专业事件。", test: () => jointEvents.every(isJointEventCompleted) },
  { id: "interdisciplinary", title: "交叉学科候选人", desc: "解锁交叉学科隐藏结局。", test: () => hasVisitedRoute("interdisciplinaryHidden") },
  { id: "clear-review", title: "错题本清空", desc: "至少获得 30 理解值，并清空错题本。", test: () => (collectionState.understanding || 0) >= 30 && (collectionState.wrongQuizCards || []).length === 0 }
];

const calendarEvents = [
  { id: "lecture-ai", day: 1, slot: "上午", title: "AI 导览讲座", place: "讲座厅", major: "cs", route: "csTheory", gain: "logic" },
  { id: "lab-energy", day: 1, slot: "下午", title: "微电网开放实验", place: "实验室", major: "ee", route: "eeGame", gain: "team" },
  { id: "robot-demo", day: 2, slot: "上午", title: "机器人队演示", place: "创新工坊", major: "auto", route: "autoGame", gain: "team" },
  { id: "chip-night", day: 2, slot: "下午", title: "芯片版图夜谈", place: "创新工坊", major: "ic", route: "icTheory", gain: "logic" },
  { id: "roof-link", day: 3, slot: "上午", title: "屋顶链路复测", place: "屋顶", major: "comm", route: "commGame", gain: "passion" },
  { id: "library-review", day: 3, slot: "下午", title: "图书馆知识复习", place: "图书馆", major: "cs", route: "csTheoryMore", gain: "logic" },
  { id: "joint-briefing", day: 4, slot: "上午", title: "跨专业项目简报", place: "讲座厅", major: "auto", route: "jointCsAuto", gain: "team" },
  { id: "dorm-talk", day: 4, slot: "下午", title: "宿舍楼下专业夜聊", place: "宿舍楼", major: "comm", route: "commTheoryMore", gain: "passion" },
  { id: "power-module", day: 5, slot: "上午", title: "功率模块拆解", place: "实验室", major: "ee", route: "jointEeIc", gain: "logic" },
  { id: "chip-review", day: 5, slot: "下午", title: "RTL Review", place: "创新工坊", major: "ic", route: "icTheoryMore", gain: "logic" },
  { id: "project-day", day: 6, slot: "上午", title: "项目制任务冲刺", place: "实验室", major: "auto", route: "autoLab", gain: "team" },
  { id: "final-report", day: 6, slot: "下午", title: "专业推荐报告整理", place: "图书馆", major: "cs", route: "knowledgeFinalArchive", gain: "passion" },
  { id: "open-demo", day: 7, slot: "上午", title: "开放日联调展示", place: "讲座厅", major: "comm", route: "jointAutoComm", gain: "team" },
  { id: "choice-evening", day: 7, slot: "下午", title: "最终选择前夜", place: "屋顶", major: "cs", route: "interdisciplinaryHidden", gain: "passion" }
];

const campusLocations = [
  { id: "lab", name: "实验室", desc: "适合触发专业实验、能源调度和项目冲刺。", routes: ["eeGame", "autoLab", "jointAutoEe"] },
  { id: "library", name: "图书馆", desc: "适合复习知识卡、整理错题和生成推荐报告。", routes: ["csTheoryMore", "icTheoryMore", "knowledgeFinalArchive"] },
  { id: "roof", name: "屋顶", desc: "适合通信链路、未来网络和选择前夜剧情。", routes: ["commGame", "commTheoryMore", "interdisciplinaryHidden"] },
  { id: "workshop", name: "创新工坊", desc: "适合机器人、芯片和跨专业硬件项目。", routes: ["autoGame", "icGame", "jointAutoIc"] },
  { id: "dorm", name: "宿舍楼", desc: "适合角色夜聊、信赖提升和后日谈。", routes: ["epilogueCs", "epilogueEe", "epilogueComm"] },
  { id: "hall", name: "讲座厅", desc: "适合讲座、展示和跨专业项目简报。", routes: ["csTheory", "jointCsComm", "jointIcComm"] }
];

const projectTasks = [
  { id: "ai-guide", name: "AI 导览组", major: "cs", desc: "把地图数据、推荐算法和真实反馈串成服务。", routes: ["csLab", "jointCsComm"], milestones: ["完成导览 AI 实验", "完成智能导览网络"] },
  { id: "robot-team", name: "机器人队", major: "auto", desc: "完成导航、控制和远程联调任务。", routes: ["autoLab", "jointAutoComm"], milestones: ["完成机器人导航", "完成远程无人车联调"] },
  { id: "chip-shop", name: "芯片工坊", major: "ic", desc: "从 RTL、时序到低功耗模块做一次完整 review。", routes: ["icLab", "jointIcComm"], milestones: ["完成版图布线", "完成低功耗基带模块"] },
  { id: "green-campus", name: "低碳校园组", major: "ee", desc: "围绕负载预测、储能和应急供能建立方案。", routes: ["eeLab", "jointCsEe"], milestones: ["完成微电网调度", "完成 AI 能源调度"] },
  { id: "wireless-link", name: "无线联调组", major: "comm", desc: "围绕链路可靠性、编码和中继完成联调。", routes: ["commLab", "jointEeComm"], milestones: ["完成链路配置", "完成应急通信供能"] }
];

const state = {
  current: "intro",
  logic: 0,
  passion: 0,
  team: 0,
  speed: 22,
  typingTimer: null,
  scoredRoutes: [],
  visitedRoutes: ["intro"]
};

const collectionState = {
  unlockedRoutes: ["intro"],
  completedJointEvents: [],
  favorites: [],
  solvedQuizzes: {},
  quizFeedback: {},
  wrongQuizCards: [],
  understanding: 0,
  achievements: [],
  trust: { cs: 0, ee: 0, auto: 0, ic: 0, comm: 0 },
  calendarDone: [],
  locationVisits: [],
  projectProgress: {}
};

const speakerEl = document.querySelector("#speaker");
const dialogueEl = document.querySelector("#dialogueText");
const choicesEl = document.querySelector("#choices");
const logicEl = document.querySelector("#logicScore");
const passionEl = document.querySelector("#passionScore");
const teamEl = document.querySelector("#teamScore");
const configDialog = document.querySelector("#configDialog");
const atlasDialog = document.querySelector("#atlasDialog");
const jointDialog = document.querySelector("#jointDialog");
const progressDialog = document.querySelector("#progressDialog");
const exploreDialog = document.querySelector("#exploreDialog");
const atlasBtn = document.querySelector("#atlasBtn");
const jointBtn = document.querySelector("#jointBtn");
const progressBtn = document.querySelector("#progressBtn");
const exploreBtn = document.querySelector("#exploreBtn");
const majorTab = document.querySelector("#majorTab");
const knowledgeTab = document.querySelector("#knowledgeTab");
const majorArchiveEl = document.querySelector("#majorArchive");
const knowledgeCardsEl = document.querySelector("#knowledgeCards");
const jointEventsEl = document.querySelector("#jointEvents");
const progressHubEl = document.querySelector("#progressHub");
const exploreHubEl = document.querySelector("#exploreHub");
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
const endingInsights = document.querySelector("#endingInsights");

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

function rememberRoute(routeId) {
  if (!state.visitedRoutes.includes(routeId)) {
    state.visitedRoutes.push(routeId);
  }
  collectionState.unlockedRoutes = collectionState.unlockedRoutes || ["intro"];
  const isNewCollectionRoute = !collectionState.unlockedRoutes.includes(routeId);
  if (!collectionState.unlockedRoutes.includes(routeId)) {
    collectionState.unlockedRoutes.push(routeId);
  }
  if (isNewCollectionRoute) increaseTrustForRoute(routeId);
  rememberJointCompletion(routeId);
  evaluateAchievements();
  saveCollectionState();
}

function loadCollectionState() {
  const saved = localStorage.getItem("majorGalgameCollection");
  if (!saved) return;
  try {
    Object.assign(collectionState, JSON.parse(saved));
    collectionState.unlockedRoutes = collectionState.unlockedRoutes || ["intro"];
    collectionState.completedJointEvents = collectionState.completedJointEvents || [];
    collectionState.favorites = collectionState.favorites || [];
    collectionState.solvedQuizzes = collectionState.solvedQuizzes || {};
    collectionState.quizFeedback = collectionState.quizFeedback || {};
    collectionState.wrongQuizCards = collectionState.wrongQuizCards || [];
    collectionState.understanding = collectionState.understanding || 0;
    collectionState.achievements = collectionState.achievements || [];
    collectionState.trust = { cs: 0, ee: 0, auto: 0, ic: 0, comm: 0, ...(collectionState.trust || {}) };
    collectionState.calendarDone = collectionState.calendarDone || [];
    collectionState.locationVisits = collectionState.locationVisits || [];
    collectionState.projectProgress = collectionState.projectProgress || {};
  } catch {
    localStorage.removeItem("majorGalgameCollection");
  }
}

function saveCollectionState() {
  localStorage.setItem("majorGalgameCollection", JSON.stringify(collectionState));
}

function increaseTrustForRoute(routeId) {
  collectionState.trust = collectionState.trust || { cs: 0, ee: 0, auto: 0, ic: 0, comm: 0 };
  Object.entries(trustRouteGain).forEach(([majorId, routeIds]) => {
    if (routeIds.includes(routeId)) {
      collectionState.trust[majorId] = Math.min(100, (collectionState.trust[majorId] || 0) + 10);
    }
  });
  jointEvents.forEach((event) => {
    if (routeId === event.route || routeId === getJointEventEndRoute(event)) {
      event.pair.split("×").forEach((part) => {
        const majorId = Object.keys(majorArchive).find((id) => part.includes(majorArchive[id].name.slice(0, 2)) || part.includes(majorArchive[id].name));
        if (majorId) collectionState.trust[majorId] = Math.min(100, (collectionState.trust[majorId] || 0) + 6);
      });
    }
  });
}

function evaluateAchievements() {
  collectionState.achievements = collectionState.achievements || [];
  achievementDefinitions.forEach((achievement) => {
    if (achievement.test() && !collectionState.achievements.includes(achievement.id)) {
      collectionState.achievements.push(achievement.id);
    }
  });
}

function isCardUnlocked(card) {
  const unlockedRoutes = collectionState.unlockedRoutes || ["intro"];
  return state.visitedRoutes.includes(card.unlock.route) || unlockedRoutes.includes(card.unlock.route);
}

function hasVisitedRoute(routeId) {
  const unlockedRoutes = collectionState.unlockedRoutes || ["intro"];
  return state.visitedRoutes.includes(routeId) || unlockedRoutes.includes(routeId);
}

function isJointEventUnlocked(event) {
  return event.requiredRoutes.every(hasVisitedRoute);
}

function getJointEventEndRoute(event) {
  return `${event.route}End`;
}

function isJointEventCompleted(event) {
  const completedEvents = collectionState.completedJointEvents || [];
  return completedEvents.includes(event.id) || hasVisitedRoute(getJointEventEndRoute(event));
}

function rememberJointCompletion(routeId) {
  const completedEvent = jointEvents.find((event) => getJointEventEndRoute(event) === routeId);
  if (!completedEvent) return;

  collectionState.completedJointEvents = collectionState.completedJointEvents || [];
  if (!collectionState.completedJointEvents.includes(completedEvent.id)) {
    collectionState.completedJointEvents.push(completedEvent.id);
    saveCollectionState();
  }
}

function toggleFavorite(cardId) {
  if (collectionState.favorites.includes(cardId)) {
    collectionState.favorites = collectionState.favorites.filter((id) => id !== cardId);
  } else {
    collectionState.favorites.push(cardId);
  }
  saveCollectionState();
}

function answerQuiz(cardId, selectedIndex) {
  const card = knowledgeCards.find((item) => item.id === cardId);
  if (!card) return;
  const correct = selectedIndex === card.quiz.answer;
  collectionState.quizFeedback[cardId] = correct ? "回答正确，知识点已点亮。" : "还差一点，再看一眼卡片说明。";
  if (correct) {
    const wasSolved = Boolean(collectionState.solvedQuizzes[cardId]);
    collectionState.solvedQuizzes[cardId] = true;
    collectionState.wrongQuizCards = (collectionState.wrongQuizCards || []).filter((id) => id !== cardId);
    if (!wasSolved) {
      collectionState.understanding = Math.min(100, (collectionState.understanding || 0) + 10);
    }
  } else if (!collectionState.solvedQuizzes[cardId]) {
    collectionState.wrongQuizCards = collectionState.wrongQuizCards || [];
    if (!collectionState.wrongQuizCards.includes(cardId)) {
      collectionState.wrongQuizCards.push(cardId);
    }
  }
  evaluateAchievements();
  saveCollectionState();
}

function getMajorCards(majorId) {
  return knowledgeCards.filter((card) => card.major === majorId);
}

function isMajorKnowledgeComplete(majorId) {
  return getMajorCards(majorId).every(isCardUnlocked);
}

function isMajorQuizComplete(majorId) {
  const cards = getMajorCards(majorId);
  return cards.every((card) => collectionState.solvedQuizzes[card.id]);
}

function getFavoriteRewardTier() {
  const count = collectionState.favorites.length;
  return favoriteRewardTiers.reduce((current, tier) => (count >= tier.count ? tier : current), favoriteRewardTiers[0]);
}

function getNextFavoriteRewardTier() {
  const count = collectionState.favorites.length;
  return favoriteRewardTiers.find((tier) => tier.count > count);
}

function hasFullFavoriteCollection() {
  return knowledgeCards.every((card) => collectionState.favorites.includes(card.id));
}

function renderReportContent(majorId) {
  const report = knowledgeReports[majorId];
  return `
    <p>${report.summary}</p>
    <div class="score-list">
      ${report.scores
        .map(([label, score]) => `
          <span>
            <b>${label}</b>
            <i style="--score:${score}%"></i>
            <em>${score}</em>
          </span>
        `)
        .join("")}
    </div>
  `;
}

function getAptitudeProfile() {
  const maxScore = Math.max(state.logic, state.passion, state.team, 1);
  const normalized = {
    logic: Math.round((state.logic / maxScore) * 100),
    passion: Math.round((state.passion / maxScore) * 100),
    team: Math.round((state.team / maxScore) * 100)
  };
  const profile = aptitudeProfiles.find((item) => item.match({ ...state, ...normalized }));
  return { ...profile, normalized };
}

function getMajorExplorationProgress() {
  const visited = collectionState.unlockedRoutes || ["intro"];
  return Object.entries(majorArchive).map(([majorId, major]) => {
    const routeCount = (majorRouteMarkers[majorId] || []).filter((routeId) => visited.includes(routeId)).length;
    const unlockedCards = getMajorCards(majorId).filter(isCardUnlocked).length;
    const solvedCards = getMajorCards(majorId).filter((card) => collectionState.solvedQuizzes[card.id]).length;
    return {
      id: majorId,
      name: major.name,
      icon: major.icon,
      score: routeCount + unlockedCards + solvedCards
    };
  });
}

function canUnlockInterdisciplinaryEnding() {
  const progressedMajors = getMajorExplorationProgress().filter((item) => item.score >= 4);
  const completedJointCount = jointEvents.filter(isJointEventCompleted).length;
  return progressedMajors.length >= 3 && (collectionState.understanding || 0) >= 30 && completedJointCount >= 1;
}

function isRouteAvailable(routeId) {
  if (routeId === "knowledgeFinalArchive") return hasFullFavoriteCollection();
  if (routeId === "interdisciplinaryHidden") return canUnlockInterdisciplinaryEnding();
  const epilogueMajor = Object.entries(epilogueRoutesByMajor).find(([, epilogueRoute]) => epilogueRoute === routeId)?.[0];
  if (epilogueMajor) return (collectionState.trust?.[epilogueMajor] || 0) >= 50 || hasVisitedRoute(routeId);
  const jointEvent = jointEvents.find((event) => event.route === routeId);
  if (jointEvent) return isJointEventUnlocked(jointEvent);
  return Boolean(routes[routeId]);
}

function getRecommendedMajors() {
  return getMajorExplorationProgress()
    .map((item) => ({
      ...item,
      trust: collectionState.trust?.[item.id] || 0,
      total: item.score * 8 + (collectionState.trust?.[item.id] || 0)
    }))
    .sort((a, b) => b.total - a.total);
}

function getTrainingAdvice(majorId) {
  const advice = {
    cs: "建议继续做完整软件项目：需求、数据结构、接口、测试和部署都要跑通。",
    ee: "建议多做仿真和实验复盘，把波形、器件状态和系统约束联系起来。",
    auto: "建议从仿真走向硬件联调，重点记录延迟、噪声和误差如何影响控制。",
    ic: "建议练习 RTL、testbench、波形和时序报告，把功能正确推进到约束满足。",
    comm: "建议用仿真观察调制、编码、信道和协议选择对可靠性的影响。"
  };
  return advice[majorId];
}

function renderRecommendationReport() {
  const recommendations = getRecommendedMajors();
  const primary = recommendations[0];
  const secondary = recommendations[1];
  const profile = getAptitudeProfile();
  return `
    <section class="report-card">
      <header>
        <span>Recommendation</span>
        <h3>专业推荐报告</h3>
      </header>
      <p>主推荐：${primary.icon} ${primary.name}。副方向：${secondary.icon} ${secondary.name}。当前画像为「${profile.title}」，${profile.desc}</p>
      <div class="report-ranks">
        ${recommendations
          .map((item) => `
            <span>
              <b>${item.icon} ${item.name}</b>
              <i style="--score:${Math.min(100, item.total)}%"></i>
              <em>${item.total}</em>
            </span>
          `)
          .join("")}
      </div>
      <p>${getTrainingAdvice(primary.id)}</p>
    </section>
  `;
}

function renderAchievements() {
  evaluateAchievements();
  return `
    <section class="progress-section">
      <header><span>Achievement</span><h3>成就系统</h3></header>
      <div class="achievement-grid">
        ${achievementDefinitions
          .map((achievement) => {
            const unlocked = collectionState.achievements.includes(achievement.id);
            return `
              <article class="${unlocked ? "done" : ""}">
                <strong>${unlocked ? "DONE" : "LOCKED"}</strong>
                <h4>${achievement.title}</h4>
                <p>${achievement.desc}</p>
              </article>
            `;
          })
          .join("")}
      </div>
    </section>
  `;
}

function renderTrustPanel() {
  return `
    <section class="progress-section">
      <header><span>Trust</span><h3>角色信赖度</h3></header>
      <div class="trust-grid">
        ${Object.entries(majorArchive)
          .map(([majorId, major]) => {
            const trust = collectionState.trust?.[majorId] || 0;
            const epilogueUnlocked = trust >= 50 || hasVisitedRoute(epilogueRoutesByMajor[majorId]);
            return `
              <article>
                <strong>${major.icon} ${profiles[majorId]?.name || major.name}</strong>
                <span style="--score:${trust}%"><i></i><b>${trust}</b></span>
                <p>${trust >= 80 ? "信赖很高，已适合解锁更多后日谈。" : trust >= 50 ? "信赖达标，后日谈入口已开放。" : "继续角色路线、知识卡和跨专业事件可提升信赖。"}</p>
                <button type="button" data-progress-route="${epilogueRoutesByMajor[majorId]}" ${epilogueUnlocked ? "" : "disabled"}>${epilogueUnlocked ? "查看后日谈" : "信赖 50 解锁"}</button>
              </article>
            `;
          })
          .join("")}
      </div>
    </section>
  `;
}

function renderProgressHub() {
  progressHubEl.innerHTML = `
    <div class="collection-stats">
      <span>成就 ${collectionState.achievements.length}/${achievementDefinitions.length}</span>
      <span>理解值 ${collectionState.understanding || 0}/100</span>
      <span>图鉴称号 ${getFavoriteRewardTier().title}</span>
    </div>
    ${renderRecommendationReport()}
    ${renderAchievements()}
    ${renderTrustPanel()}
  `;

  progressHubEl.querySelectorAll("[data-progress-route]").forEach((button) => {
    button.addEventListener("click", () => {
      progressDialog.close();
      render(button.dataset.progressRoute);
    });
  });
}

function renderEndingInsights(route) {
  if (!route.ending) {
    endingInsights.hidden = true;
    endingInsights.innerHTML = "";
    return;
  }

  const profile = getAptitudeProfile();
  const progress = getMajorExplorationProgress().sort((a, b) => b.score - a.score).slice(0, 3);
  const radarPoints = [
    `50% ${50 - profile.normalized.logic * 0.45}%`,
    `${50 + profile.normalized.passion * 0.39}% ${50 + profile.normalized.passion * 0.23}%`,
    `${50 - profile.normalized.team * 0.39}% ${50 + profile.normalized.team * 0.23}%`
  ].join(", ");
  endingInsights.hidden = false;
  endingInsights.innerHTML = `
    <section class="radar-card">
      <div class="radar-plot" style="--radar-points:${radarPoints}">
        <span>理性</span>
        <span>热情</span>
        <span>协作</span>
      </div>
      <div>
        <strong>专业画像：${profile.title}</strong>
        <p>${profile.desc}</p>
        <dl>
          <div><dt>理性</dt><dd>${state.logic}</dd></div>
          <div><dt>热情</dt><dd>${state.passion}</dd></div>
          <div><dt>协作</dt><dd>${state.team}</dd></div>
        </dl>
      </div>
    </section>
    <section class="cross-progress">
      <strong>交叉探索 Top 3</strong>
      <div>${progress.map((item) => `<span>${item.icon} ${item.name}<b>${item.score}</b></span>`).join("")}</div>
      <p>${canUnlockInterdisciplinaryEnding() ? "交叉学科隐藏结局已解锁。" : "继续均衡探索至少三个专业、提升理解值并完成一个跨专业事件，可解锁交叉学科隐藏结局。"}</p>
    </section>
  `;
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

function renderMajorArchive() {
  majorArchiveEl.innerHTML = Object.entries(majorArchive)
    .map(([id, major]) => `
      <article class="major-entry ${major.color}">
        <div class="major-entry-head">
          <span>${major.icon}</span>
          <div>
            <h3>${major.name}</h3>
            <p>${major.subtitle}</p>
          </div>
        </div>
        <div class="archive-grid">
          <section>
            <strong>核心课程</strong>
            <ul>${major.tracks.map((item) => `<li>${item}</li>`).join("")}</ul>
          </section>
          <section>
            <strong>能力树</strong>
            <ul>${major.skills.map((item) => `<li>${item}</li>`).join("")}</ul>
          </section>
          <section>
            <strong>典型去向</strong>
            <ul>${major.paths.map((item) => `<li>${item}</li>`).join("")}</ul>
          </section>
        </div>
        <p class="fit-note">${major.fit}</p>
        <div class="advice-grid">
          ${major.advice
            .map(([label, value]) => `
              <section>
                <strong>${label}</strong>
                <p>${value}</p>
              </section>
            `)
            .join("")}
        </div>
        <button type="button" data-route="${id}">进入角色线</button>
      </article>
    `)
    .join("");

  majorArchiveEl.querySelectorAll("[data-route]").forEach((button) => {
    button.addEventListener("click", () => {
      atlasDialog.close();
      render(button.dataset.route);
    });
  });
}

function renderKnowledgeCards(filter = "all") {
  const filterOptions = [
    ["all", "全部"],
    ["favorite", "收藏"],
    ...Object.entries(majorArchive).map(([id, major]) => [id, major.icon])
  ];
  const cards = knowledgeCards.filter((card) => {
    if (filter === "all") return true;
    if (filter === "favorite") return collectionState.favorites.includes(card.id);
    return card.major === filter;
  });
  const unlockedCount = knowledgeCards.filter(isCardUnlocked).length;
  const favoriteCount = collectionState.favorites.length;
  const solvedCount = Object.values(collectionState.solvedQuizzes).filter(Boolean).length;

  knowledgeCardsEl.innerHTML = `
    <div class="knowledge-filter" aria-label="知识卡片筛选">
      ${filterOptions
        .map(([id, label]) => `<button class="${id === filter ? "active" : ""}" type="button" data-filter="${id}">${label}</button>`)
        .join("")}
    </div>
    <div class="collection-stats">
      <span>解锁 ${unlockedCount}/${knowledgeCards.length}</span>
      <span>收藏 ${favoriteCount}</span>
      <span>测验 ${solvedCount}/${knowledgeCards.length}</span>
    </div>
    ${renderKnowledgeRewards()}
    <div class="knowledge-grid">
      ${cards
        .map((card) => renderKnowledgeCard(card))
        .join("")}
    </div>
  `;

  knowledgeCardsEl.querySelectorAll("[data-filter]").forEach((button) => {
    button.addEventListener("click", () => renderKnowledgeCards(button.dataset.filter));
  });
  knowledgeCardsEl.querySelectorAll("[data-favorite]").forEach((button) => {
    button.addEventListener("click", () => {
      toggleFavorite(button.dataset.favorite);
      renderKnowledgeCards(filter);
    });
  });
  knowledgeCardsEl.querySelectorAll("[data-quiz]").forEach((button) => {
    button.addEventListener("click", () => {
      answerQuiz(button.dataset.quiz, Number(button.dataset.answer));
      renderKnowledgeCards(filter);
    });
  });
  knowledgeCardsEl.querySelectorAll("[data-reward-route]").forEach((button) => {
    button.addEventListener("click", () => {
      atlasDialog.close();
      render(button.dataset.rewardRoute);
    });
  });
}

function renderKnowledgeRewards() {
  const majorRewardCards = Object.entries(majorArchive)
    .map(([majorId, major]) => {
      const cards = getMajorCards(majorId);
      const unlocked = cards.filter(isCardUnlocked).length;
      const solved = cards.filter((card) => collectionState.solvedQuizzes[card.id]).length;
      const collectionComplete = isMajorKnowledgeComplete(majorId);
      const quizComplete = isMajorQuizComplete(majorId);
      return `
        <article class="reward-card ${collectionComplete ? "ready" : "locked"}">
          <span>${major.icon} ${major.name}</span>
          <h3>${collectionComplete ? "特别对话已解锁" : "特别对话未解锁"}</h3>
          <p>知识卡进度：${unlocked}/${cards.length}</p>
          <button type="button" data-reward-route="${knowledgeRewardRoutesByMajor[majorId]}" ${collectionComplete ? "" : "disabled"}>${collectionComplete ? "进入特别对话" : "继续收集知识卡"}</button>
          <section class="report-box ${quizComplete ? "ready" : ""}">
            <strong>${quizComplete ? "专业理解报告" : "理解报告未完成"}</strong>
            ${quizComplete ? renderReportContent(majorId) : `<p>测验进度：${solved}/${cards.length}</p>`}
          </section>
        </article>
      `;
    })
    .join("");
  const currentTier = getFavoriteRewardTier();
  const nextTier = getNextFavoriteRewardTier();
  const fullFavorite = hasFullFavoriteCollection();
  const wrongCards = (collectionState.wrongQuizCards || [])
    .map((cardId) => knowledgeCards.find((card) => card.id === cardId))
    .filter(Boolean);

  return `
    <section class="reward-panel" aria-label="知识卡片奖励">
      <header>
        <div>
          <span>Reward Center</span>
          <h3>知识卡片奖励</h3>
        </div>
        <p>${currentTier.title}</p>
      </header>
      <div class="title-reward">
        <strong>图鉴称号：${currentTier.title}</strong>
        <p>${currentTier.advice}</p>
        <small>${nextTier ? `再收藏 ${nextTier.count - collectionState.favorites.length} 张知识卡，解锁「${nextTier.title}」。` : "全部收藏称号已解锁。"}</small>
        <button type="button" data-reward-route="knowledgeFinalArchive" ${fullFavorite ? "" : "disabled"}>${fullFavorite ? "进入最终隐藏剧情" : `收藏全部 ${knowledgeCards.length} 张知识卡后解锁最终剧情`}</button>
      </div>
      <div class="review-panel">
        <strong>理解值：${collectionState.understanding || 0}/100</strong>
        <p>${wrongCards.length ? "错题本会记录未答对的知识卡，再次答对后自动移出。" : "错题本为空。保持这个状态，很漂亮。"}</p>
        <div>
          ${wrongCards.length
            ? wrongCards.map((card) => `<span>${majorArchive[card.major].icon} ${card.title}</span>`).join("")
            : "<span>暂无错题</span>"}
        </div>
      </div>
      <div class="reward-grid">${majorRewardCards}</div>
    </section>
  `;
}

function renderKnowledgeCard(card) {
  const unlocked = isCardUnlocked(card);
  const favorite = collectionState.favorites.includes(card.id);
  const solved = Boolean(collectionState.solvedQuizzes[card.id]);
  const feedback = collectionState.quizFeedback[card.id] || "";

  if (!unlocked) {
    return `
      <article class="knowledge-card locked ${card.major}">
        <span>${card.tag}</span>
        <h3>未解锁知识卡</h3>
        <p>解锁条件：${card.unlock.label}</p>
        <div class="term-list"><b>LOCKED</b><b>${majorArchive[card.major].name}</b></div>
      </article>
    `;
  }

  return `
    <article class="knowledge-card ${card.major}">
      <header class="card-head">
        <span>${card.tag}</span>
        <button type="button" data-favorite="${card.id}" aria-pressed="${favorite}">${favorite ? "已收藏" : "收藏"}</button>
      </header>
      <h3>${card.title}</h3>
      <p>${card.summary}</p>
      <div class="term-list">${card.terms.map((term) => `<b>${term}</b>`).join("")}</div>
      <section class="quiz-box">
        <strong>${solved ? "测验已通过" : "随堂测验"}</strong>
        <p>${card.quiz.question}</p>
        <div class="quiz-options">
          ${card.quiz.options
            .map((option, index) => `
              <button type="button" data-quiz="${card.id}" data-answer="${index}" ${solved ? "disabled" : ""}>${option}</button>
            `)
            .join("")}
        </div>
        <small>${feedback}</small>
      </section>
    </article>
  `;
}

function renderJointEvents() {
  const unlockedCount = jointEvents.filter(isJointEventUnlocked).length;
  const completedCount = jointEvents.filter(isJointEventCompleted).length;
  jointEventsEl.innerHTML = `
    <div class="collection-stats">
      <span>跨专业事件 ${unlockedCount}/${jointEvents.length}</span>
      <span>已完成 ${completedCount}/${jointEvents.length}</span>
      <span>完成两条相关路线后解锁</span>
    </div>
    <div class="joint-grid">
      ${jointEvents
        .map((event) => {
          const unlocked = isJointEventUnlocked(event);
          const completed = isJointEventCompleted(event);
          const missing = event.requiredRoutes
            .map((routeId, index) => [routeId, event.requiredLabels[index]])
            .filter(([routeId]) => !hasVisitedRoute(routeId))
            .map(([, label]) => label);
          return `
            <article class="joint-card ${completed ? "completed" : unlocked ? "unlocked" : "locked"}">
              <span>${completed ? "DONE" : unlocked ? "READY" : "LOCKED"}</span>
              <h3>${event.title}</h3>
              <strong>${event.pair}</strong>
              <p>${event.summary}</p>
              <small>${completed ? `已完成：${event.reward}` : unlocked ? event.reward : `尚未完成：${missing.join(" / ")}`}</small>
              <button type="button" data-joint-route="${event.route}" ${unlocked ? "" : "disabled"}>${completed ? "再次查看" : unlocked ? "进入跨专业事件" : "暂未解锁"}</button>
            </article>
          `;
        })
        .join("")}
    </div>
  `;

  jointEventsEl.querySelectorAll("[data-joint-route]").forEach((button) => {
    button.addEventListener("click", () => {
      jointDialog.close();
      render(button.dataset.jointRoute);
    });
  });
}

function completeCalendarEvent(eventId) {
  const event = calendarEvents.find((item) => item.id === eventId);
  if (!event) return;
  collectionState.calendarDone = collectionState.calendarDone || [];
  if (!collectionState.calendarDone.includes(eventId)) {
    collectionState.calendarDone.push(eventId);
    state[event.gain] = (state[event.gain] || 0) + 1;
    increaseTrustForRoute(event.route);
    evaluateAchievements();
    saveCollectionState();
    updateScores();
  }
}

function visitLocation(locationId) {
  collectionState.locationVisits = collectionState.locationVisits || [];
  if (!collectionState.locationVisits.includes(locationId)) {
    collectionState.locationVisits.push(locationId);
    saveCollectionState();
  }
}

function completeProjectTask(projectId, routeId) {
  collectionState.projectProgress = collectionState.projectProgress || {};
  collectionState.projectProgress[projectId] = collectionState.projectProgress[projectId] || [];
  if (!collectionState.projectProgress[projectId].includes(routeId)) {
    collectionState.projectProgress[projectId].push(routeId);
    saveCollectionState();
  }
}

function renderCalendarPlanner() {
  return `
    <section class="explore-section">
      <header><span>7 Days</span><h3>7 天专业选择日历</h3></header>
      <div class="calendar-grid">
        ${calendarEvents
          .map((event) => {
            const done = (collectionState.calendarDone || []).includes(event.id);
            const available = isRouteAvailable(event.route);
            return `
              <article class="${done ? "done" : ""}">
                <span>Day ${event.day} · ${event.slot}</span>
                <h4>${event.title}</h4>
                <p>${event.place} / ${majorArchive[event.major].name}</p>
                <button type="button" data-calendar-event="${event.id}" data-explore-route="${event.route}" ${available ? "" : "disabled"}>${done ? "再次前往" : available ? "选择行动" : "条件不足"}</button>
              </article>
            `;
          })
          .join("")}
      </div>
    </section>
  `;
}

function renderCampusMap() {
  return `
    <section class="explore-section">
      <header><span>Map</span><h3>校园地图探索</h3></header>
      <div class="map-grid">
        ${campusLocations
          .map((location) => {
            const visited = (collectionState.locationVisits || []).includes(location.id);
            return `
              <article class="${visited ? "done" : ""}">
                <strong>${location.name}</strong>
                <p>${location.desc}</p>
                <div>
                  ${location.routes
                    .map((routeId) => `<button type="button" data-location="${location.id}" data-explore-route="${routeId}" ${isRouteAvailable(routeId) ? "" : "disabled"}>${routes[routeId]?.speaker || "隐藏事件"}</button>`)
                    .join("")}
                </div>
              </article>
            `;
          })
          .join("")}
      </div>
    </section>
  `;
}

function renderProjectTasks() {
  return `
    <section class="explore-section">
      <header><span>Project</span><h3>专业社团 / 项目制任务</h3></header>
      <div class="project-grid">
        ${projectTasks
          .map((project) => {
            const doneRoutes = collectionState.projectProgress?.[project.id] || [];
            return `
              <article>
                <span>${majorArchive[project.major].icon} ${project.name}</span>
                <h4>${project.desc}</h4>
                <p>完成度 ${doneRoutes.length}/${project.routes.length}</p>
                <div>
                  ${project.routes
                    .map((routeId, index) => `
                      <button type="button" data-project="${project.id}" data-explore-route="${routeId}" ${isRouteAvailable(routeId) ? "" : "disabled"}>${doneRoutes.includes(routeId) ? "DONE" : project.milestones[index]}</button>
                    `)
                    .join("")}
                </div>
              </article>
            `;
          })
          .join("")}
      </div>
    </section>
  `;
}

function renderExploreHub() {
  exploreHubEl.innerHTML = `
    <div class="collection-stats">
      <span>日历 ${collectionState.calendarDone.length}/${calendarEvents.length}</span>
      <span>地点 ${collectionState.locationVisits.length}/${campusLocations.length}</span>
      <span>项目 ${Object.values(collectionState.projectProgress || {}).flat().length}/${projectTasks.reduce((sum, item) => sum + item.routes.length, 0)}</span>
    </div>
    ${renderCalendarPlanner()}
    ${renderCampusMap()}
    ${renderProjectTasks()}
  `;

  exploreHubEl.querySelectorAll("[data-explore-route]").forEach((button) => {
    button.addEventListener("click", () => {
      if (button.dataset.calendarEvent) completeCalendarEvent(button.dataset.calendarEvent);
      if (button.dataset.location) visitLocation(button.dataset.location);
      if (button.dataset.project) completeProjectTask(button.dataset.project, button.dataset.exploreRoute);
      exploreDialog.close();
      render(button.dataset.exploreRoute);
    });
  });
}

function switchAtlasTab(target) {
  const isMajor = target === "major";
  majorTab.classList.toggle("active", isMajor);
  knowledgeTab.classList.toggle("active", !isMajor);
  majorTab.setAttribute("aria-selected", String(isMajor));
  knowledgeTab.setAttribute("aria-selected", String(!isMajor));
  majorArchiveEl.hidden = !isMajor;
  knowledgeCardsEl.hidden = isMajor;
}

function render(routeId, shouldScore = true) {
  const route = routes[routeId];
  if (!route) return;

  state.current = routeId;
  rememberRoute(routeId);
  if (routeId === "intro" && shouldScore) {
    state.logic = 0;
    state.passion = 0;
    state.team = 0;
    state.scoredRoutes = [];
    state.visitedRoutes = ["intro"];
  }
  if (shouldScore) applyScore(routeId, route.score);
  updateScores();
  updateCharacterFocus(route.focus);
  renderProfile(route.focus);
  renderMiniGame(route);
  renderEndingInsights(route);

  speakerEl.textContent = route.speaker;
  const displayText = route.ending ? `${route.text}\n\n图鉴称号：${getFavoriteRewardTier().title}` : route.text;
  typeText(displayText);
  choicesEl.innerHTML = "";

  const endingChoices = [["intro", "↺", "重新选择", "回到五个专业"], ["save", "✓", "保存倾向", "记录当前结局"]];
  if (route.ending && routeId !== "interdisciplinaryHidden" && canUnlockInterdisciplinaryEnding()) {
    endingChoices.unshift(["interdisciplinaryHidden", "✦", "交叉学科隐藏结局", "进入复合方向画像"]);
  }

  const choices = route.ending
    ? endingChoices
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
  const archiveTitle = getFavoriteRewardTier().title;
  const snapshot = {
    current: state.current,
    logic: state.logic,
    passion: state.passion,
    team: state.team,
    speed: state.speed,
    scoredRoutes: state.scoredRoutes,
    visitedRoutes: state.visitedRoutes,
    archiveTitle
  };
  localStorage.setItem("majorGalgameDemo", JSON.stringify(snapshot));
  speakerEl.textContent = "系统";
  typeText(`进度已保存。当前图鉴称号：${archiveTitle}。等你再次回到实验平台，我们会从这里继续。`);
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
  state.visitedRoutes = state.visitedRoutes || ["intro", state.current].filter(Boolean);
  state.scoredRoutes = state.scoredRoutes || [];
  render(state.current, false);
}

document.querySelector("#saveBtn").addEventListener("click", saveGame);
document.querySelector("#loadBtn").addEventListener("click", loadGame);
document.querySelector("#configBtn").addEventListener("click", () => configDialog.showModal());
atlasBtn.addEventListener("click", () => {
  loadCollectionState();
  renderMajorArchive();
  renderKnowledgeCards();
  switchAtlasTab("major");
  atlasDialog.showModal();
});
jointBtn.addEventListener("click", () => {
  loadCollectionState();
  renderJointEvents();
  jointDialog.showModal();
});
progressBtn.addEventListener("click", () => {
  loadCollectionState();
  evaluateAchievements();
  renderProgressHub();
  progressDialog.showModal();
});
exploreBtn.addEventListener("click", () => {
  loadCollectionState();
  renderExploreHub();
  exploreDialog.showModal();
});
majorTab.addEventListener("click", () => switchAtlasTab("major"));
knowledgeTab.addEventListener("click", () => switchAtlasTab("knowledge"));

speedRange.addEventListener("input", (event) => {
  state.speed = Number(event.target.value);
});

ambientToggle.addEventListener("change", (event) => {
  document.body.classList.toggle("paused", !event.target.checked);
});

document.querySelectorAll(".hero-card").forEach((card) => {
  card.addEventListener("click", () => render(card.dataset.route));
});

loadCollectionState();
render("intro", false);
