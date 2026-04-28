---
title: Linux 内核系列
date: 2026-04-29
slug: linux-kernel
description: Linux 内核系列重定向页，包含 Linux 内核源码分析的所有文章目录。
category:
  - 操作系统
tags:
   - 操作系统
   - Linux
---

# Linux源码分析

## 目录

* 进程管理
    * [进程管理](https://iceferryling.github.io/series/linux-source-code-analyze//process-management)
    * [进程调度](https://iceferryling.github.io/series/linux-source-code-analyze//process-schedule)
* 同步机制
    * [并发同步](https://iceferryling.github.io/series/linux-source-code-analyze//concurrency-synchronize)
    * [等待队列](https://iceferryling.github.io/series/linux-source-code-analyze//waitqueue)
    * [顺序锁](https://iceferryling.github.io/series/linux-source-code-analyze//seqlock)
* 内存管理
    * [物理内存管理](https://iceferryling.github.io/series/linux-source-code-analyze//physical-memory-managemen)
    * [伙伴分配算法](https://iceferryling.github.io/series/linux-source-code-analyze//physical-memory-buddy-system)
    * [Slab分配算法](https://iceferryling.github.io/series/linux-source-code-analyze//physical-memory-slab-algorithm)
    * [虚拟内存管理](https://iceferryling.github.io/series/linux-source-code-analyze//virtual_memory_address_manager)
    * [mmap完全剖析](https://iceferryling.github.io/series/linux-source-code-analyze//memory_mmap)
    * [内存交换](https://iceferryling.github.io/series/linux-source-code-analyze//memory_swap)
    * [vmalloc原理与实现](https://iceferryling.github.io/series/linux-source-code-analyze//vmalloc-memory-implements)
    * [写时复制](https://iceferryling.github.io/series/linux-source-code-analyze//copy-on-write)
    * [零拷贝技术](https://iceferryling.github.io/series/linux-source-code-analyze//zero-copy)
    * [虚拟内存空间管理](https://iceferryling.github.io/series/linux-source-code-analyze//process-virtual-memory-manage)
* 中断机制
    * [硬件相关](https://iceferryling.github.io/series/linux-source-code-analyze//interrupt_hardware)
    * [中断处理](https://iceferryling.github.io/series/linux-source-code-analyze//interrupt_softward)
    * [系统调用](https://iceferryling.github.io/series/linux-source-code-analyze//syscall)
* 文件系统
    * [虚拟文件系统](https://iceferryling.github.io/series/linux-source-code-analyze//virtual_file_system)
    * [MINIX文件系统](https://iceferryling.github.io/series/linux-source-code-analyze//minix_file_system)
    * [通用块层](https://iceferryling.github.io/series/linux-source-code-analyze//filesystem-generic-block-layer)
    * [直接I/O](https://iceferryling.github.io/series/linux-source-code-analyze//direct-io)
    * [原生异步I/O](https://iceferryling.github.io/series/linux-source-code-analyze//native-aio)
    * [inotify源码分析](https://iceferryling.github.io/series/linux-source-code-analyze//inotify-source-code-analysis)
* 进程间通信
    * [信号处理机制](https://iceferryling.github.io/series/linux-source-code-analyze//signal)
    * [共享内存](https://iceferryling.github.io/series/linux-source-code-analyze//ipc-shm)
* 网络
    * [Socket接口](https://iceferryling.github.io/series/linux-source-code-analyze//socket_interface)
    * [Unix Domain Socket](https://iceferryling.github.io/series/linux-source-code-analyze//unix-domain-sockets)
    * [TUN/TAP设备原理与实现](https://iceferryling.github.io/series/linux-source-code-analyze//tun-tap-principle)
    * [LVS原理与实现 - 原理篇](https://iceferryling.github.io/series/linux-source-code-analyze//lvs-principle-and-source-analysis-part1)
    * [LVS原理与实现 - 实现篇](https://iceferryling.github.io/series/linux-source-code-analyze//lvs-principle-and-source-analysis-part2)
    * [ARP协议与邻居子系统剖析](https://iceferryling.github.io/series/linux-source-code-analyze//arp-neighbour)
    * [IP协议源码分析](https://iceferryling.github.io/series/linux-source-code-analyze//ip-source-code)
    * [UDP协议源码分析](https://iceferryling.github.io/series/linux-source-code-analyze//udp-source-code)
    * [TCP源码分析 - 三次握手之 connect 过程](https://iceferryling.github.io/series/linux-source-code-analyze//tcp-three-way-handshake-connect)
    * [Linux网桥工作原理与实现](https://iceferryling.github.io/series/linux-source-code-analyze//net_bridge)
* 其他
    * [定时器实现](https://iceferryling.github.io/series/linux-source-code-analyze//kernel-timer)
    * [多路复用I/O](https://iceferryling.github.io/series/linux-source-code-analyze//multiplexing-io)
    * [GDB原理之ptrace](https://iceferryling.github.io/series/linux-source-code-analyze//ptrace)
* 容器相关
    * [docker实现原理之 - namespace](https://iceferryling.github.io/series/linux-source-code-analyze//namespace)
    * [docker实现原理之 - CGroup介绍](https://iceferryling.github.io/series/linux-source-code-analyze//cgroup)
    * [docker实现原理之 - CGroup实现原理](https://iceferryling.github.io/series/linux-source-code-analyze//cgroup-principle)
    * [docker实现原理之 - OverlayFS实现原理](https://iceferryling.github.io/series/linux-source-code-analyze//overlayfs)
* 2.6+内核分析
    * [Epoll原理与实现](https://iceferryling.github.io/series/linux-source-code-analyze//epoll-principle)
    * [RCU原理与实现](https://iceferryling.github.io/series/linux-source-code-analyze//rcu)
    * [O(1)调度算法](https://iceferryling.github.io/series/linux-source-code-analyze//process-schedule-o1)
    * [完全公平调度算法](https://iceferryling.github.io/series/linux-source-code-analyze//cfs-scheduler)
    * [HugePages原理与使用](https://iceferryling.github.io/series/linux-source-code-analyze//hugepage)
    * [HugePages实现剖析](https://iceferryling.github.io/series/linux-source-code-analyze//hugepages-source-code-analysis)
    * [什么是iowait](https://iceferryling.github.io/series/linux-source-code-analyze//iowait)
    
## 其他版本Linux

### 1、Linux-3.x

### 2、Linux-4.x
* eBPF
    * [eBPF源码分析 - kprobe模块](https://iceferryling.github.io/series/linux-source-code-analyze//eBPF)

### 3、Linux-5.x
* 文件系统与I/O
   * io_uring

