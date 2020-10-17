# SPI Flash info

```
~ # cat /proc/mtd
dev:    size   erasesize  name
mtd0: 00080000 00010000 "boot"
mtd1: 00300000 00010000 "kernel"
mtd2: 00c00000 00010000 "rootfs"
mtd3: 00070000 00010000 "config"
mtd4: 00010000 00010000 "key"

~ # cat /proc/cmdline
mem=128M console=ttyAMA0,115200 root=/dev/mtdblock2 rootfstype=jffs2 rw mtdparts=hi_sfc:512K(boot),3M(kernel),12M(rootfs),448K(config),64K(key)
```

## Note

| Name    | Note                                                   |
|---------|--------------------------------------------------------|
| boot    | UBOOT                                                  |
| kernel  | linux kernel (3.18.20)                                 |
| rootfs  | jffs2                                                  |
| config  | jffs2                                                  |
| key     | MAC some key but mostly 0xFF and may a 4 byte checksum |

most interesting binarys:

- jffs2-rootfs/fs_1/bin/vs/vs_server

# Dump

## Create

```
~ # dd if=/dev/mtdblock0 > /tmpfs/boot.bin
~ # dd if=/dev/mtdblock1 > /tmpfs/kernel.bin
~ # dd if=/dev/mtdblock2 > /tmpfs/rootfs.bin
~ # dd if=/dev/mtdblock3 > /tmpfs/config.bin
~ # dd if=/dev/mtdblock4 > /tmpfs/key.bin
```

## Download

http://<IP>/tmpfs/boot.bin
http://<IP>/tmpfs/kernel.bin
http://<IP>/tmpfs/rootfs.bin
http://<IP>/tmpfs/config.bin
http://<IP>/tmpfs/key.bin


## jffs2 extract

see https://github.com/sviehb/jefferson
