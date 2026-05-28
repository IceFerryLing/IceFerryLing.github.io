---
title: FlashAttention 1 和 FlashAttention 2 的区别
date: 2026-05-28
slug: flash-attention-1-vs-flash-attention-2
description: FlashAttention 1 和 FlashAttention 2 的区别与优化策略，适合深度学习和 GPU 编程开发者。
category:
  - 深度学习
tags:
   - FlashAttention
   - GPU编程
---
# FlashAttention 1 和 FlashAttention 2 的区别

## 1. 总体结论

FlashAttention 1 和 FlashAttention 2 的核心区别可以概括为：

```text
FlashAttention 1:
    主要解决 HBM IO 问题

FlashAttention 2:
    在保留 FA1 IO 优化的基础上，进一步优化 GPU 并行度、warp 分工和非矩阵乘开销
```

也就是说：

$$
\boxed{\text{FA1 的目标是少访问 HBM，FA2 的目标是既少访问 HBM，又更接近 GEMM 的执行效率。}}
$$

---

## 2. 普通 Attention 的问题

标准 attention 计算为：

$$
Q,K,V\in\mathbb{R}^{N\times d}
$$

$$  
S=QK^T\in\mathbb{R}^{N\times N}
$$

$$
P=\operatorname{softmax}(S)
$$

$$
O=PV\in\mathbb{R}^{N\times d}
$$

普通实现会显式生成 \(S\) 和 \(P\)。当序列长度 \(N\) 很大时，\(S\) 和 \(P\) 都是 \(N\times N\) 矩阵，会造成大量 HBM 读写。

FlashAttention 的核心思想是：

```text
不要把完整的 S 和 P 写回 HBM。
只在 SRAM/shared memory 中生成局部 tile，
算完之后直接更新输出 O。
```

---

## 3. FlashAttention 1 的核心思想

FA1 把矩阵分块。

把 \(Q\) 按行切：

$$
Q_i\in\mathbb{R}^{B_r\times d}
$$

把 \(K,V\) 按行切：

$$
K_j,V_j\in\mathbb{R}^{B_c\times d}
$$

局部计算：

$$
S_{ij}=Q_iK_j^T
$$

维度为：

$$
(B_r\times d)(d\times B_c)=B_r\times B_c
$$

也就是：

$$
S_{ij}\in\mathbb{R}^{B_r\times B_c}
$$

然后在 SRAM 中做 online softmax，并直接更新：

$$
O_i
$$

FA1 的关键收益是：

$$
\boxed{\text{不把 }S_{ij}\text{ 和 }P_{ij}\text{ 写回 HBM。}}
$$

因此 FA1 的主要优化目标是：

```text
减少 HBM 访问量
```

---

## 4. FA1 的局限

FA1 虽然显著减少了 HBM 访问，但它仍然存在 GPU kernel 层面的低效。

主要问题不是“不支持向量化访存”。FA1 也可以做：

```text
vectorized load
coalesced memory access
shared memory tiling
Tensor Core / MMA
```

FA1 的主要劣势在于：

```text
warp/block 内部分工不够理想
跨 warp 通信较多
softmax rescale 和归约开销较多
非 matmul 指令比例较高
GPU occupancy 不够充分
```

这些开销都不是 Tensor Core 擅长的矩阵乘操作，因此会拉低整体吞吐。

---

## 5. FA1 的 split-K/V 分工

FA1 更接近 split-K/V 的分法。

假设一个 tile 为：

$$
Q_i\in\mathbb{R}^{64\times d}
$$

$$
K_j,V_j\in\mathbb{R}^{64\times d}
$$

使用 4 个 warp。

split-K/V 的分法类似：

```text
warp 0: 负责 K/V 的第 0~15 个 token
warp 1: 负责 K/V 的第 16~31 个 token
warp 2: 负责 K/V 的第 32~47 个 token
warp 3: 负责 K/V 的第 48~63 个 token
```

也就是把 \(K_j,V_j\) 沿 token 维度拆开：

$$
K_j=
\begin{bmatrix}
K_j^{(0)}\\
K_j^{(1)}\\
K_j^{(2)}\\
K_j^{(3)}
\end{bmatrix}
$$

其中：

$$
K_j^{(w)}\in\mathbb{R}^{16\times d}
$$

每个 warp 计算：

$$
S_{ij}^{(w)}=Q_i(K_j^{(w)})^T
$$

