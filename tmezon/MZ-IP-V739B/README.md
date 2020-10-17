# MZ-IP-V739B

Some basic infos and dump of a MZ-IP-V739B running Linux based on Hi3516cv300

## Basic Infos

```
~ # uname -a
Linux (none) 3.18.20 #19 Tue Jun 9 07:24:36 EDT 2020 armv5tejl GNU/Linux

~ # cat /proc/cmdline
mem=128M console=ttyAMA0,115200 root=/dev/mtdblock2 rootfstype=jffs2 rw mtdparts=hi_sfc:512K(boot),3M(kernel),12M(rootfs),448K(config),64K(key)

~ # cat /proc/cpuinfo
processor       : 0
model name      : ARM926EJ-S rev 5 (v5l)
BogoMIPS        : 398.13
Features        : swp half thumb fastmult edsp java
CPU implementer : 0x41
CPU architecture: 5TEJ
CPU variant     : 0x0
CPU part        : 0x926
CPU revision    : 5

Hardware        : Hisilicon Hi3516cv300 (Flattened Device Tree)
Revision        : 0000
Serial          : 0000000000000000

```

## Serial

The device has 3 Serial ports @ 3V3 TTL level.
the pads are labeled on the PCB.

| Where                 | Baud   | Note                             |
|-----------------------|--------|----------------------------------|
| compute module        | 115200 | Uboot + Kernel + Shell (no auth) |
| at connectors         | 38400  | binary garbage                   |
| beside compute module | ?      | no data seen                     |

## Getting Network access

Start telnetd
```
telnetd &
```

User: root
Pass: "" (empty password)

## netstat

```
~ # netstat -tulpen
Active Internet connections (only servers)
Proto Recv-Q Send-Q Local Address           Foreign Address         State       PID/Program name    
tcp        0      0 0.0.0.0:20510           0.0.0.0:*               LISTEN      165/vs_server
tcp        0      0 0.0.0.0:7778            0.0.0.0:*               LISTEN      165/vs_server
tcp        0      0 0.0.0.0:554             0.0.0.0:*               LISTEN      165/vs_server
tcp        0      0 0.0.0.0:80              0.0.0.0:*               LISTEN      165/vs_server
tcp        0      0 :::23                   :::*                    LISTEN      166/telnetd
udp        0      0 0.0.0.0:1500            0.0.0.0:*                           165/vs_server
udp        0      0 0.0.0.0:46062           0.0.0.0:*                           165/vs_server
udp        0      0 0.0.0.0:20989           0.0.0.0:*                           165/vs_server
udp        0      0 0.0.0.0:8002            0.0.0.0:*                           165/vs_server
udp        0      0 0.0.0.0:5555            0.0.0.0:*                           165/vs_server
```

## nmap

```
PORT      STATE    SERVICE    REASON      VERSION
23/tcp    open     telnet?    syn-ack
80/tcp    open     http       syn-ack     thttpd 2.25b 29dec2003
|_ HTML title: Site doesn't have a title.
554/tcp   open     rtsp?      syn-ack
7778/tcp  open     tcpwrapped syn-ack
20510/tcp open     unknown    syn-ack
```
