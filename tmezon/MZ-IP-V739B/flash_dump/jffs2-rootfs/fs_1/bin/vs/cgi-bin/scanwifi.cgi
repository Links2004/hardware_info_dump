#!/bin/sh

. /bin/vs/cgi-bin/netenv.conf
. $wifi_config

wpa_cli -i $wifidev -p /var/wpa_supplicant scan > /dev/null 2>1&
wpa_cli -i $wifidev -p /var/wpa_supplicant scan_result 2>/tmpfs/wifinets.info| sed "1d;$d" | awk 'BEGIN {print "200 OK HTTP 1.1\n\n"}{print "var ssid_"NR "=\""$5"\";" "var signal_"NR "=\""$3"\";" "var secret_"NR "=\""$4"\";"}'

