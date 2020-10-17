#!/bin/sh

. /etc/upgrade.conf
. /mnt/config/network/wifi.conf

if [ $1 -eq 1 ]
then
	if [ $upgrade -eq 1 ]
	then
		wifikey2=`/bin/paraconf r 1 wifikey`
		wifiessid2=`/bin/paraconf r 1 wifiessid`
		if [ $wifikey2"A" != "A" ]
		then
			wifiessid3=`IntToStr $wifiessid2`
			if [ $wifikey2 != "null" ]
			then
				wifikeytype=3
				wifikey3=`IntToStr $wifikey2`
				/bin/vs/cgi-bin/setwifiattr.sh "$wifiessid3" $wifikeytype "$wifikey3"
			else
				wifikeytype=1
				/bin/vs/cgi-bin/setwifiattr.sh "$wifiessid3" $wifikeytype
			fi
		fi
		echo "upgrade=0" > /etc/upgrade.conf
	fi
else
	/bin/paraconf w 1 wifiessid $wifiessid
	if [ $wifikeytype -eq 1 ]
	then
		/bin/paraconf d 1 wifikey
	else
		/bin/paraconf w 1 wifikey $wifikey
	fi
	/bin/paraconf p
fi
