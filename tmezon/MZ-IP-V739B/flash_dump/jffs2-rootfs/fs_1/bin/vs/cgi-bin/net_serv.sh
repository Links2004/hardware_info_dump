#!/bin/sh

. /bin/vs/cgi-bin/netenv.conf
. /etc/board.conf

/bin/vs/cgi-bin/wificonnect.sh load

getnetstatus()
{
	ifconfig $1 up
	sleep 3
	v=`cat /sys/class/net/$1/carrier 2>/tmpfs/err`
	sleep 3
	v=`cat /sys/class/net/$1/carrier 2>/tmpfs/err`
	if [ -z $v ]
	then
		echo 2
	else
		echo $v
	fi
}

#First Time run . set mac
echo MACCHANGE > $net_serv

/bin/vs/cgi-bin/ipconfig.sh

iface=`cat $NETDEV`

# py: --> /mnt/config/network/ifattr
. $ip_config

friststart=0
nowlinedstatus=$(getnetstatus eth0)
prelinedstatus=$nowlinedstatus

if [ $dhcp = y ]
then
	friststart=1
	gateway=`route | grep default | awk '{print $2}'`
fi

# pyu:                    
if [ $iface = "wlan0" ]
then
	friststart=1
	wifi_status=`wpa_cli -i wlan0  -p /var/wpa_supplicant status 2>/dev/null | grep wpa_state | sed -n 's/wpa_state=//gp'`
	echo "oooooooo: connect wifi: dev is $iface; status is ${wifi_status}"
fi

wifim=`/bin/paraconf r 1 WIFI_MODE`

echo "oooooooo: cur_iface is $iface; eth0_status is $nowlinedstatus; dhcp is $dhcp; wifi_mode is $wifim "

sleep 1

while [ 1 ]
do
    nowlinedstatus=$(getnetstatus eth0)
    wifienable=0
    if [ -e $wifi_config ]
    then
        . $wifi_config
    else
        wifienable=0
    fi

    if [ $nowlinedstatus"A" != $prelinedstatus"A" ] 
    then
		if [ "$friststart""A" == "1A" ]
		then
			if [ "$wifienable""A" == "1A" ]
			then
				if [ $wifim = STA ]
				then
					echo "oooooooo: reboot."
					reboot
				fi
			fi
		fi
		friststart=1
		SERV_MODE=`cat $net_serv`
        if [ "A"$SERV_MODE = "A""MACCHANGE" ]
        then
        	echo "oooooooo: change mac."
        	/bin/vs/cgi-bin/ipconfig.sh
        else
        	echo "oooooooo: not change mac."
        	/bin/vs/cgi-bin/ipconfig.sh "NOTSETMAC"
        fi
    fi

	prelinedstatus=$nowlinedstatus
	sleep 1
done
