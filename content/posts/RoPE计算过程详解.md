---
title: RoPE计算过程详解
date: 2026-05-17
slug: rope-calculation-detail
description: RoPE计算过程详解
category:
  - 深度学习
tags:
   - 深度学习
   - 位置编码
---

# RoPE计算过程详解

RoPE全称：Rotary Position Embedding（旋转位置编码），本文介绍其基本原理。


# 1 预备知识

## 1.1 二维向量的旋转

**二维旋转矩阵的作用就是将一个二维向量绕原点旋转一个指定的角度**。

例如，二维向量

$$
\mathbf{v}=\begin{bmatrix}x \\ y\end{bmatrix}
$$

用旋转矩阵

$$
R(\theta) = \begin{bmatrix}\cos\theta & -\sin\theta \\ \sin\theta & \cos\theta\end{bmatrix}
$$

左乘它：

$$
\mathbf{v}' = R(\theta) \cdot \mathbf{v} =
\begin{bmatrix}
x\cos\theta - y\sin\theta \\
x\sin\theta + y\cos\theta
\end{bmatrix}
$$

得到的新向量 $\mathbf{v}'$ 就是原向量逆时针旋转 $\theta$ 角后的结果。


**旋转矩阵（数学上的线性变换）:**

这是用于**旋转向量或坐标系**的工具。其核心性质是：

- 行列式为 +1（保持面积/体积不变，且保持手性）
- 是正交矩阵 $R^T R = I$


## 1.2 二维向量的点积（内积）


**定义**：
设 $\mathbf{a} = (a_1, a_2)$ ， $\mathbf{b} = (b_1, b_2)$ ，点积

$$
\mathbf{a} \cdot \mathbf{b} = a_1 b_1 + a_2 b_2
$$

**几何含义**：

$$
\mathbf{a} \cdot \mathbf{b} = \|\mathbf{a}\| \, \|\mathbf{b}\| \, \cos\theta
$$

其中 $\theta$ 是两向量之间的夹角。

- 若点积为正 → 夹角小于 90°（方向大致相同）
- 若点积为零 → 两向量垂直（正交）
- 若点积为负 → 夹角大于 90°（方向相反）

**另一种几何解释**：点积等于**一个向量在另一个向量上的投影长度**乘以另一个向量的长度。


## 1.3 二维向量的旋转

**二维旋转矩阵的作用就是将一个二维向量绕原点旋转一个指定的角度**。

例如，二维向量

$$
\mathbf{v}=\begin{bmatrix}x \\ y\end{bmatrix}
$$

用旋转矩阵

$$
R(\theta) = \begin{bmatrix}\cos\theta & -\sin\theta \\ \sin\theta & \cos\theta\end{bmatrix}
$$

左乘它：

$$
\mathbf{v}' = R(\theta) \cdot \mathbf{v} =
\begin{bmatrix}
x\cos\theta - y\sin\theta \\
x\sin\theta + y\cos\theta
\end{bmatrix}
$$

得到的新向量 $\mathbf{v}'$ 就是原向量逆时针旋转 $\theta$ 角后的结果。


**旋转矩阵（数学上的线性变换）:**

这是用于**旋转向量或坐标系**的工具。其核心性质是：

- 行列式为 +1（保持面积/体积不变，且保持手性）
- 满足正交性： $R^T R = I$



