---
title: CPU虚拟化笔记
date: 2026-03-30
slug: cpu-virtualization-notes
description: CPU虚拟化的概念、机制、性能和实战排障全景笔记，适合操作系统初学者和后端开发者。
category:
  - 操作系统
tags:
   - CPU虚拟化
   - 操作系统
---
# CPU虚拟化学习笔记

> 一篇给零基础读者的「操作系统 CPU 虚拟化」长文：从概念到机制、从机制到性能、从性能到实战排障。

**作者定位**：学习笔记 / 博客教程  
**阅读建议**：先通读一次，再按章节回看图解与案例  
**适合人群**：操作系统初学者、后端开发者、面试冲刺读者

## TL;DR（3 句话快速预览）

1. CPU 虚拟化的本质是：让多个 VM 都“以为自己独占 CPU”，但实际由 Hypervisor 统一调度。  
2. 性能关键在 **VM Exit 频率、vCPU 调度、I/O 路径、中断处理**。  
3. 工程上要把“机制 + 指标 + 调优策略”串起来，才能从会背概念变成会定位问题。

## 阅读导航（博客版）

- 想先入门：看 **第一、二、三部分 + 附录A 图解**
- 想看性能：看 **第四、七部分**
- 想看工程实践：看 **第五、六、八部分**
- 想准备面试：看 **第九部分**

## 一页总览（先建立地图）

| 你想解决的问题 | 先读哪里 | 读完你应该会什么 |
|---|---|---|
| CPU 虚拟化到底是什么？ | 第一部分 | 讲清 vCPU / pCPU / Hypervisor 关系 |
| VM 为啥会慢？ | 第二、四部分 | 识别 Exit、调度等待、抢占抖动 |
| I/O 路径怎么影响性能？ | 第五部分 | 解释 Emulation / Virtio / Passthrough 差异 |
| 多核和 NUMA 怎么调？ | 第六部分 | 做亲和性与拓扑优化 |
| 线上排障怎么落地？ | 第七部分 | 按指标流程定位问题 |
| 面试怎么答得结构化？ | 第九部分 + 附录B | 30 秒口述 + 算法选型 |

## 目录