维度为：

$$
(64\times d)(d\times 16)=64\times 16
$$

所以完整的 \(S_{ij}\) 是按列拼接出来的：

$$
S_{ij}=
\begin{bmatrix}
S_{ij}^{(0)} & S_{ij}^{(1)} & S_{ij}^{(2)} & S_{ij}^{(3)}
\end{bmatrix}
$$

也就是说：

```text
S 被按列切开。
```

---

## 6. split-K/V 为什么通信多

softmax 是按行做的。

对于某一行 \(q_r\)，完整 softmax 需要看到：

$$
S[r,0:64]
$$

但 split-K/V 后，不同 warp 只看到这一行的一部分：

```text
warp 0: S[r,  0:16]
warp 1: S[r, 16:32]
warp 2: S[r, 32:48]
warp 3: S[r, 48:64]
```

每个 warp 只能得到局部统计量：

$$
m_w=\max(q_r(K_j^{(w)})^T)
$$

$$
\ell_w=\sum \exp(q_r(K_j^{(w)})^T-m_w)
$$

$$
O_w=\sum \exp(q_r(K_j^{(w)})^T-m_w)V_j^{(w)}
$$

最后必须跨 warp 合并。

全局最大值：

$$
m=\max_w m_w
$$

全局分母：

$$
\ell=\sum_w e^{m_w-m}\ell_w
$$

全局输出分子：

$$
O=\sum_w e^{m_w-m}O_w
$$

最终输出：

$$
O/\ell
$$

这个合并过程需要：

```text
shared memory 写入
shared memory 读取
warp/block 同步
跨 warp reduce
softmax rescale
中间 O 向量合并
```

尤其 \(O_w\) 是长度为 \(d\) 的向量。如果 \(d=128\)，每个 query row 都要合并一个 128 维的输出向量，开销很明显。

因此 split-K/V 的核心问题是：

$$
\boxed{\text{同一个 query row 的结果被多个 warp 分散计算，最后必须合并。}}
$$

---

## 7. FlashAttention 2 的 split-Q 分工

FA2 更倾向于 split-Q。

仍然假设：

$$
Q_i\in\mathbb{R}^{64\times d}
$$

$$
K_j,V_j\in\mathbb{R}^{64\times d}
$$

使用 4 个 warp。

split-Q 的分法类似：

```text
warp 0: 负责 Q 的第 0~15 行
warp 1: 负责 Q 的第 16~31 行
warp 2: 负责 Q 的第 32~47 行
warp 3: 负责 Q 的第 48~63 行
```

也就是把 \(Q_i\) 沿行方向拆开：

$$
Q_i=
\begin{bmatrix}
Q_i^{(0)}\\
Q_i^{(1)}\\
Q_i^{(2)}\\
Q_i^{(3)}
\end{bmatrix}
$$

其中：

$$
Q_i^{(w)}\in\mathbb{R}^{16\times d}
$$

每个 warp 计算：

$$
S_{ij}^{(w)}=Q_i^{(w)}K_j^T
$$

维度为：

$$
(16\times d)(d\times 64)=16\times 64
$$

所以完整的 \(S_{ij}\) 是按行拼接出来的：

$$
S_{ij}=
\begin{bmatrix}
S_{ij}^{(0)}\\
S_{ij}^{(1)}\\
S_{ij}^{(2)}\\
S_{ij}^{(3)}
\end{bmatrix}
$$

也就是说：

```text
S 被按行切开。
```

---

## 8. split-Q 为什么能减少通信

split-Q 后，每个 warp 负责一部分完整的 query rows。

例如：

```text
warp 0: S[ 0:16, 0:64]
warp 1: S[16:32, 0:64]
warp 2: S[32:48, 0:64]
warp 3: S[48:64, 0:64]
```

每个 warp 看到自己负责的 query rows 对应的完整 K/V tile。

因此每个 warp 可以独立完成：

```text
QK^T
rowmax
rowsum
online softmax
PV
O 写回
```

它独立维护自己的：

$$
m,\ell,O
$$

不需要和其他 warp 合并同一行的 softmax 结果。

因此减少了：

```text
跨 warp shared memory 交换
跨 warp reduce
block-level synchronization
中间 O 的 shared memory 暂存
softmax rescale 合并
```

split-Q 的核心优势是：

$$
\boxed{\text{每个 query row 的 softmax 生命周期在固定 warp/group 内完成。}}
$$