```python
# 代码辅助理解：

import numpy as np
import math

# 1.定义原始二维向量
v = np.array([3.0, 1.0])   # 可以修改为其他向量

# 2.定义旋转角度(例如60度)
theta_deg = 60
theta = math.radians(theta_deg)

# 构造二维旋转矩阵(逆时针)
R = np.array([
    [math.cos(theta), -math.sin(theta)],
    [math.sin(theta),  math.cos(theta)]
])
print(f"旋转矩阵R的行列式：{np.linalg.det(R)}")
print(f"旋转矩阵正交性：R.T @ R={R.T @ R}\n")

# 3.旋转向量
v_rot = R @ v

# 4.计算点积
dot_product = np.dot(v, v_rot)

# 5.计算模长
norm_v = np.linalg.norm(v)
norm_v_rot = np.linalg.norm(v_rot)   # 旋转不改变模长

# 6.几何验证：点积= |v| * |v_rot| * cos(夹角)
#    因为旋转后的向量与原始向量的夹角就是旋转角theta
cos_theta = math.cos(theta)
expected_dot = norm_v * norm_v_rot * cos_theta

# 输出结果
print(f"原始向量v= {v}")
print(f"旋转矩阵R(逆时针{theta_deg}°):\n{R}")
print(f"旋转后向量v_rot={v_rot}")
print(f"v · v_rot={dot_product:.4f}")
print(f"|v|={norm_v:.4f}, |v_rot|={norm_v_rot:.4f}")
print(f"几何公式计算的点积=|v||v_rot|cosθ={expected_dot:.4f}")
print(f"两者相等? 结果：{np.isclose(dot_product, expected_dot)}")

# 额外：直接计算夹角余弦
cos_calc = dot_product / (norm_v * norm_v_rot)
print(f"\n实际夹角余弦={cos_calc:.4f}")
print(f"cos({theta_deg}°)={cos_theta:.4f}")
print(f"夹角={math.degrees(math.acos(cos_calc)):.2f}°")
```

    旋转矩阵R的行列式：1.0
    旋转矩阵R.T @ R：[[ 1.00000000e+00 -1.48741681e-17]
     [-1.48741681e-17  1.00000000e+00]]

    原始向量v= [3. 1.]
    旋转矩阵R(逆时针60°):
    [[ 0.5       -0.8660254]
     [ 0.8660254  0.5      ]]
    旋转后向量v_rot=[0.6339746  3.09807621]
    v · v_rot=5.0000
    |v|=3.1623, |v_rot|=3.1623
    几何公式计算的点积=|v||v_rot|cosθ=5.0000
    两者相等? 结果：True

    实际夹角余弦=0.5000
    cos(60°)=0.5000
    夹角=60.00°


## 1.4 向量点积与旋转的关系

两个向量分别旋转后再做点积，旋转角度转化为相对变化。