- [TL;DR（3 句话快速预览）](#tldr3-句话快速预览)
- [阅读导航（博客版）](#阅读导航博客版)
- [零基础阅读法（先看这个）](#零基础阅读法先看这个)
- [第一部分：基础概念（详细版）](#第一部分基础概念详细版)
- [第二部分：调度算法基础（先学这个）](#第二部分调度算法基础先学这个)
- [第三部分：CPU虚拟化核心机制（Trap、VM Exit、Hypercall）](#第三部分cpu虚拟化核心机制trapvm-exithypercall)
- [第四部分：vCPU调度与性能开销（为什么会慢）](#第四部分vcpu调度与性能开销为什么会慢)
- [第五部分：I/O虚拟化与中断路径（从可用到高性能）](#第五部分io虚拟化与中断路径从可用到高性能)
- [第六部分：多核、NUMA 与亲和性（工程实战关键）](#第六部分多核numa-与亲和性工程实战关键)
- [第七部分：观测与调优实战（指标、流程、方法）](#第七部分观测与调优实战指标流程方法)
- [第八部分：安全与隔离（特权边界与风险控制）](#第八部分安全与隔离特权边界与风险控制)
- [第九部分：面试高频问答 + 实战案例题（收官）](#第九部分面试高频问答--实战案例题收官)
- [附录A：超小白图解（ASCII 流程图）](#附录a超小白图解ascii-流程图)
- [附录B：调度算法系统课补充（对齐第7-11章）](#附录b调度算法系统课补充对齐第7-11章)
- [结语：把CPU虚拟化学成能力](#结语把cpu虚拟化学成能力)

## 零基础阅读法（先看这个）

> 你可以把 CPU 虚拟化想成“机场塔台调度”：
> - 第一、二、三部分：先懂飞机和跑道规则（概念 + 调度 + 机制）
> - 第四、五部分：看堵塞和起降效率（vCPU调度与 I/O）
> - 第六、七部分：看复杂机场运营（NUMA + 性能调优）
> - 第八、九部分：看安全与应急（隔离与面试实战）

### 给小白的学习节奏（建议）

1. **先记关系图**：vCPU、pCPU、Hypervisor、Guest OS
2. **再记关键路径**：Guest 执行 -> VM Exit -> Hypervisor -> VM Entry
3. **每章只记 3 件事**：核心定义、典型流程、一个误区
4. **一定要画图复述**：画不出来，基本没真正懂

### 术语速查（读不懂时先回这里）

- **vCPU**：虚拟机看到的 CPU
- **pCPU**：物理 CPU 核心
- **Hypervisor/VMM**：虚拟机监控器，负责调度和隔离
- **VM Exit / VM Entry**：从 Guest 切到 Hypervisor，再切回 Guest
- **Trap-and-Emulate**：敏感操作陷入后由 Hypervisor 模拟
- **Hypercall**：Guest 主动调用 Hypervisor 服务
- **VT-x / AMD-V**：x86 硬件辅助虚拟化能力

---

## 第一部分：基础概念（详细版）

> **新手注解（先建立直觉）**  
> 这章先回答两个问题：  
> 1) 为什么一个物理 CPU 能“同时”跑很多 VM？  
> 2) 为什么 VM 里看到的 CPU 不等于真实独占 CPU？

**速读提示**：先看“vCPU 与 pCPU 的关系”，再看 Type-1 / Type-2。

### 1. 什么是 CPU 虚拟化？

**CPU 虚拟化（CPU Virtualization）**指的是：  
Hypervisor 把物理 CPU 的执行能力抽象成多个虚拟 CPU（vCPU），分配给不同虚拟机，让每个 VM 看到“可用且隔离”的 CPU 环境。

### 2. 目标是什么？

- **复用**：同一台物理机承载多个 VM
- **隔离**：VM 之间互不越权
- **可控**：可限额、可监控、可调度

### 3. vCPU 与 pCPU 的关系

- vCPU 是“逻辑执行单元”
- pCPU 是真实硬件核心
- Hypervisor 负责把 vCPU 运行片段映射到 pCPU 时间片

核心点：vCPU 数量可以大于 pCPU 数量，但会引入调度竞争。

### 4. Type-1 与 Type-2 Hypervisor

- **Type-1（裸金属）**：直接跑在硬件上（如 ESXi、Hyper-V、Xen）
- **Type-2（宿主型）**：跑在宿主 OS 上（如 VirtualBox、VMware Workstation）

通常 Type-1 在性能和隔离上更强。

### 5. 本节小结

CPU 虚拟化本质是：**把“物理执行资源”切分为“可调度的虚拟执行视图”**。

---

## 第二部分：调度算法基础（先学这个）

> **重排说明**：你提到“调度算法没有系统讲”，这里把它前置。  
> 先懂调度，再看虚拟化机制，会更顺。

### 1. 为什么先学调度算法？

因为 CPU 虚拟化本质上也是“调度问题”：

- Guest 内核调度线程
- Hypervisor 调度 vCPU

你不先懂调度，后面很多性能现象会看不懂。

### 2. 五类核心算法（速览）

1. **RR**：时间片轮转，公平直观
2. **STCF**：剩余时间最短优先，平均周转好
3. **MLFQ**：多级反馈，兼顾响应与吞吐
4. **Lottery/Stride**：按份额分配 CPU
5. **Work Stealing**：多核场景动态均衡

### 3. 三个你必须会的实现思路

#### 3.1 MLFQ（多级反馈队列）

```text
新任务 -> 最高优先级队列
用完整个时间片 -> 降级
周期性提升 -> 防饥饿
```

#### 3.2 Stride（确定性比例份额）

```text
stride = BIG / tickets
每次选 pass 最小者运行
运行后 pass += stride
```

#### 3.3 Work Stealing（多核）

```text
本核队列空 -> 去其他核偷任务
平衡负载，同时保留局部性
```

### 4. 本节小结

一句话：**调度算法决定“谁先跑、跑多久、会不会饿死”，这是 CPU 虚拟化的地基。**

---

## 第三部分：CPU虚拟化核心机制（Trap、VM Exit、Hypercall）

> **新手注解（最核心机制）**  
> 这一章是 CPU 虚拟化的发动机。你要懂“什么时候直接跑，什么时候切回 Hypervisor”。

**速读提示**：这章最重要的是 `VM Exit -> Hypervisor 处理 -> VM Entry` 这条链路。

### 1. Trap-and-Emulate 机制

Guest 执行特权敏感操作时，CPU 触发陷入（trap），控制权转给 Hypervisor，由它做安全处理或模拟执行。

流程可写成：

$$
Guest\ Instruction \rightarrow Trap \rightarrow Hypervisor\ Emulate \rightarrow Resume
$$

### 2. VM Exit / VM Entry

- **VM Exit**：从 Guest 上下文切到 Hypervisor
- **VM Entry**：处理后切回 Guest

Exit/Entry 不是免费操作，频繁发生会明显增加开销。

### 3. Hypercall 与系统调用的关系

- 系统调用：应用 -> Guest 内核
- Hypercall：Guest -> Hypervisor

可以理解为“虚拟化层级下的特权服务请求”。

### 4. 硬件辅助虚拟化（VT-x / AMD-V）

硬件提供专门的虚拟化执行模式和控制结构，减少纯软件模拟开销，提高可用性与性能。

### 5. 本节小结

CPU 虚拟化能高效运行的关键是：**尽量少 Exit，必要时才 Exit**。

---

## 第四部分：vCPU调度与性能开销（为什么会慢）

> **新手注解（性能分水岭）**  
> 这一章解决“为什么 VM 看起来 CPU 不满，却还是很卡”。

**速读提示**：先看“2. 调度算法（实现解说）”，再看“3. 常见开销来源”。

### 1. vCPU 调度基础

Hypervisor 会把多个 vCPU 放到可运行队列中，按策略映射到 pCPU 执行。

常见影响因素：

- vCPU 数量与 pCPU 比例
- 权重（shares）与上限（limit）
- 绑定（pinning）策略

### 2. 调度算法（实现解说）

这一节回答你最关心的问题：**vCPU 到底按什么算法被调度到 pCPU 上？**

#### 2.0 算法对照（先看这张表）

| 算法 | 公平性 | 响应性 | 实现复杂度 | 典型问题 | 适用场景 |
|---|---|---|---|---|---|
| RR | 中 | 中高 | 低 | 时间片太小切换开销大 | 通用入门、公平优先 |
| Priority/Weight | 中高 | 取决于策略 | 中 | 权重配置不当会倾斜 | 多租户资源分级 |
| CFS 思想 | 高 | 中高 | 中高 | 需要精细统计 | 混合负载系统 |
| Credit 类 | 高 | 中 | 中 | 额度参数敏感 | 虚拟化平台常用 |
| Stride | 高（长期） | 中 | 中 | 短期波动仍在 | 份额可预测场景 |

> 记忆口诀：**先定公平目标，再选调度机制；先看响应，再看吞吐。**

#### 2.1 Round-Robin（时间片轮转）

**思路**：每个可运行 vCPU 轮流获得固定时间片 `q`。  
**优点**：实现简单、公平直观。  
**缺点**：对“短任务”和“延迟敏感任务”不够友好。

伪代码：

```text
while true:
      v = run_queue.pop_front()
      run(v, q)
      if v.still_runnable:
            run_queue.push_back(v)
```

---

#### 2.2 Priority + Weight（优先级/权重调度）

**思路**：给不同 VM 或 vCPU 配置优先级/权重，高权重得到更多 CPU 份额。  
**典型应用**：生产环境按业务等级分配资源（核心业务 > 批处理）。

可理解为目标份额：

$$
share_i = \frac{weight_i}{\sum weight}
$$

---

#### 2.3 CFS 思想（按虚拟运行时间 vruntime）

Linux 常见思路是让每个任务的 `vruntime` 尽量接近：

- 谁的 `vruntime` 最小，谁优先运行
- 运行后其 `vruntime` 增长

伪代码（简化）：

```text
pick_next():
      v = tree.min_vruntime()
      run(v, delta)
      v.vruntime += delta * normalize(v.weight)
      tree.reinsert(v)
```

这种方式兼顾吞吐与公平，比纯轮转更适合混合负载。

---

#### 2.4 Xen Credit / 类信用调度（虚拟化常见）

**思路**：每个 vCPU 有“credit（额度）”，运行会消耗额度；额度高者优先。  
周期性补充 credit，确保长期公平。

适合多租户环境：可以较自然地表达“谁该多拿 CPU”。

---

#### 2.5 Stride / 彩票类调度（进阶概念）

给每个实体分配票数（或步长 stride）：

- 票多 => stride 小 => 更频繁被调度
- 每次运行后 `pass += stride`
- 选 `pass` 最小者运行

伪代码：

```text
pick_next():
      v = min_pass_entity
      run(v, q)
      v.pass += v.stride
```

优点是份额控制精确、可预测性较好。

---

#### 2.6 虚拟化里“额外难点”：Co-scheduling

对多 vCPU 的同一 VM，如果调度不同步，可能出现：

- 某些 vCPU 在等锁
- 另一些 vCPU 还没被调度到

这会导致 **co-stop** 上升。  
所以虚拟化调度不只是“单核公平”，还要考虑“同一 VM 内多核协同”。

### 3. 常见开销来源

1. **VM Exit 频繁**：上下文切换开销
2. **调度等待**：vCPU 在 run queue 排队
3. **抢占与抖动**：时间片碎片化
4. **中断压力**：高频打断 Guest 执行

### 4. 过量分配（CPU Overcommit）

vCPU 总量超过 pCPU 总量是常见做法，但过高会引发抢占延迟，表现为尾延迟升高。

### 5. 本节小结

性能不只是“CPU 利用率”，还要看 **等待时间 + 切换成本 + 抖动程度**。

---

## 第五部分：I/O虚拟化与中断路径（从可用到高性能）

> **新手注解（工程高频）**  
> 真实业务慢很多时候不是算不动，而是 I/O 路径太绕。

**速读提示**：先看三种 I/O 路径，再看中断虚拟化。

### 1. I/O 虚拟化三种路径（简化）

1. **设备模拟（Emulation）**：兼容最好，开销较高
2. **半虚拟化（Virtio）**：Guest 配合驱动，性能更好
3. **直通（Passthrough/SR-IOV）**：性能接近原生，隔离复杂度更高

### 2. 中断虚拟化

设备中断需要在 Guest 与 Hypervisor 间正确转发，若中断过密，CPU 会被频繁打断。

### 3. 常见优化方向

- 采用 virtio 替代重模拟
- 调整中断合并（coalescing）
- 合理使用多队列（multi-queue）

### 4. 本节小结

I/O 路径设计决定了“吞吐和延迟上限”。

---

## 第六部分：多核、NUMA 与亲和性（工程实战关键）

> **新手注解（进阶重点）**  
> 多核时代，CPU 问题往往是“拓扑问题”而不只是“算力问题”。

**速读提示**：优先掌握“本地内存快、远程内存慢”这个核心事实。

### 1. NUMA 基础

NUMA 系统中，不同 CPU 节点访问本地内存更快，跨节点访问更慢。

### 2. VM 的 NUMA 感知

若 vCPU 与内存分布不合理，可能出现“CPU 在 A 节点跑，内存在 B 节点”，导致额外延迟。

### 3. 亲和性策略

- vCPU 绑定 pCPU（减少迁移）
- 内存尽量本地化（降低远程访问）

### 4. 本节小结

高并发下，**拓扑亲和性**常常比“盲目加核”更有效。

---

## 第七部分：观测与调优实战（指标、流程、方法）

> **新手注解（从会背到会排障）**  
> 这章目标是建立一套“可复用”的 CPU 虚拟化排障流程。

**速读提示**：按“业务受损 -> 调度拥塞 -> Exit 异常 -> I/O/拓扑”顺序看。

### 1. 关键指标地图

1. **调度层**：ready time、run queue 长度、co-stop
2. **执行层**：CPU 使用率、steal time
3. **虚拟化层**：VM Exit 频率、Exit 原因分布
4. **业务层**：P95/P99、吞吐、超时率

### 2. 排障流程（推荐）

1. 先看业务是否受损（延迟/吞吐）
2. 再看调度是否拥塞（ready/co-stop）
3. 再看 Exit 是否异常偏高
4. 最后定位到 I/O 或拓扑问题

### 3. 高价值调优动作

- 控制 vCPU overcommit 比例
- 给关键 VM 预留资源与亲和绑定
- 优化 I/O 路径（virtio、多队列）
- 降低不必要 VM Exit

### 4. 本节小结

调优的本质是：**减少无效切换，保证关键路径持续执行**。

---

## 第八部分：安全与隔离（特权边界与风险控制）

> **新手注解（别只看性能）**  
> CPU 虚拟化首先是隔离机制，其次才是性能机制。

**速读提示**：把“特权边界”当作这章主线，风险点和防护策略围绕它记。

### 1. 特权边界

Guest 内核不等于宿主内核。Hypervisor 才是全局资源裁决者。

### 2. 常见风险点

- VM Escape（虚拟机逃逸）
- 侧信道风险（共享缓存/分支预测相关）
- 过度共享导致资源争抢

### 3. 基础防护策略

- 及时更新 Hypervisor 与微码
- 最小化设备暴露面
- 关键业务隔离部署
- 持续监控异常 Exit 与行为偏差

### 4. 本节小结

安全不是附加项，而是 CPU 虚拟化设计的一部分。

---

## 第九部分：面试高频问答 + 实战案例题（收官）

> **新手注解（输出能力）**  
> 这章帮助你把“理解”变成“表达”。

**速读提示**：先背 Q1~Q4，再背 30 秒口述。

### 1. 高频问答（简洁版）

#### Q1：CPU 虚拟化是什么？

- 让多个 VM 共享物理 CPU，并保证隔离与可控调度。

#### Q2：为什么 VM Exit 很关键？

- Exit 需要上下文切换，频繁发生会显著增加延迟。

#### Q3：vCPU 高于 pCPU 一定不行吗？

- 不一定；轻载可行，但高峰期易导致调度等待和尾延迟。

#### Q4：为什么 CPU 利用率不高但业务仍慢？

- 可能卡在调度等待、Exit 开销、I/O 中断或 NUMA 远程访问。

### 2. 实战案例

#### 案例1：延迟飙升但 CPU 仅 50%

- 现象：P99 增高、ready time 增高
- 结论：调度拥塞而非纯算力不足
- 动作：降低 overcommit、关键 VM 绑定

#### 案例2：升级后吞吐下降

- 现象：Exit 频率激增
- 结论：某类敏感指令/设备路径触发更多 Exit
- 动作：优化虚拟化配置、调整驱动与 I/O 路径

### 3. 30 秒口述总结

> CPU 虚拟化的本质是让多个 VM 在共享硬件上被安全、可控地调度执行。性能上关键看 VM Exit、vCPU 调度与 I/O 路径；工程上要结合拓扑亲和性、资源策略和监控指标，才能在密度和稳定性之间取得平衡。

### 4. 全书一句话

**CPU 虚拟化 = 特权受控执行 + 调度复用 + 指标驱动调优。**

---

## 附录A：超小白图解（ASCII 流程图）

### A1. Guest 执行与 VM Exit

```text
Guest 在 vCPU 上执行
        |
        v
  是否触发敏感操作？
    /           \
   否            是
   |             |
   v             v
继续执行      VM Exit 到 Hypervisor
                  |
                  v
            处理/模拟该操作
                  |
                  v
               VM Entry
                  |
                  v
             返回 Guest 继续执行
```

### A2. vCPU 调度直观图

```text
vCPU队列: [vCPU1][vCPU2][vCPU3][vCPU4]...
                |
                v
Hypervisor 调度器按策略分配到 pCPU

pCPU0 <- vCPU1 时间片
pCPU1 <- vCPU3 时间片
pCPU2 <- vCPU2 时间片
pCPU3 <- vCPU4 时间片
```

### A3. CPU 虚拟化排障速记卡

```text
1) 先看业务：P95/P99 是否异常
2) 再看调度：ready/co-stop/steal
3) 再看机制：VM Exit 是否激增
4) 再看路径：I/O 与中断是否过重
5) 最后看拓扑：NUMA/亲和性是否失配
```

---

## 附录B：调度算法系统课补充（对齐第7-11章）

> 这部分就是你说的“还没讲到”的重点：
> - 第7章：进程调度介绍
> - 第8章：多级反馈队列（MLFQ）
> - 第9章：比例份额（Proportional Share）
> - 第10章：多处理器调度
> - 第11章：与 CPU 虚拟化的连接

**阅读建议**：这部分按 B1 -> B2 -> B3 -> B4 -> B5 顺序读，最后用 B6 做一页复盘。

### B1. 第7章：进程调度介绍（基础算法）

#### 1) FCFS（先来先服务）

- 规则：按到达顺序执行，直到完成
- 优点：实现最简单
- 缺点：短任务可能被长任务“压住”（护航效应）

伪代码：

```text
on_arrival(job):
      queue.push_back(job)

scheduler_loop():
      while true:
            j = queue.pop_front()
            run_until_finish(j)
```

#### 2) SJF / STCF（最短作业优先 / 最短剩余时间优先）

- SJF：总运行时间最短者先
- STCF：可抢占版本，每次选“剩余时间最短”
- 难点：现实里不知道未来运行时间，只能估计

伪代码（STCF）：

```text
pick_next():
      return argmin_j(remaining_time[j])

on_tick_or_arrival():
      if current != pick_next():
            preempt(current)
            switch_to(pick_next())
```

#### 3) RR（时间片轮转）

- 规则：每个任务拿到时间片 `q`
- 响应时间好，公平直观
- 时间片过小会导致切换开销高

---

### B2. 第8章：MLFQ（多级反馈队列）

MLFQ 用“行为反馈”替代“先验预测”：

- 交互型任务（经常主动让出 CPU）优先级高
- CPU 密集型任务优先级逐步下降

#### 经典规则（简化）

1. 新任务先放最高优先级队列
2. 同优先级内 RR
3. 用完整个时间片则降级
4. 周期性全体提升（防饥饿）

#### 核心数据结构

- 多个就绪队列：`Q0, Q1, ..., Qn`（`Q0` 最高）
- 每任务统计：`ticks_used`, `queue_level`, `wait_time`

#### 伪代码（简化）

```text
on_job_arrival(j):
      j.level = 0
      enqueue(Q0, j)

pick_next():
      for level in 0..n:
            if not empty(Q[level]):
                  return dequeue(Q[level])

on_time_slice_end(j):
      if j.used_full_quantum:
            j.level = min(j.level + 1, n)
      enqueue(Q[j.level], j)

on_priority_boost_interval():
      move_all_jobs_to(Q0)
```

#### MLFQ 参数怎么调

- 高层队列时间片短（响应快）
- 低层队列时间片长（吞吐高）
- Boost 周期不能太长（避免饥饿）

---

### B3. 第9章：比例份额调度（Proportional Share）

目标：每个任务长期获得 CPU 比例接近其权重份额。

#### 1) Lottery Scheduling（彩票调度）

- 每个任务持有若干“彩票”
- 每次抽签，抽中者运行
- 票数越多，中签概率越高

概率份额：

$$
P(i) = \frac{tickets_i}{\sum tickets}
$$

伪代码：

```text
pick_next():
      t = random(1, total_tickets)
      s = 0
      for j in runnable_jobs:
            s += tickets[j]
            if s >= t:
                  return j
```

#### 2) Stride Scheduling（确定性版本）

- `stride = BIG / tickets`
- 每次选 `pass` 最小者运行
- 运行后 `pass += stride`

比 Lottery 更稳定、抖动更小。

伪代码：

```text
init(j):
      j.stride = BIG / j.tickets
      j.pass = 0

pick_next():
      j = argmin(pass)
      run(j, q)
      j.pass += j.stride
```

---

### B4. 第10章：多处理器调度（Multiprocessor Scheduling）

多核调度的核心矛盾：

- **负载均衡**（别让某核太忙）
- **缓存亲和性**（别频繁迁移导致缓存失效）

#### 1) 设计方式

1. **全局队列**：简单，但锁竞争高
2. **每核队列**：扩展性好，但可能不均衡
3. **混合策略**：每核队列 + 周期偷取/均衡

#### 2) Work Stealing（工作窃取）

- 空闲核从繁忙核“偷任务”
- 平衡吞吐与局部性

伪代码：

```text
worker_loop(cpu_i):
      while true:
            if localQ[i] not empty:
                  run(pop(localQ[i]))
            else:
                  v = steal_from_other_cpu()
                  if v != nil:
                        run(v)
```

#### 3) 多处理器常见指标

- 每核 run queue 长度
- 任务迁移率（migration rate）
- 缓存 miss 与上下文切换率
- co-stop（虚拟化多 vCPU 协同时）

---

### B5. 第11章：这些调度算法与 CPU 虚拟化怎么连接？

把前面章节映射到虚拟化场景：

1. Guest OS 内部也在调度线程（Guest 调度）
2. Hypervisor 还要调度 vCPU（Host 调度）

这就是“双层调度”问题：

- Guest 认为线程 A 该跑
- 但 Host 可能没给该 vCPU 时间片

结果就是：应用看起来“CPU 不高但延迟上升”。

#### 双层调度排障顺序（实战）

1. 先看 Guest 内线程是否阻塞
2. 再看 Host 侧 ready/co-stop/steal
3. 再看 VM Exit 与中断压力
4. 最后看 NUMA 与迁移行为

---

### B6. 一页速记（调度算法怎么选）

```text
追求实现最简单：FCFS / RR
追求平均周转：SJF/STCF（需预测）
交互体验优先：MLFQ
资源份额可控：Lottery / Stride / Weight
多核高吞吐：每核队列 + Work Stealing
虚拟化场景：关注双层调度 + co-stop + affinity
```

---

## 结语：把CPU虚拟化学成能力

如果你能做到下面 4 件事，说明你已经从“看懂”走向“会用”：

1. 能画出 Guest -> VM Exit -> Hypervisor -> VM Entry 路径。
2. 能解释“CPU 不高但 VM 仍慢”的原因链路。
3. 能说清 overcommit 的收益与风险边界。
4. 能给出一套可执行的 CPU 虚拟化排障流程。

最后一句送你：

> CPU 虚拟化不是把“一个 CPU 切成很多份”这么简单，
> 而是把“执行权、特权和调度权”做了工程化重构。