#!/bin/sh
cd /komod/extdrv/
insmod cfg80211.ko
insmod mtprealloc.ko
insmod mt7601Usta.ko
iwpriv wlan0 set Debug=0
rm -f /var/wpa_supplicant/wlan0

