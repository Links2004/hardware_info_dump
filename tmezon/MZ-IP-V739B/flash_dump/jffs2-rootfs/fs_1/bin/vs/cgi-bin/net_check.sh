#!/bin/sh

. /bin/vs/cgi-bin/netenv.conf
iface=`cat $NETDEV`

if [ $iface = "wlan0" ]
then
	linkstatus=`wpa_cli -i $iface -p /var/wpa_supplicant status 2>/dev/null | grep wpa_state | sed -n 's/wpa_state=//gp'`
	if [ ${linkstatus} != COMPLETED ]
	then
		/bin/vs/cgi-bin/scanwifi.sh
		/bin/paraconf w 1 WIFI_MODE AP
		sleep 1
		reboot
	fi
fi