设 $\mathbf{a}$ 、 $\mathbf{b}$ 的极角分别为 $\phi_a$ 、 $\phi_b$ ，则原始夹角 $\alpha = \phi_b - \phi_a$ 。
旋转后： $\phi_{a'} = \phi_a + \theta_1$ ， $\phi_{b'} = \phi_b + \theta_2$ 。
新夹角 $\alpha' = \phi_{b'} - \phi_{a'} = (\phi_b + \theta_2) - (\phi_a + \theta_1) = \alpha + \theta_2 - \theta_1$ 。

点积：
$$
\mathbf{a}' \cdot \mathbf{b}' = |\mathbf{a}'||\mathbf{b}'| \cos\alpha' = |\mathbf{a}||\mathbf{b}| \cos(\alpha + \theta_2 - \theta_1)
$$

若写成 $\alpha - (\theta_1 - \theta_2)$ ，则 $\cos(\alpha - (\theta_1-\theta_2))$ 与上式一致。



```python
import numpy as np

# 原始向量 a, b
a = np.array([1.0, 0.0])   # 极角 0°
b = np.array([0.0, 1.0])   # 极角 90°, 原始夹角 α = 90°

# 旋转角度
theta1 = np.radians(30)   # a 逆时针转 30°
theta2 = np.radians(60)   # b 逆时针转 60°

# 旋转矩阵
def rot(theta):
    return np.array([[np.cos(theta), -np.sin(theta)],
                     [np.sin(theta),  np.cos(theta)]])

a_rot = rot(theta1) @ a
b_rot = rot(theta2) @ b

# 点积
dot_rot = np.dot(a_rot, b_rot)

# 理论计算
alpha = np.pi/2   # 90°
norm = np.linalg.norm(a) * np.linalg.norm(b)  # =1
theory = norm * np.cos(alpha + theta2 - theta1)

print(f"实际点积: {dot_rot:.6f}")
print(f"理论点积: {theory:.6f}")
print(f"相等? {np.isclose(dot_rot, theory)}")
```

    实际点积: -0.500000
    理论点积: -0.500000
    相等? True



# 2 Attention运算引入旋转角度
在Attention计算中，用Q与 $K^\top$ 做矩阵乘法得到分数（scores）这一步，本质是矩阵乘法；对单个score而言，对应两个向量的点积。

文字序列经过编码后，hidden_size=2，编码数据的shape为[seq_len, hidden_size]，即每个token可以认为是一个二维向量。

举个例子，假设输入序列为“我是ky”，编码后有4个token，则shape=[4, 2]。

序列的Q和K有相同的shape，如何标记序列中不同位置的token，从而影响最终score的大小？ 答案是，为每个位置引入一个不同的旋转角度。

在计算点积时，可使用公式：
$$
\mathbf{a}' \cdot \mathbf{b}' = |\mathbf{a}'||\mathbf{b}'| \cos\alpha' = |\mathbf{a}||\mathbf{b}| \cos(\alpha + \theta_2 - \theta_1)
$$


很显然，**序列位置越接近**（ $\theta_1$ 与 $\theta_2$ 越接近）时， $\theta_2-\theta_1$ 越小， $\cos(\alpha + \theta_2 - \theta_1)$ 对位置差的响应方式就越能体现相对关系。因此，score中便融入了相对位置信息。

同时可以看到，各向量上的旋转角 $\theta$ 本身是绝对的，但点积中体现的是相对关系，从而使attention中每个token都能感知与之相乘的另一token的位置。这正是RoPE的核心思想。

在计算query( $q_m$ )与key( $k_n$ )的内积时，RoPE的效果等价于引入一个**相对位置依赖的旋转**：

$$
(R_m q_m)^\top (R_n k_n) = q_m^\top R_m^\top R_n k_n = q_m^\top R_{n-m} k_n
$$

其中 $R_m$ 、 $R_n$ 分别为施加在位置 $m$ 、 $n$ 上query与key的旋转矩阵（ $R$ 为正交矩阵，且 $R_m^\top R_n=R_{n-m}$ ），故内积只依赖相对位置 $n-m$ 。

这里还有两个关键问题没有回答：
- Q/K的hidden_size通常远大于2（如1024、2048），已不是把整个向量当作二维来旋转的情形，如何引入旋转位置信息？
- theta角度设置多少合适？

接下来依次分析：

## 2.1 QK的多维向量如何旋转？

通过线性代数知识，可知：
- 多维向量支持旋转操作；
- 多维向量的旋转方式很多。

这里我们仅关注部分坐标（平面）上的旋转，以四维情形为例。


四维旋转矩阵是 $4 \times 4$ 的正交矩阵（行列式为 $+1$ ），作用在四维向量 $\mathbf{v} = (x, y, z, w)$ 上。

一个简单的四维旋转例子是**在由两个坐标轴张成的平面内旋转**（例如 $xy$ 平面），而保持另外两个坐标不变。比如在 $xy$ 平面内旋转角度 $\theta$ ，同时保持 $z$ 和 $w$ 不变。矩阵如下：

$$
R(\theta) =
\begin{bmatrix}
\cos\theta & -\sin\theta & 0 & 0 \\
\sin\theta & \cos\theta & 0 & 0 \\
0 & 0 & 1 & 0 \\
0 & 0 & 0 & 1
\end{bmatrix}
$$

**具体数值举例**：取 $\theta = 90^\circ = \frac{\pi}{2}$ ，则 $\cos\theta = 0,\ \sin\theta = 1$ ：

$$
R =
\begin{bmatrix}
0 & -1 & 0 & 0 \\
1 & 0 & 0 & 0 \\
0 & 0 & 1 & 0 \\
0 & 0 & 0 & 1
\end{bmatrix}
$$

用它旋转四维向量 $\mathbf{v} = (1, 0, 0, 0)$ ：

$$
\mathbf{v}' = R \cdot \mathbf{v} =
\begin{bmatrix}
0\cdot1 + (-1)\cdot0 + 0\cdot0 + 0\cdot0 \\
1\cdot1 + 0\cdot0 + 0\cdot0 + 0\cdot0 \\
0\cdot1 + 0\cdot0 + 1\cdot0 + 0\cdot0 \\
0\cdot1 + 0\cdot0 + 0\cdot0 + 1\cdot0
\end{bmatrix}=\begin{bmatrix}0 \\ 1 \\ 0 \\ 0\end{bmatrix}
$$

即 $(1,0,0,0) \to (0,1,0,0)$ ，这是在 $xy$ 平面内旋转90°。而 $z$ 和 $w$ 分量完全不变。


**更一般的四维旋转**
四维空间中的旋转可以同时发生在两个相互正交的平面上（例如 $xy$ 平面和 $zw$ 平面），且两个平面的旋转角度独立。这样的矩阵是块对角的：

$$
R(\theta, \phi) =
\begin{bmatrix}
\cos\theta & -\sin\theta & 0 & 0 \\
\sin\theta & \cos\theta & 0 & 0 \\
0 & 0 & \cos\phi & -\sin\phi \\
0 & 0 & \sin\phi & \cos\phi
\end{bmatrix}
$$

这就是四维旋转矩阵的典型形式。它满足 $R^T R = I$ 且 $\det(R) = 1$ （因为每个 $2\times2$ 子块的行列式都是1，乘积为1）。


在QK的乘法运算中，RoPE把 $d$ 维向量拆成 $d/2$ 个二维子空间，在每个子空间内做平面旋转（各子空间正交）。

设token向量的维度为 $d$ ，各维下标为 $0, 1, \dots, d-1$ 。当 $d$ 为偶数时，**一种便于画图的划分**是把相邻两维成对： $[0,1]$ 、 $[2,3]$ 、 $\dots$ 、 $[d-2,d-1]$ ，共 $d/2$ 个平面；**而常见实现**（见下文注意与`rotate_half`）则把第 $i$ 维与第 $i+d/2$ 维配成一对，数学上仍是块对角正交变换，只是维度的编号方式不同。下面先用**相邻两维成对**的写法给出块对角形式的 $R_m$ ：

设d = 2n，则旋转矩阵 $R_m$ 为：

$$
R_m = \begin{pmatrix}
\cos m\theta_1 & -\sin m\theta_1 & 0 & 0 & \cdots & 0 & 0 \\
\sin m\theta_1 & \cos m\theta_1 & 0 & 0 & \cdots & 0 & 0 \\
0 & 0 & \cos m\theta_2 & -\sin m\theta_2 & \cdots & 0 & 0 \\
0 & 0 & \sin m\theta_2 & \cos m\theta_2 & \cdots & 0 & 0 \\
\vdots & \vdots & \vdots & \vdots & \ddots & \vdots & \vdots \\
0 & 0 & 0 & 0 & \cdots & \cos m\theta_n & -\sin m\theta_n \\
0 & 0 & 0 & 0 & \cdots & \sin m\theta_n & \cos m\theta_n
\end{pmatrix}
$$

其中 $\theta_i$ 是预先设定的频率

注意：在实际RoPE计算中，配对不是按相邻下标，而是前半段与后半段一一对应，即第 $i$ 维与第 $i+d/2$ 维配成一对（ $i=0,1,\dots,d/2-1$ ），这种配对方式便于计算。



## 2.2 theta角度设置多少合适？

由上面的讨论可知，RoPE用位置 $m$ 与多组基频 $\theta_i$ 共同决定各平面上的旋转。下面先用周期性与序列长度说明：为何需要**随维度 $i$ 变化**的 $\theta_i$ ，而不能只靠「每位置固定转一小角度」这一种尺度。

对任一固定频率 $\theta_i$ ，位置 $m$ 带来的相位是 $m\theta_i$ ；由于 $\cos$ 以 $2\pi$ 为周期，有 $\cos(m\theta_i+\Delta)=\cos(m\theta_i+2\pi+\Delta)$ 。若**只用一种很粗的步长**（直觉上类似「每步转一度」的比喻），序列很长时，不同位置 $m$ 在**某些频率**上容易落在同一等价类里，难以区分。

而在大模型中，序列长度可达128K/256K甚至更长，因此需要**多组**随维度 $i$ 变化的基频 $\theta_i$ （见下式），使不同位置在各频率上的组合相位在所需长度范围内尽可能可区分；这不是靠「每个位置多转一度」这种单一尺度能解决的。

除了位置，当hidden_size>2时还存在多个二维平面，需要区分各平面对结果的影响，因此把平面序号（维度索引）也引入旋转角度的计算。

在RoPE中， $\theta$ 由**位置索引** $m$ 与**维度索引** $i$ 共同决定。具体计算公式如下：

对于位置 $m$ （token在序列中的索引，从0开始），以及第 $i$ 个旋转平面（ $i=0,\ldots,d/2-1$ ；与实现中`rotate_half`一致时，该平面由第 $i$ 维与第 $i+d/2$ 维分量张成），该平面上的旋转角为：

$$
\theta(m, i) = m \cdot \theta_i = m \cdot \left( 10000^{-\frac{2i}{d}} \right)
$$

其中：

- d为注意力头维度，即hidden_size/num_heads
- i的取值范围是 $0, 1, \dots, d/2 - 1$
- $\theta_i$ 是**该维度对的基础频率**（与位置无关，由维度索引决定）




这里代码演示一下这个设计对计算结果的影响：

### 演示1：相对位置对计算的影响


```python
import math

def rotate_2d(vec,theta):
    """旋转二维向量vec(列表[x0,x1])角度theta(弧度)"""
    cos_t=math.cos(theta)
    sin_t=math.sin(theta)
    return [vec[0]*cos_t-vec[1]*sin_t, vec[0]*sin_t+vec[1]*cos_t]

def dot(vec_a,vec_b):
    """二维点积"""
    return vec_a[0]*vec_b[0]+vec_a[1]*vec_b[1]

if __name__=="__main__":
    #RoPE参数:总维度head_dim=2,因此只有一对(i=0)
    head_dim=2
    i=0  #维度对索引
    #按照RoPE公式计算基础角度theta_i
    theta_base = 10000.0 ** (-2.0 * i / head_dim)  #即10000^0=1.0
    original=[1.0,0.0]  #原始向量(未旋转)

    #测试不同相对距离delta=n-m
    test_cases=[(0,1),(0,2),(0,10),(0,100), (0,1000)]

    for m,n in test_cases:
        print("相对距离Δ\t旋转后点积")
        delta=n-m
        #每个位置的实际旋转角度=位置索引*theta_base
        theta_m=m*theta_base
        theta_n=n*theta_base
        vec_m=rotate_2d(original,theta_m)
        vec_n=rotate_2d(original,theta_n)
        prod=dot(vec_m,vec_n)

        print(f"{delta}\t\t{prod:.6f}")
```

    相对距离Δ	旋转后点积
    1		0.540302
    2		-0.416147
    10		-0.839072
    100		0.862319
    1000		0.562379


### 演示2：基础索引（平面位置）
因为点积结果为受cos(Δ * theta_base_i)影响，因此高频对（i=0）振荡快，低频对（i=1）振荡慢。


```python
import math

def rotate_2d(vec,theta):
    """旋转二维向量vec角度theta(弧度)"""
    cos_t=math.cos(theta)
    sin_t=math.sin(theta)
    return [vec[0]*cos_t-vec[1]*sin_t, vec[0]*sin_t+vec[1]*cos_t]

def dot(vec_a,vec_b):
    """二维点积"""
    return vec_a[0]*vec_b[0]+vec_a[1]*vec_b[1]

if __name__=="__main__":
    head_dim=4
    original=[1.0,0.0]
    #测试相对距离
    deltas=[1,2,5,10,20,50,100]

    print("head_dim=4\n相对距离Δ\ti=0(theta_base=1.0)点积\ti=1(theta_base=0.01)点积")
    for delta in deltas:
        results=[]
        for i in [0,1]:
            theta_base=10000.0**(-2.0*i/head_dim)
            #位置0和位置delta
            theta_m=0*theta_base
            theta_n=delta*theta_base
            vec_m=rotate_2d(original,theta_m)
            vec_n=rotate_2d(original,theta_n)
            prod=dot(vec_m,vec_n)
            results.append(f"{prod:.6f}")
        print(f"{delta}\t\t{results[0]}\t\t{results[1]}")
```

    head_dim=4
    相对距离Δ	i=0(theta_base=1.0)点积	i=1(theta_base=0.01)点积
    1		0.540302		0.999950
    2		-0.416147		0.999800
    5		0.283662		0.998750
    10		-0.839072		0.995004
    20		0.408082		0.980067
    50		0.964966		0.877583
    100		0.862319		0.540302


旋转角度theta区分平面的作用：使得长距离依赖能够通过低频维度保持一定的相似性，同时高频维度捕捉局部细节。

RoPE正是通过混合多个不同频率的维度对，

## 2.3 RoPE的计算过程

### 重复计算的降低
在大模型中，RoPE的运算通常分成两步：先预计算“系数矩阵”，前向传播时再用该矩阵乘Q或K，而不是显式地采用如下运算：

$$
(R_m q_m)^\top (R_n k_n)
$$

关键在于计算效率：降低构造 $R$ 矩阵的成本。再看一下 $R$ 的内容：

$$
R_m = \begin{pmatrix}
\cos m\theta_1 & -\sin m\theta_1 & 0 & 0 & \cdots & 0 & 0 \\
\sin m\theta_1 & \cos m\theta_1 & 0 & 0 & \cdots & 0 & 0 \\
0 & 0 & \cos m\theta_2 & -\sin m\theta_2 & \cdots & 0 & 0 \\
0 & 0 & \sin m\theta_2 & \cos m\theta_2 & \cdots & 0 & 0 \\
\vdots & \vdots & \vdots & \vdots & \ddots & \vdots & \vdots \\
0 & 0 & 0 & 0 & \cdots & \cos m\theta_n & -\sin m\theta_n \\
0 & 0 & 0 & 0 & \cdots & \sin m\theta_n & \cos m\theta_n
\end{pmatrix}
$$

其中：
$$
\theta(m, i) = m \cdot \theta_i = m \cdot \left( 10000^{-\frac{2i}{d}} \right)
$$

基础频率的含义：每个元素代表一对正弦/余弦分量（对应一个旋转角度），即：
$$
\text{inv\_freq}_i = 10000^{-2i/d}, \quad i = 0, 1, \dots, d/2-1
$$

$R$ 矩阵中各元素对每个Q/K位置的运算是相同的，尤其是其中cos与sin的取值。
因此可按最长序列预先构造好cos、sin，在attention迭代中复用。

一般步骤：
- 根据最长索引值L_max构造频率表（freq_table），即由 $\theta(m, i)$ 构成的数据矩阵，shape为[L_max, d/2]
- 计算freq_table的cos与sin值。


### 避免显式矩阵乘法

$R$ 是块对角矩阵，若按完整稠密矩阵做乘法会造成大量无效计算。
RoPE的高效实现通常采用**复数乘法**形式，避免显式计算旋转矩阵。对于位置 $m$ ，第 $i$ 个平面内的分量（在相邻维记号下可记为 $(x_{2i}, x_{2i+1})$ ）视为复数 $z=x_{2i}+i\,x_{2i+1}$ ，旋转后为：

$$
z' = z \cdot e^{i m \theta_i} = (x_{2i} + i x_{2i+1}) \cdot (\cos(m\theta_i) + i \sin(m\theta_i))
$$

展开得到实数部分即为旋转后的两个分量：

$$
\begin{aligned}
x'_{2i} &= x_{2i}\cos(m\theta_i) - x_{2i+1}\sin(m\theta_i) \\
x'_{2i+1} &= x_{2i}\sin(m\theta_i) + x_{2i+1}\cos(m\theta_i)
\end{aligned}
$$

结合前面的分析，其中的 $\cos(m\theta_i)$ 和 $\sin(m\theta_i)$ 可以提前算好。

通用公式参考：https://kexue.fm/archives/8265 的公式13：




常见的计算过程代码示例：

1 cos与sin值的构造：

```python
inv_freq = 1.0 / (base ** (torch.arange(0, dim, 2, dtype=torch.int64).to(device=device, dtype=torch.float) / dim))
inv_freq_expanded = self.inv_freq[None, :, None].float().expand(position_ids.shape[0], -1, 1).to(x.device)
position_ids_expanded = position_ids[:, None, :].float()
freqs = (inv_freq_expanded.float() @ position_ids_expanded.float()).transpose(1, 2)
emb = torch.cat((freqs, freqs), dim=-1)
cos = emb.cos() * self.attention_scaling
sin = emb.sin() * self.attention_scaling
          
```
其中freqs经cat拼接后，最后一维与hidden_size一致。


2 Q/K值做位置运算：
```python
def rotate_half(x):
    """Rotates half the hidden dims of the input."""
    x1 = x[..., : x.shape[-1] // 2]
    x2 = x[..., x.shape[-1] // 2 :]
    return torch.cat((-x2, x1), dim=-1)


@use_kernel_func_from_hub("rotary_pos_emb")
def apply_rotary_pos_emb(q, k, cos, sin):
    """Applies Rotary Position Embedding to the query and key tensors.

    Args:
        q (`torch.Tensor`): The query tensor.
        k (`torch.Tensor`): The key tensor.
        cos (`torch.Tensor`): The cosine part of the rotary embedding.
        sin (`torch.Tensor`): The sine part of the rotary embedding.
    Returns:
        `tuple(torch.Tensor)` comprising of the query and key tensors rotated using the Rotary Position Embedding.
    """
    q_embed = (q * cos) + (rotate_half(q) * sin)
    k_embed = (k * cos) + (rotate_half(k) * sin)
    return q_embed, k_embed
```

其中rotate_half用于构造与sin相乘的另一部分；对单个元素而言，计算如下：

```python
q_i'   = q_i * cosθ - q_{i+dim/2} * sinθ
q_{i+dim/2}' = q_{i+dim/2} * cosθ + q_i * sinθ
```
