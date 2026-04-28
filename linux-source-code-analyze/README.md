# Linux源码分析

## 目录

* 进程管理
    * [进程管理](./process-management.md)
    * [进程调度](./process-schedule.md)
* 同步机制
    * [并发同步](./concurrency-synchronize.md)
    * [等待队列](./waitqueue.md)
    * [顺序锁](./seqlock.md)
* 内存管理
    * [物理内存管理](./physical-memory-managemen.md)
    * [伙伴分配算法](./physical-memory-buddy-system.md)
    * [Slab分配算法](./physical-memory-slab-algorithm.md)
    * [虚拟内存管理](./virtual_memory_address_manager.md)
    * [mmap完全剖析](./memory_mmap.md)
    * [内存交换](./memory_swap.md)
    * [vmalloc原理与实现](./vmalloc-memory-implements.md)
    * [写时复制](./copy-on-write.md)
    * [零拷贝技术](./zero-copy.md)
    * [虚拟内存空间管理](./process-virtual-memory-manage.md)
* 中断机制
    * [硬件相关](./interrupt_hardware.md)
    * [中断处理](./interrupt_softward.md)
    * [系统调用](./syscall.md)
* 文件系统
    * [虚拟文件系统](./virtual_file_system.md)
    * [MINIX文件系统](./minix_file_system.md)
    * [通用块层](./filesystem-generic-block-layer.md)
    * [直接I/O](./direct-io.md)
    * [原生异步I/O](./native-aio.md)
    * [inotify源码分析](./inotify-source-code-analysis.md)
* 进程间通信
    * [信号处理机制](./signal.md)
    * [共享内存](./ipc-shm.md)
* 网络
    * [Socket接口](./socket_interface.md)
    * [Unix Domain Socket](./unix-domain-sockets.md)
    * [TUN/TAP设备原理与实现](./tun-tap-principle.md)
    * [LVS原理与实现 - 原理篇](./lvs-principle-and-source-analysis-part1.md)
    * [LVS原理与实现 - 实现篇](./lvs-principle-and-source-analysis-part2.md)
    * [ARP协议与邻居子系统剖析](./arp-neighbour.md)
    * [IP协议源码分析](./ip-source-code.md)
    * [UDP协议源码分析](./udp-source-code.md)
    * [TCP源码分析 - 三次握手之 connect 过程](./tcp-three-way-handshake-connect.md)
    * [Linux网桥工作原理与实现](./net_bridge.md)
* 其他
    * [定时器实现](./kernel-timer.md)
    * [多路复用I/O](./multiplexing-io.md)
    * [GDB原理之ptrace](./ptrace.md)
* 容器相关
    * [docker实现原理之 - namespace](./namespace.md)
    * [docker实现原理之 - CGroup介绍](./cgroup.md)
    * [docker实现原理之 - CGroup实现原理](./cgroup-principle.md)
    * [docker实现原理之 - OverlayFS实现原理](./overlayfs.md)
* 2.6+内核分析
    * [Epoll原理与实现](./epoll-principle.md)
    * [RCU原理与实现](./rcu.md)
    * [O(1)调度算法](./process-schedule-o1.md)
    * [完全公平调度算法](./cfs-scheduler.md)
    * [HugePages原理与使用](./hugepage.md)
    * [HugePages实现剖析](./hugepages-source-code-analysis.md)
    * [什么是iowait](./iowait.md)
    
## 其他版本Linux

### 1、Linux-3.x

### 2、Linux-4.x
* eBPF
    * [eBPF源码分析 - kprobe模块](./eBPF.md)

### 3、Linux-5.x
* 文件系统与I/O
   * io_uring



