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
