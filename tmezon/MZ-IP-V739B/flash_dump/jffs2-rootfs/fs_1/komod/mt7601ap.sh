#!/bin/sh
cd /komod/extdrv/
insmod cfg80211.ko
insmod mtprealloc.ko
insmod mt7601Usta.ko
iwpriv wlan0 set Debug=0

# use ssid as AP name:
DATPATH=/etc/Wireless/hostapd_wpa.conf  
APNAME=`paraconf p | grep P2P_ID | sed -n 's/P2P_ID=//p'`
if [ -n $APNAME ]                       
then                                    
	echo "APNAME: $APNAME"          
	sed -i "s/^ssid=\(.*\)/ssid=cctvp2p-$APNAME/g" $DATPATH
fi                                      

hostapd /etc/Wireless/hostapd_wpa.conf &
sleep 2
ifconfig wlan0 192.168.1.1
udhcpd -fS /etc/Wireless/udhcpd.conf &
