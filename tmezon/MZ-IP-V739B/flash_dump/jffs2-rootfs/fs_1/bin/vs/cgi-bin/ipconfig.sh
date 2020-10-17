#!/bin/sh
# $1 config file

. /bin/vs/cgi-bin/netenv.conf

setmac()
{
	linediface=eth0
	mac=`/bin/paraconf r 1 mac`
	ret=$?
	if [ ${ret} -ne 0 ]
	then
        mac1=`randommac`
        echo "oooooooo: set mac by randommac: mac is $mac1."
        ifconfig $linediface down
        ifconfig $linediface hw ether $mac1
        ifconfig $linediface up
        paraconf w 1 mac $mac1
	else
        echo "oooooooo: set mac by paraconf: mac is $mac."
        ifconfig $linediface down
        ifconfig $linediface hw ether $mac
        ifconfig $linediface up
	fi
	echo NOTHING > $net_serv
}

setip()
{
   
    killall -9 udhcpc 2>/dev/null
    if [ $dhcp = y ]
    then
	echo "oooooooo: set ip: enable dhcp: iface is $iface."
	/sbin/udhcpc -i $iface -b -A 3
    elif [ $dhcp = n ]
    then
        ip route show | awk -v k="$iface" '$0 !~ k { print " ip route delete " $0 | "sh" }'
        if [ -n "$address" -a -n "$netmask" ];then
            /sbin/ifconfig $iface $address netmask $netmask
        fi
        route add default gw $gateway dev $iface 2>/dev/null
        route add -net 239.0.0.0 netmask 255.0.0.0 $iface 2>/dev/null
        echo "oooooooo: set ip: disable dhcp: ip is $address; mask is netmask; iface is $iface; gateway is $gateway."
    fi
}    

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

wifienable=0
if [ -e $wifi_config ]
then
    . $wifi_config
    
else
    wifienable=0
fi

. /etc/board.conf
linedstatus=$(getnetstatus eth0)
nettype=lined

if [ $linedstatus = 1 ]
then
    iface=eth0
    nettype=lined
else
    iface=$wifidev
    nettype=wifi
fi

wifim=`/bin/paraconf r 1 WIFI_MODE`
echo "oooooooo: wifi_enable=$wifienable line_status=$linedstatus net_dev=$iface wifi_mode=$wifim "

if [ $wifim = "AP" ]
then
	echo "oooooooo: wifi is ap mode: force to wifi-device."
	iface=$wifidev
	nettype=wifi
else
	wifim=STA
fi	

echo $iface > /tmpfs/netdev

if [ $nettype = wifi ]
then
	ifconfig eth0 0.0.0.0
	if [ $wifim != "AP" ]
	then
      	 	echo "oooooooo: wifi is SAT mode: connect wifi"
        	/bin/vs/cgi-bin/wificonnect.sh connect
	fi
else
    ifconfig $wifidev 0.0.0.0 2>/dev/null
fi

. $ip_config

# pyu:debug with nfs:
echo "oooooooo: set_mac_ip: arg1=$1 wifi_mode=$wifim "
if [ "A"$1 != "A""NOTSETMAC" ]
then
	setmac
fi
if [ $wifim = STA ]
then
	setip
fi