---

## 9. 矩阵形态对比

FA1 / split-K/V：

$$
S=
\begin{bmatrix}
S^{(0)} & S^{(1)} & S^{(2)} & S^{(3)}
\end{bmatrix}
$$

特点：

```text
按列切 S
softmax 行被拆散
同一行结果分布在多个 warp 中
需要跨 warp 合并 m、ell、O
```

FA2 / split-Q：

$$
S=
\begin{bmatrix}
S^{(0)}\\
S^{(1)}\\
S^{(2)}\\
S^{(3)}
\end{bmatrix}
$$

特点：

```text
按行切 S
softmax 行保持完整
不同 warp 负责不同输出行
不需要跨 warp 合并同一行 O
```

---

## 10. 向量化访存的作用

向量化访存不是 FA1 和 FA2 的根本区别。

两者都可以做：

```text
vectorized load
coalesced access
aligned memory access
```

例如 FP16 下，可以一次读取 16 bytes：

```text
8 个 half 元素
```

向量化访存主要减少：

```text
load 指令数量
memory transaction 开销
访存不对齐带来的浪费
```

但它不改变 attention 的数学数据量。

FA2 相对 FA1 的主要收益不是“能不能向量化”，而是：

```text
算完之后少通信
少同步
少归约
少 softmax rescale
```

也就是减少非 GEMM 开销。

---

## 11. 逻辑转置和 stride 访问

在 attention 里写的是：

$$
S_{ij}=Q_iK_j^T
$$

但实现中通常不会真的物理转置 \(K_j\)。

因为：

$$
K_j\in\mathbb{R}^{B_c\times d}
$$

数学上：

$$
K_j^T\in\mathbb{R}^{d\times B_c}
$$

实际计算某个元素时：

$$
S_{ij}[r,c]=\sum_{k=0}^{d-1} Q_i[r,k]\cdot K_j[c,k]
$$

所以实现上仍然访问：

```text
K_j[c, k]
```

只是逻辑上把它看成 \(K_j^T\)。

如果 \(K_j\) 是 row-major，那么：

```text
K_j[c, 0], K_j[c, 1], K_j[c, 2], ...
```

沿 \(d\) 维是连续的，可以做 vectorized load。

所以这里的转置更多是：

```text
逻辑转置 + stride-based addressing
```

而不是显式生成一个转置矩阵。

---

## 12. FA2 的目的

FA2 的目的不是改变 attention 的数学公式，而是改变 kernel 的执行方式。

它主要做了三类优化：

```text
1. 减少非 matmul FLOPs
2. 增加并行度
3. 改善 warp/thread block 级别的数据划分
```

更具体地说：

```text
减少 softmax rescale 次数
减少 shared memory 通信
减少跨 warp 同步
提高 occupancy
让 QK^T 和 PV 更接近高性能 GEMM
```

最终目标是：

$$
\boxed{\text{让 attention kernel 的执行效率更接近 GEMM。}}
$$

---

## 13. Prefill 和 Decode 场景的差异

在 prefill 阶段：

```text
query length 很长
Q rows 很多
```

这时 split-Q 很自然，因为有足够多的 Q rows 可以分给不同 warp/thread block。

在 decode 阶段：

```text
每个 sequence 通常只有 1 个新 token
Q rows 很少
历史 K/V 很长
```

这时没有太多 Q rows 可以拆，只能更多沿 K/V block 或 sequence 维度并行。

因此 decode 更容易变成：

```text
split-K / paged attention / KV cache bandwidth-bound
```

这也是为什么推理中的 attention kernel 常常需要专门优化 KV cache layout、paged block table 和 memory bandwidth。

---

## 14. 最终总结

FA1：

```text
核心贡献:
    IO-aware tiling
    online softmax
    避免显式写回 N x N attention matrix

主要目标:
    减少 HBM 访问
```

FA2：

```text
核心贡献:
    保留 FA1 的 IO-aware tiling
    改进 warp/block 分工
    更偏 split-Q
    减少 shared memory 通信和 softmax 合并
    提高 GPU 并行度

主要目标:
    提高 GPU kernel 执行效率
    让 attention 更接近 GEMM 性能
```

一句话：

$$
\boxed{
\text{FA1 解决“不要频繁访问 HBM”，FA2 进一步解决“如何让 GPU 真正跑满”。}
}
$$

